require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./src/routes/userRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const redirectRoutes = require('./src/routes/redirectRoutes');
const hubRoutes = require('./src/routes/hubRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', redirectRoutes);
app.use('/api/hubs', hubRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/social-media-hub', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'social-media-hub.html'));
});

app.get('/business-hub', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'business-hub.html'));
});

app.get('/other-sectors-hub', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'other-sectors-hub.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/admin-history', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-history.html'));
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tunnelguard';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Continuing without MongoDB connection. Some API endpoints will still work in-memory fallback mode.');
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`TunnelGuard server running on http://localhost:${PORT}`);
});
