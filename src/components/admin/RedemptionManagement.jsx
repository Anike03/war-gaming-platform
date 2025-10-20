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
    reason: '',
    actionType: 'approve' // 'approve' or 'reject'
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

  const handleRedemptionAction = (redemption, actionType) => {
    console.log('Opening modal for:', redemption.id, 'action:', actionType);
    setSelectedRedemption(redemption);
    setActionData({
      giftCardCode: actionType === 'approve' ? (redemption.giftCardCode || '') : '',
      returnPoints: true,
      reason: redemption.statusReason || '',
      actionType: actionType
    });
  };

  const confirmAction = async () => {
    if (!selectedRedemption) return;

    try {
      const status = actionData.actionType === 'approve' ? 'approved' : 'rejected';
      
      await updateRedemptionStatus(
        selectedRedemption.id, 
        status, 
        actionData.actionType === 'approve' ? actionData.giftCardCode : null, 
        actionData.returnPoints, 
        actionData.reason
      );
      
      // Close modal
      setSelectedRedemption(null);
      setActionData({
        giftCardCode: '',
        returnPoints: true,
        reason: '',
        actionType: 'approve'
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
                  {redemption.status === 'rejected' && redemption.pointsReturned && (
                    <div className="flex items-center gap-1 text-success text-xs mt-1">
                      <RotateCcw size={10} />
                      Points Returned
                    </div>
                  )}
                  {redemption.status === 'rejected' && !redemption.pointsReturned && (
                    <div className="text-xs text-muted mt-1">
                      Points Not Returned
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRedemptionAction(redemption, 'approve');
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRedemptionAction(redemption, 'reject');
                        }}
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
                  {(redemption.status === 'approved' || redemption.status === 'rejected') && (
                    <button
                      className="btn btn-sm btn-secondary mt-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRedemptionAction(redemption, redemption.status === 'approved' ? 'approve' : 'reject');
                      }}
                    >
                      Update
                    </button>
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

      {/* Enhanced Action Modal */}
      {selectedRedemption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {actionData.actionType === 'approve' ? 'Approve Redemption' : 'Reject Redemption'}
            </h3>
            
            <div className="space-y-4">
              {/* Redemption Details */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Redemption Details</h4>
                <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <div><strong>User:</strong> {selectedRedemption.userName || selectedRedemption.user?.displayName}</div>
                  <div><strong>Email:</strong> {selectedRedemption.userEmail}</div>
                  <div><strong>Reward:</strong> {selectedRedemption.vendor} ${selectedRedemption.value} Gift Card</div>
                  <div><strong>Points:</strong> {selectedRedemption.points}</div>
                  <div><strong>Status:</strong> <span className="capitalize">{selectedRedemption.status}</span></div>
                </div>
              </div>

              {/* Action Type Selection - Only show for pending redemptions */}
              {selectedRedemption.status === 'pending' && (
                <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <button
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      actionData.actionType === 'approve' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActionData(prev => ({ 
                      ...prev, 
                      actionType: 'approve',
                      giftCardCode: selectedRedemption.giftCardCode || '',
                      returnPoints: true
                    }))}
                  >
                    Approve
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      actionData.actionType === 'reject' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActionData(prev => ({ 
                      ...prev, 
                      actionType: 'reject',
                      giftCardCode: '',
                      returnPoints: true
                    }))}
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Gift Card Code Input - Only for approval */}
              {actionData.actionType === 'approve' && (
                <div>
                  <label className="form-label flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Gift Card Code *</span>
                    {selectedRedemption.giftCardCode && (
                      <span className="text-xs text-green-600 font-medium">
                        Current: {selectedRedemption.giftCardCode}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={actionData.giftCardCode}
                    onChange={(e) => setActionData(prev => ({ ...prev, giftCardCode: e.target.value }))}
                    placeholder="Enter gift card code (e.g., STARBUCKS-XXXX-XXXX)"
                    required
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This code will be sent to the user and visible in their redemption history.
                  </div>
                </div>
              )}

              {/* Return Points Option - Only for rejection */}
              {actionData.actionType === 'reject' && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <input
                    type="checkbox"
                    id="returnPoints"
                    checked={actionData.returnPoints}
                    onChange={(e) => setActionData(prev => ({ ...prev, returnPoints: e.target.checked }))}
                    className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <label htmlFor="returnPoints" className="font-medium text-sm block mb-1 text-gray-700 dark:text-gray-300">
                      Return {selectedRedemption.points} points to user
                    </label>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      If checked, the points will be returned to the user's account. 
                      If unchecked, the points will be permanently deducted.
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Notes/Reason */}
              <div>
                <label className="form-label text-gray-700 dark:text-gray-300">
                  {actionData.actionType === 'approve' ? 'Approval Notes' : 'Rejection Reason'} *
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                    (Visible to user)
                  </span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={actionData.reason}
                  onChange={(e) => setActionData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder={
                    actionData.actionType === 'approve' 
                      ? 'Add notes for the user about this approval...' 
                      : 'Explain why this redemption was rejected...'
                  }
                  rows={3}
                  required
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This note will be visible to the user in their redemption history.
                </div>
              </div>

              {/* Action Summary */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Action Summary</h4>
                <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <div>
                    <strong>Action:</strong> <span className="capitalize">{actionData.actionType}</span>
                  </div>
                  {actionData.actionType === 'approve' && (
                    <div>
                      <strong>Gift Card:</strong> {actionData.giftCardCode || 'Not provided'}
                    </div>
                  )}
                  {actionData.actionType === 'reject' && (
                    <div>
                      <strong>Points Return:</strong> {actionData.returnPoints ? 'Yes' : 'No'}
                    </div>
                  )}
                  <div>
                    <strong>User Notification:</strong> Yes
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={confirmAction}
                  disabled={
                    !actionData.reason.trim() || 
                    (actionData.actionType === 'approve' && !actionData.giftCardCode.trim())
                  }
                >
                  Confirm {actionData.actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
                <button
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  onClick={() => {
                    setSelectedRedemption(null);
                    setActionData({
                      giftCardCode: '',
                      returnPoints: true,
                      reason: '',
                      actionType: 'approve'
                    });
                  }}
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