import React, { useState } from 'react';
import { useAuth, useGame } from '../hooks';
import { User, Mail, Calendar, Star, Award, Clock, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const { userData, updateUserData, updateUserProfile } = useAuth();
  const { gameHistory } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    hobby: userData?.hobby || '',
    dob: userData?.dob || ''
  });

  const stats = {
    totalGames: gameHistory.length,
    gamesWon: gameHistory.filter(game => game.completed).length,
    totalPoints: gameHistory.reduce((sum, game) => sum + (game.pointsEarned || 0), 0),
    averageScore: gameHistory.length > 0 
      ? Math.round(gameHistory.reduce((sum, game) => sum + (game.score || 0), 0) / gameHistory.length)
      : 0
  };

  const handleSave = async () => {
    try {
      await updateUserData(editData);
      if (editData.displayName !== userData.displayName) {
        await updateUserProfile({ displayName: editData.displayName });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: userData?.displayName || '',
      bio: userData?.bio || '',
      hobby: userData?.hobby || '',
      dob: userData?.dob || ''
    });
    setIsEditing(false);
  };

  const recentGames = gameHistory.slice(0, 5);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3">
          <User size={32} />
          Your Profile
        </h1>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{userData?.points || 0} Points</span>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        {/* Profile Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSave}
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editData.displayName}
                      onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                    />
                  ) : (
                    userData?.displayName || 'Anonymous Player'
                  )}
                </h3>
                <p className="text-muted flex items-center gap-2">
                  <Mail size={16} />
                  {userData?.email}
                </p>
              </div>
            </div>

            <div>
              <label className="form-label">Bio</label>
              {isEditing ? (
                <textarea
                  className="form-textarea"
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows={3}
                />
              ) : (
                <p className="text-muted">{userData?.bio || 'No bio yet'}</p>
              )}
            </div>

            <div>
              <label className="form-label">Hobby</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editData.hobby}
                  onChange={(e) => setEditData({...editData, hobby: e.target.value})}
                />
              ) : (
                <p className="text-muted">{userData?.hobby || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="form-label">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  className="form-input"
                  value={editData.dob}
                  onChange={(e) => setEditData({...editData, dob: e.target.value})}
                />
              ) : (
                <p className="text-muted flex items-center gap-2">
                  <Calendar size={16} />
                  {userData?.dob || 'Not specified'}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">Member Since</label>
              <p className="text-muted">
                {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="card">
          <h2 className="mb-4">Game Statistics</h2>
          
          <div className="grid grid-2 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-3xl font-bold text-primary">{stats.totalGames}</div>
              <div className="text-muted">Total Games</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-3xl font-bold text-success">{stats.gamesWon}</div>
              <div className="text-muted">Games Won</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <div className="text-3xl font-bold text-warning">{stats.totalPoints}</div>
              <div className="text-muted">Total Points</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-3xl font-bold text-accent">{stats.averageScore}</div>
              <div className="text-muted">Avg Score</div>
            </div>
          </div>

          <h3 className="mb-3">Achievements</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-card rounded border">
              <Award className="text-warning" size={20} />
              <div>
                <div className="font-semibold">First Win</div>
                <div className="text-sm text-muted">Win your first game</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded border">
              <Award className="text-warning" size={20} />
              <div>
                <div className="font-semibold">Point Collector</div>
                <div className="text-sm text-muted">Reach 1000 points</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded border">
              <Award className="text-warning" size={20} />
              <div>
                <div className="font-semibold">Variety Player</div>
                <div className="text-sm text-muted">Play all 7 games</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="card mt-6">
        <h2 className="mb-4">Recent Games</h2>
        
        {recentGames.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="text-muted mx-auto mb-4" size={48} />
            <p className="text-muted">No games played yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Points</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game) => (
                  <tr key={game.id}>
                    <td>
                      <span className="badge badge-secondary">{game.name}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        game.difficulty === 'easy' ? 'badge-success' :
                        game.difficulty === 'medium' ? 'badge-warning' :
                        game.difficulty === 'hard' ? 'badge-accent' :
                        'badge-danger'
                      }`}>
                        {game.difficulty}
                      </span>
                    </td>
                    <td className="font-bold">{game.score}</td>
                    <td>
                      <div className="flex items-center gap-1 text-warning">
                        <Star size={14} fill="currentColor" />
                        {game.pointsEarned || 0}
                      </div>
                    </td>
                    <td>{game.duration}s</td>
                    <td>
                      {game.createdAt ? new Date(game.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;