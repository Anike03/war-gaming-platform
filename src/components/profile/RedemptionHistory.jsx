import React, { useState } from 'react';
import { useRedemption } from '../../hooks';
import { Gift, Filter, Search, Star, Clock, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';

const RedemptionHistory = () => {
  const { redemptionHistory, loading } = useRedemption();
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');

  const statusOptions = ['all', 'pending', 'approved', 'rejected'];
  const vendorOptions = ['all', 'Starbucks', 'Tim Hortons'];

  const filteredRedemptions = redemptionHistory.filter(redemption => {
    const matchesStatus = statusFilter === 'all' || redemption.status === statusFilter;
    const matchesVendor = vendorFilter === 'all' || redemption.vendor === vendorFilter;
    return matchesStatus && matchesVendor;
  });

  const stats = {
    total: filteredRedemptions.length,
    pending: filteredRedemptions.filter(r => r.status === 'pending').length,
    approved: filteredRedemptions.filter(r => r.status === 'approved').length,
    rejected: filteredRedemptions.filter(r => r.status === 'rejected').length,
    totalPoints: filteredRedemptions.reduce((sum, r) => sum + r.points, 0),
    totalValue: filteredRedemptions.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.value, 0)
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
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Gift size={24} />
          Redemption History
        </h2>
        <div className="text-lg font-semibold text-success flex items-center gap-2">
          <DollarSign size={20} />
          ${stats.totalValue} Redeemed
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-1 md:grid-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search redemptions..."
              className="form-input pl-10"
              disabled
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select"
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="form-select"
        >
          {vendorOptions.map(vendor => (
            <option key={vendor} value={vendor}>
              {vendor === 'all' ? 'All Vendors' : vendor}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-2 md:grid-4 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-muted">Total Requests</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          <div className="text-muted">Pending</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.approved}</div>
          <div className="text-muted">Approved</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-danger">{stats.rejected}</div>
          <div className="text-muted">Rejected</div>
        </div>
      </div>

      {/* Redemption List */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Value</th>
              <th>Points</th>
              <th>Status</th>
              <th>Date</th>
              <th>Gift Card Code</th>
            </tr>
          </thead>
          <tbody>
            {filteredRedemptions.map((redemption) => (
              <tr key={redemption.id}>
                <td>
                  <div className="font-medium">{redemption.vendor}</div>
                </td>
                <td>
                  <div className="font-bold text-success">${redemption.value}</div>
                </td>
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
                  {redemption.createdAt ? new Date(redemption.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  {redemption.giftCardCode ? (
                    <code className="bg-success/20 text-success px-2 py-1 rounded text-sm">
                      {redemption.giftCardCode}
                    </code>
                  ) : (
                    <span className="text-muted">—</span>
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
          <p className="text-muted">No redemption history found</p>
          {redemptionHistory.length === 0 && (
            <p className="text-sm text-muted mt-2">
              Redeem your points for gift cards to see them here!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RedemptionHistory;