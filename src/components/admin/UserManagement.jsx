import React, { useState } from 'react';
import { useAdmin } from '../../hooks';
import { Users, Search, Download, Ban, CheckCircle, Trash2, Plus, Minus } from 'lucide-react';

const UserManagement = () => {
  const { users, loading, updateUser, adjustUserPoints, banUser, unbanUser, deleteUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAdjustment, setPointsAdjustment] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' or 'deduct'

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePointsAdjustment = async (userId, points) => {
    if (!adjustmentReason.trim()) {
      alert('Please provide a reason for the points adjustment');
      return;
    }

    // Determine the actual points change based on type
    const actualPoints = adjustmentType === 'deduct' ? -Math.abs(points) : Math.abs(points);

    try {
      await adjustUserPoints(userId, actualPoints, adjustmentReason);
      setPointsAdjustment(0);
      setAdjustmentReason('');
      setSelectedUser(null);
      setAdjustmentType('add'); // Reset to default
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

  const quickAdjustPoints = async (userId, points, reason) => {
    if (window.confirm(`Are you sure you want to ${points >= 0 ? 'add' : 'deduct'} ${Math.abs(points)} points?`)) {
      try {
        await adjustUserPoints(userId, points, reason);
      } catch (error) {
        console.error('Error adjusting points:', error);
      }
    }
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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-warning">{user.points || 0}</span>
                    <div className="flex gap-1">
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => quickAdjustPoints(user.id, 10, 'Quick points addition')}
                        title="Add 10 points"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        className="btn btn-xs btn-danger"
                        onClick={() => quickAdjustPoints(user.id, -10, 'Quick points deduction')}
                        title="Deduct 10 points"
                      >
                        <Minus size={12} />
                      </button>
                    </div>
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
                      onClick={() => {
                        setSelectedUser(user);
                        setPointsAdjustment(0);
                        setAdjustmentType('add');
                      }}
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
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Current Points: <span className="text-warning font-bold">{selectedUser.points || 0}</span></p>
                {pointsAdjustment !== 0 && (
                  <p className="text-sm">
                    New Total: <span className="font-bold">
                      {selectedUser.points + (adjustmentType === 'deduct' ? -Math.abs(pointsAdjustment) : Math.abs(pointsAdjustment))}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="form-label">Adjustment Type</label>
                <div className="flex gap-2 mb-3">
                  <button
                    className={`btn flex-1 ${adjustmentType === 'add' ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => setAdjustmentType('add')}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Points
                  </button>
                  <button
                    className={`btn flex-1 ${adjustmentType === 'deduct' ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => setAdjustmentType('deduct')}
                  >
                    <Minus size={16} className="mr-1" />
                    Deduct Points
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">
                  Points to {adjustmentType === 'add' ? 'Add' : 'Deduct'}
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder={`Enter points to ${adjustmentType}`}
                  min="0"
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
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  className={`btn flex-1 ${
                    adjustmentType === 'add' ? 'btn-success' : 'btn-danger'
                  }`}
                  onClick={() => handlePointsAdjustment(selectedUser.id, pointsAdjustment)}
                  disabled={!pointsAdjustment || pointsAdjustment <= 0 || !adjustmentReason.trim()}
                >
                  {adjustmentType === 'add' ? 'Add' : 'Deduct'} {pointsAdjustment} Points
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