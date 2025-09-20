import { useState, useCallback, useEffect } from 'react';
import { useGame } from './useGame';
import { useAuth } from './useAuth';

// Hook for common game logic
export const useGameTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  return {
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formattedTime: formatTime(time)
  };
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Hook for game score management
export const useGameScore = (initialScore = 0) => {
  const [score, setScore] = useState(initialScore);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const addScore = useCallback((points) => {
    const pointsWithMultiplier = points * multiplier;
    setScore(prev => prev + pointsWithMultiplier);
    setCombo(prev => prev + 1);
    
    // Increase multiplier after 5 consecutive correct actions
    if (combo >= 4) {
      setMultiplier(prev => Math.min(prev + 0.5, 3));
    }
    
    return pointsWithMultiplier;
  }, [combo, multiplier]);

  const resetCombo = useCallback(() => {
    setCombo(0);
    setMultiplier(1);
  }, []);

  const resetScore = useCallback(() => {
    setScore(0);
    resetCombo();
  }, [resetCombo]);

  return {
    score,
    combo,
    multiplier,
    addScore,
    resetCombo,
    resetScore
  };
};

// Hook for game completion and rewards
export const useGameCompletion = (gameName, difficulty) => {
  const { endGame } = useGame();
  const { addPoints } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [reward, setReward] = useState(0);

  const completeGame = useCallback(async (score, time) => {
    try {
      const result = await endGame(score, true);
      if (result && result.pointsEarned) {
        setIsCompleted(true);
        setReward(result.pointsEarned);
        return result.pointsEarned;
      }
      return 0;
    } catch (error) {
      console.error('Error completing game:', error);
      return 0;
    }
  }, [endGame, gameName, difficulty]);

  const failGame = useCallback(async (score = 0) => {
    try {
      await endGame(score, false);
      setIsCompleted(false);
      setReward(0);
    } catch (error) {
      console.error('Error failing game:', error);
    }
  }, [endGame]);

  return {
    isCompleted,
    reward,
    completeGame,
    failGame
  };
};

// Hook for game difficulty settings
export const useGameDifficulty = (initialDifficulty = 'medium') => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  const difficultySettings = {
    easy: { multiplier: 0.7, timeBonus: 5, maxScore: 1000 },
    medium: { multiplier: 1, timeBonus: 10, maxScore: 2000 },
    hard: { multiplier: 1.5, timeBonus: 15, maxScore: 3000 },
    extreme: { multiplier: 2, timeBonus: 20, maxScore: 5000 }
  };

  const getDifficultySettings = useCallback(() => {
    return difficultySettings[difficulty] || difficultySettings.medium;
  }, [difficulty]);

  return {
    difficulty,
    setDifficulty,
    getDifficultySettings,
    difficultyOptions: Object.keys(difficultySettings)
  };
};