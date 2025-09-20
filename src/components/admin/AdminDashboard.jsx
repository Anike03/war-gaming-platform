import React, { useState, useEffect } from 'react';
import { useAdmin, useAuth } from '../../hooks';
import { 
  Users, 
  Gift, 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Download,
  Crown,
  Star,
  Clock
} from 'lucide-react';
import UserManagement from './UserManagement';
import RedemptionManagement from './RedemptionManagement';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const { stats, loading, getStats, getAllUsers, getRedemptions } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'redemptions', label: 'Redemptions', icon: Gift },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    getStats();
    getAllUsers();
    getRedemptions();
  };

  const exportData = (type) => {
    let data, filename, contentType;
    
    if (type === 'stats') {
      data = JSON.stringify(stats, null, 2);
      filename = 'war_stats_export.json';
      contentType = 'application/json';
      
      const blob = new Blob([data], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!userData?.isAdmin) {
    return (
      <div className="container">
        <div className="card text-center py-12">
          <Shield size={48} className="text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted mb-6">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Crown className="text-warning" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-muted">Manage users, redemptions, and platform analytics</p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Clock size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
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
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-1 md:grid-2 lg:grid-4 gap-6">
            <div className="card text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                <Users className="text-primary" size={24} />
              </div>
              <div className="text-3xl font-bold text-primary">{stats.totalUsers || 0}</div>
              <div className="text-muted">Total Users</div>
            </div>

            <div className="card text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mb-4 mx-auto">
                <Star className="text-warning" size={24} />
              </div>
              <div className="text-3xl font-bold text-warning">{stats.totalPoints || 0}</div>
              <div className="text-muted">Total Points</div>
            </div>

            <div className="card text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4 mx-auto">
                <Gift className="text-success" size={24} />
              </div>
              <div className="text-3xl font-bold text-success">{stats.totalRedemptions || 0}</div>
              <div className="text-muted">Total Redemptions</div>
            </div>

            <div className="card text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4 mx-auto">
                <Clock className="text-accent" size={24} />
              </div>
              <div className="text-3xl font-bold text-accent">{stats.pendingRedemptions || 0}</div>
              <div className="text-muted">Pending Requests</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-2 gap-4">
              <button
                onClick={() => setActiveTab('redemptions')}
                className="btn btn-primary flex items-center gap-2"
              >
                <Gift size={18} />
                Manage Redemptions
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Users size={18} />
                Manage Users
              </button>
              <button
                onClick={() => exportData('stats')}
                className="btn btn-accent flex items-center gap-2"
              >
                <Download size={18} />
                Export Stats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && <UserManagement />}

      {/* Redemptions Tab */}
      {activeTab === 'redemptions' && <RedemptionManagement />}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-1 md:grid-2 gap-6">
            {/* Platform Statistics */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Users</span>
                  <span className="font-bold">{stats.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Points</span>
                  <span className="font-bold text-warning">{stats.totalPoints || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Redemptions</span>
                  <span className="font-bold text-success">{stats.totalRedemptions || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Pending Redemptions</span>
                  <span className="font-bold text-accent">{stats.pendingRedemptions || 0}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Data Export</h3>
              <div className="space-y-3">
                <button
                  onClick={() => exportData('stats')}
                  className="btn btn-primary flex items-center gap-2 w-full"
                >
                  <Download size={18} />
                  Export Platform Statistics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;