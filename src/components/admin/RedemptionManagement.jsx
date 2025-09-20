import React, { useState } from 'react';
import { useAdmin } from '../../hooks';
import { Gift, Download, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const RedemptionManagement = () => {
  const { redemptions, loading, updateRedemptionStatus } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handleRedemptionAction = async (redemptionId, status) => {
    if (status === 'approved') {
      const giftCardCode = prompt('Enter gift card code:');
      if (giftCardCode) {
        await updateRedemptionStatus(redemptionId, status, giftCardCode);
      }
    } else {
      await updateRedemptionStatus(redemptionId, status);
    }
  };

  const exportRedemptions = () => {
    const headers = ['ID', 'User ID', 'User Email', 'Vendor', 'Value', 'Points', 'Status', 'Gift Card Code', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...redemptions.map(redemption => [
        redemption.id,
        redemption.userId,
        `"${redemption.user?.email || ''}"`,
        redemption.vendor,
        redemption.value,
        redemption.points,
        redemption.status,
        redemption.giftCardCode || '',
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
                        {redemption.user?.displayName?.[0] || redemption.user?.email?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{redemption.user?.displayName || 'Unknown User'}</div>
                      <div className="text-sm text-muted">{redemption.user?.email}</div>
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
                </td>
                <td>
                  {redemption.createdAt ? new Date(redemption.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  {redemption.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleRedemptionAction(redemption.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRedemptionAction(redemption.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {redemption.status === 'approved' && redemption.giftCardCode && (
                    <code className="bg-success/20 text-success px-2 py-1 rounded text-sm">
                      {redemption.giftCardCode}
                    </code>
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
    </div>
  );
};

export default RedemptionManagement;