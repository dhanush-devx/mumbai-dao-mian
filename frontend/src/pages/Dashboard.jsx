import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// API base URL - change this based on environment
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const Dashboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/main`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data.leaderboard.slice(0, 5)); // Top 5 users
        } else {
          console.error("Failed to fetch dashboard data:", await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/activities`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          console.error("Failed to fetch activities:", await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setActivityLoading(false);
      }
    };
    
    fetchData();
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Calculate wallet age in days
  const calculateWalletAge = (walletCreation) => {
    if (!walletCreation) return 'N/A';
    const creationDate = new Date(walletCreation);
    const now = new Date();
    const diffTime = Math.abs(now - creationDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const walletAgeInDays = calculateWalletAge(user?.walletCreation);

  // Format activity timestamp to relative time
  const formatActivityTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Format activity type for display
  const getActivityIcon = (type) => {
    switch (type) {
      case 'LOGIN':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'SOCIAL_CONNECT':
        return (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'USERNAME_UPDATE':
        return (
          <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="bg-white rounded-lg shadow overflow-hidden col-span-2">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Stats</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-gray-500">Username</h4>
                <p className="text-2xl font-bold text-gray-800">{user?.username || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-gray-500">Points</h4>
                <p className="text-2xl font-bold text-gray-800">{user?.points || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-gray-500">Wallet Age</h4>
                <p className="text-2xl font-bold text-gray-800">{walletAgeInDays} days</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Connected Socials</h4>
              <div className="flex space-x-4">
                <div className={`rounded-md px-4 py-2 flex items-center ${user?.social?.google ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-400'}`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </div>
                <div className={`rounded-md px-4 py-2 flex items-center ${user?.social?.twitter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M23.953,4.57a10,10,0,0,1-2.825.775,4.958,4.958,0,0,0,2.163-2.723,9.99,9.99,0,0,1-3.127,1.195A4.93,4.93,0,0,0,11.78,8.28,13.94,13.94,0,0,1,1.64,3.162a4.92,4.92,0,0,0,1.524,6.574A4.903,4.903,0,0,1,.934,9.017v.061a4.926,4.926,0,0,0,3.95,4.827,4.9,4.9,0,0,1-2.224.084,4.935,4.935,0,0,0,4.6,3.417,9.893,9.893,0,0,1-6.1,2.1A10.1,10.1,0,0,1,0,19.458a13.94,13.94,0,0,0,7.548,2.208A13.888,13.888,0,0,0,21.53,7.772c0-.209,0-.42-.015-.63A9.935,9.935,0,0,0,24,4.59Z"/>
                  </svg>
                  Twitter
                </div>
                <div className={`rounded-md px-4 py-2 flex items-center ${user?.social?.linkedin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
                  </svg>
                  LinkedIn
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Edit Profile →
            </Link>
          </div>
        </div>
        
        {/* Top Leaderboard Preview */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Top Members</h3>
            <Link to="/leaderboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View All
            </Link>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {leaderboardData.map((member, index) => (
                <li key={index} className="py-3 flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.username || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{member.points} points</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {member.walletAge} days
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {activityLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : activities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatActivityTime(activity.timestamp)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start participating in the Mumbai DAO community to see your activity here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;