import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Coins, LogOut, User, Crown, Menu, X, GamepadIcon } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games', requiresAuth: true },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/redeem', label: 'Redeem', requiresAuth: true },
    { path: '/profile', label: 'Profile', requiresAuth: true },
    ...(userData?.isAdmin ? [{ path: '/admin', label: 'Admin' }] : [])
  ];

  return (
    <header className="bg-card border-b border-border-color sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="logo flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <GamepadIcon className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold">WAR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks
              .filter(link => !link.requiresAuth || userData)
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'text-primary' : 'text-muted hover:text-primary'}`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {userData ? (
              <>
                <div className="wallet-badge flex items-center gap-2">
                  <Coins size={20} />
                  <span className="font-semibold">{userData.points || 0}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-card border border-border-color rounded-lg">
            <div className="space-y-3">
              {navLinks
                .filter(link => !link.requiresAuth || userData)
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-3 rounded-lg ${
                      isActive(link.path)
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-primary/10 hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              
              {userData && (
                <>
                  <div className="flex items-center justify-between py-2 px-3 bg-warning/10 text-warning rounded-lg">
                    <span className="flex items-center gap-2">
                      <Coins size={16} />
                      Points
                    </span>
                    <span className="font-bold">{userData.points || 0}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-2 px-3 text-danger hover:bg-danger/10 rounded-lg"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;