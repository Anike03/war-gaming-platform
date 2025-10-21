// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AllProviders } from './context';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Redeem from './pages/Redeem';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import GameLoader from './components/games/GameLoader';

import Help from './pages/Help';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';


import './App.css';
import './styles/animations.css';
import './styles/threejs.css';
import './styles/games.css';

function App() {
  return (
    <AllProviders>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/help" element={<Help />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected */}
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <Games />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/redeem"
                element={
                  <ProtectedRoute>
                    <Redeem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin only */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <Admin />
                  </AdminProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="container" style={{ padding: "32px 16px" }}>
                    <div className="card">
                      <h2 className="mb-3">Page not found</h2>
                      <p className="text-muted mb-4">
                        The page you’re looking for doesn’t exist.
                      </p>
                      <a className="btn btn-primary" href="/">Go home</a>
                    </div>
                  </div>
                }
              />
              <Route
  path="/play/:gameId"
  element={
    <ProtectedRoute>
      <GameLoader />
    </ProtectedRoute>
  }
/>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AllProviders>
  );
}

export default App;
