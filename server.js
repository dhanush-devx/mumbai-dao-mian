require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const leaderboardRoutes = require('./routes/leaderboard');
const activitiesRoutes = require('./routes/activities');
const profileRoutes = require('./routes/profile'); // Import profile routes

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/auth', authRoutes);
app.use('/main', mainRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/activities', activitiesRoutes);
app.use('/profile', profileRoutes); // Add profile routes

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Mumbai DAO API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});