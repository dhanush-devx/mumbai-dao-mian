import { useUser, useClerk } from '@clerk/clerk-react';
import { UserProfile } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// API base URL - change this based on environment
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const Profile = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { openUserProfile } = useClerk();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [socialStatus, setSocialStatus] = useState({
    google: false,
    twitter: false,
    linkedin: false
  });
  const [points, setPoints] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setSocialStatus({
        google: user.social?.google || false,
        twitter: user.social?.twitter || false,
        linkedin: user.social?.linkedin || false
      });
      setPoints(user.points || 0);
    }
  }, [user]);

  const connectSocial = async (provider) => {
    if (!clerkUser || !isSignedIn) return;
    
    setIsConnecting(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/profile/connect-social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: clerkUser.id,
          provider: `oauth_${provider}`
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSocialStatus(data.social);
        setPoints(data.points);
        setMessage({
          type: 'success',
          text: `Successfully connected ${provider}! ${!socialStatus[provider] ? '+100 points!' : ''}`
        });
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser) {
          currentUser.points = data.points;
          currentUser.social = data.social;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.error || `Failed to connect ${provider}`
        });
      }
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
      setMessage({
        type: 'error',
        text: `Error connecting to ${provider}: ${error.message}`
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <button
              onClick={() => openUserProfile()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Manage Social Connections
            </button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-500">Your Points</div>
                <div className="text-2xl font-bold text-gray-900">{points}</div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                Connect socials to earn 100 points each
              </div>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setMessage(null)}
                      className={`inline-flex rounded-md p-1.5 ${
                        message.type === 'success' 
                          ? 'text-green-500 hover:bg-green-100' 
                          : 'text-red-500 hover:bg-red-100'
                      } focus:outline-none`}
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Social Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    <span className="font-medium">Google</span>
                  </div>
                  <div>
                    {socialStatus.google ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          openUserProfile({ initialTab: 'connections' });
                          setTimeout(() => connectSocial('google'), 2000);
                        }}
                        disabled={isConnecting}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                      >
                        {isConnecting ? 'Connecting...' : 'Connect +100 pts'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953,4.57a10,10,0,0,1-2.825.775,4.958,4.958,0,0,0,2.163-2.723,9.99,9.99,0,0,1-3.127,1.195A4.93,4.93,0,0,0,11.78,8.28,13.94,13.94,0,0,1,1.64,3.162a4.92,4.92,0,0,0,1.524,6.574A4.903,4.903,0,0,1,.934,9.017v.061a4.926,4.926,0,0,0,3.95,4.827,4.9,4.9,0,0,1-2.224.084,4.935,4.935,0,0,0,4.6,3.417,9.893,9.893,0,0,1-6.1,2.1A10.1,10.1,0,0,1,0,19.458a13.94,13.94,0,0,0,7.548,2.208A13.888,13.888,0,0,0,21.53,7.772c0-.209,0-.42-.015-.63A9.935,9.935,0,0,0,24,4.59Z"/>
                    </svg>
                    <span className="font-medium">Twitter</span>
                  </div>
                  <div>
                    {socialStatus.twitter ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          openUserProfile({ initialTab: 'connections' });
                          setTimeout(() => connectSocial('twitter'), 2000);
                        }}
                        disabled={isConnecting}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                      >
                        {isConnecting ? 'Connecting...' : 'Connect +100 pts'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-700 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
                    </svg>
                    <span className="font-medium">LinkedIn</span>
                  </div>
                  <div>
                    {socialStatus.linkedin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          openUserProfile({ initialTab: 'connections' });
                          setTimeout(() => connectSocial('linkedin'), 2000);
                        }}
                        disabled={isConnecting}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                      >
                        {isConnecting ? 'Connecting...' : 'Connect +100 pts'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-blue-800 mb-2">How to connect your social accounts:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Click the "Connect" button next to the social network you want to link</li>
              <li>Follow the authentication process from the provider</li>
              <li>You'll be redirected back to your profile automatically</li>
              <li>Earn 100 points for each unique social account you connect!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;