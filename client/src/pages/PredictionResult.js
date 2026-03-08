import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Share2,
  Download,
  BarChart3,
  DollarSign,
  Users,
  Target,
  Zap,
  Info,
  IndianRupeeIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import pdfService from '../services/pdfService';
const PredictionResult = () => {
  const { id } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPrediction();
  }, [id]);

  const fetchPrediction = async () => {
    try {
      const response = await axios.get(`/api/predictions/${id}`);
      if (response.data.success) {
        setPrediction(response.data.prediction);
      } else {
        setError('Failed to fetch prediction');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setError('Failed to fetch prediction data');
      toast.error('Failed to load prediction result');
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (prediction) => {
    return prediction === 'Success' ? 'success' : 'danger';
  };

  const getPredictionIcon = (prediction) => {
    return prediction === 'Success' ? CheckCircle : XCircle;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-danger-600';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 60) return 'High';
    if (confidence >= 40) return 'Medium';
    return 'Low';
  };

  const handleDownloadPDF = async () => {
    if (!prediction) return;
    
    setDownloading(true);
    try {
      await pdfService.downloadFreemiumReport(prediction, 'freemium-report');
      toast.success('Analysis report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const pieData = prediction ? [
    { name: 'Success', value: prediction.successProbability || (prediction.prediction === 'Success' ? prediction.confidence : 100 - prediction.confidence), color: '#22c55e' },
    { name: 'Failure', value: prediction.failureProbability || (prediction.prediction === 'Failure' ? prediction.confidence : 100 - prediction.confidence), color: '#ef4444' }
  ] : [];

  const factorData = prediction ? [
    { name: 'Funding', value: prediction.fundingAmount, max: 1000000 },
    { name: 'Team Size', value: prediction.teamSize, max: 50 },
    { name: 'Revenue', value: prediction.revenue, max: 1000000 },
    { name: 'Years', value: prediction.yearsInBusiness, max: 10 }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prediction results...</p>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-danger-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-6">{error || 'Prediction not found'}</p>
          <Link to="/predict" className="btn-primary">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const PredictionIcon = getPredictionIcon(prediction.prediction);
  const predictionColor = getPredictionColor(prediction.prediction);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div id="freemium-report" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/predict"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prediction
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prediction Results
            </h1>
            <p className="text-xl text-gray-600">
              Analysis for <span className="font-semibold">{prediction.startupName}</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Prediction Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="text-center mb-8">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  predictionColor === 'success' ? 'success-gradient' : 'failure-gradient'
                }`}>
                  <PredictionIcon className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {prediction.prediction}
                </h2>
                
                <p className="text-lg text-gray-600 mb-4">
                  Our AI predicts your startup will be a {prediction.prediction.toLowerCase()}
                </p>

                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Confidence: </span>
                  <span className={`ml-2 text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}% ({getConfidenceLabel(prediction.confidence)})
                  </span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${
                      predictionColor === 'success' ? 'bg-success-500' : 'bg-danger-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Probability Chart */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Success vs Failure Probability</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Probability']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-8 mt-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {item.name}: {item.value.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Startup Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Startup Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{prediction.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <IndianRupeeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Funding</p>
                    <p className="font-medium">₹{prediction.fundingAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="font-medium">{prediction.teamSize} people</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="font-medium">₹{prediction.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Business Model</p>
                    <p className="font-medium">{prediction.businessModel}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary inline-flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="w-full btn-secondary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading ? 'Generating PDF...' : 'Download Report'}
                </button>
                <Link
                  to="/predict"
                  className="w-full btn-secondary inline-flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  New Prediction
                </Link>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card bg-primary-50 border-primary-200"
            >
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Key Insights</h3>
                  <ul className="text-primary-700 text-sm space-y-1">
                    <li>• {prediction.prediction === 'Success' ? 'Strong indicators for success' : 'Areas for improvement identified'}</li>
                    <li>• Based on {prediction.confidence}% confidence level</li>
                    <li>• Analyzed against industry benchmarks</li>
                    <li>• Consider market conditions and trends</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 card"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Strengths</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>Strong market positioning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>Competitive funding levels</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>Experienced team structure</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Areas for Improvement</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Focus on revenue growth</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Expand market reach</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Strengthen competitive advantage</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionResult;
