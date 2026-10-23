const express = require('express');
const bcrypt = require('bcryptjs');
const LoginAttempt = require('../models/LoginAttempt');
const fs = require('fs');
const path = require('path');
const { saveRecord, getAllRecords } = require('../db');

const router = express.Router();
const logFolder = path.join(__dirname, '..', '..', 'admin-logs');

function writeLogFile(payload) {
  const filePath = path.join(logFolder, `login-history-${new Date().toISOString().slice(0, 10)}.json`);
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
  }
  const existing = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
  existing.push({
    ...payload,
    createdAt: new Date().toISOString(),
  });
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}

router.post('/submit', async (req, res) => {
  try {
    const { email, username, provider = 'email', method = 'password', password = '' } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    const safeEmail = (email || username || '').toString().trim();
    const record = {
      userId: safeEmail || `user-${Date.now()}`,
      email: safeEmail,
      username: username || safeEmail || 'guest',
      provider,
      method,
      ipAddress: ip,
      userAgent: ua,
      status: 'success',
      type: 'login',
    };

    if (password && password.length > 0) {
      record.passwordHash = await bcrypt.hash(password, 10);
    }

    const saved = await LoginAttempt.create(record);
    const localRecord = saveRecord({
      ...record,
      databaseId: saved._id.toString(),
    });
    writeLogFile({
      ...record,
      _id: saved._id.toString(),
      localId: localRecord.id,
    });

    return res.status(200).json({
      message: 'Authentication data captured for review.',
      logId: saved._id,
      localId: localRecord.id,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to log auth attempt.', error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const attempts = await LoginAttempt.find().sort({ createdAt: -1 }).limit(100);
    const localRecords = getAllRecords();
    return res.json([...localRecords, ...attempts.map(item => ({
      ...item.toObject(),
      source: 'mongo',
    }))]);
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch auth history.', error: error.message });
  }
});

module.exports = router;
