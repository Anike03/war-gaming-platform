import React, { useState } from 'react';
import { useAuth, useGame } from '../../hooks';
import { User, Mail, Calendar, Star, Award, Clock, Edit3, Save, X, Trophy, Gift, History } from 'lucide-react';
import EditProfile from './EditProfile';
import GameHistory from './GameHistory';
import RedemptionHistory from './RedemptionHistory';

const UserProfile = () => {
  const { userData } = useAuth();
  const { gameHistory } = useGame();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'games', label: 'Game History', icon: History },
    { id: 'redemptions', label: 'Redemptions', icon: Gift },
    { id: 'edit', label: 'Edit Profile', icon: Edit3 }
  ];

  const stats = {
    totalGames: gameHistory.length,
    gamesWon: gameHistory.filter(game => game.completed).length,
    totalPoints: gameHistory.reduce((sum, game) => sum + (game.pointsEarned || 0), 0),
    averageScore: gameHistory.length > 0 
      ? Math.round(gameHistory.reduce((sum, game) => sum + (game.score || 0), 0) / gameHistory.length)
      : 0,
    winRate: gameHistory.length > 0 
      ? Math.round((gameHistory.filter(game => game.completed).length / gameHistory.length) * 100)
      : 0
  };

  const recentGames = gameHistory.slice(0, 5);
  const topGames = [...gameHistory]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <User size={32} />
          Your Profile
        </h1>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{userData?.points || 0} Points</span>
        </div>
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
          {/* Profile Summary */}
          <div className="grid grid-1 md:grid-3 gap-6">
            <div className="card md:col-span-2">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <User size={48} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{userData?.displayName || 'Anonymous Player'}</h2>
                  <p className="text-muted flex items-center gap-2 mb-2">
                    <Mail size={16} />
                    {userData?.email}
                  </p>
                  {userData?.dob && (
                    <p className="text-muted flex items-center gap-2">
                      <Calendar size={16} />
                      Born {userData.dob}
                    </p>
                  )}
                </div>
              </div>

              {userData?.bio && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  <p className="text-muted">{userData.bio}</p>
                </div>
              )}

              {userData?.hobby && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Hobby</h3>
                  <p className="text-muted">{userData.hobby}</p>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="text-muted">Level</span>
                  <span className="text-2xl font-bold text-primary">
                    {Math.floor((userData?.points || 0) / 100) + 1}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <span className="text-muted">Games Played</span>
                  <span className="text-2xl font-bold text-success">{stats.totalGames}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                  <span className="text-muted">Win Rate</span>
                  <span className="text-2xl font-bold text-warning">{stats.winRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                  <span className="text-muted">Total Points</span>
                  <span className="text-2xl font-bold text-accent">{stats.totalPoints}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="text-warning" size={20} />
              Achievements
            </h3>
            <div className="grid grid-1 md:grid-2 lg:grid-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Trophy className="text-success" size={24} />
                </div>
                <div>
                  <div className="font-semibold">First Win</div>
                  <div className="text-sm text-muted">Win your first game</div>
                  <div className="text-xs text-success mt-1">Unlocked</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Star className="text-warning" size={24} />
                </div>
                <div>
                  <div className="font-semibold">Point Collector</div>
                  <div className="text-sm text-muted">Reach 1000 points</div>
                  <div className="text-xs text-success mt-1">Unlocked</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="text-primary" size={24} />
                </div>
                <div>
                  <div className="font-semibold">Variety Player</div>
                  <div className="text-sm text-muted">Play all 7 games</div>
                  <div className="text-xs text-muted mt-1">{Math.min(5, stats.totalGames)}/7 games</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-1 lg:grid-2 gap-6">
            {/* Recent Games */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History size={20} />
                Recent Games
              </h3>
              <div className="space-y-3">
                {recentGames.length === 0 ? (
                  <p className="text-muted text-center py-4">No games played yet</p>
                ) : (
                  recentGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-3 bg-card rounded border">
                      <div>
                        <div className="font-medium capitalize">{game.name}</div>
                        <div className="text-sm text-muted">
                          {game.difficulty} • {game.duration}s
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-warning">{game.score}</div>
                        <div className="text-sm text-success">
                          +{game.pointsEarned || 0} points
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Scores */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy size={20} />
                Top Scores
              </h3>
              <div className="space-y-3">
                {topGames.length === 0 ? (
                  <p className="text-muted text-center py-4">No scores yet</p>
                ) : (
                  topGames.map((game, index) => (
                    <div key={game.id} className="flex items-center justify-between p-3 bg-card rounded border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium capitalize">{game.name}</div>
                          <div className="text-sm text-muted capitalize">{game.difficulty}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-warning">{game.score}</div>
                        <div className="text-sm text-success">
                          +{game.pointsEarned || 0} points
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game History Tab */}
      {activeTab === 'games' && <GameHistory />}

      {/* Redemption History Tab */}
      {activeTab === 'redemptions' && <RedemptionHistory />}

      {/* Edit Profile Tab */}
      {activeTab === 'edit' && <EditProfile />}
    </div>
  );
};

export default UserProfile;