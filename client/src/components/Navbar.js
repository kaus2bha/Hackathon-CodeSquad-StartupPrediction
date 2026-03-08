import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  Brain, 
  Home, 
  User, 
  LogOut, 
  Menu, 
  X,
  Crown,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    initializeAuth();
    
    // Listen for storage changes to update auth status
    const handleStorageChange = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    // Listen for custom auth events
    const handleAuthChange = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoggedIn(false);
      setIsPremium(false);
      return;
    }

    // Validate token by making a request to the server
    try {
      const response = await axios.get('/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        setIsLoggedIn(true);
        
        // Get premium status from backend
        try {
          const premiumResponse = await axios.get('/api/auth/premium-status', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (premiumResponse.data.isPremium) {
            // User has premium status from backend
            setIsPremium(true);
            localStorage.setItem('isPremium', 'true');
            localStorage.setItem('premiumPlan', premiumResponse.data.plan);
            localStorage.setItem('premiumUntil', premiumResponse.data.expiresAt);
          } else {
            // User doesn't have premium status
            setIsPremium(false);
            localStorage.setItem('isPremium', 'false');
            localStorage.removeItem('premiumPlan');
            localStorage.removeItem('premiumUntil');
          }
        } catch (premiumError) {
          // If premium status check fails, default to freemium
          console.log('Premium status check failed, defaulting to freemium');
          setIsPremium(false);
          localStorage.setItem('isPremium', 'false');
          localStorage.removeItem('premiumPlan');
          localStorage.removeItem('premiumUntil');
        }
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setIsPremium(false);
      }
    } catch (error) {
      // Token is invalid or expired, clear it
      console.log('Token validation failed, clearing invalid token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isPremium');
      localStorage.removeItem('premiumPlan');
      localStorage.removeItem('premiumUntil');
      setIsLoggedIn(false);
      setIsPremium(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumPlan');
    localStorage.removeItem('premiumUntil');
    setIsLoggedIn(false);
    setIsPremium(false);
    
    // Dispatch custom event to notify other components of auth change
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/');
  };

  const handlePremiumUpgrade = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await axios.post('/api/auth/upgrade-premium', {
        plan: 'Premium',
        duration: 30
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Update local state
        setIsPremium(true);
        
        // Update localStorage
        localStorage.setItem('isPremium', 'true');
        localStorage.setItem('premiumPlan', response.data.premiumStatus.plan);
        localStorage.setItem('premiumUntil', response.data.premiumStatus.expiresAt);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('authChange'));
        
        toast.success('Upgraded to premium successfully!');
      }
    } catch (error) {
      console.error('Premium upgrade error:', error);
      toast.error('Failed to upgrade to premium');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Startup Predictor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-blue-600' : ''
              }`}
            >
              <Home className="w-4 h-4 inline mr-1" />
              Home
            </Link>
            
            {isLoggedIn && (
              <>
                <Link
                  to="/predict"
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/predict' ? 'text-blue-600' : ''
                  }`}
                >
                  <Brain className="w-4 h-4 inline mr-1" />
                  Predict
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard' ? 'text-blue-600' : ''
                  }`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Dashboard
                </Link>
              </>
            )}
            
            <Link
              to="/about"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/about' ? 'text-blue-600' : ''
              }`}
            >
              About
            </Link>
          </div>

          {/* Right side - Auth & Premium */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Premium Status Indicator */}
            {isLoggedIn && !isLoading && (
              <div className="flex items-center space-x-2">
                {isPremium ? (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Premium</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/subscription"
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Upgrade</span>
                    </Link>
                    
                    {/* Premium Upgrade Button for Freemium Users */}
                    <button
                      onClick={handlePremiumUpgrade}
                      className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="Upgrade to premium"
                    >
                      <Zap className="w-4 h-4 inline mr-1" />
                      Upgrade
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Loading indicator for auth status */}
            {isLoggedIn && isLoading && (
              <div className="flex items-center space-x-2 px-3 py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            )}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Home
            </Link>
            
            {isLoggedIn && (
              <>
                <Link
                  to="/predict"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/predict' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Brain className="w-4 h-4 inline mr-2" />
                  Predict
                </Link>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Dashboard
                </Link>
              </>
            )}
            
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/about' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            {/* Mobile Premium Status */}
            {isLoggedIn && !isLoading && (
              <div className="px-3 py-2">
                {isPremium ? (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Premium User</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/subscription"
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Upgrade to Premium</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handlePremiumUpgrade();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Quick Upgrade</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Loading indicator for auth status */}
            {isLoggedIn && isLoading && (
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              </div>
            )}

            {/* Mobile Auth */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
