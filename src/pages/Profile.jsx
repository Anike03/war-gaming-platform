// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth, useGame } from "../hooks";
import {
  User, Mail, Calendar, Star, Clock, Edit3, Save, X,
} from "lucide-react";

/* ---------- helpers ---------- */
function safeNumber(n, d = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : d;
}
function formatDate(maybeTs) {
  if (!maybeTs) return "N/A";
  try {
    if (typeof maybeTs.toDate === "function") return maybeTs.toDate().toLocaleString();
    const d = new Date(maybeTs);
    return Number.isFinite(d.getTime()) ? d.toLocaleString() : "N/A";
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
  const {
    gameHistory = [],
    getUserGameHistory,
  } = useGame();

  const [localHistory, setLocalHistory] = useState(gameHistory);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // form editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userData?.displayName || "",
    bio: userData?.bio || "",
    hobby: userData?.hobby || "",
    dob: userData?.dob || "",
  });

  // Keep in sync if context updates
  useEffect(() => {
    setLocalHistory(gameHistory);
  }, [gameHistory]);

  // Ensure history is loaded (so stats & recent games fill in)
  useEffect(() => {
    (async () => {
      if (!userData?.uid && !userData?.id) return;
      setLoadingHistory(true);
      try {
        const uid = userData.uid || userData.id;
        const fresh = await getUserGameHistory(uid, 50);
        if (Array.isArray(fresh) && fresh.length >= 0) {
          setLocalHistory(fresh);
        }
      } finally {
        setLoadingHistory(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.uid, userData?.id]);

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const list = Array.isArray(localHistory) ? localHistory : [];
    const totalGames = list.length;
    const gamesWon = list.filter(g => !!g.completed).length;
    const totalPoints = list.reduce((s, g) => s + safeNumber(g.pointsEarned), 0);
    const averageScore = totalGames
      ? Math.round(list.reduce((s, g) => s + safeNumber(g.score), 0) / totalGames)
      : 0;
    const bestScore = list.reduce((m, g) => Math.max(m, safeNumber(g.score)), 0);
    const bestStreak = list.reduce((m, g) => Math.max(m, safeNumber(g?.meta?.bestStreak || g.bestStreak)), 0);
    return { totalGames, gamesWon, totalPoints, averageScore, bestScore, bestStreak };
  }, [localHistory]);

  const recentGames = useMemo(
    () => (Array.isArray(localHistory) ? localHistory.slice(0, 8) : []),
    [localHistory]
  );

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

  /* ---------- UI ---------- */
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3">
          <User size={32} />
          Your Profile
        </h1>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{safeNumber(userData?.points)} Points</span>
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
                    userData?.displayName || "Anonymous Player"
                  )}
                </h3>
                <p className="text-muted flex items-center gap-2">
                  <Mail size={16} />
                  {userData?.email || "N/A"}
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
                <p className="text-muted">{userData?.bio || "No bio yet"}</p>
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
                <p className="text-muted">{userData?.hobby || "Not specified"}</p>
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
                  {userData?.dob || "Not specified"}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">Member Since</label>
              <p className="text-muted">
                {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics + Milestones */}
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

          {/* Milestones (interactive replacement for Achievements) */}
          <h3 className="mb-3">Milestones</h3>
          <div className="space-y-3">
            {/* Next Points Target */}
            {(() => {
              // Choose a neat next target (500, 1000, 2500, 5000, …)
              const targets = [500, 1000, 2500, 5000, 10000, 20000];
              const nextTarget = targets.find(t => stats.totalPoints < t) || targets[targets.length - 1];
              const progress = pct(stats.totalPoints, nextTarget);
              return (
                <div className="milestone">
                  <div className="milestone-head">
                    <span>Points to next badge</span>
                    <strong>{stats.totalPoints} / {nextTarget}</strong>
                  </div>
                  <div className="milestone-bar"><div style={{ width: `${progress}%` }} /></div>
                </div>
              );
            })()}

            {/* Games Played Target */}
            {(() => {
              const targets = [10, 25, 50, 100];
              const nextTarget = targets.find(t => stats.totalGames < t) || targets[targets.length - 1];
              const progress = pct(stats.totalGames, nextTarget);
              return (
                <div className="milestone">
                  <div className="milestone-head">
                    <span>Games played</span>
                    <strong>{stats.totalGames} / {nextTarget}</strong>
                  </div>
                  <div className="milestone-bar"><div style={{ width: `${progress}%` }} /></div>
                </div>
              );
            })()}

            {/* Best Streak visual */}
            <div className="milestone">
              <div className="milestone-head">
                <span>Best memorization streak</span>
                <strong>{stats.bestStreak || 0}</strong>
              </div>
              <div className="milestone-bar"><div style={{ width: `${pct(stats.bestStreak || 0, 20)}%` }} /></div>
            </div>

            {/* Best Score visual */}
            <div className="milestone">
              <div className="milestone-head">
                <span>Best single-game score</span>
                <strong>{stats.bestScore || 0}</strong>
              </div>
              <div className="milestone-bar"><div style={{ width: `${pct(stats.bestScore || 0, 2000)}%` }} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Games</h2>
          {loadingHistory ? (
            <span className="text-muted" style={{ fontSize: ".9rem" }}>Loading…</span>
          ) : (
            <button
              className="btn btn-sm"
              onClick={async () => {
                const uid = userData?.uid || userData?.id;
                if (!uid) return;
                setLoadingHistory(true);
                try {
                  const fresh = await getUserGameHistory(uid, 50);
                  setLocalHistory(fresh || []);
                } finally {
                  setLoadingHistory(false);
                }
              }}
            >
              Refresh
            </button>
          )}
        </div>

        {(!recentGames || recentGames.length === 0) ? (
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
                {recentGames.map((g) => {
                  const gameName = g.name || g.gameName || g.gameId || "Game";
                  const diff = (g.difficulty || "").toLowerCase();
                  const diffClass =
                    diff === "easy" ? "badge-success" :
                    diff === "medium" ? "badge-warning" :
                    diff === "hard" ? "badge-accent" : "badge-danger";

                  return (
                    <tr key={g.id || `${gameName}-${g.createdAt?.seconds || Math.random()}`}>
                      <td><span className="badge badge-secondary">{gameName}</span></td>
                      <td><span className={`badge ${diffClass}`}>{diff || "—"}</span></td>
                      <td className="font-bold">{safeNumber(g.score)}</td>
                      <td className="text-warning font-bold">
                        <span className="flex items-center gap-1"><Star size={14} fill="currentColor" />{safeNumber(g.pointsEarned)}</span>
                      </td>
                      <td>{Number.isFinite(g?.duration) ? `${g.duration}s` : "—"}</td>
                      <td>{formatDate(g.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
