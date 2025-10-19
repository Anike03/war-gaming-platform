// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth, useGame } from "../hooks";
import {
  User, Mail, Calendar, Star, Clock, Edit3, Save, X, 
  Trophy, Award, Zap, RefreshCw, TrendingUp, Target, GamepadIcon
} from "lucide-react";
import './Profile.css';

/* ---------- helpers ---------- */
function safeNumber(n, d = 0) {
  if (n === null || n === undefined) return d;
  const v = Number(n);
  return Number.isFinite(v) ? v : d;
}

function formatDate(maybeTs) {
  if (!maybeTs) return "N/A";
  try {
    if (typeof maybeTs.toDate === "function") {
      return maybeTs.toDate().toLocaleDateString();
    }
    if (typeof maybeTs === "object" && maybeTs.seconds) {
      return new Date(maybeTs.seconds * 1000).toLocaleDateString();
    }
    const d = new Date(maybeTs);
    return Number.isFinite(d.getTime()) ? d.toLocaleDateString() : "N/A";
  } catch {
    return "N/A";
  }
}

/** clamped % for progress bars */
function pct(v, max) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((v / max) * 100)));
}

const Profile = () => {
  const { userData, updateUserData, updateUserProfile } = useAuth();
  const { gameHistory, getUserGameHistory, refreshGameHistory, loadingHistory } = useGame();

  const [localHistory, setLocalHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userData?.displayName || "",
    bio: userData?.bio || "",
    hobby: userData?.hobby || "",
    dob: userData?.dob || "",
  });

  // Load game history when component mounts or user changes
  useEffect(() => {
    let isMounted = true;
    
    const loadGameHistory = async () => {
      if (!userData?.uid) {
        if (isMounted) setLocalHistory([]);
        return;
      }
      
      console.log("Loading game history for user:", userData.uid);
      try {
        const history = await getUserGameHistory(userData.uid);
        console.log("Loaded history:", history);
        if (isMounted) {
          setLocalHistory(Array.isArray(history) ? history : []);
        }
      } catch (error) {
        console.error('Error loading game history:', error);
        if (isMounted) setLocalHistory([]);
      }
    };

    loadGameHistory();
    
    return () => {
      isMounted = false;
    };
  }, [userData?.uid]);

  // Also sync with context gameHistory when it updates
  useEffect(() => {
    if (Array.isArray(gameHistory) && gameHistory.length > 0) {
      console.log("Syncing with context gameHistory:", gameHistory.length, "games");
      setLocalHistory(gameHistory);
    }
  }, [gameHistory]);

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const list = Array.isArray(localHistory) ? localHistory : [];
    
    const totalGames = list.length;
    const gamesWon = list.filter(g => g.completed === true).length;
    const totalPoints = list.reduce((s, g) => s + safeNumber(g.pointsEarned), 0);
    const averageScore = totalGames > 0 
      ? Math.round(list.reduce((s, g) => s + safeNumber(g.score), 0) / totalGames)
      : 0;
    const bestScore = list.reduce((m, g) => Math.max(m, safeNumber(g.score)), 0);
    const bestStreak = list.reduce((m, g) => 
      Math.max(m, safeNumber(g?.meta?.bestStreak || g.bestStreak || 0)), 0);
    
    return { totalGames, gamesWon, totalPoints, averageScore, bestScore, bestStreak };
  }, [localHistory]);

  const recentGames = useMemo(() => {
    const list = Array.isArray(localHistory) ? localHistory : [];
    return list.slice(0, 8);
  }, [localHistory]);

  const winRate = useMemo(() => {
    return stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0;
  }, [stats.totalGames, stats.gamesWon]);

  /* ---------- profile save/cancel ---------- */
  const handleSave = async () => {
    const next = { ...editData };
    try {
      await updateUserData(next);
      if (next.displayName && next.displayName !== userData?.displayName) {
        await updateUserProfile({ displayName: next.displayName });
      }
      setIsEditing(false);
    } catch (e) {
      console.error("Error updating profile:", e);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: userData?.displayName || "",
      bio: userData?.bio || "",
      hobby: userData?.hobby || "",
      dob: userData?.dob || "",
    });
    setIsEditing(false);
  };

  const handleRefreshHistory = async () => {
    if (userData?.uid) {
      await refreshGameHistory();
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-main">
            <div className="user-avatar">
              <User size={40} className="avatar-icon" />
            </div>
            <div className="user-info">
              <h1 className="user-name">
                {userData?.displayName || "Anonymous Player"}
              </h1>
              <p className="user-email">
                <Mail size={16} />
                {userData?.email || "N/A"}
              </p>
            </div>
          </div>
          <div className="points-display">
            <Star size={24} className="points-icon" />
            <div className="points-content">
              <span className="points-label">Total Points</span>
              <span className="points-value">{safeNumber(userData?.points)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Top Row - Profile and Quick Stats (2 equal columns) */}
        <div className="top-row">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <User size={20} />
                Personal Information
              </h2>
              {!isEditing ? (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <Save size={16} />
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-fields">
              <div className="field-group">
                <label className="field-label">Display Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="field-input"
                    value={editData.displayName}
                    onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                    placeholder="Enter your display name"
                  />
                ) : (
                  <p className="field-value">{userData?.displayName || "Anonymous Player"}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Bio</label>
                {isEditing ? (
                  <textarea
                    className="field-textarea"
                    rows={3}
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="field-value bio-value">
                    {userData?.bio || "No bio yet. Tell us about yourself!"}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Hobby</label>
                {isEditing ? (
                  <input
                    className="field-input"
                    value={editData.hobby}
                    onChange={(e) => setEditData({ ...editData, hobby: e.target.value })}
                    placeholder="What do you enjoy doing?"
                  />
                ) : (
                  <p className="field-value">{userData?.hobby || "Not specified"}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="field-input"
                    value={editData.dob}
                    onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                  />
                ) : (
                  <p className="field-value">
                    <Calendar size={16} />
                    {userData?.dob || "Not specified"}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Member Since</label>
                <p className="field-value">
                  {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Card - Now in top row */}
          <div className="stats-card">
            <h2 className="card-title">
              <TrendingUp size={20} />
              Quick Stats
            </h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon games">
                  <GamepadIcon size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalGames}</div>
                  <div className="stat-label">Games Played</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon wins">
                  <Trophy size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.gamesWon}</div>
                  <div className="stat-label">Games Won</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon rate">
                  <Target size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{winRate}%</div>
                  <div className="stat-label">Win Rate</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon average">
                  <Zap size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.averageScore}</div>
                  <div className="stat-label">Avg Score</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon points">
                  <Star size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalPoints}</div>
                  <div className="stat-label">Total Points</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon best">
                  <Award size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.bestScore}</div>
                  <div className="stat-label">Best Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row - Milestones & Progress (Full Width) */}
        <div className="middle-row">
          <div className="milestones-card full-width">
            <h2 className="card-title">
              <Trophy size={20} />
              Milestones & Progress
            </h2>
            
            <div className="milestones-grid full-width">
              <div className="milestone-item">
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">Points Collector</span>
                    <span className="milestone-target">{stats.totalPoints} / 1000</span>
                  </div>
                  <span className="milestone-percent">{pct(stats.totalPoints, 1000)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill points"
                    style={{ width: `${pct(stats.totalPoints, 1000)}%` }}
                  />
                </div>
              </div>

              <div className="milestone-item">
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">Game Explorer</span>
                    <span className="milestone-target">{stats.totalGames} / 50</span>
                  </div>
                  <span className="milestone-percent">{pct(stats.totalGames, 50)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill games"
                    style={{ width: `${pct(stats.totalGames, 50)}%` }}
                  />
                </div>
              </div>

              <div className="milestone-item">
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">Victory Seeker</span>
                    <span className="milestone-target">{winRate}% / 50%</span>
                  </div>
                  <span className="milestone-percent">{pct(winRate, 50)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill wins"
                    style={{ width: `${pct(winRate, 50)}%` }}
                  />
                </div>
              </div>

              <div className="milestone-item">
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">Streak Master</span>
                    <span className="milestone-target">{stats.bestStreak} / 10</span>
                  </div>
                  <span className="milestone-percent">{pct(stats.bestStreak, 10)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill streak"
                    style={{ width: `${pct(stats.bestStreak, 10)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Recent Games (Full Width) */}
        <div className="bottom-row">
          <div className="games-card full-width">
            <div className="card-header">
              <h2 className="card-title">
                <Zap size={20} />
                Recent Games
              </h2>
              <button
                className="refresh-btn"
                onClick={handleRefreshHistory}
                disabled={loadingHistory}
              >
                <RefreshCw size={16} className={loadingHistory ? "spinning" : ""} />
                Refresh
              </button>
            </div>

            {loadingHistory ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your game history...</p>
              </div>
            ) : recentGames.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} className="empty-icon" />
                <h3>No Games Yet</h3>
                <p>Play some games to see your history here!</p>
              </div>
            ) : (
              <div className="games-list">
                {recentGames.map((game, index) => {
                  const gameName = game.name || game.gameName || "Unknown Game";
                  const difficulty = game.difficulty || "easy";
                  const isCompleted = game.completed === true;

                  return (
                    <div key={game.id || index} className="game-item">
                      <div className="game-main">
                        <div className="game-icon">
                          {gameName.includes('color') ? '🎨' : 
                           gameName.includes('number') ? '🔢' : 
                           gameName.includes('tic') ? '❌' : '🎮'}
                        </div>
                        <div className="game-info">
                          <h4 className="game-name">{gameName.replace(/-/g, ' ')}</h4>
                          <div className="game-meta">
                            <span className={`difficulty-badge ${difficulty}`}>
                              {difficulty}
                            </span>
                            <span className="game-date">
                              {formatDate(game.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="game-stats">
                        <div className="game-score">
                          <span className="score-value">{safeNumber(game.score)}</span>
                          <span className="score-label">Score</span>
                        </div>
                        <div className="game-points">
                          <Star size={14} className="points-star" />
                          <span className="points-value">+{safeNumber(game.pointsEarned)}</span>
                        </div>
                        <div className={`game-status ${isCompleted ? 'won' : 'lost'}`}>
                          {isCompleted ? 'Won' : 'Lost'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;