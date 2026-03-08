import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, 
  CheckCircle, 
  Target, 
  Lightbulb, 
  Rocket,
  Star,
  Zap,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Basic startup prediction',
        'Success/failure probability',
        'Confidence score',
        'Basic insights'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonAction: () => {},
      disabled: true
    },
    {
      name: 'Premium',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Advanced AI prediction',
        'Strategic guidance & recommendations',
        'Risk assessment & mitigation',
        'Actionable next steps',
        'Priority support',
        'Detailed analytics dashboard'
      ],
      popular: true,
      buttonText: 'Get Premium',
      buttonAction: () => handleSubscribe(),
      disabled: false
    },
    {
      name: 'Enterprise',
      price: { monthly: 999, yearly: 9990 },
      features: [
        'Everything in Premium',
        'Custom ML model training',
        'API access',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonAction: () => {},
      disabled: false
    }
  ];

  const handleSubscribe = async () => {
    // Navigate to payment page with plan details
    navigate('/payment', {
      state: {
        planDetails: {
          name: 'Premium',
          price: selectedPlan === 'monthly' ? 299 : 290,
          period: selectedPlan,
          features: [
            'Advanced AI prediction',
            'Strategic guidance & recommendations',
            'Risk assessment & mitigation',
            'Actionable next steps',
            'Priority support',
            'Detailed analytics dashboard'
          ]
        }
      }
    });
  };

  const getCurrentPrice = () => {
    return plans[1].price[selectedPlan];
  };

  const getSavings = () => {
    const monthlyTotal = plans[1].price.monthly * 12;
    const yearlyPrice = plans[1].price.yearly;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock advanced AI insights and strategic guidance to accelerate your startup's success
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedPlan === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </div>
          {selectedPlan === 'yearly' && (
            <p className="mt-2 text-sm text-success-600 font-medium">
              Save ₹{getSavings()} per year
            </p>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={`relative card ₹{
                plan.popular
                  ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                  : 'bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price[selectedPlan]}</span>
                  {plan.price[selectedPlan] > 0 && (
                    <span className="text-gray-600">/{selectedPlan === 'monthly' ? 'mo' : 'year'}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.buttonAction}
                disabled={plan.disabled || isProcessing}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                    : plan.disabled
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isProcessing && plan.popular ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  plan.buttonText
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Premium Features Detail */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You Get with Premium
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI-powered insights to transform your startup strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Guidance</h3>
              <p className="text-gray-600 text-sm">
                Personalized recommendations on funding, team building, and market positioning
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Assessment</h3>
              <p className="text-gray-600 text-sm">
                Identify potential pitfalls and get specific advice on risk mitigation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Actionable Steps</h3>
              <p className="text-gray-600 text-sm">
                Concrete action items with timelines to improve success probability
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm">
                Deep insights and performance tracking against industry benchmarks
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. No long-term contracts required.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, you can try our basic prediction for free. Premium features require a subscription.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How accurate are the predictions?
              </h3>
              <p className="text-gray-600">
                Our AI models achieve 95%+ accuracy based on analysis of thousands of startup data points.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Accelerate Your Startup's Success?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of entrepreneurs who are already using our premium insights
            </p>
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="mr-2 w-5 h-5" />
                  Start Premium Now
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;
