const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const User = require('../models/User');
const clerkService = require('../services/clerkService');

// POST /profile/username - update username (unique)
router.post('/username', authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  try {
    const existing = await User.findOne({ where: { username } });
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    req.user.username = username;
    await req.user.save();
    res.json({ success: true, username: req.user.username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /profile/connect-social - connect social account via Clerk
router.post('/connect-social', authMiddleware, async (req, res) => {
  const { userId, provider } = req.body;
  if (!userId || !provider) return res.status(400).json({ error: 'userId and provider are required' });

  try {
    const socialAccount = await clerkService.verifySocialConnection(userId, provider);
    if (!socialAccount) {
      return res.status(400).json({ error: 'Social account not found or not connected' });
    }

    // Add 100 points for connecting social account if not already connected
    if (!req.user[`social${capitalize(provider)}`]) {
      req.user.points += 100;
    }

    // Update social info
    req.user[`social${capitalize(provider)}`] = socialAccount.id;

    // Update profilePic if Twitter
    if (provider === 'twitter' && socialAccount.username) {
      req.user.profilePic = `https://twivatar.glitch.me/${socialAccount.username}`;
    }

    await req.user.save();
    res.json({ success: true, social: {
      google: req.user.socialGoogle,
      twitter: req.user.socialTwitter,
      linkedin: req.user.socialLinkedin
    }, points: req.user.points, profilePic: req.user.profilePic });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;
