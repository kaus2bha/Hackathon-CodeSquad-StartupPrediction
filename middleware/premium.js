const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = async function premium(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(req.user.id)).select('isPremium premiumUntil');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const now = new Date();
    const active = Boolean(user.isPremium) || (user.premiumUntil && user.premiumUntil > now);
    if (!active) {
      return res.status(402).json({ message: 'Premium subscription required' });
    }
    return next();
  } 
  catch (err) {
    return res.status(500).json({ message: 'Premium check failed' });
  }
};


