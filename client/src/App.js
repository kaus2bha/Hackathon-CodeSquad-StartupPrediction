import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PremiumHome from './pages/PremiumHome';
import PredictionForm from './pages/PredictionForm';
import PrivateRoute from './components/PrivateRoute';
import PredictionResult from './pages/PredictionResult';
import PremiumResult from './pages/PremiumResult';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PremiumDashboard from './pages/PremiumDashboard';
import About from './pages/About';
import Subscription from './pages/Subscription';
import Payment from './pages/Payment';

// Smart Route Component that shows different pages based on premium status
const SmartRoute = ({ premiumComponent, freemiumComponent, fallback = <Navigate to="/subscription" />, checkQuery = false }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      // Check if premium is requested via query parameter
      if (checkQuery) {
        const urlParams = new URLSearchParams(window.location.search);
        const isPremiumQuery = urlParams.get('premium') === 'true';
        if (isPremiumQuery) {
          setIsPremium(true);
          setLoading(false);
          return;
        }
      }

      // Check if user is logged in (has token)
      const token = localStorage.getItem('token');
      if (token) {
        // Get premium status from backend
        try {
          const response = await axios.get('/api/auth/premium-status', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.isPremium) {
            // User has premium status from backend
            setIsPremium(true);
            localStorage.setItem('isPremium', 'true');
            localStorage.setItem('premiumPlan', response.data.plan);
            localStorage.setItem('premiumUntil', response.data.expiresAt);
          } else {
            // User doesn't have premium status
            setIsPremium(false);
            localStorage.setItem('isPremium', 'false');
            localStorage.removeItem('premiumPlan');
            localStorage.removeItem('premiumUntil');
          }
        } catch (error) {
          // If premium status check fails, default to freemium
          console.log('Premium status check failed, defaulting to freemium');
          setIsPremium(false);
          localStorage.setItem('isPremium', 'false');
          localStorage.removeItem('premiumPlan');
          localStorage.removeItem('premiumUntil');
        }
      } else {
        // Check localStorage for premium status - only true if explicitly set to 'true'
        const premiumStatus = localStorage.getItem('isPremium');
        const premiumPlan = localStorage.getItem('premiumPlan');
        const premiumUntil = localStorage.getItem('premiumUntil');
        
        // Only consider premium if all required fields are present and valid
        const isPremium = premiumStatus === 'true' && 
                        premiumPlan && 
                        premiumUntil && 
                        new Date(premiumUntil) > new Date();
        
        setIsPremium(isPremium);
        
        // Clean up invalid premium status
        if (!isPremium && (premiumStatus || premiumPlan || premiumUntil)) {
          localStorage.removeItem('isPremium');
          localStorage.removeItem('premiumPlan');
          localStorage.removeItem('premiumUntil');
        }
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return isPremium ? premiumComponent : freemiumComponent;
};

function App() {
  // Check and validate premium status on app start
  useEffect(() => {
    const validatePremiumStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Get premium status from backend
        try {
          const response = await axios.get('/api/auth/premium-status', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.isPremium) {
            // User has premium status from backend
            localStorage.setItem('isPremium', 'true');
            localStorage.setItem('premiumPlan', response.data.plan);
            localStorage.setItem('premiumUntil', response.data.expiresAt);
          } else {
            // User doesn't have premium status
            localStorage.setItem('isPremium', 'false');
            localStorage.removeItem('premiumPlan');
            localStorage.removeItem('premiumUntil');
          }
        } catch (error) {
          // If premium status check fails, default to freemium
          console.log('Premium status check failed, defaulting to freemium');
          localStorage.setItem('isPremium', 'false');
          localStorage.removeItem('premiumPlan');
          localStorage.removeItem('premiumUntil');
        }
      } else {
        // If no token, clear premium status
        localStorage.removeItem('isPremium');
        localStorage.removeItem('premiumPlan');
        localStorage.removeItem('premiumUntil');
      }
    };

    const clearInvalidAuth = () => {
      // Clear any existing auth data on app start to ensure clean state
      // This prevents showing logout option when there's an invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isPremium');
      localStorage.removeItem('premiumPlan');
      localStorage.removeItem('premiumUntil');
    };
    
    clearInvalidAuth();
    validatePremiumStatus().catch(console.error);
  }, []);

  return (
    <div className="App">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          {/* Smart routing based on premium status */}
          <Route path="/" element={
            <SmartRoute
              premiumComponent={<PremiumHome />}
              freemiumComponent={<Home />}
            />
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <SmartRoute
                premiumComponent={<PremiumDashboard />}
                freemiumComponent={<Dashboard />}
              />
            </PrivateRoute>
          } />

          <Route path="/result/:id" element={
            <SmartRoute
              premiumComponent={<PremiumResult />}
              freemiumComponent={<PredictionResult />}
              checkQuery={true}
            />
          } />

          {/* Regular routes */}
          <Route path="/predict" element={
            <PrivateRoute>
              <PredictionForm />
            </PrivateRoute>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </motion.div>
    </div>
  );
}

export default App;
