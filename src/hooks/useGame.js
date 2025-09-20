import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export const useGame = () => {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};

// Game-specific hooks
export const useGameState = () => {
  const { currentGame, gameScore, gameHistory } = useGame();
  return { currentGame, gameScore, gameHistory };
};

export const useGameActions = () => {
  const { startGame, endGame, updateScore } = useGame();
  return { startGame, endGame, updateScore };
};

export const useLeaderboard = (gameName = null, difficulty = null) => {
  const { leaderboard, getLeaderboard } = useGame();
  
  const refreshLeaderboard = () => {
    return getLeaderboard(gameName, difficulty);
  };
  
  return {
    leaderboard,
    refreshLeaderboard
  };
};

export const useGameHistory = (userId = null) => {
  const { gameHistory, getUserGameHistory } = useGame();
  
  const refreshHistory = () => {
    return getUserGameHistory(userId);
  };
  
  return {
    gameHistory,
    refreshHistory
  };
};

export const usePointsSystem = () => {
  const { POINTS_SYSTEM } = useGame();
  return POINTS_SYSTEM;
};