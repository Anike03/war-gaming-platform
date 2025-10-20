// src/pages/Redeem.jsx
import React, { useState, useEffect } from 'react';
import { useRedemption, useAuth } from '../hooks';
import { Gift, Coffee, Star, CheckCircle, Clock, AlertCircle, Mail, User, RotateCcw, ChevronRight } from 'lucide-react';
import '../styles/redeem.css';

/** Safe date formatter */
function formatMaybeDate(d) {
  try {
    if (!d) return 'N/A';
    if (typeof d.toDate === 'function') return d.toDate().toLocaleDateString();
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleDateString();
  } catch {
    return 'N/A';
  }
}

const Redeem = () => {
  const { userData } = useAuth();
  const { redemptionHistory = [], GIFT_CARD_OPTIONS = [], requestRedemption, loading } = useRedemption();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [redemptionForm, setRedemptionForm] = useState({
    userName: '',
    userEmail: '',
    confirmRedemption: false
  });
  const [activeTab, setActiveTab] = useState('rewards');
  
  const points = Number(userData?.points || 0);

  // Auto-fill user data if available
  useEffect(() => {
    if (userData) {
      setRedemptionForm(prev => ({
        ...prev,
        userName: userData.displayName || '',
        userEmail: userData.email || ''
      }));
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setRedemptionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canRedeem = () => {
    return selectedOption && 
           points >= selectedOption.points && 
           redemptionForm.userName.trim() && 
           redemptionForm.userEmail.trim() && 
           redemptionForm.confirmRedemption;
  };

  const handleRedeemNow = (option) => {
    setSelectedOption(option);
    setActiveTab('rewards');
    setTimeout(() => {
      document.getElementById('redemption-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleRedeem = async () => {
    if (!canRedeem()) return;

    try {
      await requestRedemption(
        selectedOption.points,
        selectedOption.value,
        selectedOption.vendor,
        redemptionForm.userEmail,
        redemptionForm.userName
      );
      setShowConfirmation(true);
      setSelectedOption(null);
      setRedemptionForm({
        userName: userData?.displayName || '',
        userEmail: userData?.email || '',
        confirmRedemption: false
      });
      setActiveTab('history');
      
      setTimeout(() => setShowConfirmation(false), 5000);
    } catch (error) {
      console.error('Redemption failed:', error);
      alert(`Redemption failed: ${error.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved': return <CheckCircle size={20} />;
      case 'pending': return <Clock size={20} />;
      case 'rejected': return <AlertCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getVendorIcon = (vendor) => {
    const icons = {
      'Starbucks': '☕',
      'Tim Hortons': '🍩'
    };
    return icons[vendor] || '🎁';
  };

  return (
    <div className="redeem-container">
      {/* Header */}
      <div className="redeem-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="redeem-title">Redeem Your Points</h1>
            <p className="redeem-subtitle">Exchange your hard-earned points for amazing gift cards</p>
          </div>
          <div className="wallet-badge">
            <Star size={24} />
            <span>{points.toLocaleString()} Points</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button
          className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          <Gift size={18} />
          Available Rewards
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} />
          Redemption History
          {redemptionHistory.length > 0 && (
            <span className="tab-badge">
              {redemptionHistory.length}
            </span>
          )}
        </button>
      </div>

      {showConfirmation && (
        <div className="success-message">
          <CheckCircle size={24} className="icon" />
          <div className="success-content">
            <h4>Redemption Request Submitted!</h4>
            <p>Your request is being processed. You'll receive an email notification once it's approved.</p>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div>
          <div className="gift-cards-grid">
            {GIFT_CARD_OPTIONS.map((option, idx) => {
              const enough = points >= Number(option.points || 0);
              
              return (
                <div
                  key={`${option.vendor}-${option.value}-${idx}`}
                  className="gift-card"
                >
                  <div className="gift-card-header">
                    <div className="gift-card-icon">
                      {getVendorIcon(option.vendor)}
                    </div>
                    <div className="gift-card-info">
                      <h3>{option.vendor}</h3>
                      <div className="gift-card-value">${Number(option.value || 0)}</div>
                      <div className="gift-card-points">
                        <Star size={16} fill="currentColor" />
                        <span>{Number(option.points || 0).toLocaleString()} Points</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`points-badge ${enough ? '' : 'insufficient'}`}>
                      {enough ? 'You have enough points' : 'Insufficient points'}
                    </div>
                  </div>

                  <button
                    className="redeem-now-btn"
                    onClick={() => handleRedeemNow(option)}
                    disabled={!enough || loading}
                  >
                    {enough ? 'Redeem Now' : 'Need More Points'}
                    {enough && <ChevronRight size={16} />}
                  </button>

                  {!enough && (
                    <div className="insufficient-points">
                      Need {Math.max(0, Number(option.points || 0) - points).toLocaleString()} more points
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Redemption Form */}
          {selectedOption && (
            <div id="redemption-form" className="redemption-form-container">
              <div className="form-section">
                <h3>Complete Your Redemption</h3>
                
                <div className="selected-reward-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="gift-card-icon">
                        {getVendorIcon(selectedOption.vendor)}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{selectedOption.vendor}</div>
                        <div className="text-xl font-bold text-green-600">${selectedOption.value}</div>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-1 text-yellow-600 text-lg font-bold justify-center sm:justify-end">
                        <Star size={20} fill="currentColor" />
                        {selectedOption.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Points Required</div>
                    </div>
                  </div>
                </div>

                <div className="points-balance-grid">
                  <div className="points-balance-card current">
                    <div className="points-balance-label">Current Balance</div>
                    <div className="points-balance-value">
                      <Star size={16} fill="currentColor" />
                      {points.toLocaleString()} Points
                    </div>
                  </div>
                  <div className="points-balance-card future">
                    <div className="points-balance-label">After Redemption</div>
                    <div className="points-balance-value">
                      <Star size={16} fill="currentColor" />
                      {Math.max(0, points - selectedOption.points).toLocaleString()} Points
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={redemptionForm.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    placeholder="Enter your full name as it should appear on the gift card"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={redemptionForm.userEmail}
                    onChange={(e) => handleInputChange('userEmail', e.target.value)}
                    placeholder="Enter your email address for delivery"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    We'll send the gift card code to this email address once approved
                  </div>
                </div>

                <div className="confirmation-checkbox">
                  <input
                    type="checkbox"
                    checked={redemptionForm.confirmRedemption}
                    onChange={(e) => handleInputChange('confirmRedemption', e.target.checked)}
                    className="w-5 h-5 mt-0.5"
                  />
                  <label className="confirmation-text">
                    I confirm that I want to redeem {selectedOption.points.toLocaleString()} points 
                    for a ${selectedOption.value} {selectedOption.vendor} gift card. I understand that 
                    this action is final and cannot be undone. The gift card code will be delivered 
                    to my email within 24 hours of approval.
                  </label>
                </div>

                <button
                  className="confirm-redemption-btn"
                  onClick={handleRedeem}
                  disabled={!canRedeem() || loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Confirm Redemption - ${selectedOption.points.toLocaleString()} Points`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="history-section">
          <h3 className="history-title">Your Redemption History</h3>

          {redemptionHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎁</div>
              <h4>No Redemptions Yet</h4>
              <p>Redeem your points for amazing gift cards and they'll appear here!</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setActiveTab('rewards')}
              >
                Browse Rewards
              </button>
            </div>
          ) : (
            <div className="history-list">
              {redemptionHistory.map((redemption) => (
                <div key={redemption.id} className="history-item">
                  <div className="history-header">
                    <div className="history-vendor-info">
                      {getStatusIcon(redemption.status)}
                      <div>
                        <div className="history-vendor">{redemption.vendor}</div>
                        <div className="history-value">${redemption.value}</div>
                      </div>
                    </div>
                    <div className={`history-status ${getStatusBadge(redemption.status)}`}>
                      {redemption.status?.toUpperCase() || 'PENDING'}
                    </div>
                  </div>

                  <div className="history-details">
                    <div className="history-detail">
                      <div className="detail-label">Points Redeemed</div>
                      <div className="detail-value points-value">
                        <Star size={14} fill="currentColor" />
                        {redemption.points.toLocaleString()}
                      </div>
                    </div>
                    <div className="history-detail">
                      <div className="detail-label">Date Requested</div>
                      <div className="detail-value">{formatMaybeDate(redemption.createdAt)}</div>
                    </div>
                    <div className="history-detail">
                      <div className="detail-label">Gift Card Value</div>
                      <div className="detail-value">${redemption.value}</div>
                    </div>
                    {redemption.processedAt && (
                      <div className="history-detail">
                        <div className="detail-label">Processed On</div>
                        <div className="detail-value">{formatMaybeDate(redemption.processedAt)}</div>
                      </div>
                    )}
                  </div>

                  {/* Admin Notes - Show for all statuses if available */}
                  {redemption.statusReason && (
                    <div className="admin-notes-section">
                      <div className="admin-notes-label">Admin Note</div>
                      <div className="admin-notes-content">{redemption.statusReason}</div>
                    </div>
                  )}

                  {/* Gift Card Code (Approved only) */}
                  {redemption.status === 'approved' && redemption.giftCardCode && (
                    <div className="gift-card-code-section">
                      <div className="gift-card-code-label">Gift Card Code</div>
                      <div className="code-display">{redemption.giftCardCode}</div>
                      <div className="code-instructions">
                        This code has been sent to your email. Use it at {redemption.vendor} checkout.
                      </div>
                    </div>
                  )}

                  {/* Points Returned (Rejected with return) */}
                  {redemption.status === 'rejected' && redemption.pointsReturned && (
                    <div className="points-returned-section">
                      <RotateCcw size={16} />
                      <span>Points have been returned to your account</span>
                    </div>
                  )}

                  {/* No Gift Card Available (Rejected without code) */}
                  {redemption.status === 'rejected' && !redemption.giftCardCode && (
                    <div className="no-gift-card">
                      No gift card code available for this declined redemption.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Redeem;