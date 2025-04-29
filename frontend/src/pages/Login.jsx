import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import metamaskLogo from '../assets/metamask.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { login, user, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    const success = await login(username);
    setIsConnecting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Mumbai DAO</h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect your wallet to enter the community
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isConnecting || !username}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <img src={metamaskLogo} alt="MetaMask" className="h-5 w-5" />
              </span>
              {isConnecting ? 'Connecting...' : 'Connect with MetaMask'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to Web3?
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">
              Learn how to set up MetaMask &rarr;
            </a>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;