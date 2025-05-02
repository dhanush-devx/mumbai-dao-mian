import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Footer from './components/Footer'
import SSOCallback from './components/SSOCallback'; // Import the new component

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_aHVtYW5lLXBpZ2Vvbi01OC5jbGVyay5hY2NvdW50cy5kZXYk';

// Check if the key exists before rendering the app
if (!clerkPubKey) {
  console.error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
}

function App() {
  return (
    <Router>
      <ClerkProvider publishableKey={clerkPubKey}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/*" element={<Login />} /> {/* Catch all login routes */}
                <Route path="/login/sso-callback" element={<SSOCallback />} /> {/* SSO callback route */}
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
                <Route
                  path="/leaderboard"
                  element={<Leaderboard />}
                />
                <Route
                  path="/profile"
                  element={<Profile />}
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </ClerkProvider>
    </Router>
  );
}

export default App;
