const express = require('express');
const Setting = require('../models/Setting');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne({ userId: 'default-user' });
    if (!settings) {
      settings = await Setting.create({ userId: 'default-user' });
    }
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch settings.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { themeColor, particleSpeed, glowIntensity, motionReduced } = req.body;

    const settings = await Setting.findOneAndUpdate(
      { userId: 'default-user' },
      {
        themeColor: themeColor || '#00ffc8',
        particleSpeed: Number(particleSpeed) || 1,
        glowIntensity: Number(glowIntensity) || 1,
        motionReduced: Boolean(motionReduced),
        updatedAt: Date.now(),
      },
      { new: true, upsert: true }
    );

    return res.json({ message: 'Settings updated successfully.', settings });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update settings.', error: error.message });
  }
});

module.exports = router;
