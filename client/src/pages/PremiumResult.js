import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Crown, 
  Target, 
  Lightbulb, 
  Rocket, 
  Star,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowRight,
  Download,
  Share2,
  Bookmark,
  Brain,
  Award,
  Zap,
  Clock,
  Globe,
  Building2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import pdfService from '../services/pdfService';

const PremiumResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPrediction();
  }, [id]);

  const fetchPrediction = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view prediction');
        navigate('/login');
        return;
      }

      const response = await axios.get(`/api/predictions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPrediction(response.data.prediction);
      } else {
        throw new Error('Failed to fetch prediction');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      toast.error('Failed to load prediction');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (prediction) => {
    return prediction === 'Success' ? 'text-green-600' : 'text-red-600';
  };

  const getPredictionBgColor = (prediction) => {
    return prediction === 'Success' ? 'bg-green-100' : 'bg-red-100';
  };

  const getPredictionIcon = (prediction) => {
    return prediction === 'Success' ? CheckCircle : XCircle;
  };

  const generateStrategicGuidance = () => {
    if (!prediction) return [];
    
    const guidance = [];
    
    if (prediction.prediction === 'Success') {
      guidance.push(
        { title: 'Capitalize on Momentum', description: 'Your startup shows strong potential. Focus on scaling operations and expanding market reach.', priority: 'high' },
        { title: 'Team Expansion', description: 'Consider expanding your team to handle growth and maintain quality standards.', priority: 'medium' },
        { title: 'Investor Relations', description: 'Prepare for funding rounds by building relationships with potential investors.', priority: 'high' }
      );
    } else {
      guidance.push(
        { title: 'Risk Mitigation', description: 'Focus on addressing identified risk factors before proceeding with major investments.', priority: 'high' },
        { title: 'Market Research', description: 'Conduct deeper market analysis to understand customer needs and competition.', priority: 'high' },
        { title: 'Pivot Strategy', description: 'Consider pivoting your business model based on market feedback.', priority: 'medium' }
      );
    }
    
    return guidance;
  };

  const generateRiskAssessment = () => {
    if (!prediction) return [];
    
    const risks = [
      { category: 'Market Risk', level: 'medium', description: 'Market competition and saturation concerns', mitigation: 'Strengthen unique value proposition' },
      { category: 'Financial Risk', level: 'low', description: 'Funding requirements and cash flow management', mitigation: 'Implement strict financial controls' },
      { category: 'Operational Risk', level: 'medium', description: 'Team scaling and process efficiency', mitigation: 'Invest in training and automation' },
      { category: 'Technology Risk', level: 'low', description: 'Technology stack and infrastructure', mitigation: 'Regular technology audits and updates' }
    ];
    
    return risks;
  };

  const generateActionPlan = () => {
    if (!prediction) return [];
    
    const actions = [
      { title: 'Immediate (Next 30 days)', items: ['Review and update business plan', 'Conduct customer feedback sessions', 'Assess current team capabilities'] },
      { title: 'Short-term (3-6 months)', items: ['Implement recommended improvements', 'Begin market expansion planning', 'Develop investor pitch deck'] },
      { title: 'Long-term (6-12 months)', items: ['Execute growth strategies', 'Secure additional funding', 'Establish strategic partnerships'] }
    ];
    
    return actions;
  };

  const handleDownloadPDF = async () => {
    if (!prediction) return;
    
    setDownloading(true);
    try {
      await pdfService.downloadPremiumReport(prediction, 'premium-report');
      toast.success('Premium report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const marketTrendsData = [
    { month: 'Jan', trend: 65, industry: 70, startup: 75 },
    { month: 'Feb', trend: 68, industry: 72, startup: 78 },
    { month: 'Mar', trend: 72, industry: 75, startup: 82 },
    { month: 'Apr', trend: 75, industry: 78, startup: 85 },
    { month: 'May', trend: 78, industry: 80, startup: 88 },
    { month: 'Jun', trend: 82, industry: 83, startup: 92 }
  ];

  const pieData = [
    { name: 'Success Probability', value: prediction?.confidence || 0, color: '#10b981' },
    { name: 'Risk Factors', value: 100 - (prediction?.confidence || 0), color: '#ef4444' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading premium analysis...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Prediction not found</p>
          <Link to="/dashboard" className="btn-primary mt-4">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
      <div id="premium-report" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Analysis Result
          </h1>
          <p className="text-xl text-gray-600">
            Advanced insights and strategic guidance for your startup
          </p>
        </motion.div>

        {/* Prediction Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card bg-white mb-8 border-2 border-yellow-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${getPredictionBgColor(prediction.prediction)} rounded-full flex items-center justify-center`}>
                {React.createElement(getPredictionIcon(prediction.prediction), { 
                  className: `w-8 h-8 ${getPredictionColor(prediction.prediction)}` 
                })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {prediction.startupName || 'Startup Analysis'}
                </h2>
                <p className="text-gray-600">{prediction.industry || 'Industry Analysis'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">Premium Analysis</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {prediction.confidence}%
              </div>
              <div className="text-sm text-gray-500">Confidence Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {prediction.prediction}
              </div>
              <div className="text-sm text-gray-600">Prediction</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {new Date(prediction.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Analysis Date</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                Premium
              </div>
              <div className="text-sm text-gray-600">Analysis Type</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'guidance', label: 'Strategic Guidance', icon: Target },
              { id: 'risks', label: 'Risk Assessment', icon: Shield },
              { id: 'actions', label: 'Action Plan', icon: Rocket },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card bg-white"
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed">
                  Based on our advanced AI analysis, your startup shows a {prediction.confidence}% probability of success. 
                  This comprehensive assessment takes into account market conditions, competitive landscape, team capabilities, 
                  and financial projections to provide you with actionable insights for strategic decision-making.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Probability Distribution</h4>
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Strengths</h4>
                  <div className="space-y-3">
                    {[
                      'Strong market positioning',
                      'Experienced team',
                      'Innovative technology',
                      'Clear value proposition'
                    ].map((strength, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Areas for Improvement</h4>
                  <div className="space-y-3">
                    {[
                      'Market penetration strategy',
                      'Customer acquisition cost',
                      'Scalability planning'
                    ].map((area, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guidance' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategic Guidance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generateStrategicGuidance().map((item, index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk Assessment & Mitigation</h3>
              <div className="space-y-4">
                {generateRiskAssessment().map((risk, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{risk.category}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        risk.level === 'high' ? 'bg-red-100 text-red-700' :
                        risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {risk.level} risk
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{risk.description}</p>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Action Plan</h3>
              <div className="space-y-6">
                {generateActionPlan().map((phase, index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      {phase.title}
                    </h4>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Market Trends & Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="trend" stroke="#6b7280" strokeWidth={2} name="Market Trend" />
                        <Line type="monotone" dataKey="industry" stroke="#3b82f6" strokeWidth={2} name="Industry Average" />
                        <Line type="monotone" dataKey="startup" stroke="#f59e0b" strokeWidth={3} name="Your Startup" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Competitive Analysis</h4>
                  <div className="space-y-4">
                    {[
                      { metric: 'Market Share', value: '12%', trend: 'up', color: 'text-green-600' },
                      { metric: 'Growth Rate', value: '25%', trend: 'up', color: 'text-green-600' },
                      { metric: 'Customer Satisfaction', value: '4.2/5', trend: 'stable', color: 'text-blue-600' },
                      { metric: 'Innovation Score', value: '8.5/10', trend: 'up', color: 'text-green-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{item.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${item.color}`}>{item.value}</span>
                          {item.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : item.trend === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <div className="w-4 h-4 text-blue-500">—</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg font-semibold inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="mr-2 w-5 h-5" />
            {downloading ? 'Generating PDF...' : 'Download Report'}
          </button>
          <Link
            to="/predict"
            className="btn-primary bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-3 text-lg font-semibold inline-flex items-center"
          >
            <Brain className="mr-2 w-5 h-5" />
            New Premium Analysis
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary px-8 py-3 text-lg font-semibold"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumResult;
