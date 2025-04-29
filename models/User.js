const mongoose = require('mongoose');
mongoose.pluralize(null);

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  walletCreation: {
    type: Date,
    default: null
  },
  points: {
    type: Number,
    default: 0
  },
  socialGoogle: {
    type: String,
    default: null
  },
  socialTwitter: {
    type: String,
    default: null
  },
  socialLinkedin: {
    type: String,
    default: null
  },
  profilePic: {
    type: String,
    default: null
  },
  nonce: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
