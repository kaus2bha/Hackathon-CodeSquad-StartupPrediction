const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  startupName: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  fundingAmount: {
    type: Number,
    required: true
  },
  teamSize: {
    type: Number,
    required: true
  },
  yearsInBusiness: {
    type: Number,
    required: true
  },
  revenue: {
    type: Number,
    required: true
  },
  marketSize: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    required: true
  },
  competitionLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  technologyStack: {
    type: String,
    required: true
  },
  businessModel: {
    type: String,
    enum: ['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'Other'],
    required: true
  },
  prediction: {
    type: String,
    enum: ['Success', 'Failure'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  features: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
