import React, { useEffect, useMemo, useState } from "react";
import { useGame, useAuth } from "../hooks";
import { Trophy, User, Star } from "lucide-react";

/** Small avatar that gracefully falls back to an initial */
const Avatar = ({ name = "Player", photoURL }) => {
  const [broken, setBroken] = useState(false);
  const initial = (name || "P").trim().charAt(0).toUpperCase();

  if (!photoURL || broken) {
    return (
      <div
        className="w-8 h-8 rounded-full bg-primary text-white font-bold grid place-items-center"
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={photoURL}
      alt=""               /* alt left empty so it won't render text if it fails */
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      style={{ width: 32, height: 32, borderRadius: "999px", objectFit: "cover" }}
    />
  );
};

const Leaderboard = () => {
  const { userData } = useAuth();
  const { pointsLeaderboard, getPointsLeaderboard } = useGame();

  useEffect(() => {
    getPointsLeaderboard(100); // load top 100 by points
  }, [getPointsLeaderboard]);

  // Filter out admins safely (either by flag or by display name “admin”)
  const rows = useMemo(() => {
    const cleaned = (pointsLeaderboard || []).filter(
      (r) => !(r?.user?.isAdmin || String(r?.user?.displayName || "").trim().toLowerCase() === "admin")
    );
    // Ensure sort by points desc (in case context didn’t already)
    cleaned.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    return cleaned;
  }, [pointsLeaderboard]);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3">
          <Trophy className="text-yellow-400" size={32} />
          Points Leaderboard
        </h1>
        {userData && (
          <div className="wallet-badge">
            <Star size={20} />
            <span>{userData.points || 0} Points</span>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="mb-4">Top Players</h2>

        {rows.length === 0 ? (
          <div className="text-center py-12">
            <Trophy size={48} className="text-muted mx-auto mb-4" />
            <p className="text-muted">No leaderboard data yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const isMe = row.userId === (userData?.uid || userData?.id);
                  const name = row.user?.displayName || "Anonymous";
                  return (
                    <tr key={row.userId} className={isMe ? "bg-primary/10" : ""}>
                      <td className="font-bold">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={name} photoURL={row.user?.photoURL} />
                          <span>{name}</span>
                          {isMe && <span className="badge badge-primary">You</span>}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-warning">
                          <Star size={14} fill="currentColor" />
                          <span className="font-bold">{row.totalPoints || 0}</span>
                        </div>
                      </td>
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

export default Leaderboard;
