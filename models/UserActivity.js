const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['LOGIN', 'SOCIAL_CONNECT', 'USERNAME_UPDATE', 'PROFILE_VIEW'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: Object,
    default: {}
  },
  ipAddress: String,
  userAgent: String,
}, { 
  timestamps: true 
});

// Index for faster queries
UserActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('UserActivity', UserActivitySchema);