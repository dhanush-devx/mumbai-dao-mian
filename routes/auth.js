const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyMessage } = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /auth/nonce - generate nonce for Metamask login challenge
router.post('/nonce', async (req, res) => {
  const { address, username } = req.body;
  if (!address) return res.status(400).json({ error: 'Address is required' });

  const nonce = Math.floor(Math.random() * 1000000);
  try {
    let user = await User.findOne({ where: { address: address.toLowerCase() } });
    if (user) {
      user.nonce = nonce;
      // Update username if provided and different
      if (username && username !== user.username) {
        // Check if username is unique
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser && existingUser.address.toLowerCase() !== address.toLowerCase()) {
          return res.status(400).json({ error: 'Username already taken' });
        }
        user.username = username;
      }
      await user.save();
    } else {
      // Check if username is unique before creating
      if (username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(400).json({ error: 'Username already taken' });
        }
      }
      user = await User.create({ address: address.toLowerCase(), nonce, username: username || null });
    }
    res.json({ nonce });
  } catch (err) {
    console.error('Error in /auth/nonce:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { address, signature } = req.body;
    if (!address || !signature) {
      return res.status(400).json({ error: 'Address and signature are required' });
    }

    // Find user by address
    const user = await User.findOne({ where: { address: address.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the message that was signed
    const message = `Login nonce: ${user.nonce}`;

    // Verify the signature using ethers.js
    const signerAddr = verifyMessage(message, signature);

    if (signerAddr.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    // Update wallet creation date if not set
    if (!user.walletCreation) {
      user.walletCreation = new Date();
    }

    // Clear nonce after successful login
    user.nonce = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Respond with token and user info
    res.json({
      token,
      user: {
        address: user.address,
        username: user.username,
        points: user.points,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Error in /auth/verify:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
