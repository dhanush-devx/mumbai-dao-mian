import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// API base URL - change this based on environment
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, walletAge, points

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Apply filters
  const filteredData = [...leaderboardData];
  if (filter === 'walletAge') {
    filteredData.sort((a, b) => b.walletAge - a.walletAge);
  } else if (filter === 'points') {
    filteredData.sort((a, b) => b.points - a.points);
  }

  // Find user's rank
  const userRank = leaderboardData.findIndex(member => 
    member.username === user?.username
  ) + 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Mumbai DAO Leaderboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Members ranked by wallet age and contribution points
          </p>
        </div>
        
        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-700">Filter by:</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Default
              </button>
              <button 
                onClick={() => setFilter('walletAge')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'walletAge' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Wallet Age
              </button>
              <button 
                onClick={() => setFilter('points')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'points' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Points
              </button>
            </div>

            {userRank > 0 && (
              <div className="ml-auto text-sm">
                <span className="text-gray-600">Your rank:</span> 
                <span className="ml-1 px-2 py-1 bg-indigo-600 text-white rounded font-medium">
                  #{userRank}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Age
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((member, index) => (
                <tr 
                  key={index} 
                  className={member.username === user?.username ? "bg-indigo-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`
                        flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium
                        ${index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-400'}
                      `}>
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.profilePic ? (
                        <img src={member.profilePic} alt="" className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {member.username ? member.username[0].toUpperCase() : '?'}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.username || 'Anonymous User'}
                        </div>
                        {member.username === user?.username && (
                          <div className="text-xs text-indigo-600">You</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.walletAge} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.points}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;