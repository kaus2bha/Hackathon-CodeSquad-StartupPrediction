const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Prediction = require('../models/Prediction');
const mlService = require('../services/mlService');

// @route   POST /api/predictions
// @desc    Make a startup prediction
// @access  Public
router.post('/', [
  body('fundingAmount').isNumeric().withMessage('Funding amount must be a number'),
  body('teamSize').isInt({ min: 1 }).withMessage('Team size must be at least 1'),
  body('yearsInBusiness').isFloat({ min: 0 }).withMessage('Years in business must be non-negative')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fundingAmount,
      teamSize,
      yearsInBusiness,
      revenue,
      marketSize,
      competitionLevel
    } = req.body;

    // Prepare data for ML prediction
    const startupData = {
      fundingAmount: parseFloat(fundingAmount),
      teamSize: parseInt(teamSize),
      yearsInBusiness: parseFloat(yearsInBusiness),
      revenue: revenue !== undefined ? Number(revenue) : 0,
      marketSize: marketSize || 'Medium',
      competitionLevel: competitionLevel || 'Medium'
    };

    // Make prediction
    let predictionResult;
    try {
      predictionResult = await mlService.predict(startupData);
    } catch (error) {
      console.error('ML prediction error:', error);
      predictionResult = mlService.fallbackPrediction(startupData);
    }

    // Save prediction
    const saved = await Prediction.create({
      startupName: req.body.startupName || 'Untitled',
      industry: req.body.industry || 'Unknown',
      fundingAmount: startupData.fundingAmount,
      teamSize: startupData.teamSize,
      yearsInBusiness: startupData.yearsInBusiness,
      revenue: startupData.revenue,
      marketSize: startupData.marketSize,
      competitionLevel: startupData.competitionLevel,
      technologyStack: req.body.technologyStack || 'Unknown',
      businessModel: req.body.businessModel || 'Other',
      prediction: predictionResult.prediction,
      confidence: predictionResult.confidence,
      features: predictionResult.features || []
    });

    // Respond with id so client can navigate
    res.json({
      success: true,
      prediction: {
        id: saved._id,
        prediction: predictionResult.prediction,
        confidence: predictionResult.confidence,
        successProbability: predictionResult.success_probability || (predictionResult.prediction === 'Success' ? predictionResult.confidence : 100 - predictionResult.confidence),
        failureProbability: predictionResult.failure_probability || (predictionResult.prediction === 'Failure' ? predictionResult.confidence : 100 - predictionResult.confidence)
      }
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during prediction',
      error: error.message 
    });
  }
});

const auth = require('../middleware/auth');
const premium = require('../middleware/premium');

// @route   GET /api/predictions
// @desc    Get all predictions (for authenticated users)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      predictions: predictions.map(pred => ({
        id: pred._id,
        startupName: pred.startupName,
        prediction: pred.prediction,
        confidence: pred.confidence,
        createdAt: pred.createdAt
      }))
    });

  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   GET /api/predictions/:id
// @desc    Get specific prediction
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json({
      success: true,
      prediction: {
        id: prediction._id,
        startupName: prediction.startupName,
        industry: prediction.industry,
        fundingAmount: prediction.fundingAmount,
        teamSize: prediction.teamSize,
        yearsInBusiness: prediction.yearsInBusiness,
        revenue: prediction.revenue,
        marketSize: prediction.marketSize,
        competitionLevel: prediction.competitionLevel,
        technologyStack: prediction.technologyStack,
        businessModel: prediction.businessModel,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        createdAt: prediction.createdAt
      }
    });

  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   POST /api/predictions/premium
// @desc    Make a premium startup prediction with guidance
// @access  Public
router.post('/premium', [
  body('fundingAmount').isNumeric().withMessage('Funding amount must be a number'),
  body('teamSize').isInt({ min: 1 }).withMessage('Team size must be at least 1'),
  body('yearsInBusiness').isFloat({ min: 0 }).withMessage('Years in business must be non-negative')
], auth, premium, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fundingAmount,
      teamSize,
      yearsInBusiness,
      revenue,
      marketSize,
      competitionLevel
    } = req.body;

    const startupData = {
      fundingAmount: parseFloat(fundingAmount),
      teamSize: parseInt(teamSize),
      yearsInBusiness: parseFloat(yearsInBusiness),
      revenue: revenue !== undefined ? Number(revenue) : 0,
      marketSize: marketSize || 'Medium',
      competitionLevel: competitionLevel || 'Medium'
    };

    // Premium prediction (with guidance)
    let premiumResult;
    try {
      premiumResult = await mlService.premiumPredict(startupData);
    } catch (error) {
      console.error('ML premium prediction error:', error);
      const fallbackBase = mlService.fallbackPrediction(startupData);
      premiumResult = {
        prediction: fallbackBase.prediction,
        confidence: fallbackBase.confidence,
        success_probability: fallbackBase.success_probability || (fallbackBase.prediction === 'Success' ? fallbackBase.confidence : 100 - fallbackBase.confidence),
        failure_probability: fallbackBase.failure_probability || (fallbackBase.prediction === 'Failure' ? fallbackBase.confidence : 100 - fallbackBase.confidence),
        features: fallbackBase.features,
        guidance: [
          'Improve funding runway and customer acquisition efficiency.',
          'Validate pricing and reduce churn risks.'
        ],
        risks: ['Execution risk', 'Market competition'],
        nextSteps: ['Define top 3 OKRs for next quarter']
      };
    }

    // Save base prediction (schema unchanged)
    const saved = await Prediction.create({
      startupName: req.body.startupName || 'Untitled',
      industry: req.body.industry || 'Unknown',
      fundingAmount: startupData.fundingAmount,
      teamSize: startupData.teamSize,
      yearsInBusiness: startupData.yearsInBusiness,
      revenue: startupData.revenue,
      marketSize: startupData.marketSize,
      competitionLevel: startupData.competitionLevel,
      technologyStack: req.body.technologyStack || 'Unknown',
      businessModel: req.body.businessModel || 'Other',
      prediction: premiumResult.prediction,
      confidence: premiumResult.confidence,
      features: premiumResult.features || []
    });

    res.json({
      success: true,
      prediction: {
        id: saved._id,
        prediction: premiumResult.prediction,
        confidence: premiumResult.confidence,
        successProbability: premiumResult.success_probability,
        failureProbability: premiumResult.failure_probability,
        guidance: premiumResult.guidance,
        risks: premiumResult.risks,
        nextSteps: premiumResult.nextSteps
      }
    });

  } catch (error) {
    console.error('Premium prediction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during premium prediction',
      error: error.message 
    });
  }
});

module.exports = router;
