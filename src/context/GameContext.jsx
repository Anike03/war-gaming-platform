import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";         // keep your path
import { db } from "../utils/firebase";          // keep your path
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  Timestamp,
  limit as qlimit,
} from "firebase/firestore";

export const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { currentUser, addPoints } = useAuth();

  const [currentGame, setCurrentGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);           // legacy: per-match
  const [pointsLeaderboard, setPointsLeaderboard] = useState([]); // NEW: per-user totals

  const POINTS_SYSTEM = useMemo(
    () => ({ easy: 25, medium: 50, hard: 75, extreme: 100 }),
    []
  );

  const startGame = (gameName, difficulty) => {
    setCurrentGame({ name: gameName, difficulty, startTime: new Date() });
    setGameScore(0);
  };

  const endGame = async (score, completed = true) => {
    if (!currentGame || !currentUser) return null;

    const endTime = new Date();
    const duration = Math.round((endTime - currentGame.startTime) / 1000);

    const gameResult = {
      ...currentGame,
      score,
      completed,
      endTime,
      duration,
      userId: currentUser.uid,
    };

    let pointsEarned = 0;
    if (completed && score > 0) {
      pointsEarned = POINTS_SYSTEM[currentGame.difficulty] || 0;
      if (score > 1000) pointsEarned += Math.floor(score / 100);
      if (duration < 60) pointsEarned += Math.floor((60 - duration) / 10) * 5;
    }
    gameResult.pointsEarned = pointsEarned;

    try {
      const gamesRef = collection(db, "games");
      const docRef = await addDoc(gamesRef, {
        ...gameResult,
        createdAt: Timestamp.now(),
      });

      gameResult.id = docRef.id;

      if (pointsEarned > 0) {
        await addPoints(pointsEarned, `Completed ${currentGame.name} (${currentGame.difficulty})`);
      }

      setGameHistory((prev) => [gameResult, ...prev]);
      setCurrentGame(null);

      // refresh points leaderboard
      await getPointsLeaderboard();

      return gameResult;
    } catch (err) {
      console.error("Error saving game result:", err);
      return null;
    }
  };

  const updateScore = (pts) => setGameScore((s) => s + pts);

  /** Legacy per-match leaderboard (kept if other pages still use it) */
  const getLeaderboard = async (gameName = null, difficulty = null, limitCount = 50) => {
    try {
      let qRef = query(
        collection(db, "games"),
        orderBy("score", "desc"),
        orderBy("duration", "asc")
      );

      if (gameName) qRef = query(qRef, where("name", "==", gameName));
      if (difficulty) qRef = query(qRef, where("difficulty", "==", difficulty));

      const snap = await getDocs(qRef);
      const rows = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));

      const joined = await joinUsersForRows(rows);
      setLeaderboard(joined.slice(0, limitCount));
      return joined.slice(0, limitCount);
    } catch (e) {
      console.error("getLeaderboard failed:", e);
      setLeaderboard([]);
      return [];
    }
  };

  /** ✅ Points-only leaderboard: read users ordered by points desc */
  const getPointsLeaderboard = async (limitCount = 100) => {
    try {
      const qRef = query(
        collection(db, "users"),
        orderBy("points", "desc"),
        qlimit(limitCount)
      );
      const snap = await getDocs(qRef);

      const list = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          userId: data.uid || d.id,                          // support either layout
          totalPoints: Number(data.points || 0),
          user: {
            displayName: data.displayName || "Anonymous",
            photoURL: data.photoURL || null,
            email: data.email || "",
          },
        };
      });

      setPointsLeaderboard(list);
      return list;
    } catch (e) {
      console.error("getPointsLeaderboard failed:", e);
      setPointsLeaderboard([]);
      return [];
    }
  };

  /** Current user's recent matches */
  const getUserGameHistory = async (userId = null, limitCount = 20) => {
    const uid = userId || currentUser?.uid;
    if (!uid) return [];
    try {
      const qRef = query(
        collection(db, "games"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(qRef);
      const history = [];
      snap.forEach((d) => history.push({ id: d.id, ...d.data() }));
      return history.slice(0, limitCount);
    } catch (e) {
      console.error("getUserGameHistory failed:", e);
      return [];
    }
  };

  // Helpers --------------------------------------------------------
  async function joinUsersForRows(rows) {
    const ids = Array.from(new Set(rows.map((r) => r.userId).filter(Boolean)));
    const users = await fetchUsersByIds(ids);
    return rows.map((r) => ({ ...r, user: users[r.userId] || { displayName: "Anonymous" } }));
  }

  async function fetchUsersByIds(ids) {
    const out = {};
    await Promise.all(
      ids.map(async (uid) => {
        try {
          const uref = doc(db, "users", uid);
          const usnap = await getDoc(uref);
          out[uid] = usnap.exists() ? usnap.data() : { displayName: "Anonymous" };
        } catch {
          out[uid] = { displayName: "Anonymous" };
        }
      })
    );
    return out;
  }

  // Boot
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setGameHistory([]);
        setPointsLeaderboard([]);
        return;
      }
      const myHistory = await getUserGameHistory();
      setGameHistory(myHistory);
      await getPointsLeaderboard();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  const value = {
    // state
    currentGame,
    gameScore,
    gameHistory,
    leaderboard,            // legacy
    pointsLeaderboard,      // ✅ points-only

    // actions
    startGame,
    endGame,
    updateScore,

    // loaders
    getLeaderboard,           // legacy (per match)
    getPointsLeaderboard,     // ✅ points-only
    getLeaderboardByPoints: getPointsLeaderboard, // alias for older code
    getUserGameHistory,

    // config
    POINTS_SYSTEM,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
