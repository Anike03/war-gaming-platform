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
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/games" element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/redeem" element={
                <ProtectedRoute>
                  <Redeem />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AllProviders>
  );
}

export default App;