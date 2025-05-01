import { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

const AuthContext = createContext();

// API base URL - change this based on environment
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/main`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token invalid, clear it
            console.log('Invalid token, clearing...');
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Auth check error:', err);
          setError('Failed to authenticate');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
