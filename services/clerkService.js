const axios = require('axios');

class ClerkService {
  constructor() {
    this.apiKey = process.env.CLERK_SECRET_KEY;
    this.baseUrl = 'https://api.clerk.com/v1';
  }

  async verifySocialConnection(userId, provider) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/${userId}/oauth_accounts`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`
          }
        }
      );
      const accounts = response.data;
      return accounts.find(acc => acc.provider === provider);
    } catch (error) {
      console.error('Clerk API error:', error);
      throw new Error('Failed to verify social connection');
    }
  }
}

module.exports = new ClerkService();
