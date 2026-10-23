const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest',
  },
  email: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  provider: {
    type: String,
    default: 'local',
    enum: ['local', 'email', 'google', 'facebook', 'instagram', 'linkedin', 'apple', 'github'],
  },
  method: {
    type: String,
    default: 'password',
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'success',
    enum: ['success', 'failed', 'pending'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { minimize: false });

module.exports = mongoose.models.LoginAttempt || mongoose.model('LoginAttempt', loginAttemptSchema);
