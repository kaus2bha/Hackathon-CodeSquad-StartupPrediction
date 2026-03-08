import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Crown,
  Target,
  Lightbulb,
  Rocket,
  Star,
  Zap,
  Users,
  DollarSign,
  Award,
  TrendingUp as TrendingUpIcon,
  AlertTriangle,
  Calendar,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
const PremiumDashboard = () => {
  const location = useLocation();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failure: 0,
    avgConfidence: 0,
    premiumPredictions: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchPredictions();
    
    // Check if user just became premium
    if (location.state?.isNewPremium) {
      setShowWelcomeMessage(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view dashboard');
        return;
      }

      const response = await axios.get('/api/predictions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPredictions(response.data.predictions);
        calculateStats(response.data.predictions);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      const message = error.response?.data?.message || 'Failed to load predictions';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (predictionData) => {
    const total = predictionData.length;
    const success = predictionData.filter(p => p.prediction === 'Success').length;
    const failure = total - success;
    const avgConfidence = total > 0 
      ? predictionData.reduce((sum, p) => sum + p.confidence, 0) / total 
      : 0;

    setStats({ 
      total, 
      success, 
      failure, 
      avgConfidence: Math.round(avgConfidence),
      premiumPredictions: Math.floor(total * 0.8), // Simulate premium predictions
      totalRevenue: total * 29 // Simulate revenue from predictions
    });
  };

  const chartData = predictions.slice(-10).map((pred, index) => ({
    name: `Prediction ${index + 1}`,
    confidence: pred.confidence,
    success: pred.prediction === 'Success' ? pred.confidence : 0,
    failure: pred.prediction === 'Failure' ? pred.confidence : 0
  }));

  const marketInsights = [
    { category: 'Technology', success: 85, trend: 'up' },
    { category: 'Healthcare', success: 72, trend: 'up' },
    { category: 'Finance', success: 68, trend: 'down' },
    { category: 'E-commerce', success: 78, trend: 'up' }
  ];

  const premiumFeatures = [
    {
      icon: Target,
      title: 'Strategic Insights',
      description: 'Get personalized recommendations for your startup',
      action: 'View Insights',
      link: '/insights'
    },
    {
      icon: Lightbulb,
      title: 'Risk Assessment',
      description: 'Identify and mitigate potential risks',
      action: 'Assess Risks',
      link: '/risk-assessment'
    },
    {
      icon: Rocket,
      title: 'Action Plan',
      description: 'Get actionable steps to improve success',
      action: 'Get Plan',
      link: '/action-plan'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep dive into performance metrics',
      action: 'View Analytics',
      link: '/analytics'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading premium dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Premium Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Welcome to your exclusive startup success command center
          </p>
        </motion.div>

        {/* Welcome Message for New Premium Users */}
        {showWelcomeMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 card bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                🎉 Welcome to Premium! 🎉
              </h2>
              <p className="text-yellow-100 mb-4">
                {location.state?.message || 'Your subscription is now active. Enjoy all premium features!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/predict"
                  className="btn-primary bg-white text-orange-600 hover:bg-gray-100 inline-flex items-center"
                >
                  <Star className="mr-2 w-4 h-4" />
                  Try Premium Analysis
                </Link>
                <button
                  onClick={() => setShowWelcomeMessage(false)}
                  className="btn-secondary border-white text-white hover:bg-white hover:text-orange-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-100">Total Predictions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card bg-gradient-to-br from-green-500 to-green-600 text-white border-0"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-100">Success Rate</p>
                <p className="text-2xl font-bold">{stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-100">Premium Insights</p>
                <p className="text-2xl font-bold">{stats.premiumPredictions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-100">Revenue Generated</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card bg-white hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  {feature.action}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="card bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Performance Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={3} />
                  <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="failure" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Market Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
            <div className="space-y-4">
              {marketInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="font-medium text-gray-900">{insight.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{insight.success}%</span>
                    {insight.trend === 'up' ? (
                      <TrendingUpIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Premium Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 card bg-white"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Premium Predictions</h3>
            <Link
              to="/predict"
              className="inline-flex items-center text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Premium Analysis
            </Link>
          </div>
          
          {predictions.length === 0 ? (
            <div className="text-center py-8">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No premium predictions yet</p>
              <Link to="/predict" className="btn-primary bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Start Your First Premium Analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.slice(0, 5).map((prediction) => (
                <div key={prediction.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      {prediction.prediction === 'Success' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{prediction.startupName}</p>
                      <p className="text-sm text-gray-500">{prediction.industry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{prediction.confidence}%</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(prediction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
