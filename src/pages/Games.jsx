// src/pages/Games.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useGame, useAuth } from '../hooks';
import { Play, Star } from 'lucide-react';
import GameModal from '../components/games/GameModal';

const Games = () => {
  const { userData, addPoints } = useAuth();
  const { gameHistory } = useGame();

  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pointsShown, setPointsShown] = useState(userData?.points ?? 0);

  useEffect(() => {
    // keep in sync if context changes (e.g., after refresh or elsewhere)
    setPointsShown(userData?.points ?? 0);
  }, [userData?.points]);

  // Catalog of games shown as cards
  const games = useMemo(() => ([
    {
      id: 'number-grid',
      name: 'Number Grid',
      description: 'Test your memory by remembering number sequences',
      icon: '🔢',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
    },
    {
      id: 'color-grid',
      name: 'Color Grid',
      description: 'Match colors in this challenging memory game',
      icon: '🎨',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic Tac Toe',
      description: 'Classic game with smart AI opponent',
      icon: '❌',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)'
    },
    {
      id: 'quizquest',
      name: 'QuizQuest',
      description: 'Answer trivia questions across various categories',
      icon: '❓',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #5614b0 0%, #dbd65c 100%)'
    },
    {
      id: 'chess',
      name: 'Chess',
      description: 'Strategic board game against AI',
      icon: '♟️',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Logical number placement puzzle',
      icon: '9️⃣',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)'
    },
    {
      id: 'crossword',
      name: 'Crossword',
      description: 'Word puzzle with city names theme',
      icon: '📝',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)'
    }
  ]), []);

  // Use gameId (not name) to compute simple stats from history
  const getGameStats = (gameId) => {
    const played = gameHistory?.filter(g => g.gameId === gameId) || [];
    if (played.length === 0) return null;

    const wins = played.filter(g => g.completed).length;
    const totalPoints = played.reduce((sum, g) => sum + (g.pointsEarned || 0), 0);
    const bestScore = Math.max(...played.map(g => g.score || 0));

    return { plays: played.length, wins, totalPoints, bestScore };
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  // 🔑 When a game finishes, save points and update the UI
  const handleGameEnd = async (payload) => {
    // payload { completed, won, score, pointsEarned, meta }
    try {
      const pts = Number(payload?.pointsEarned || 0);
      if (pts > 0) {
        // addPoints returns the new total (per your AuthContext)
        const newTotal = await addPoints(pts, `Game: ${selectedGame?.name}${payload?.won ? ' (win)' : ''}`);
        // Update the badge immediately
        setPointsShown(newTotal ?? (pointsShown + pts));
      }
    } catch (e) {
      // Silently ignore for UI, or you could show a toast here
      console.error('Failed to add points:', e);
    } finally {
      setShowModal(false);
      setSelectedGame(null);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1>Games Arena</h1>
        <div className="wallet-badge" title="Your total points">
          <Star size={20} />
          <span>{pointsShown} Points</span>
        </div>
      </div>

      {/* Games grid */}
      <div className="grid grid-3">
        {games.map((game) => {
          const stats = getGameStats(game.id);

          return (
            <div key={game.id} className="card hover-lift">
              {/* Card header with gradient */}
              <div
                className="game-card-header p-4 rounded-t-lg text-white text-center"
                style={{ background: game.color }}
              >
                <div className="text-4xl mb-2" aria-hidden>{game.icon}</div>
                <h3>{game.name}</h3>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-muted mb-4">{game.description}</p>

                {/* Centered gaming-style difficulty badges with icons */}
<div className="difficulty-levels mb-4">
  {game.difficulties.map(level => (
    <span 
      key={level} 
      className={`difficulty-chip difficulty-${level}`}
    >
      <span className="difficulty-icon">
        {level === 'easy' && '🎯'}
        {level === 'medium' && '⚡'}
        {level === 'hard' && '🔥'}
        {level === 'extreme' && '💀'}
      </span>
      <span className="difficulty-text">
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    </span>
  ))}
</div>

                {/* Stats (if any) */}
                {stats && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Plays</span>
                      <span className="font-semibold">{stats.plays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Wins</span>
                      <span className="font-semibold text-success">{stats.wins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Best Score</span>
                      <span className="font-semibold text-warning">{stats.bestScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Points</span>
                      <span className="font-semibold text-primary">{stats.totalPoints}</span>
                    </div>
                  </div>
                )}

                {/* Play */}
                <button
                  onClick={() => handleGameSelect(game)}
                  className="btn btn-primary btn-full"
                >
                  <Play size={18} />
                  Play Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal mounts the actual game with difficulty selection */}
      {showModal && selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={() => {
            setShowModal(false);
            setSelectedGame(null);
          }}
          onGameEnd={handleGameEnd}   // ⟵ Bubble up points & close
        />
      )}
    </div>
  );
};

export default Games;
