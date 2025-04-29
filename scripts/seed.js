require('dotenv').config();
const { connectDB } = require('../config/db');
const User = require('../models/User');
const pointsCalculator = require('../services/pointsCalculator');

// Sample data
const sampleUsers = [
  {
    address: '0x1234567890123456789012345678901234567890',
    username: 'crypto_king',
    walletCreation: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    socialTwitter: 'twitter123'
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    username: 'blockchain_queen',
    walletCreation: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    socialGoogle: 'google123'
  },
  {
    address: '0x9876543210987654321098765432109876543210',
    username: 'web3_developer',
    walletCreation: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000), // 2 years ago
    socialLinkedin: 'linkedin123',
    socialGoogle: 'google456'
  },
  {
    address: '0xfedcba9876543210fedcba9876543210fedcba98',
    username: 'defi_guru',
    walletCreation: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
  {
    address: '0x0123456789abcdef0123456789abcdef01234567',
    username: 'nft_enthusiast',
    walletCreation: new Date(Date.now() - 545 * 24 * 60 * 60 * 1000), // 1.5 years ago
    socialTwitter: 'twitter456',
    socialLinkedin: 'linkedin789'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    
    console.log('Existing users deleted');
    
    // Insert sample users
    await User.insertMany(sampleUsers);
    
    console.log('Sample users inserted');
    
    // Calculate points for all users
    await pointsCalculator.updateAllPoints();
    
    console.log('Points calculated for all users');
    
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();