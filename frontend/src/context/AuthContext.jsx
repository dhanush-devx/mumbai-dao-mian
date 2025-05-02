import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext();

// API base URL - change this based on environment
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get Clerk user status
  const { isSignedIn, isLoaded: clerkLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Function to fetch user data from backend
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/main`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Store user in localStorage for persistence between refreshes
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        console.log('Invalid token, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Failed to authenticate');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  }, []);

  // Check auth status on initial load and when Clerk auth status changes
  useEffect(() => {
    const checkAuth = async () => {
      // First try to load user from localStorage while API request is in progress
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          console.error('Failed to parse cached user', e);
        }
      }

      // Check if we have a JWT token
      const hasToken = await fetchUserData();
      
      // If no token but signed in with Clerk, try to authenticate with Clerk
      if (!hasToken && isSignedIn && clerkUser) {
        try {
          console.log('Signed in with Clerk, getting user data...');
          const clerkUserResponse = await fetch(`${API_URL}/auth/clerk-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              username: clerkUser.username || clerkUser.firstName || `user_${clerkUser.id.substring(0, 8)}`
            })
          });

          if (clerkUserResponse.ok) {
            const data = await clerkUserResponse.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
          } else {
            console.error('Failed to create/retrieve user from Clerk login');
          }
        } catch (err) {
          console.error('Error during Clerk auth integration:', err);
        }
      }
      
      setLoading(false);
    };
    
    // Only check auth once Clerk has loaded
    if (clerkLoaded) {
      checkAuth();
    }
  }, [clerkLoaded, isSignedIn, clerkUser, fetchUserData]);

  // Function to refresh user data without waiting for page reload
  const refreshUserData = async () => {
    setLoading(true);
    await fetchUserData();
    setLoading(false);
  };

  // Login with MetaMask wallet
  const login = async (username) => {
    setError(null);
    
    if (!window.ethereum) {
      setError('Please install MetaMask to continue');
      return false;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      console.log('Connected address:', address);
      
      // Get nonce
      const nonceRes = await fetch(`${API_URL}/auth/nonce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, username })
      });
      
      if (!nonceRes.ok) {
        const errorData = await nonceRes.json();
        setError(errorData.error || 'Failed to get login nonce');
        return false;
      }
      
      const nonceData = await nonceRes.json();
      console.log('Received nonce:', nonceData.nonce);
      
      // Sign message using personal_sign method
      const message = `Login nonce: ${nonceData.nonce}`;
      
      try {
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });
        
        console.log('Message signed, verifying...');
        
        // Verify signature
        const verifyRes = await fetch(`${API_URL}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, signature })
        });
        
        if (!verifyRes.ok) {
          const errText = await verifyRes.text();
          try {
            const errData = JSON.parse(errText);
            setError(errData.error || 'Authentication failed');
          } catch (e) {
            setError(`Authentication failed: ${verifyRes.status} ${verifyRes.statusText}`);
          }
          console.error('Verification failed:', verifyRes.status, errText);
          return false;
        }
        
        const verifyData = await verifyRes.json();
        console.log('Login successful!');
        localStorage.setItem('token', verifyData.token);
        localStorage.setItem('user', JSON.stringify(verifyData.user));
        setUser(verifyData.user);
        return true;
      } catch (signError) {
        console.error('Error during message signing:', signError);
        setError('Failed to sign message with MetaMask');
        return false;
      }
    } catch (err) {
      if (err.code === 4001) {
        // User rejected request
        setError('You must connect your wallet to continue');
      } else {
        console.error('Login error:', err);
        setError('Authentication error: ' + (err.message || 'Unknown error'));
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user data in context without full refresh
  const updateUserData = (newData) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      error, 
      refreshUserData,
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;