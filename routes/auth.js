const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLogger = require('../services/activityLogger');
const ErrorHandler = require('../utils/errorHandler');

// POST /auth/nonce - generate nonce for Metamask login challenge
router.post('/nonce', async (req, res) => {
  try {
    const { address, username } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const nonce = Math.floor(Math.random() * 1000000);
    
    let user = await User.findOne({ address: address.toLowerCase() });
    
    if (user) {
      user.nonce = nonce;
      // Update username if provided and different
      if (username && username !== user.username) {
        // Check if username is unique
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser.address.toLowerCase() !== address.toLowerCase()) {
          return res.status(400).json({ error: 'Username already taken' });
        }
        user.username = username;
      }
      await user.save();
    } else {
      // Check if username is unique before creating
      if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ error: 'Username already taken' });
        }
      }
      user = await User.create({ 
        address: address.toLowerCase(), 
        nonce, 
        username: username || null,
        walletCreation: new Date()  // Set wallet creation date for new users
      });
    }
    
    return res.status(200).json({ nonce });
  } catch (err) {
    console.error('Error in /auth/nonce:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { address, signature } = req.body;
    if (!address || !signature) {
      return res.status(400).json({ error: 'Address and signature are required' });
    }

    // Find user by address
    const user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Make sure nonce exists
    if (user.nonce === null) {
      return res.status(400).json({ error: 'Invalid login attempt. Please request a new nonce.' });
    }

    // Construct the message that was signed
    const message = `Login nonce: ${user.nonce}`;
    console.log(`Verifying signature for message: "${message}" from address: ${address}`);

    try {
      // Recover the address from the signature using ethers v6 API
      const recoveredAddress = ethers.verifyMessage(message, signature);
      console.log(`Recovered address: ${recoveredAddress}`);

      // Check if the recovered address matches the provided address
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        console.error(`Signature verification failed: ${recoveredAddress.toLowerCase()} !== ${address.toLowerCase()}`);
        return res.status(401).json({ error: 'Signature verification failed' });
      }

      console.log('Signature verified successfully');
    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(401).json({ error: 'Invalid signature format: ' + error.message });
    }

    // Update wallet creation date if not set
    if (!user.walletCreation) {
      user.walletCreation = new Date();
    }

    // Clear nonce after successful login
    user.nonce = null;
    await user.save();

    // Check if JWT_SECRET exists before trying to sign the token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not defined');
      return res.status(500).json({ error: 'Server configuration error: JWT_SECRET is missing' });
    }

    // Generate JWT token
    try {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      // Log login activity (non-blocking)
      try {
        ActivityLogger.logActivity(
          user,
          'LOGIN',
          'User logged in with wallet',
          req,
          { address: user.address }
        ).catch(err => console.error('Error logging activity:', err));
      } catch (logError) {
        console.error('Error logging activity:', logError);
        // Continue anyway since this is non-critical
      }

      // Respond with token and user info
      return res.status(200).json({
        token,
        user: {
          address: user.address,
          username: user.username,
          points: user.points,
          profilePic: user.profilePic,
          walletCreation: user.walletCreation,
          social: {
            google: !!user.socialGoogle,
            twitter: !!user.socialTwitter,
            linkedin: !!user.socialLinkedin
          }
        }
      });
    } catch (jwtError) {
      console.error('Error signing JWT token:', jwtError);
      return res.status(500).json({ error: 'Failed to generate authentication token', details: jwtError.message });
    }
  } catch (error) {
    console.error('Error in /auth/verify:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;
