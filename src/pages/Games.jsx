import React, { useState } from 'react';
import { useGame, useAuth } from '../hooks';
import { Play, Clock, Star, TrendingUp, Award } from 'lucide-react';
import GameModal from '../components/games/GameModal';

const Games = () => {
  const { userData } = useAuth();
  const { gameHistory } = useGame();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const games = [
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
  ];

  const getGameStats = (gameId) => {
    const gameGames = gameHistory.filter(game => game.name === gameId);
    if (gameGames.length === 0) return null;

    const wins = gameGames.filter(game => game.completed).length;
    const totalPoints = gameGames.reduce((sum, game) => sum + (game.pointsEarned || 0), 0);
    const bestScore = Math.max(...gameGames.map(game => game.score || 0));

    return { plays: gameGames.length, wins, totalPoints, bestScore };
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h1>Games Arena</h1>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{userData?.points || 0} Points</span>
        </div>
      </div>

      <div className="grid grid-3">
        {games.map((game) => {
          const stats = getGameStats(game.id);
          
          return (
            <div key={game.id} className="card hover-lift">
              <div 
                className="game-card-header p-4 rounded-t-lg text-white text-center"
                style={{ background: game.color }}
              >
                <div className="text-4xl mb-2">{game.icon}</div>
                <h3>{game.name}</h3>
              </div>
              
              <div className="p-4">
                <p className="text-muted mb-4">{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.difficulties.map(diff => (
                    <span key={diff} className="badge badge-secondary text-sm">
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </span>
                  ))}
                </div>

                {stats && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Plays:</span>
                      <span className="font-semibold">{stats.plays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Wins:</span>
                      <span className="font-semibold text-success">{stats.wins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Best Score:</span>
                      <span className="font-semibold text-warning">{stats.bestScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Points:</span>
                      <span className="font-semibold text-primary">{stats.totalPoints}</span>
                    </div>
                  </div>
                )}

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

      {showModal && selectedGame && (
        <GameModal 
          game={selectedGame} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Games;