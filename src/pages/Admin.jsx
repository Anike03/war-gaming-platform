import React, { useState } from 'react';
import { useAdmin, useAuth } from '../hooks';
import { Crown, Users, Gift, BarChart3, Shield, Ban, Trash2, Plus, Minus, Check, X, RefreshCw, Search, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import '../styles/admin.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'redemptions', label: 'Redemptions', icon: Gift },
    { id: 'moderation', label: 'Moderation', icon: Shield }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter redemptions based on status
  const filteredRedemptions = redemptions.filter(redemption =>
    statusFilter === 'all' || redemption.status === statusFilter
  );

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
      alert('Error adjusting points: ' + error.message);
    }
  };

  const handleRedemptionAction = async (redemptionId, status, giftCardCode = null) => {
    try {
      if (status === 'approved' && !giftCardCode) {
        const code = prompt('Enter gift card code:');
        if (!code) return;
        giftCardCode = code;
      }
      
      await updateRedemptionStatus(redemptionId, status, giftCardCode);
    } catch (error) {
      console.error('Error updating redemption:', error);
      alert('Error updating redemption: ' + error.message);
    }
  };

  const refreshData = () => {
    getAllUsers();
    getRedemptions();
    getStats();
  };

  const exportUsers = () => {
    const headers = ['ID', 'Email', 'Display Name', 'Points', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.email}"`,
        user.displayName ? `"${user.displayName}"` : '',
        user.points || 0,
        user.status || 'active',
        user.createdAt ? new Date(user.createdAt.toDate()).toISOString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin_users_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-success" />;
      case 'pending': return <Clock size={16} className="text-warning" />;
      case 'rejected': return <AlertCircle size={16} className="text-danger" />;
      default: return <Clock size={16} className="text-muted" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getUserStatusBadge = (status) => {
    switch (status) {
      case 'banned': return 'user-status-banned';
      case 'active': return 'user-status-active';
      default: return 'user-status-active';
    }
  };

  if (!userData?.isAdmin) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <Shield size={64} className="access-denied-icon" />
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-section">
          <div className="admin-title">
            <Crown size={32} className="admin-crown" />
            <h1>Admin Dashboard</h1>
          </div>
          <p className="admin-subtitle">Manage users, redemptions, and platform analytics</p>
        </div>
        <button 
          onClick={refreshData} 
          className="refresh-btn"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalUsers || 0}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon points">
                <Gift size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalPoints || 0}</div>
                <div className="stat-label">Total Points</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon redemptions">
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalRedemptions || 0}</div>
                <div className="stat-label">Total Redemptions</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.pendingRedemptions || 0}</div>
                <div className="stat-label">Pending Requests</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-header">
                <h3>Recent Users</h3>
                <span className="activity-count">{users.length} total</span>
              </div>
              <div className="activity-list">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="activity-item">
                    <div className="user-avatar">
                      <Users size={16} />
                    </div>
                    <div className="activity-info">
                      <div className="activity-title">{user.displayName || user.email}</div>
                      <div className="activity-meta">{user.points || 0} points</div>
                    </div>
                    <div className={`user-status ${getUserStatusBadge(user.status)}`}>
                      {user.status || 'active'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-header">
                <h3>Pending Redemptions</h3>
                <span className="activity-count">
                  {redemptions.filter(r => r.status === 'pending').length} pending
                </span>
              </div>
              <div className="activity-list">
                {redemptions
                  .filter(r => r.status === 'pending')
                  .slice(0, 5)
                  .map((redemption) => (
                    <div key={redemption.id} className="activity-item">
                      <div className="user-avatar gift">
                        <Gift size={16} />
                      </div>
                      <div className="activity-info">
                        <div className="activity-title">{redemption.user?.displayName || 'Unknown User'}</div>
                        <div className="activity-meta">
                          {redemption.vendor} • ${redemption.value} • {redemption.points} points
                        </div>
                      </div>
                      <div className="status-pending">Pending</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="section-header">
            <h2>User Management</h2>
            <div className="header-actions">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={exportUsers} className="export-btn">
                <Download size={18} />
                Export Users
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="admin-table">
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
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          <Users size={16} />
                        </div>
                        <div className="user-info">
                          <div className="user-name">{user.displayName || 'Anonymous'}</div>
                          <div className="user-id">ID: {user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email">{user.email}</div>
                    </td>
                    <td>
                      <div className="points-cell">
                        <span className="points-value">{user.points || 0}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`user-status-badge ${getUserStatusBadge(user.status)}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="date-cell">
                        {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => setSelectedUser(user)}
                          title="Adjust Points"
                        >
                          <Plus size={14} />
                          Adjust
                        </button>
                        {user.status === 'banned' ? (
                          <button
                            className="btn-success btn-sm"
                            onClick={() => unbanUser(user.id)}
                            title="Unban User"
                          >
                            <Check size={14} />
                            Unban
                          </button>
                        ) : (
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => banUser(user.id, 'Violation of terms')}
                            title="Ban User"
                          >
                            <Ban size={14} />
                            Ban
                          </button>
                        )}
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                              deleteUser(user.id);
                            }
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <h3>No Users Found</h3>
                <p>No users match your search criteria.</p>
              </div>
            )}
          </div>

          {/* Points Adjustment Modal */}
          {selectedUser && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Adjust Points</h3>
                  <button 
                    className="modal-close"
                    onClick={() => setSelectedUser(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-content">
                  <div className="user-info-modal">
                    <div className="user-avatar large">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="user-name">{selectedUser.displayName || 'Anonymous'}</div>
                      <div className="user-email">{selectedUser.email}</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Points</label>
                    <div className="current-points">{selectedUser.points || 0}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Points Adjustment</label>
                    <input
                      type="number"
                      className="form-input"
                      value={pointsAdjustment}
                      onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                      placeholder="Enter points to add/subtract"
                    />
                    <div className="form-hint">
                      Use negative numbers to subtract points
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reason for Adjustment *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      placeholder="Please provide a reason for this adjustment"
                      required
                    />
                  </div>

                  {pointsAdjustment !== 0 && (
                    <div className="points-preview">
                      <div className="preview-label">New Points Balance:</div>
                      <div className="preview-value">
                        {(selectedUser.points || 0) + pointsAdjustment}
                      </div>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handlePointsAdjustment(selectedUser.id, pointsAdjustment)}
                      disabled={!adjustmentReason.trim()}
                    >
                      Apply Adjustment
                    </button>
                    <button
                      className="btn-secondary"
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
        <div className="admin-content">
          <div className="section-header">
            <h2>Redemption Management</h2>
            <div className="header-actions">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Reward</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRedemptions.map((redemption) => (
                  <tr key={redemption.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          <Users size={16} />
                        </div>
                        <div className="user-info">
                          <div className="user-name">{redemption.user?.displayName || 'Unknown User'}</div>
                          <div className="user-email">{redemption.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="reward-info">
                        <div className="reward-vendor">{redemption.vendor}</div>
                        <div className="reward-value">${redemption.value}</div>
                      </div>
                    </td>
                    <td>
                      <div className="points-cell">
                        <span className="points-value">{redemption.points}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`status-badge ${getStatusBadge(redemption.status)}`}>
                        {getStatusIcon(redemption.status)}
                        <span>{redemption.status}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        {redemption.createdAt ? new Date(redemption.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      {redemption.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="btn-success btn-sm"
                            onClick={() => handleRedemptionAction(redemption.id, 'approved')}
                            title="Approve Redemption"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => handleRedemptionAction(redemption.id, 'rejected')}
                            title="Reject Redemption"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      )}
                      {redemption.status === 'approved' && redemption.giftCardCode && (
                        <div className="gift-card-code">
                          <code>{redemption.giftCardCode}</code>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRedemptions.length === 0 && (
              <div className="empty-state">
                <Gift size={48} className="empty-icon" />
                <h3>No Redemptions Found</h3>
                <p>No redemptions match your current filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="admin-content">
          <div className="section-header">
            <h2>Content Moderation</h2>
          </div>

          <div className="moderation-grid">
            <div className="moderation-card">
              <div className="moderation-icon">
                <Shield size={32} />
              </div>
              <h3>User Reports</h3>
              <p>Manage user reports and handle violations of community guidelines.</p>
              <button className="btn-secondary">View Reports</button>
            </div>

            <div className="moderation-card">
              <div className="moderation-icon">
                <Ban size={32} />
              </div>
              <h3>Banned Users</h3>
              <p>Review and manage currently banned users and their status.</p>
              <button className="btn-secondary">Manage Bans</button>
            </div>

            <div className="moderation-card">
              <div className="moderation-icon">
                <AlertCircle size={32} />
              </div>
              <h3>Content Flags</h3>
              <p>Monitor and review content that has been flagged by users.</p>
              <button className="btn-secondary">Review Flags</button>
            </div>

            <div className="moderation-card">
              <div className="moderation-icon">
                <Users size={32} />
              </div>
              <h3>User Analytics</h3>
              <p>View user behavior analytics and moderation statistics.</p>
              <button className="btn-secondary">View Analytics</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;