const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const User = require('../models/User');
const clerkService = require('../services/clerkService');
const ActivityLogger = require('../services/activityLogger');
const ErrorHandler = require('../utils/errorHandler');

// POST /profile/username - update username (unique)
router.post('/username', authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  try {
    // Check if username is already taken by another user
    const existing = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existing) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    const oldUsername = req.user.username;
    // Update the username
    req.user.username = username;
    await req.user.save();
    
    // Log activity
    ActivityLogger.logActivity(
      req.user,
      'USERNAME_UPDATE',
      'User updated their username',
      req,
      { oldUsername, newUsername: username }
    );
    
    res.json({ success: true, username: req.user.username });
  } catch (err) {
    console.error('Error updating username:', err);
    return ErrorHandler.handleDBError(res, err);
  }
});

// POST /profile/connect-social - connect social account via Clerk
router.post('/connect-social', authMiddleware, async (req, res) => {
  const { userId, provider, mockData } = req.body;
  if (!userId || !provider) return res.status(400).json({ error: 'userId and provider are required' });

  try {
    // First try to use Clerk verification
    let socialAccount;
    let providerKey = provider;
    
    // Handle OAuth prefix if present (oauth_google -> google)
    if (provider.startsWith('oauth_')) {
      providerKey = provider.substring(6);
    }
    
    try {
      socialAccount = await clerkService.verifySocialConnection(userId, providerKey);
    } catch (error) {
      console.error('Clerk API error:', error.message);
      // Fall back to mock data if provided
      if (mockData) {
        console.log('Using mock data as fallback:', mockData);
        socialAccount = mockData;
      } else {
        throw error; // Re-throw if no fallback
      }
    }

    if (!socialAccount) {
      return res.status(400).json({ error: 'Social account not found or not connected' });
    }

    // Add 100 points for connecting social account if not already connected
    const providerCapitalized = capitalize(providerKey);
    const socialField = `social${providerCapitalized}`;
    const isNewConnection = !req.user[socialField];
    let pointsAdded = 0;
    
    if (isNewConnection) {
      pointsAdded = 100;
      req.user.points += pointsAdded;
    }

    // Update social info
    req.user[socialField] = socialAccount.id || socialAccount.provider_user_id || 'connected';

    // Update profilePic if Twitter and user doesn't have one
    if (providerKey === 'twitter' && socialAccount.username && !req.user.profilePic) {
      req.user.profilePic = `https://twivatar.glitch.me/${socialAccount.username}`;
    }

    await req.user.save();
    
    // Log activity only for new connections
    if (isNewConnection) {
      ActivityLogger.logActivity(
        req.user,
        'SOCIAL_CONNECT',
        `User connected their ${providerCapitalized} account`,
        req,
        { provider: providerKey, pointsEarned: pointsAdded }
      );
    }
    
    // Return detailed response with social connection status
    res.json({ 
      success: true, 
      social: {
        google: req.user.socialGoogle ? true : false,
        twitter: req.user.socialTwitter ? true : false,
        linkedin: req.user.socialLinkedin ? true : false
      },
      points: req.user.points,
      pointsAdded: pointsAdded,
      profilePic: req.user.profilePic,
      isNewConnection: isNewConnection
    });
  } catch (err) {
    console.error('Error connecting social account:', err);
    return ErrorHandler.handleError(res, 500, 'Server error', err.message);
  }
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;