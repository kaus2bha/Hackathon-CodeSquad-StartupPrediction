const { PythonShell } = require('python-shell');
const path = require('path');

class MLService {
  constructor() {
    this.modelPath = path.join(__dirname, '../models/startup_model.pkl');
    this.scalerPath = path.join(__dirname, '../models/scaler.pkl');
  }

  // Preprocess input data
  preprocessData(startupData) {
    const { fundingAmount, teamSize, yearsInBusiness } = startupData;
    // Normalize features as in train.py
    const normalizedFunding = Math.log(fundingAmount + 1) / 15;
    const normalizedTeamSize = teamSize / 10;
    const normalizedYears = yearsInBusiness / 50;
    return [
      normalizedFunding,
      normalizedTeamSize,
      normalizedYears
    ];
  }

  // Premium prediction: includes guidance and risk factors
  async premiumPredict(startupData) {
    const base = await this.predict(startupData).catch(() => this.fallbackPrediction(startupData));

    // Derive probabilities when not supplied (fallback case)
    const successProbability = typeof base.success_probability === 'number'
      ? base.success_probability
      : (base.prediction === 'Success' ? base.confidence : 100 - base.confidence);
    const failureProbability = 100 - successProbability;

    // Simple heuristic guidance
    const guidance = [];
    const risks = [];
    const nextSteps = [];

    if (startupData.fundingAmount < 50000) {
      risks.push('Low funding runway');
      guidance.push('Increase funding runway by 6-12 months.');
      nextSteps.push('Prepare targeted investor outreach with traction metrics.');
    }
    if (startupData.teamSize < 3) {
      risks.push('Small core team');
      guidance.push('Fill key gaps in product, sales, or marketing.');
      nextSteps.push('Hire or contract for missing key roles.');
    }
    if (startupData.yearsInBusiness < 1) {
      risks.push('Limited operating history');
      guidance.push('Focus on rapid learning cycles and customer discovery.');
      nextSteps.push('Run 3 customer interviews per week for 4-6 weeks.');
    }
    if (startupData.marketSize === 'Small') {
      risks.push('Limited market size');
      guidance.push('Validate adjacent segments or upsell opportunities.');
      nextSteps.push('Test pricing and bundling for higher ARPU.');
    }
    if (startupData.competitionLevel === 'High') {
      risks.push('Crowded market');
      guidance.push('Differentiate via niche positioning or superior DX.');
      nextSteps.push('Ship 1-2 moat-building features in next quarter.');
    }

    // Prioritize top 3
    const topGuidance = guidance.slice(0, 3);
    const topRisks = risks.slice(0, 3);
    const topNextSteps = nextSteps.slice(0, 3);

    return {
      prediction: base.prediction,
      confidence: base.confidence,
      success_probability: successProbability,
      failure_probability: failureProbability,
      features: base.features,
      guidance: topGuidance,
      risks: topRisks,
      nextSteps: topNextSteps
    };
  }
  // Make prediction using Python script
  async predict(startupData) {
    return new Promise((resolve, reject) => {
      const features = this.preprocessData(startupData);
      const options = {
        mode: 'json',
        pythonPath: process.env.PYTHON_PATH || 'python',
        pythonOptions: ['-u'],
        scriptPath: path.join(__dirname, '../python'),
        args: [JSON.stringify(features)]
      };

      const pyshell = new PythonShell('predict.py', options);
      let resolved = false;

      const timeoutMs = Number(process.env.PREDICT_TIMEOUT_MS || 10000);
      const timer = setTimeout(() => {
        if (!resolved) {
          try { pyshell.terminate(); } catch (e) {}
          reject(new Error('Prediction timed out'));
        }
      }, timeoutMs);

      const results = [];
      pyshell.on('message', (message) => {
        results.push(message);
      });

      pyshell.end((err) => {
        clearTimeout(timer);
        if (resolved) return;
        if (err) {
          console.error('Python script error:', err);
          return reject(err);
        }
        try {
          const result = results[0] || {};
          resolved = true;
          return resolve({
            prediction: result.prediction,
            confidence: result.confidence,
            features: features
          });
        } catch (error) {
          return reject(error);
        }
      });
    });
  }

  // Fallback prediction method (if Python script fails)
  fallbackPrediction(startupData) {
    const features = this.preprocessData(startupData);
    
    // Simple rule-based prediction as fallback
    let score = 0;
    
    // Funding score (0-25 points)
    if (startupData.fundingAmount > 100000) score += 15;
    else if (startupData.fundingAmount > 50000) score += 10;
    else if (startupData.fundingAmount > 10000) score += 5;
    
    // Team size score (0-20 points)
    if (startupData.teamSize > 10) score += 20;
    else if (startupData.teamSize > 5) score += 15;
    else if (startupData.teamSize > 2) score += 10;
    
    // Revenue score (0-25 points)
    if (startupData.revenue > 100000) score += 25;
    else if (startupData.revenue > 50000) score += 20;
    else if (startupData.revenue > 10000) score += 15;
    
    // Market size score (0-15 points)
    if (startupData.marketSize === 'Large') score += 15;
    else if (startupData.marketSize === 'Medium') score += 10;
    else score += 5;
    
    // Competition score (0-15 points)
    if (startupData.competitionLevel === 'Low') score += 15;
    else if (startupData.competitionLevel === 'Medium') score += 10;
    else score += 5;
    
    const confidence = Math.min(score, 100);
    const prediction = score >= 60 ? 'Success' : 'Failure';
    
    return {
      prediction,
      confidence,
      features
    };
  }
}

module.exports = new MLService();
