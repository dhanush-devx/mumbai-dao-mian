const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const User = require('../models/User');

// Helper function to calculate wallet age in days
function calculateWalletAge(walletCreation) {
  const now = new Date();
  const diffTime = Math.abs(now - walletCreation);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // days
}

// GET /main - returns user info and leaderboard data
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get user info
    const user = await User.findOne({ where: { id: req.user.id } });

    // Get leaderboard data (top 100 users)
    const users = await User.findAll({
      order: [
        ['walletCreation', 'ASC'], // oldest wallet first
        ['points', 'DESC']
      ],
      limit: 100
    });

    const leaderboard = users.map(u => ({
      username: u.username,
      profilePic: u.profilePic,
      walletAge: calculateWalletAge(u.walletCreation),
      points: u.points
    }));

    res.json({
      user: {
        address: user.address,
        username: user.username,
        profilePic: user.profilePic,
        points: user.points,
        social: {
          google: user.socialGoogle,
          twitter: user.socialTwitter,
          linkedin: user.socialLinkedin
        }
      },
      leaderboard
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
