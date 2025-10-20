import React, { useState } from 'react';
import { useAdmin } from '../../hooks';
import { Gift, Download, CheckCircle, XCircle, Clock, AlertCircle, Mail, RotateCcw } from 'lucide-react';

const RedemptionManagement = () => {
  const { redemptions, loading, updateRedemptionStatus } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRedemption, setSelectedRedemption] = useState(null);
  const [actionData, setActionData] = useState({
    giftCardCode: '',
    returnPoints: true,
    reason: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredRedemptions = redemptions.filter(redemption =>
    statusFilter === 'all' || redemption.status === statusFilter
  );

  const pendingRedemptions = redemptions.filter(r => r.status === 'pending');
  const approvedRedemptions = redemptions.filter(r => r.status === 'approved');
  const rejectedRedemptions = redemptions.filter(r => r.status === 'rejected');

  const handleRedemptionAction = async (redemption, status) => {
    if (status === 'approved') {
      setSelectedRedemption(redemption);
      setActionData({
        giftCardCode: '',
        returnPoints: true,
        reason: ''
      });
    } else if (status === 'rejected') {
      setSelectedRedemption(redemption);
      setActionData({
        giftCardCode: '',
        returnPoints: true,
        reason: ''
      });
    } else {
      await updateRedemptionStatus(redemption.id, status);
    }
  };

  const confirmAction = async () => {
    if (!selectedRedemption) return;

    try {
      if (selectedRedemption.status === 'pending') {
        // This is for approve/reject actions
        const status = actionData.giftCardCode ? 'approved' : 'rejected';
        await updateRedemptionStatus(
          selectedRedemption.id, 
          status, 
          actionData.giftCardCode, 
          actionData.returnPoints, 
          actionData.reason
        );
      }
      
      setSelectedRedemption(null);
      setActionData({
        giftCardCode: '',
        returnPoints: true,
        reason: ''
      });
    } catch (error) {
      console.error('Error updating redemption:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const exportRedemptions = () => {
    const headers = ['ID', 'User ID', 'User Name', 'User Email', 'Vendor', 'Value', 'Points', 'Status', 'Gift Card Code', 'Reason', 'Points Returned', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...redemptions.map(redemption => [
        redemption.id,
        redemption.userId,
        `"${redemption.userName || ''}"`,
        `"${redemption.userEmail || ''}"`,
        redemption.vendor,
        redemption.value,
        redemption.points,
        redemption.status,
        redemption.giftCardCode || '',
        `"${redemption.statusReason || ''}"`,
        redemption.pointsReturned ? 'Yes' : 'No',
        redemption.createdAt ? new Date(redemption.createdAt.toDate()).toISOString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'war_redemptions_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-success" size={16} />;
      case 'pending':
        return <Clock className="text-warning" size={16} />;
      case 'rejected':
        return <XCircle className="text-danger" size={16} />;
      default:
        return <AlertCircle className="text-muted" size={16} />;
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
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Gift size={20} />
          Redemption Management
        </h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={exportRedemptions}
            className="btn btn-primary flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-1 md:grid-3 gap-4 mb-6">
        <div className="bg-card rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-warning">{pendingRedemptions.length}</div>
          <div className="text-muted">Pending</div>
        </div>
        <div className="bg-card rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-success">{approvedRedemptions.length}</div>
          <div className="text-muted">Approved</div>
        </div>
        <div className="bg-card rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-danger">{rejectedRedemptions.length}</div>
          <div className="text-muted">Rejected</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {redemption.user?.displayName?.[0] || redemption.userName?.[0] || redemption.userEmail?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{redemption.userName || redemption.user?.displayName || 'Unknown User'}</div>
                      <div className="text-sm text-muted">ID: {redemption.userId?.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Mail size={12} />
                      {redemption.userEmail}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-semibold">{redemption.vendor}</div>
                  <div className="text-sm text-muted">${redemption.value} Gift Card</div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-warning">
                    <span className="font-bold">{redemption.points}</span>
                  </div>
                </td>
                <td>
                  <div className={`flex items-center gap-2 ${getStatusColor(redemption.status)}`}>
                    {getStatusIcon(redemption.status)}
                    <span className="capitalize">{redemption.status}</span>
                  </div>
                  {redemption.statusReason && (
                    <div className="text-xs text-muted mt-1 max-w-xs">
                      {redemption.statusReason}
                    </div>
                  )}
                </td>
                <td>
                  {redemption.createdAt ? new Date(redemption.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  {redemption.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleRedemptionAction(redemption, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRedemptionAction(redemption, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {redemption.status === 'approved' && redemption.giftCardCode && (
                    <div className="space-y-1">
                      <code className="bg-success/20 text-success px-2 py-1 rounded text-sm block">
                        {redemption.giftCardCode}
                      </code>
                      <div className="text-xs text-muted">Gift Card Code</div>
                    </div>
                  )}
                  {redemption.status === 'rejected' && redemption.pointsReturned && (
                    <div className="flex items-center gap-1 text-success text-sm">
                      <RotateCcw size={12} />
                      Points Returned
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRedemptions.length === 0 && (
        <div className="text-center py-12">
          <Gift className="text-muted mx-auto mb-4" size={48} />
          <p className="text-muted">No redemptions found</p>
        </div>
      )}

      {/* Action Modal */}
      {selectedRedemption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {actionData.giftCardCode ? 'Approve' : 'Reject'} Redemption
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Redemption Details</h4>
                <div className="text-sm space-y-1">
                  <div><strong>User:</strong> {selectedRedemption.userName}</div>
                  <div><strong>Email:</strong> {selectedRedemption.userEmail}</div>
                  <div><strong>Reward:</strong> {selectedRedemption.vendor} ${selectedRedemption.value}</div>
                  <div><strong>Points:</strong> {selectedRedemption.points}</div>
                </div>
              </div>

              {actionData.giftCardCode ? (
                <div>
                  <label className="form-label">Gift Card Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={actionData.giftCardCode}
                    onChange={(e) => setActionData(prev => ({ ...prev, giftCardCode: e.target.value }))}
                    placeholder="Enter gift card code"
                    required
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                  <input
                    type="checkbox"
                    checked={actionData.returnPoints}
                    onChange={(e) => setActionData(prev => ({ ...prev, returnPoints: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">
                    Return {selectedRedemption.points} points to user
                  </label>
                </div>
              )}

              <div>
                <label className="form-label">
                  {actionData.giftCardCode ? 'Approval Notes' : 'Rejection Reason'} *
                </label>
                <textarea
                  className="form-textarea"
                  value={actionData.reason}
                  onChange={(e) => setActionData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder={actionData.giftCardCode ? 'Add notes for approval...' : 'Explain why this redemption was rejected...'}
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="btn btn-primary flex-1"
                  onClick={confirmAction}
                  disabled={!actionData.reason.trim() || (actionData.giftCardCode && !actionData.giftCardCode.trim())}
                >
                  Confirm {actionData.giftCardCode ? 'Approve' : 'Reject'}
                </button>
                <button
                  className="btn btn-secondary flex-1"
                  onClick={() => setSelectedRedemption(null)}
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

export default RedemptionManagement;