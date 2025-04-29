import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// API base URL - change this based on environment
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const Profile = () => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Social connection state
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    twitter: false,
    linkedin: false,
  });

  // Mock social connection data for development/testing
  const mockSocialData = {
    google: { id: 'google-mock-id', provider: 'google', username: 'googleuser' },
    twitter: { id: 'twitter-mock-id', provider: 'twitter', username: 'twitteruser' },
    linkedin: { id: 'linkedin-mock-id', provider: 'linkedin', username: 'linkedinuser' }
  };

  useEffect(() => {
    // Update username when user data changes
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (username.trim() === '') {
      setUsernameError('Username cannot be empty');
      return;
    }

    setIsSaving(true);
    setUsernameError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/profile/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        setSuccessMessage('Username updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setUsernameError(data.error || 'Failed to update username');
      }
    } catch (error) {
      setUsernameError('Network error. Please try again.');
      console.error('Update username error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectSocial = async (provider) => {
    try {
      setSocialLoading(prev => ({ ...prev, [provider]: true }));
      
      // Use a mock userId because we don't have real Clerk users
      // In a production app, this would be a real Clerk user ID
      const userId = 'user-123';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/profile/connect-social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userId, 
          provider,
          // Always include mock data for fallback
          mockData: mockSocialData[provider]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Social connection error:', errorData);
        throw new Error(errorData.error || 'Server error');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update the Auth context user if needed (this should be handled by your auth context)
        // For now, just show a success message
        setSuccessMessage(`Successfully connected ${provider}!`);
        
        // Refresh user data if needed
        // This depends on how your auth context works
        
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Social connection error:', error);
      setUsernameError(`Failed to connect ${provider}: ${error.message}`);
      setTimeout(() => setUsernameError(''), 5000);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If user isn't loaded yet or no user is logged in
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
        </div>
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          
          {usernameError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {usernameError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Details Section */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                <form onSubmit={handleUpdateUsername}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Address
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-sm text-gray-500 break-all">
                        {user.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Age
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-sm text-gray-500">
                        {user.walletCreation
                          ? `${Math.floor((new Date() - new Date(user.walletCreation)) / (1000 * 60 * 60 * 24))} days`
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Points and Stats Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stats</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">Total Points</span>
                  <span className="font-bold text-xl text-indigo-600">{user.points}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-4">
                  <div 
                    className="h-2 bg-indigo-600 rounded-full" 
                    style={{ width: `${Math.min(100, (user.points / 1000) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {user.points}/1000 points to next level
                </div>
              </div>
            </div>
          </div>

          {/* Social Connections Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Connections</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect your social accounts to earn additional points and verify your identity.
              Each connected account gives you 100 points.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Google */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    <span className="font-medium">Google</span>
                  </div>
                  <div>
                    {user?.social?.google ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnectSocial('google')}
                        disabled={socialLoading.google}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:opacity-50"
                      >
                        {socialLoading.google ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Twitter */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953,4.57a10,10,0,0,1-2.825.775,4.958,4.958,0,0,0,2.163-2.723,9.99,9.99,0,0,1-3.127,1.195A4.93,4.93,0,0,0,11.78,8.28,13.94,13.94,0,0,1,1.64,3.162a4.92,4.92,0,0,0,1.524,6.574A4.903,4.903,0,0,1,.934,9.017v.061a4.926,4.926,0,0,0,3.95,4.827,4.9,4.9,0,0,1-2.224.084,4.935,4.935,0,0,0,4.6,3.417,9.893,9.893,0,0,1-6.1,2.1A10.1,10.1,0,0,1,0,19.458a13.94,13.94,0,0,0,7.548,2.208A13.888,13.888,0,0,0,21.53,7.772c0-.209,0-.42-.015-.63A9.935,9.935,0,0,0,24,4.59Z"/>
                    </svg>
                    <span className="font-medium">Twitter</span>
                  </div>
                  <div>
                    {user?.social?.twitter ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnectSocial('twitter')}
                        disabled={socialLoading.twitter}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:opacity-50"
                      >
                        {socialLoading.twitter ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-700 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
                    </svg>
                    <span className="font-medium">LinkedIn</span>
                  </div>
                  <div>
                    {user?.social?.linkedin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnectSocial('linkedin')}
                        disabled={socialLoading.linkedin}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:opacity-50"
                      >
                        {socialLoading.linkedin ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
            
            <div className="flex">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;