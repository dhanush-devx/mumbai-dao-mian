const User = require('../models/User');

class PointsCalculator {
  calculateWalletPoints(walletCreation) {
    if (!walletCreation) return 0;
    const ageDays = (Date.now() - new Date(walletCreation)) / (1000 * 60 * 60 * 24);
    const intervals = Math.floor(ageDays / 90);
    // Points increase by 100 every 90 days, capped at 300+
    return intervals > 3 ? 300 + (intervals - 3) * 100 : intervals * 100;
  }

  async updateAllPoints() {
    try {
      const users = await User.find({});
      for (const user of users) {
        const walletPoints = this.calculateWalletPoints(user.walletCreation);
        let socialPoints = 0;
        if (user.socialGoogle) socialPoints += 100;
        if (user.socialTwitter) socialPoints += 100;
        if (user.socialLinkedin) socialPoints += 100;
        user.points = walletPoints + socialPoints;
        await user.save();
      }
      console.log('Points updated for all users');
    } catch (error) {
      console.error('Error updating points:', error);
    }
  }
}

module.exports = new PointsCalculator();
