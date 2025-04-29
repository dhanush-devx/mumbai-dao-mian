const axios = require('axios');
const clerkConfig = require('../config/clerk');

class ClerkService {
  constructor() {
    this.apiKey = clerkConfig.apiKey;
    this.baseUrl = 'https://api.clerk.com/v1';
    console.log('ClerkService initialized with API key:', this.apiKey ? 'API key present' : 'API key missing');
  }

  async verifySocialConnection(userId, provider) {
    try {
      console.log(`Attempting to verify social connection for user ${userId} with provider ${provider}`);
      console.log(`Using API key: ${this.apiKey ? 'Yes' : 'No'}`);
      
      const response = await axios.get(
        `${this.baseUrl}/users/${userId}/oauth_accounts`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Clerk API response status:', response.status);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Unexpected response format from Clerk API:', response.data);
        return null;
      }
      
      const accounts = response.data;
      console.log(`Found ${accounts.length} social accounts for user`);
      
      const matchedAccount = accounts.find(acc => acc.provider === provider);
      if (matchedAccount) {
        console.log(`Found matching account for provider ${provider}`);
        return matchedAccount;
      } else {
        console.log(`No matching account found for provider ${provider}`);
        return null;
      }
    } catch (error) {
      console.error('Clerk API error:', error.message);
      console.error('Error details:', error.response?.data || 'No detailed error information');
      throw new Error('Failed to verify social connection');
    }
  }

  async getUserProfile(userId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data) {
        console.error('Failed to retrieve user profile from Clerk');
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error('Clerk API error:', error.response?.data || error.message);
      return null;
    }
  }
}

module.exports = new ClerkService();