const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../utils/authMiddleware');

// Helper function to calculate wallet age in days
function calculateWalletAge(walletCreation) {
  if (!walletCreation) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - walletCreation);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // days
}

// GET /leaderboard - get top users sorted by wallet age (descending) and points (descending)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Sort by oldest wallet first (ascending creation date), then by points (descending)
    const users = await User.find({ walletCreation: { $ne: null } })
      .sort({ walletCreation: 1, points: -1 })
      .limit(100);

    const leaderboard = users.map(user => ({
      username: user.username,
      profilePic: user.profilePic,
      walletAge: calculateWalletAge(user.walletCreation),
      points: user.points
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Error in leaderboard route:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
