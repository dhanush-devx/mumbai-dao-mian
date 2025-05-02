import { SignIn, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      // Check if there's a redirect in the URL
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/dashboard';
      navigate(redirect);
    }
  }, [isSignedIn, navigate, location]);

  // Check if this is a subpath of /login (for Clerk's internal routing)
  const isClerkSubroute = location.pathname.startsWith('/login/');

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {!isClerkSubroute && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Mumbai DAO</h1>
            <p className="mt-2 text-sm text-gray-600">
              Connect your wallet or social accounts to enter the community
            </p>
          </div>
        )}
        
        <div className="mt-8">
          <SignIn 
            routing="path"
            path="/login"
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/login"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
                footerActionLink: 'text-indigo-600 hover:text-indigo-500',
                card: 'rounded-lg shadow-md',
                socialButtonsBlockButton: 'rounded-md',
                socialButtonsProviderIcon: 'w-6 h-6'
              }
            }}
          />
        </div>
        
        {!isClerkSubroute && (
          <div className="text-center mt-4">
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">
              Learn how to set up MetaMask &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;