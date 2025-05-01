import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Footer from './components/Footer'

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
  return (
    <Router>
      <ClerkProvider publishableKey={clerkPubKey}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
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
      </ClerkProvider>
    </Router>
  );
}

export default App;
