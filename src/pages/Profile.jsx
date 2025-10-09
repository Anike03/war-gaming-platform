import React, { useState, useMemo } from 'react';
import { useAuth, useGame } from '../hooks';
import { User, Mail, Calendar, Star, Award, Clock, Edit3, Save, X } from 'lucide-react';

function formatDate(maybeTs) {
  if (!maybeTs) return 'N/A';
  try {
    // Firestore Timestamp
    if (typeof maybeTs.toDate === 'function') return maybeTs.toDate().toLocaleDateString();
    // ISO string or millis
    const d = new Date(maybeTs);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  } catch {
    return 'N/A';
  }
}

const Profile = () => {
  const { userData, updateUserData, updateUserProfile } = useAuth();
  const { gameHistory = [] } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    hobby: userData?.hobby || '',
    dob: userData?.dob || ''
  });

  const stats = useMemo(() => {
    const totalGames = gameHistory.length;
    const gamesWon = gameHistory.filter(g => g.completed).length;
    const totalPoints = gameHistory.reduce((s, g) => s + (g.pointsEarned || 0), 0);
    const averageScore = totalGames
      ? Math.round(gameHistory.reduce((s, g) => s + (g.score || 0), 0) / totalGames)
      : 0;
    return { totalGames, gamesWon, totalPoints, averageScore };
  }, [gameHistory]);

  const recentGames = useMemo(() => gameHistory.slice(0, 5), [gameHistory]);

  const handleSave = async () => {
    const next = { ...editData };
    try {
      await updateUserData(next);
      if (next.displayName && next.displayName !== userData?.displayName) {
        await updateUserProfile({ displayName: next.displayName });
      }
      setIsEditing(false);
    } catch (e) {
      console.error('Error updating profile:', e);
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
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-success btn-sm" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-border-color">
                <User size={32} className="text-primary-strong" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editData.displayName}
                      onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                    />
                  ) : (
                    userData?.displayName || 'Anonymous Player'
                  )}
                </h3>
                <p className="text-muted flex items-center gap-2">
                  <Mail size={16} />
                  {userData?.email || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <label className="form-label">Bio</label>
              {isEditing ? (
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                />
              ) : (
                <p className="text-muted">{userData?.bio || 'No bio yet'}</p>
              )}
            </div>

            <div>
              <label className="form-label">Hobby</label>
              {isEditing ? (
                <input
                  className="form-input"
                  value={editData.hobby}
                  onChange={(e) => setEditData({ ...editData, hobby: e.target.value })}
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
                  onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
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
                {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="card">
          <h2 className="mb-4">Game Statistics</h2>

          <div className="grid grid-2 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-border-color">
              <div className="text-3xl font-bold text-primary">{stats.totalGames}</div>
              <div className="text-muted">Total Games</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success">
              <div className="text-3xl font-bold text-success">{stats.gamesWon}</div>
              <div className="text-muted">Games Won</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg border border-border-color">
              <div className="text-3xl font-bold text-warning">{stats.totalPoints}</div>
              <div className="text-muted">Total Points</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-border-color">
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
                {recentGames.map((g) => (
                  <tr key={g.id}>
                    <td><span className="badge badge-secondary">{g.name || g.gameId}</span></td>
                    <td>
                      <span className={`badge ${
                        g.difficulty === 'easy' ? 'badge-success' :
                        g.difficulty === 'medium' ? 'badge-warning' :
                        g.difficulty === 'hard' ? 'badge-accent' : 'badge-danger'
                      }`}>
                        {g.difficulty}
                      </span>
                    </td>
                    <td className="font-bold">{g.score || 0}</td>
                    <td className="text-warning font-bold flex items-center gap-1">
                      <Star size={14} fill="currentColor" /> {g.pointsEarned || 0}
                    </td>
                    <td>{typeof g.duration === 'number' ? `${g.duration}s` : '—'}</td>
                    <td>{formatDate(g.createdAt)}</td>
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
