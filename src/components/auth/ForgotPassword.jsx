import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Shield } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    clearError();

    try {
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
    } finally {
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
        <div className="absolute inset-0 border-4 border-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute inset-8 border-4 border-purple-500 rounded-full opacity-15 animate-ping"></div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 max-w-md w-full space-y-8 p-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-purple-500" fill="currentColor" />
            </div>
          </div>
          
          <Link
            to="/login"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            RETURN TO COMMAND
          </Link>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            CODE RECOVERY
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-wider">REQUEST ACCESS CODE RESET</p>
        </div>

        {/* Card - Military Terminal Style */}
        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg p-8 shadow-2xl shadow-black/50">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-900/50 border border-green-700 text-green-200 p-4 rounded-lg mb-6 flex items-center gap-3">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                <Mail className="inline w-4 h-4 mr-2" />
                COMMAND ID
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
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 military-input"
                  placeholder="operative@command.com"
                />
                <div className="absolute inset-0 border border-gray-500 rounded-lg pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold uppercase tracking-wider transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 military-btn relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>TRANSMITTING...</span>
                </div>
              ) : (
                <span>INITIATE CODE RESET</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine"></div>
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Code recovered?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                Report to command
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            <span className="text-yellow-400 font-semibold">SECURITY NOTICE:</span>{' '}
            Reset instructions will be sent to your command ID. Ensure email authenticity.
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

export default ForgotPassword;