import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Brain, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  Info,
  Crown,
  Star,
  Target as TargetIcon,
  Lightbulb,
  Rocket,
  IndianRupeeIcon
} from 'lucide-react';
import axios from 'axios';

const PredictionForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [usePremium, setUsePremium] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Get premium status from backend
        try {
          const response = await axios.get('/api/auth/premium-status', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.isPremium) {
            // User has premium status from backend
            setIsPremiumUser(true);
            setUserData({
              isPremium: true,
              premiumPlan: response.data.plan,
              premiumUntil: response.data.expiresAt
            });
          } else {
            // User doesn't have premium status
            setIsPremiumUser(false);
            setUserData({
              isPremium: false,
              premiumPlan: null,
              premiumUntil: null
            });
          }
        } catch (premiumError) {
          // If premium status check fails, default to freemium
          console.log('Premium status check failed, defaulting to freemium');
          setIsPremiumUser(false);
          setUserData({
            isPremium: false,
            premiumPlan: null,
            premiumUntil: null
          });
        }
      }
    } catch (error) {
      console.log('User not logged in or premium check failed');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  const businessModels = [
    { value: 'B2B', label: 'Business to Business (B2B)' },
    { value: 'B2C', label: 'Business to Consumer (B2C)' },
    { value: 'B2B2C', label: 'Business to Business to Consumer (B2B2C)' },
    { value: 'Marketplace', label: 'Marketplace' },
    { value: 'SaaS', label: 'Software as a Service (SaaS)' },
    { value: 'Other', label: 'Other' }
  ];

  const marketSizes = [
    { value: 'Small', label: 'Small (< ₹1B)' },
    { value: 'Medium', label: 'Medium (₹1B - ₹10B)' },
    { value: 'Large', label: 'Large (> ₹10B)' }
  ];

  const competitionLevels = [
    { value: 'Low', label: 'Low Competition' },
    { value: 'Medium', label: 'Medium Competition' },
    { value: 'High', label: 'High Competition' }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let response;
      if (usePremium && isPremiumUser) {
        const token = localStorage.getItem('token');
        response = await axios.post('/api/predictions/premium', data, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
      } else {
        response = await axios.post('/api/predictions', data);
      }
      
      if (response.data.success) {
        toast.success('Prediction completed successfully!');
        const predictionId = response.data.prediction.id;
        
        // Redirect based on user type and analysis type
        if (usePremium && isPremiumUser) {
          navigate(`/result/${predictionId}?premium=true`);
        } else {
          navigate(`/result/${predictionId}`);
        }
      } else {
        toast.error('Failed to get prediction. Please try again.');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during prediction';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Startup Name *
        </label>
        <input
          type="text"
          {...register('startupName', { required: 'Startup name is required' })}
          className="input-field"
          placeholder="Enter your startup name"
        />
        {errors.startupName && (
          <p className="mt-1 text-sm text-red-600">{errors.startupName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry *
        </label>
        <input
          type="text"
          {...register('industry', { required: 'Industry is required' })}
          className="input-field"
          placeholder="e.g., Technology, Healthcare, Finance"
        />
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        Go-To-Market Approach *
        </label>
        <input
          type="text"
          {...register('Go-To-Market Approach', { required: 'Go-To-Market Approach is required' })}
          className="input-field"
          placeholder="e.g., online, retail, direct sales"
        />
        {errors['Go-To-Market Approach'] && (
          <p className="mt-1 text-sm text-red-600">{errors['Go-To-Market Approach'].message}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Funding Amount (Rupees) *
        </label>
        <div className="relative">
          <IndianRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            {...register('fundingAmount', { 
              required: 'Funding amount is required',
              min: { value: 0, message: 'Funding amount must be positive' }
            })}
            className="input-field pl-10"
            placeholder="0"
          />
        </div>
        {errors.fundingAmount && (
          <p className="mt-1 text-sm text-red-600">{errors.fundingAmount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Size *
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            {...register('teamSize', { 
              required: 'Team size is required',
              min: { value: 1, message: 'Team size must be at least 1' }
            })}
            className="input-field pl-10"
            placeholder="1"
          />
        </div>
        {errors.teamSize && (
          <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years in Business *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            step="0.1"
            {...register('yearsInBusiness', { 
              required: 'Years in business is required',
              min: { value: 0, message: 'Years cannot be negative' }
            })}
            className="input-field pl-10"
            placeholder="0.5"
          />
        </div>
        {errors.yearsInBusiness && (
          <p className="mt-1 text-sm text-red-600">{errors.yearsInBusiness.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Annual Revenue (Rupees) *
        </label>
        <div className="relative">
          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            {...register('revenue', { 
              required: 'Revenue is required',
              min: { value: 0, message: 'Revenue must be positive' }
            })}
            className="input-field pl-10"
            placeholder="0"
          />
        </div>
        {errors.revenue && (
          <p className="mt-1 text-sm text-red-600">{errors.revenue.message}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Market Size *
        </label>
        <select
          {...register('marketSize', { required: 'Market size is required' })}
          className="input-field"
        >
          <option value="">Select market size</option>
          {marketSizes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.marketSize && (
          <p className="mt-1 text-sm text-red-600">{errors.marketSize.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Competition Level *
        </label>
        <select
          {...register('competitionLevel', { required: 'Competition level is required' })}
          className="input-field"
        >
          <option value="">Select competition level</option>
          {competitionLevels.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.competitionLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.competitionLevel.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Model *
        </label>
        <select
          {...register('businessModel', { required: 'Business model is required' })}
          className="input-field"
        >
          <option value="">Select business model</option>
          {businessModels.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.businessModel && (
          <p className="mt-1 text-sm text-red-600">{errors.businessModel.message}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Startup Success Prediction
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Provide your startup details below and our AI will analyze your chances of success
            </p>
            
            {/* Premium User Badge */}
            {isPremiumUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-medium"
              >
                <Crown className="w-4 h-4 mr-2" />
                Premium User
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Premium Features Preview for Free Users */}
        {!isPremiumUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-gray-600 mb-6">
                Get advanced insights, risk assessment, and strategic guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TargetIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Strategic Guidance</h4>
                <p className="text-sm text-gray-600">Personalized recommendations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-600">Identify and mitigate risks</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Actionable Steps</h4>
                <p className="text-sm text-gray-600">Concrete next steps</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/subscription')}
                className="btn-primary inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Star className="mr-2 w-4 h-4" />
                Upgrade to Premium
              </button>
            </div>
          </motion.div>
        )}

        {/* Premium User Welcome Message */}
        {isPremiumUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, Premium User! 👑
              </h3>
              <p className="text-gray-600 mb-6">
                You have access to advanced insights, risk assessment, and strategic guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TargetIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Strategic Guidance</h4>
                <p className="text-sm text-gray-600">Personalized recommendations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-600">Identify and mitigate risks</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Actionable Steps</h4>
                <p className="text-sm text-gray-600">Concrete next steps</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 3
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary inline-flex items-center"
                >
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary inline-flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 w-4 h-4" />
                      Get Prediction
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Premium toggle */}
            {currentStep === 3 && (
              <div className="flex items-center justify-between pt-2">
                {isPremiumUser ? (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={usePremium}
                        onChange={(e) => setUsePremium(e.target.checked)}
                      />
                      <span className="text-yellow-600 font-medium">Use Premium Analysis</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {usePremium ? 'Will include strategic guidance, risk assessment, and actionable steps' : 'Basic prediction only'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Info className="w-4 h-4 text-gray-400" />
                    <span>Premium analysis requires subscription</span>
                    <button
                      onClick={() => navigate('/subscription')}
                      className="text-yellow-600 hover:text-yellow-700 font-medium underline"
                    >
                      Upgrade now
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                How it works
              </h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Our machine learning model analyzes your startup data against thousands of successful and failed startups. 
                We consider factors like funding, team size, market conditions, and business model to provide accurate predictions 
                with confidence scores. Your data is kept secure and used only for analysis purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
