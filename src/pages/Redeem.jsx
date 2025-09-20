import React, { useState } from 'react';
import { useRedemption, useAuth } from '../hooks';
import { Gift, Coffee, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Redeem = () => {
  const { userData } = useAuth();
  const { redemptionHistory, GIFT_CARD_OPTIONS, requestRedemption, loading } = useRedemption();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRedeem = async () => {
    if (!selectedOption) return;
    
    try {
      await requestRedemption(
        selectedOption.points,
        selectedOption.value,
        selectedOption.vendor
      );
      setShowConfirmation(true);
      setSelectedOption(null);
    } catch (error) {
      console.error('Redemption failed:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-success" size={20} />;
      case 'pending':
        return <Clock className="text-warning" size={20} />;
      case 'rejected':
        return <AlertCircle className="text-danger" size={20} />;
      default:
        return <Clock className="text-muted" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'rejected':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3">
          <Gift className="text-accent" size={32} />
          Redeem Points
        </h1>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{userData?.points || 0} Points</span>
        </div>
      </div>

      {showConfirmation && (
        <div className="card bg-success/20 border-success mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-success" size={24} />
            <div>
              <h3 className="text-success">Redemption Request Submitted!</h3>
              <p className="text-muted">Your request is being processed. You'll receive your gift card code within 24 hours.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-2 gap-6">
        {/* Gift Card Options */}
        <div className="card">
          <h2 className="mb-4">Available Rewards</h2>
          <p className="text-muted mb-6">Exchange your points for gift cards</p>

          <div className="space-y-4">
            {GIFT_CARD_OPTIONS.map((option, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option
                    ? 'border-primary bg-primary/10'
                    : 'border-border-color hover:border-primary/50'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Coffee className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{option.vendor}</h4>
                      <p className="text-lg font-bold text-accent">${option.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-warning">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold">{option.points.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {userData?.points >= option.points ? (
                      <span className="text-success">You have enough points</span>
                    ) : (
                      <span className="text-danger">
                        Need {option.points - (userData?.points || 0)} more points
                      </span>
                    )}
                  </span>
                  <button
                    className={`btn btn-sm ${
                      userData?.points >= option.points
                        ? 'btn-primary'
                        : 'btn-secondary opacity-50 cursor-not-allowed'
                    }`}
                    disabled={userData?.points < option.points || loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOption(option);
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption Summary */}
        <div className="card">
          <h2 className="mb-4">Redemption Summary</h2>

          {!selectedOption ? (
            <div className="text-center py-12">
              <Gift className="text-muted mx-auto mb-4" size={48} />
              <p className="text-muted">Select a gift card to continue</p>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white mb-6">
                <div className="text-center">
                  <Coffee className="mx-auto mb-3" size={32} />
                  <h3 className="text-2xl font-bold mb-1">{selectedOption.vendor}</h3>
                  <p className="text-3xl font-bold">${selectedOption.value}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Star size={20} fill="currentColor" />
                    <span className="text-xl font-bold">{selectedOption.points.toLocaleString()} Points</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className="font-semibold">{userData?.points || 0} Points</span>
                </div>

                <div className="flex justify-between">
                  <span>Points After Redemption:</span>
                  <span className="font-semibold">
                    {(userData?.points || 0) - selectedOption.points} Points
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-border-color">
                  <span>Total:</span>
                  <span className="text-accent">${selectedOption.value} Gift Card</span>
                </div>

                <button
                  className="btn btn-accent btn-lg btn-full mt-6"
                  onClick={handleRedeem}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Redemption'}
                </button>

                <p className="text-sm text-muted text-center">
                  Gift card codes are typically delivered within 24 hours of approval.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Redemption History */}
      <div className="card mt-6">
        <h2 className="mb-4">Redemption History</h2>

        {redemptionHistory.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="text-muted mx-auto mb-4" size={48} />
            <p className="text-muted">No redemption history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Value</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {redemptionHistory.map((redemption) => (
                  <tr key={redemption.id}>
                    <td>
                      {new Date(redemption.createdAt?.toDate()).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge badge-secondary">{redemption.vendor}</span>
                    </td>
                    <td>${redemption.value}</td>
                    <td>
                      <div className="flex items-center gap-1 text-warning">
                        <Star size={14} fill="currentColor" />
                        {redemption.points}
                      </div>
                    </td>
                    <td>
                      <div className={`flex items-center gap-2 ${getStatusColor(redemption.status)}`}>
                        {getStatusIcon(redemption.status)}
                        <span className="capitalize">{redemption.status}</span>
                      </div>
                    </td>
                    <td>
                      {redemption.giftCardCode ? (
                        <code className="bg-success/20 text-success px-2 py-1 rounded">
                          {redemption.giftCardCode}
                        </code>
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Redeem;