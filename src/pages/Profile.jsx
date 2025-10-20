// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth, useGame } from "../hooks";
import {
  User, Mail, Calendar, Star, Clock, Edit3, Save, X, 
  Trophy, Award, Zap, RefreshCw, TrendingUp, Target, GamepadIcon,
  Crown, Sparkles, Medal, Rocket, Palette, Shield
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

// Enhanced milestone system with multiple tiers - NOW 6 MILESTONES
const MILESTONE_TIERS = {
  pointsCollector: [
    { target: 1000, name: "Bronze Collector", reward: 100 },
    { target: 2500, name: "Silver Collector", reward: 250 },
    { target: 5000, name: "Gold Collector", reward: 500 },
    { target: 10000, name: "Platinum Collector", reward: 1000 },
    { target: 25000, name: "Diamond Collector", reward: 2500 }
  ],
  gameExplorer: [
    { target: 50, name: "Bronze Explorer", reward: 50 },
    { target: 100, name: "Silver Explorer", reward: 100 },
    { target: 250, name: "Gold Explorer", reward: 250 },
    { target: 500, name: "Platinum Explorer", reward: 500 },
    { target: 1000, name: "Diamond Explorer", reward: 1000 }
  ],
  victorySeeker: [
    { target: 50, name: "Bronze Champion", reward: 100 },
    { target: 60, name: "Silver Champion", reward: 150 },
    { target: 75, name: "Gold Champion", reward: 250 },
    { target: 85, name: "Platinum Champion", reward: 400 },
    { target: 95, name: "Diamond Champion", reward: 600 }
  ],
  streakMaster: [
    { target: 10, name: "Bronze Streak", reward: 50 },
    { target: 25, name: "Silver Streak", reward: 100 },
    { target: 50, name: "Gold Streak", reward: 200 },
    { target: 100, name: "Platinum Streak", reward: 400 },
    { target: 200, name: "Diamond Streak", reward: 800 }
  ],
  // NEW MILESTONES
  gameDiversity: [
    { target: 3, name: "Bronze Adventurer", reward: 50 },
    { target: 5, name: "Silver Adventurer", reward: 100 },
    { target: 7, name: "Gold Adventurer", reward: 200 },
    { target: 10, name: "Platinum Adventurer", reward: 350 },
    { target: 15, name: "Diamond Adventurer", reward: 500 }
  ],
  consistencyMaster: [
    { target: 5, name: "Bronze Consistent", reward: 75 },
    { target: 10, name: "Silver Consistent", reward: 150 },
    { target: 20, name: "Gold Consistent", reward: 300 },
    { target: 35, name: "Platinum Consistent", reward: 500 },
    { target: 50, name: "Diamond Consistent", reward: 750 }
  ]
};

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
    
    // NEW STATS for additional milestones
    const uniqueGames = new Set(list.map(g => g.gameId || g.gameName)).size;
    const consecutiveWins = calculateConsecutiveWins(list);
    
    return { 
      totalGames, 
      gamesWon, 
      totalPoints, 
      averageScore, 
      bestScore, 
      bestStreak,
      uniqueGames, // NEW: Count of different games played
      consecutiveWins // NEW: Longest consecutive win streak
    };
  }, [localHistory]);

  // Helper function to calculate consecutive wins
  function calculateConsecutiveWins(games) {
    let maxStreak = 0;
    let currentStreak = 0;
    
    // Sort games by date (newest first) and check for consecutive wins
    const sortedGames = [...games].sort((a, b) => {
      const dateA = a.createdAt?.seconds || a.createdAt;
      const dateB = b.createdAt?.seconds || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });
    
    for (const game of sortedGames) {
      if (game.completed === true) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

  const recentGames = useMemo(() => {
    const list = Array.isArray(localHistory) ? localHistory : [];
    return list.slice(0, 8);
  }, [localHistory]);

  const winRate = useMemo(() => {
    return stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0;
  }, [stats.totalGames, stats.gamesWon]);

  // Enhanced milestone calculations with multiple tiers - NOW 6 MILESTONES
  const milestoneProgress = useMemo(() => {
    const calculateTierProgress = (currentValue, tiers) => {
      let currentTierIndex = 0;
      let nextTierTarget = tiers[0].target;
      let currentTierProgress = 0;
      let isMaxTier = false;

      // Find current tier
      for (let i = tiers.length - 1; i >= 0; i--) {
        if (currentValue >= tiers[i].target) {
          currentTierIndex = i;
          if (i === tiers.length - 1) {
            // User has reached the highest tier
            isMaxTier = true;
            nextTierTarget = tiers[i].target;
            currentTierProgress = 100;
          } else {
            nextTierTarget = tiers[i + 1].target;
            currentTierProgress = pct(currentValue - tiers[i].target, tiers[i + 1].target - tiers[i].target);
          }
          break;
        }
      }

      return {
        currentTier: tiers[currentTierIndex],
        nextTier: isMaxTier ? null : tiers[currentTierIndex + 1],
        progress: currentTierProgress,
        isMaxTier,
        tiersCompleted: currentTierIndex + 1,
        totalTiers: tiers.length
      };
    };

    return {
      points: calculateTierProgress(stats.totalPoints, MILESTONE_TIERS.pointsCollector),
      games: calculateTierProgress(stats.totalGames, MILESTONE_TIERS.gameExplorer),
      wins: calculateTierProgress(winRate, MILESTONE_TIERS.victorySeeker),
      streak: calculateTierProgress(stats.bestStreak, MILESTONE_TIERS.streakMaster),
      // NEW MILESTONES
      diversity: calculateTierProgress(stats.uniqueGames, MILESTONE_TIERS.gameDiversity),
      consistency: calculateTierProgress(stats.consecutiveWins, MILESTONE_TIERS.consistencyMaster)
    };
  }, [stats.totalPoints, stats.totalGames, winRate, stats.bestStreak, stats.uniqueGames, stats.consecutiveWins]);

  // Calculate overall completion and elite status - NOW WITH 6 MILESTONES
  const overallProgress = useMemo(() => {
    const totalTiers = Object.values(MILESTONE_TIERS).reduce((sum, tier) => sum + tier.length, 0);
    const completedTiers = Object.values(milestoneProgress).reduce((sum, progress) => sum + progress.tiersCompleted, 0);
    const completionPercentage = Math.round((completedTiers / totalTiers) * 100);
    
    // Elite status based on completion
    let eliteStatus = "Rookie";
    if (completionPercentage >= 25) eliteStatus = "Bronze Elite";
    if (completionPercentage >= 50) eliteStatus = "Silver Elite";
    if (completionPercentage >= 75) eliteStatus = "Gold Elite";
    if (completionPercentage >= 90) eliteStatus = "Platinum Elite";
    if (completionPercentage === 100) eliteStatus = "Diamond Master";

    return {
      completionPercentage,
      eliteStatus,
      completedTiers,
      totalTiers
    };
  }, [milestoneProgress]);

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

        {/* Middle Row - Enhanced Milestones & Progress with 6 items */}
        <div className="middle-row">
          <div className="milestones-card full-width">
            <div className="milestones-header">
              <h2 className="card-title">
                <Trophy size={20} />
                Milestones & Progress
              </h2>
              <div className="elite-status">
                <Crown size={16} />
                <span className="status-label">{overallProgress.eliteStatus}</span>
                <span className="completion-percent">
                  {overallProgress.completedTiers}/{overallProgress.totalTiers} Tiers
                </span>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="overall-progress">
              <div className="progress-header">
                <span className="progress-title">Overall Completion</span>
                <span className="progress-percent">{overallProgress.completionPercentage}%</span>
              </div>
              <div className="progress-bar elite">
                <div 
                  className="progress-fill elite"
                  style={{ width: `${overallProgress.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="milestones-grid full-width enhanced">
              {/* Points Collector */}
              <div className={`milestone-item ${milestoneProgress.points.isMaxTier ? 'completed' : ''}`}>
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">
                      {milestoneProgress.points.currentTier.name}
                      {milestoneProgress.points.isMaxTier && <Sparkles size={14} className="completed-badge" />}
                    </span>
                    <span className="milestone-target">
                      {stats.totalPoints} / {milestoneProgress.points.nextTier ? milestoneProgress.points.nextTier.target : 'MAX'}
                    </span>
                  </div>
                  <div className="milestone-tier">
                    <span className="tier-badge points">
                      Tier {milestoneProgress.points.tiersCompleted}
                    </span>
                    <span className="milestone-percent">
                      {milestoneProgress.points.progress}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill points"
                    style={{ width: `${milestoneProgress.points.progress}%` }}
                  />
                </div>
                {milestoneProgress.points.nextTier && (
                  <div className="next-tier">
                    Next: {milestoneProgress.points.nextTier.name} (+{milestoneProgress.points.nextTier.reward} pts)
                  </div>
                )}
              </div>

              {/* Game Explorer */}
              <div className={`milestone-item ${milestoneProgress.games.isMaxTier ? 'completed' : ''}`}>
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">
                      {milestoneProgress.games.currentTier.name}
                      {milestoneProgress.games.isMaxTier && <Sparkles size={14} className="completed-badge" />}
                    </span>
                    <span className="milestone-target">
                      {stats.totalGames} / {milestoneProgress.games.nextTier ? milestoneProgress.games.nextTier.target : 'MAX'}
                    </span>
                  </div>
                  <div className="milestone-tier">
                    <span className="tier-badge games">
                      Tier {milestoneProgress.games.tiersCompleted}
                    </span>
                    <span className="milestone-percent">
                      {milestoneProgress.games.progress}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill games"
                    style={{ width: `${milestoneProgress.games.progress}%` }}
                  />
                </div>
                {milestoneProgress.games.nextTier && (
                  <div className="next-tier">
                    Next: {milestoneProgress.games.nextTier.name} (+{milestoneProgress.games.nextTier.reward} pts)
                  </div>
                )}
              </div>

              {/* Victory Seeker */}
              <div className={`milestone-item ${milestoneProgress.wins.isMaxTier ? 'completed' : ''}`}>
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">
                      {milestoneProgress.wins.currentTier.name}
                      {milestoneProgress.wins.isMaxTier && <Sparkles size={14} className="completed-badge" />}
                    </span>
                    <span className="milestone-target">
                      {winRate}% / {milestoneProgress.wins.nextTier ? milestoneProgress.wins.nextTier.target + '%' : 'MAX'}
                    </span>
                  </div>
                  <div className="milestone-tier">
                    <span className="tier-badge wins">
                      Tier {milestoneProgress.wins.tiersCompleted}
                    </span>
                    <span className="milestone-percent">
                      {milestoneProgress.wins.progress}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill wins"
                    style={{ width: `${milestoneProgress.wins.progress}%` }}
                  />
                </div>
                {milestoneProgress.wins.nextTier && (
                  <div className="next-tier">
                    Next: {milestoneProgress.wins.nextTier.name} (+{milestoneProgress.wins.nextTier.reward} pts)
                  </div>
                )}
              </div>

              {/* Streak Master */}
              <div className={`milestone-item ${milestoneProgress.streak.isMaxTier ? 'completed' : ''}`}>
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">
                      {milestoneProgress.streak.currentTier.name}
                      {milestoneProgress.streak.isMaxTier && <Sparkles size={14} className="completed-badge" />}
                    </span>
                    <span className="milestone-target">
                      {stats.bestStreak} / {milestoneProgress.streak.nextTier ? milestoneProgress.streak.nextTier.target : 'MAX'}
                    </span>
                  </div>
                  <div className="milestone-tier">
                    <span className="tier-badge streak">
                      Tier {milestoneProgress.streak.tiersCompleted}
                    </span>
                    <span className="milestone-percent">
                      {milestoneProgress.streak.progress}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill streak"
                    style={{ width: `${milestoneProgress.streak.progress}%` }}
                  />
                </div>
                {milestoneProgress.streak.nextTier && (
                  <div className="next-tier">
                    Next: {milestoneProgress.streak.nextTier.name} (+{milestoneProgress.streak.nextTier.reward} pts)
                  </div>
                )}
              </div>

              {/* NEW: Game Diversity */}
              <div className={`milestone-item ${milestoneProgress.diversity.isMaxTier ? 'completed' : ''}`}>
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">
                      {milestoneProgress.diversity.currentTier.name}
                      {milestoneProgress.diversity.isMaxTier && <Sparkles size={14} className="completed-badge" />}
                    </span>
                    <span className="milestone-target">
                      {stats.uniqueGames} / {milestoneProgress.diversity.nextTier ? milestoneProgress.diversity.nextTier.target : 'MAX'} games
                    </span>
                  </div>
                  <div className="milestone-tier">
                    <span className="tier-badge diversity">
                      Tier {milestoneProgress.diversity.tiersCompleted}
                    </span>
                    <span className="milestone-percent">
                      {milestoneProgress.diversity.progress}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill diversity"
                    style={{ width: `${milestoneProgress.diversity.progress}%` }}
                  />
                </div>
                {milestoneProgress.diversity.nextTier && (
                  <div className="next-tier">
                    Next: {milestoneProgress.diversity.nextTier.name} (+{milestoneProgress.diversity.nextTier.reward} pts)
                  </div>
                )}
              </div>

              {/* NEW: Consistency Master */}
              <div className={`milestone-item ${milestoneProgress.consistency.isMaxTier ? 'completed' : ''}`}>
                <div className="milestone-header">
                  <div className="milestone-info">
                    <span className="milestone-name">
                      {milestoneProgress.consistency.currentTier.name}
                      {milestoneProgress.consistency.isMaxTier && <Sparkles size={14} className="completed-badge" />}
                    </span>
                    <span className="milestone-target">
                      {stats.consecutiveWins} / {milestoneProgress.consistency.nextTier ? milestoneProgress.consistency.nextTier.target : 'MAX'} wins
                    </span>
                  </div>
                  <div className="milestone-tier">
                    <span className="tier-badge consistency">
                      Tier {milestoneProgress.consistency.tiersCompleted}
                    </span>
                    <span className="milestone-percent">
                      {milestoneProgress.consistency.progress}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill consistency"
                    style={{ width: `${milestoneProgress.consistency.progress}%` }}
                  />
                </div>
                {milestoneProgress.consistency.nextTier && (
                  <div className="next-tier">
                    Next: {milestoneProgress.consistency.nextTier.name} (+{milestoneProgress.consistency.nextTier.reward} pts)
                  </div>
                )}
              </div>
            </div>

            {/* Legendary Achievements for maxed players */}
            {overallProgress.completionPercentage === 100 && (
              <div className="legendary-achievement">
                <div className="legendary-content">
                  <Crown size={24} className="legendary-icon" />
                  <div className="legendary-text">
                    <h4>Legendary Master Achieved!</h4>
                    <p>You've completed all milestones! You are among the elite players.</p>
                  </div>
                  <Rocket size={24} className="legendary-icon" />
                </div>
              </div>
            )}
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