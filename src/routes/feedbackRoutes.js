const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message, category } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({ message: 'Feedback message is required.' });
    }

    const submission = await Feedback.create({
      name: name || '',
      email: email || '',
      message,
      category: category || 'general',
    });

    return res.status(201).json({
      message: 'Feedback submitted successfully.',
      feedback: submission,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save feedback.', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedback.', error: error.message });
  }
});

module.exports = router;
