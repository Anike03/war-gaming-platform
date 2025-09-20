// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, Shield, Target } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Battlefield Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95"></div>
      
      {/* Camouflage Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iIzQ0NCIvPgogIDxwYXRoIGQ9Ik0wIDBMNjAgNjBNNjAgMEwwIDYwIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')]"></div>
      
      {/* Radar Sweep Animation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute inset-8 border-4 border-green-500 rounded-full opacity-15 animate-ping"></div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 max-w-md w-full space-y-8 p-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-red-500" fill="currentColor" />
              <Target className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            COMMAND LOGIN
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-wider">ACCESS BATTLE TERMINAL</p>
        </div>

        {/* Card - Military Terminal Style */}
        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg p-8 shadow-2xl shadow-black/50">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                <Mail className="inline w-4 h-4 mr-2" />
                OPERATIVE ID
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 military-input"
                  placeholder="operative@command.com"
                />
                <div className="absolute inset-0 border border-gray-500 rounded-lg pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200"></div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                <Lock className="inline w-4 h-4 mr-2" />
                ACCESS CODE
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 military-input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className="absolute inset-0 border border-gray-500 rounded-lg pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember this terminal
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Code compromised?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold uppercase tracking-wider transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 military-btn relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>INITIATING...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn size={20} className="mr-2" />
                  <span>ACCESS TERMINAL</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-800 text-gray-400 text-sm uppercase tracking-wider">Tactical Access</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 military-btn relative group"
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>GOOGLE COMMAND ACCESS</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:animate-shine"></div>
          </button>

          {/* Sign up link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              New recruit?{' '}
              <Link
                to="/register"
                className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
              >
                Request clearance
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Login Hint */}
        <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            <span className="text-yellow-400 font-semibold">HIGH COMMAND ACCESS:</span>{' '}
            <code className="bg-gray-900 text-yellow-400 px-2 py-1 rounded border border-yellow-400/30">aniketsharma9360@gmail.com</code>{' '}
            /{' '}
            <code className="bg-gray-900 text-yellow-400 px-2 py-1 rounded border border-yellow-400/30">admin@aniket#00</code>
          </p>
        </div>
      </div>

      {/* Animated Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanlines"></div>
      </div>
    </div>
  );
};

export default Login;