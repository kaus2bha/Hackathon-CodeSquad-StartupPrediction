import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Target, 
  Lightbulb, 
  Rocket, 
  Star,
  Zap,
  Shield,
  Users,
  BarChart3,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Brain,
  Award,
  Globe,
  Clock,
  DollarSign,
  Infinity
} from 'lucide-react';

const PremiumHome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handlePremiumAnalysis = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/predict');
    }
  };

  const premiumFeatures = [
    {
      icon: Brain,
      title: 'Advanced AI Predictions',
      description: 'Get 95%+ accurate predictions with our premium ML models',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Strategic Guidance',
      description: 'Personalized recommendations for funding, team, and market positioning',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Lightbulb,
      title: 'Risk Assessment',
      description: 'Identify potential pitfalls and get specific mitigation advice',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Rocket,
      title: 'Actionable Steps',
      description: 'Concrete action items with timelines to improve success',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const exclusiveInsights = [
    {
      title: 'Market Trends Analysis',
      description: 'Real-time insights into emerging market opportunities',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Competitor Intelligence',
      description: 'Deep analysis of your competition and market positioning',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Funding Landscape',
      description: 'Current funding trends and investor preferences',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Technology Insights',
      description: 'Emerging tech trends that could impact your startup',
      icon: Zap,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const successMetrics = [
    { metric: '95%+', label: 'Prediction Accuracy', icon: Award },
    { metric: '24/7', label: 'Premium Support', icon: Shield },
    { metric: '10x', label: 'Faster Insights', icon: Zap },
    { metric: 'Unlimited', label: 'Premium Analysis', icon: Infinity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-20"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-8"
          >
            <Crown className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Premium
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto">
            Your exclusive access to advanced AI insights, strategic guidance, and startup success tools
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handlePremiumAnalysis}
              className="btn-primary bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold inline-flex items-center"
            >
              <Star className="mr-2 w-5 h-5" />
              Start Premium Analysis
            </button>
            <Link
              to="/dashboard"
              className="btn-secondary border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold"
            >
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of AI-powered startup analysis with exclusive premium features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-white hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <button
                  onClick={handlePremiumAnalysis}
                  className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium group-hover:translate-x-1 transition-transform duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Success Metrics
            </h2>
            <p className="text-xl text-gray-600">
              See the difference premium access makes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {item.metric}
                </div>
                <p className="text-gray-600 font-medium">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Insights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Exclusive Premium Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access to market intelligence and strategic insights only available to premium members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exclusiveInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-white hover:shadow-lg transition-all duration-300 border-2 border-yellow-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${insight.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {insight.description}
                    </p>
                    <button
                      onClick={handlePremiumAnalysis}
                      className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Explore Insights
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Startup?
            </h2>
            <p className="text-xl text-yellow-100 mb-8">
              Join thousands of entrepreneurs who are already using premium insights to succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePremiumAnalysis}
                className="btn-primary bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold inline-flex items-center"
              >
                <Brain className="mr-2 w-5 h-5" />
                Start Premium Analysis
              </button>
              <Link
                to="/dashboard"
                className="btn-secondary border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-8 h-8 text-yellow-400 mr-2" />
            <span className="text-xl font-bold">Premium Startup Predictor</span>
          </div>
          <p className="text-gray-400 mb-4">
            Advanced AI-powered startup success prediction and strategic guidance
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 Premium Startup Predictor</span>
            <span>•</span>
            <span>Premium Members Only</span>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumHome;
