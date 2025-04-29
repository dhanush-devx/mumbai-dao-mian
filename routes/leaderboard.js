const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Op } = require('sequelize');

// Helper function to calculate wallet age in days
function calculateWalletAge(walletCreation) {
  const now = new Date();
  const diffTime = Math.abs(now - walletCreation);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // days
}

// GET /leaderboard - get top users sorted by wallet age (descending) and points (descending)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [
        ['walletCreation', 'ASC'], // oldest wallet first
        ['points', 'DESC']
      ],
      limit: 100
    });

    const leaderboard = users.map(user => ({
      username: user.username,
      profilePic: user.profilePic,
      walletAge: calculateWalletAge(user.walletCreation),
      points: user.points
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
