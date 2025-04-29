require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

const authRoutes = require('./routes/auth');
const leaderboardRoutes = require('./routes/leaderboard');
const profileRoutes = require('./routes/profile');
const mainRoutes = require('./routes/main');
const pointsCalculator = require('./services/pointsCalculator');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Basic GET route to handle root URL and serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


// Basic GET route to handle root URL
app.get('/', (req, res) => {
  res.send('Welcome to MyApp!');
});

// Connect to MySQL
connectDB()
  .then(() => {
    // Sync Sequelize models to create tables if they don't exist
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/profile', profileRoutes);
app.use('/main', mainRoutes);

// Schedule daily points update at midnight
cron.schedule('0 0 * * *', () => {
  pointsCalculator.updateAllPoints();
  console.log('Points updated for all users');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
