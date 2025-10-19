import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../utils/firebase";
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
  const { currentUser, addPoints, userData } = useAuth();

  const [currentGame, setCurrentGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pointsLeaderboard, setPointsLeaderboard] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const POINTS_SYSTEM = useMemo(
    () => ({ easy: 25, medium: 50, hard: 75, extreme: 100 }),
    []
  );

  const startGame = (gameName, difficulty) => {
    setCurrentGame({ name: gameName, difficulty, startTime: new Date() });
    setGameScore(0);
  };

  // NEW: Enhanced saveGameResult function that works with GameModal
  const saveGameResult = async (gameData) => {
    if (!currentUser) {
      console.error("No user logged in");
      return null;
    }

    const {
      gameId,
      gameName,
      difficulty,
      score,
      completed,
      pointsEarned,
      duration,
      meta = {}
    } = gameData;

    const gameResult = {
      name: gameName,
      gameId,
      difficulty,
      score: Math.max(0, Math.floor(score || 0)),
      completed: !!completed,
      pointsEarned: Math.max(0, Math.floor(pointsEarned || 0)),
      duration: Math.max(0, Math.floor(duration || 0)),
      userId: currentUser.uid,
      meta,
      createdAt: Timestamp.now(),
      startTime: currentGame?.startTime || new Date(),
      endTime: new Date()
    };

    try {
      const gamesRef = collection(db, "games");
      const docRef = await addDoc(gamesRef, gameResult);

      gameResult.id = docRef.id;

      // Add points to user if earned
      if (gameResult.pointsEarned > 0) {
        await addPoints(
          gameResult.pointsEarned, 
          `Completed ${gameName} (${difficulty})`
        );
      }

      // Update local game history immediately
      setGameHistory(prev => [gameResult, ...prev]);
      
      console.log("Game result saved successfully:", gameResult);
      return gameResult;
    } catch (err) {
      console.error("Error saving game result:", err);
      throw err;
    }
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

  /** Legacy per-match leaderboard */
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

  /** Points-only leaderboard */
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
          userId: data.uid || d.id,
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

  /** Current user's recent matches - UPDATED with better error handling */
  const getUserGameHistory = async (userId = null, limitCount = 50) => {
    const uid = userId || currentUser?.uid;
    if (!uid) {
      console.log("No user ID provided for game history");
      return [];
    }
    
    setLoadingHistory(true);
    try {
      // Try the optimized query first (requires index)
      const qRef = query(
        collection(db, "games"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc"),
        qlimit(limitCount)
      );
      
      const snap = await getDocs(qRef);
      const history = [];
      snap.forEach((d) => {
        const data = d.data();
        history.push({ 
          id: d.id, 
          ...data,
          createdAt: data.createdAt || Timestamp.now(),
          score: data.score || 0,
          pointsEarned: data.pointsEarned || 0,
          completed: data.completed || false,
          duration: data.duration || 0,
          difficulty: data.difficulty || 'easy',
          name: data.name || data.gameName || 'Unknown Game'
        });
      });
      
      console.log(`Loaded ${history.length} games for user ${uid}`);
      return history;
    } catch (e) {
      console.error("getUserGameHistory failed with optimized query, trying fallback:", e);
      
      // Fallback: Simple query without ordering
      try {
        const qRef = query(
          collection(db, "games"),
          where("userId", "==", uid)
        );
        const snap = await getDocs(qRef);
        const history = [];
        snap.forEach((d) => {
          const data = d.data();
          history.push({ 
            id: d.id, 
            ...data,
            createdAt: data.createdAt || Timestamp.now(),
            score: data.score || 0,
            pointsEarned: data.pointsEarned || 0,
            completed: data.completed || false,
            duration: data.duration || 0,
            difficulty: data.difficulty || 'easy',
            name: data.name || data.gameName || 'Unknown Game'
          });
        });
        
        // Sort manually on client side
        history.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA; // Descending order
        });
        
        console.log(`Fallback loaded ${history.length} games for user ${uid}`);
        return history.slice(0, limitCount);
      } catch (fallbackError) {
        console.error("Fallback getUserGameHistory also failed:", fallbackError);
        return [];
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  /** NEW: Force refresh game history */
  const refreshGameHistory = async () => {
    if (!currentUser?.uid) return;
    const history = await getUserGameHistory(currentUser.uid);
    setGameHistory(history);
    return history;
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

  // Load game history when user changes - ENHANCED
  useEffect(() => {
    const loadGameHistory = async () => {
      if (!currentUser?.uid) {
        setGameHistory([]);
        return;
      }
      
      console.log("Loading game history for user:", currentUser.uid);
      const history = await getUserGameHistory(currentUser.uid);
      setGameHistory(history);
    };

    loadGameHistory();
  }, [currentUser?.uid]);

  // Also load points leaderboard
  useEffect(() => {
    if (currentUser) {
      getPointsLeaderboard();
    }
  }, [currentUser]);

  const value = {
    // state
    currentGame,
    gameScore,
    gameHistory,
    leaderboard,
    pointsLeaderboard,
    loadingHistory,

    // actions
    startGame,
    endGame,
    updateScore,
    saveGameResult,
    refreshGameHistory,

    // loaders
    getLeaderboard,
    getPointsLeaderboard,
    getLeaderboardByPoints: getPointsLeaderboard,
    getUserGameHistory,

    // config
    POINTS_SYSTEM,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}