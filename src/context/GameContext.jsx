// src/context/GameContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../utils/firebase";
import { useAuth } from "./AuthContext";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

// Base points per difficulty (used everywhere)
export const POINTS_SYSTEM = {
  easy: 25,
  medium: 50,
  hard: 75,
  extreme: 100,
};

export function GameProvider({ children }) {
  const { currentUser, addPoints } = useAuth();
  const [gameHistory, setGameHistory] = useState([]);     // this feeds Profile
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  // ---- SAVE RESULT (single, canonical path) ------------------------------
  // payload: { gameId, gameName, difficulty, score, completed, pointsEarned, duration? }
  const saveGameResult = async (payload) => {
    if (!currentUser) throw new Error("You must be logged in to save the game.");

    const result = {
      userId: currentUser.uid,
      name: payload.gameName || payload.gameId,
      gameId: payload.gameId,
      difficulty: payload.difficulty,
      score: Math.max(0, Math.floor(payload.score || 0)),
      completed: !!payload.completed,
      duration: typeof payload.duration === "number" ? Math.max(0, Math.floor(payload.duration)) : 0,
      pointsEarned: Math.max(0, Math.floor(payload.pointsEarned || 0)),
      createdAt: serverTimestamp(),
    };

    // 1) write the game result
    const gamesRef = collection(db, "games");
    await addDoc(gamesRef, result);

    // 2) award points (if any)
    if (result.pointsEarned > 0) {
      await addPoints(result.pointsEarned, `Completed ${result.name} (${result.difficulty})`);
    }

    // local state will update via the onSnapshot listener below
    return result;
  };

  // ---- Realtime history for current user --------------------------------
  useEffect(() => {
    if (!currentUser) {
      setGameHistory([]);
      setLoadingHistory(false);
      return;
    }

    const q = query(
      collection(db, "games"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    setLoadingHistory(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setGameHistory(list);
        setLoadingHistory(false);
      },
      () => setLoadingHistory(false)
    );

    return () => unsub();
  }, [currentUser]);

  // ---- (Optional) simple global leaderboard (top 10) ---------------------
  const refreshLeaderboard = async () => {
    // lightweight: client-side pull by your own queries if needed later
    // Kept here for API compatibility with your earlier code.
    return leaderboard;
  };

  const value = useMemo(
    () => ({
      POINTS_SYSTEM,
      gameHistory,
      loadingHistory,
      leaderboard,
      refreshLeaderboard,
      saveGameResult,
    }),
    [gameHistory, loadingHistory, leaderboard]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
