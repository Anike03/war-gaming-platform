// GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../utils/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export const GameContext = createContext(); // Added export

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const { currentUser, addPoints } = useAuth();

  // Points system based on difficulty
  const POINTS_SYSTEM = {
    easy: 25,
    medium: 50,
    hard: 75,
    extreme: 100
  };

  const startGame = (gameName, difficulty) => {
    setCurrentGame({
      name: gameName,
      difficulty,
      startTime: new Date()
    });
    setGameScore(0);
  };

  const endGame = async (score, completed = true) => {
    if (!currentGame || !currentUser) return null;
    
    const endTime = new Date();
    const duration = Math.round((endTime - currentGame.startTime) / 1000); // in seconds
    
    const gameResult = {
      ...currentGame,
      score,
      completed,
      endTime,
      duration,
      userId: currentUser.uid
    };
    
    // Calculate points earned
    let pointsEarned = 0;
    if (completed && score > 0) {
      pointsEarned = POINTS_SYSTEM[currentGame.difficulty] || 0;
      
      // Add bonus for high scores or fast completion
      if (score > 1000) pointsEarned += Math.floor(score / 100);
      if (duration < 60) pointsEarned += Math.floor((60 - duration) / 10) * 5;
    }
    
    gameResult.pointsEarned = pointsEarned;
    
    try {
      // Save game result to database
      const gamesRef = collection(db, 'games');
      const docRef = await addDoc(gamesRef, {
        ...gameResult,
        createdAt: new Date()
      });
      
      gameResult.id = docRef.id;
      
      // Add points to user account
      if (pointsEarned > 0) {
        await addPoints(pointsEarned, `Completed ${currentGame.name} on ${currentGame.difficulty} difficulty`);
      }
      
      // Update local state
      setGameHistory(prev => [...prev, gameResult]);
      setCurrentGame(null);
      
      return gameResult;
    } catch (error) {
      console.error('Error saving game result:', error);
      return null;
    }
  };

  const updateScore = (points) => {
    setGameScore(prev => prev + points);
  };

  const getLeaderboard = async (gameName = null, difficulty = null, limit = 10) => {
    try {
      let q = query(
        collection(db, 'games'),
        orderBy('score', 'desc'),
        orderBy('duration', 'asc')
      );
      
      if (gameName) {
        q = query(q, where('name', '==', gameName));
      }
      
      if (difficulty) {
        q = query(q, where('difficulty', '==', difficulty));
      }
      
      const querySnapshot = await getDocs(q);
      const results = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      // Get user data for each game result
      const leaderboardWithUsers = await Promise.all(
        results.slice(0, limit).map(async (result) => {
          const userRef = doc(db, 'users', result.userId);
          const userSnap = await getDoc(userRef);
          
          return {
            ...result,
            user: userSnap.exists() ? userSnap.data() : { displayName: 'Unknown Player' }
          };
        })
      );
      
      setLeaderboard(leaderboardWithUsers);
      return leaderboardWithUsers;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  };

  const getUserGameHistory = async (userId = null, limit = 20) => {
    const targetUserId = userId || (currentUser ? currentUser.uid : null);
    if (!targetUserId) return [];
    
    try {
      const q = query(
        collection(db, 'games'),
        where('userId', '==', targetUserId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      
      return history.slice(0, limit);
    } catch (error) {
      console.error('Error getting user game history:', error);
      return [];
    }
  };

  useEffect(() => {
    if (currentUser) {
      // Load user's game history
      getUserGameHistory().then(history => {
        setGameHistory(history);
      });
      
      // Load global leaderboard
      getLeaderboard();
    }
  }, [currentUser]);

  const value = {
    currentGame,
    gameScore,
    gameHistory,
    leaderboard,
    startGame,
    endGame,
    updateScore,
    getLeaderboard,
    getUserGameHistory,
    POINTS_SYSTEM
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}