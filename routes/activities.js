const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const ActivityLogger = require('../services/activityLogger');
const ErrorHandler = require('../utils/errorHandler');

// GET /activities - get recent activities for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const activities = await ActivityLogger.getRecentActivities(req.user._id);
    
    // Format activities for frontend display
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.activityType,
      description: activity.description,
      timestamp: activity.createdAt,
      metadata: activity.metadata
    }));
    
    res.json(formattedActivities);
    
    // Log this activity view (non-blocking)
    ActivityLogger.logActivity(
      req.user, 
      'PROFILE_VIEW', 
      'User viewed their activity history', 
      req
    );
  } catch (err) {
    return ErrorHandler.handleDBError(res, err);
  }
});

module.exports = router;