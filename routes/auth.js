const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('company').optional(),
  body('role').isIn(['entrepreneur', 'investor', 'analyst']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, company, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration failed: user already exists for email', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      company: company || '',
      role: role || 'entrepreneur'
    });

    try {
      await user.save();
    } catch (err) {
      console.log('Registration failed: error saving user', err);
      return res.status(500).json({ message: 'Error saving user', error: err.message });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: user not found for email', email);
      return res.status(400).json({ message: 'Invalid credentials: user not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: password mismatch for email', email);
      return res.status(400).json({ message: 'Invalid credentials: password mismatch' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find the user
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password)
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        isPremium: user.isPremium,
        premiumPlan: user.premiumPlan,
        premiumUntil: user.premiumUntil,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   GET /api/auth/premium-status
// @desc    Get user's premium status
// @access  Private
router.get('/premium-status', async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find the user
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has premium status
    const isPremium = user.isPremium || false;
    const premiumPlan = user.premiumPlan || null;
    const premiumUntil = user.premiumUntil || null;

    console.log('Premium status check for user:', user.email);
    console.log('User premium fields:', { isPremium, premiumPlan, premiumUntil });

    res.json({
      isPremium,
      plan: premiumPlan,
      expiresAt: premiumUntil
    });

  } catch (error) {
    console.error('Premium status check error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error checking premium status',
      error: error.message 
    });
  }
});

// @route   POST /api/auth/upgrade-premium
// @desc    Upgrade user to premium
// @access  Private
router.post('/upgrade-premium', async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find the user
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { plan = 'Premium', duration = 30 } = req.body; // duration in days
    
    // Calculate expiration date
    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + duration);
    
    // Update user's premium status
    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumUntil = premiumUntil;
    
    await user.save();

    res.json({
      success: true,
      message: 'User upgraded to premium successfully',
      premiumStatus: {
        isPremium: true,
        plan: user.premiumPlan,
        expiresAt: user.premiumUntil
      }
    });

  } catch (error) {
    console.error('Premium upgrade error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error upgrading to premium',
      error: error.message 
    });
  }
});

// @route   POST /api/auth/test-premium
// @desc    Test endpoint to make a user premium (temporary)
// @access  Private
router.post('/test-premium', async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find the user
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Force user to be premium for testing
    user.isPremium = true;
    user.premiumPlan = 'Test Premium';
    user.premiumUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    
    await user.save();

    console.log('User forced to premium:', user.email);

    res.json({
      success: true,
      message: 'User forced to premium for testing',
      premiumStatus: {
        isPremium: true,
        plan: user.premiumPlan,
        expiresAt: user.premiumUntil
      }
    });

  } catch (error) {
    console.error('Test premium error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error forcing premium',
      error: error.message 
    });
  }
});

module.exports = router;
