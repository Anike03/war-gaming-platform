import React, { useState } from 'react';
import { useAdmin, useAuth } from '../hooks';
import { Crown, Users, Gift, BarChart3, Shield, Ban, Trash2, Plus, Minus, Check, X } from 'lucide-react';

const Admin = () => {
  const { userData } = useAuth();
  const { 
    users, 
    redemptions, 
    stats, 
    loading, 
    getAllUsers, 
    getRedemptions, 
    getStats, 
    updateUser, 
    adjustUserPoints, 
    banUser, 
    unbanUser, 
    deleteUser, 
    updateRedemptionStatus 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAdjustment, setPointsAdjustment] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'redemptions', label: 'Redemptions', icon: Gift },
    { id: 'moderation', label: 'Moderation', icon: Shield }
  ];

  const handlePointsAdjustment = async (userId, points) => {
    if (!adjustmentReason.trim()) {
      alert('Please provide a reason for the points adjustment');
      return;
    }

    try {
      await adjustUserPoints(userId, points, adjustmentReason);
      setPointsAdjustment(0);
      setAdjustmentReason('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adjusting points:', error);
    }
  };

  const handleRedemptionAction = async (redemptionId, status, giftCardCode = null) => {
    try {
      await updateRedemptionStatus(redemptionId, status, giftCardCode);
    } catch (error) {
      console.error('Error updating redemption:', error);
    }
  };

  const refreshData = () => {
    getAllUsers();
    getRedemptions();
    getStats();
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3">
          <Crown className="text-warning" size={32} />
          Admin Dashboard
        </h1>
        <button onClick={refreshData} className="btn btn-secondary" disabled={loading}>
          Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-4 gap-6 mb-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
              <div className="text-muted">Total Users</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-warning">{stats.totalPoints}</div>
              <div className="text-muted">Total Points</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-success">{stats.totalRedemptions}</div>
              <div className="text-muted">Total Redemptions</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-accent">{stats.pendingRedemptions}</div>
              <div className="text-muted">Pending Redemptions</div>
            </div>
          </div>

          <div className="grid grid-2 gap-6">
            <div className="card">
              <h3 className="mb-4">Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-card rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Users size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{user.displayName || user.email}</div>
                        <div className="text-sm text-muted">{user.points} points</div>
                      </div>
                    </div>
                    <span className={`badge ${user.status === 'banned' ? 'badge-danger' : 'badge-success'}`}>
                      {user.status || 'active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="mb-4">Pending Redemptions</h3>
              <div className="space-y-3">
                {redemptions
                  .filter(r => r.status === 'pending')
                  .slice(0, 5)
                  .map((redemption) => (
                    <div key={redemption.id} className="p-3 bg-card rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{redemption.user?.displayName}</span>
                        <span className="text-warning flex items-center gap-1">
                          <Gift size={14} />
                          {redemption.points} points
                        </span>
                      </div>
                      <div className="text-sm text-muted">
                        {redemption.vendor} ${redemption.value} gift card
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 className="mb-4">User Management</h3>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Users size={14} className="text-white" />
                        </div>
                        {user.displayName || 'Anonymous'}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="font-bold">{user.points || 0}</span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'banned' ? 'badge-danger' : 'badge-success'}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedUser(user)}
                        >
                          Adjust Points
                        </button>
                        {user.status === 'banned' ? (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => unbanUser(user.id)}
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => banUser(user.id, 'Violation of terms')}
                          >
                            <Ban size={14} />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              deleteUser(user.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Points Adjustment Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="mb-4">Adjust Points for {selectedUser.displayName || selectedUser.email}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Current Points: {selectedUser.points || 0}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={pointsAdjustment}
                      onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                      placeholder="Enter points to add/subtract"
                    />
                  </div>

                  <div>
                    <label className="form-label">Reason</label>
                    <input
                      type="text"
                      className="form-input"
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      placeholder="Reason for adjustment"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={() => handlePointsAdjustment(selectedUser.id, pointsAdjustment)}
                    >
                      Apply Adjustment
                    </button>
                    <button
                      className="btn btn-secondary flex-1"
                      onClick={() => setSelectedUser(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Redemptions Tab */}
      {activeTab === 'redemptions' && (
        <div className="card">
          <h3 className="mb-4">Redemption Management</h3>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Vendor</th>
                  <th>Value</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((redemption) => (
                  <tr key={redemption.id}>
                    <td>{redemption.user?.displayName || redemption.user?.email}</td>
                    <td>
                      <span className="badge badge-secondary">{redemption.vendor}</span>
                    </td>
                    <td>${redemption.value}</td>
                    <td>{redemption.points}</td>
                    <td>
                      <span className={`badge ${
                        redemption.status === 'approved' ? 'badge-success' :
                        redemption.status === 'pending' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {redemption.status}
                      </span>
                    </td>
                    <td>
                      {redemption.createdAt ? new Date(redemption.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {redemption.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              const code = prompt('Enter gift card code:');
                              if (code) {
                                handleRedemptionAction(redemption.id, 'approved', code);
                              }
                            }}
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRedemptionAction(redemption.id, 'rejected')}
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="card">
          <h3 className="mb-4">Content Moderation</h3>
          <p className="text-muted mb-6">Moderation tools and reports will appear here.</p>
          
          <div className="grid grid-2 gap-6">
            <div className="text-center p-6 bg-card rounded-lg">
              <Shield size={48} className="text-primary mx-auto mb-4" />
              <h4>User Reports</h4>
              <p className="text-muted">Manage user reports and violations</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg">
              <Ban size={48} className="text-danger mx-auto mb-4" />
              <h4>Banned Users</h4>
              <p className="text-muted">View and manage banned users</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;