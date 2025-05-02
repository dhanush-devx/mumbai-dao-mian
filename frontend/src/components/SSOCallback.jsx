import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

// This component handles the SSO callback from Clerk
const SSOCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse the URL parameters to get the redirect URL
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect_url') || '/dashboard';
    
    async function processCallback() {
      try {
        // Process the callback from Clerk
        await handleRedirectCallback({
          // Use fallbackRedirectUrl instead of redirectUrl
          fallbackRedirectUrl: redirectUrl
        });
        
        // Note: The handleRedirectCallback now handles the redirection
        // with the fallbackRedirectUrl, so we don't need to manually navigate
      } catch (error) {
        console.error('Error handling SSO callback:', error);
        navigate('/login');
      }
    }
    
    processCallback();
  }, [handleRedirectCallback, navigate, location.search]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default SSOCallback;