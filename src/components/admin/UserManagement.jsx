import React, { useState } from 'react';
import { useAdmin } from '../../hooks';
import { Users, Search, Download, Ban, CheckCircle, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const { users, loading, updateUser, adjustUserPoints, banUser, unbanUser, deleteUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAdjustment, setPointsAdjustment] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
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
    }
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
    link.download = 'war_users_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          User Management
        </h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4 w-full"
            />
          </div>
          <button
            onClick={exportUsers}
            className="btn btn-primary flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user.displayName || 'Anonymous'}</div>
                      <div className="text-sm text-muted">ID: {user.id.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <div className="flex items-center gap-1 text-warning">
                    <span className="font-bold">{user.points || 0}</span>
                  </div>
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
                        <CheckCircle size={14} />
                        Unban
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => banUser(user.id, 'Violation of terms')}
                      >
                        <Ban size={14} />
                        Ban
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="text-muted mx-auto mb-4" size={48} />
          <p className="text-muted">No users found</p>
        </div>
      )}

      {/* Points Adjustment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Adjust Points for {selectedUser.displayName || selectedUser.email}
            </h3>
            
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
  );
};

export default UserManagement;