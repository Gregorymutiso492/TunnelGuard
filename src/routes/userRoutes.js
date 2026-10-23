const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { saveRecord } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password, email, provider = 'email', method = 'password' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email || cleanUsername || '').trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ username: cleanUsername.toLowerCase() });

    if (!user) {
      user = await User.create({
        username: cleanUsername.toLowerCase(),
        email: cleanEmail,
        password: hashedPassword,
      });
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        user.password = hashedPassword;
        await user.save();
      }
    }

    saveRecord({
      type: 'user-login',
      username: cleanUsername,
      email: cleanEmail,
      provider,
      method,
      passwordHash: hashedPassword,
      status: 'success',
      source: 'local-db',
      userId: user._id.toString(),
    });

    return res.status(200).json({
      message: 'Login accepted.',
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while handling login.', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

module.exports = router;
