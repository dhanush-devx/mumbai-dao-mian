const UserActivity = require('../models/UserActivity');

class ActivityLogger {
  /**
   * Log user activity
   * @param {Object} user - User object
   * @param {String} activityType - Type of activity
   * @param {String} description - Description of activity
   * @param {Object} req - Express request object
   * @param {Object} metadata - Additional data to log
   */
  static async logActivity(user, activityType, description, req, metadata = {}) {
    try {
      if (!user || !user._id) {
        console.warn('Cannot log activity: No valid user provided');
        return;
      }

      const activity = new UserActivity({
        user: user._id,
        activityType,
        description,
        metadata,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      await activity.save();
      return activity;
    } catch (err) {
      console.error('Failed to log user activity:', err);
      // Non-blocking - we don't want activity logging to cause API failures
      return null;
    }
  }

  /**
   * Get recent activities for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Maximum number of activities to return
   */
  static async getRecentActivities(userId, limit = 10) {
    try {
      const activities = await UserActivity.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return activities;
    } catch (err) {
      console.error('Failed to get user activities:', err);
      return [];
    }
  }
}

module.exports = ActivityLogger;