const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const User = require('../models/User');

// Helper function to calculate wallet age in days
function calculateWalletAge(walletCreation) {
  if (!walletCreation) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - walletCreation);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // days
}

// GET /main - returns user info and leaderboard data
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get user info - req.user already populated by authMiddleware
    const user = req.user;

    // Get leaderboard data (top 100 users)
    const users = await User.find({ walletCreation: { $ne: null } })
      .sort({ walletCreation: 1, points: -1 })
      .limit(100);

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
        walletAge: calculateWalletAge(user.walletCreation),
        social: {
          google: user.socialGoogle ? true : false,
          twitter: user.socialTwitter ? true : false,
          linkedin: user.socialLinkedin ? true : false
        }
      },
      leaderboard
    });
  } catch (err) {
    console.error("Error in main route:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
