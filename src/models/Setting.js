const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default-user',
  },
  themeColor: {
    type: String,
    default: '#00ffc8',
  },
  particleSpeed: {
    type: Number,
    default: 1,
  },
  glowIntensity: {
    type: Number,
    default: 1,
  },
  motionReduced: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
