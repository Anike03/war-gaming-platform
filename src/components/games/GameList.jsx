import React, { useState } from 'react';
import { useGame, useAuth } from '../../hooks';
import { Play, Star, Clock, Award, Search, Filter } from 'lucide-react';
import GameModal from './GameModal';

const GameList = () => {
  const { userData } = useAuth();
  const { gameHistory } = useGame();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const games = [
    {
      id: 'number-grid',
      name: 'Number Grid',
      description: 'Test your memory by remembering number sequences and finding matching pairs',
      icon: '🔢',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      category: 'Memory'
    },
    {
      id: 'color-grid',
      name: 'Color Grid',
      description: 'Match colors in this challenging memory and pattern recognition game',
      icon: '🎨',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)',
      category: 'Memory'
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic Tac Toe',
      description: 'Classic game with smart AI opponent across multiple difficulty levels',
      icon: '❌',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
      category: 'Strategy'
    },
    {
      id: 'quizquest',
      name: 'QuizQuest',
      description: 'Answer trivia questions across various categories and difficulty levels',
      icon: '❓',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #5614b0 0%, #dbd65c 100%)',
      category: 'Trivia'
    },
    {
      id: 'chess',
      name: 'Chess',
      description: 'Strategic board game against AI with adaptive difficulty',
      icon: '♟️',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      category: 'Strategy'
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Logical number placement puzzle with various grid sizes',
      icon: '9️⃣',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
      category: 'Puzzle'
    },
    {
      id: 'crossword',
      name: 'Crossword',
      description: 'Word puzzle with city names theme and increasing complexity',
      icon: '📝',
      difficulties: ['easy', 'medium', 'hard', 'extreme'],
      color: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)',
      category: 'Word'
    }
  ];

  const difficulties = ['all', 'easy', 'medium', 'hard', 'extreme'];
  const categories = ['all', 'Memory', 'Strategy', 'Trivia', 'Puzzle', 'Word'];

  const getGameStats = (gameId) => {
    const gameGames = gameHistory.filter(game => game.name === gameId);
    if (gameGames.length === 0) return null;

    const wins = gameGames.filter(game => game.completed).length;
    const totalPoints = gameGames.reduce((sum, game) => sum + (game.pointsEarned || 0), 0);
    const bestScore = Math.max(...gameGames.map(game => game.score || 0));
    const avgTime = gameGames.reduce((sum, game) => sum + (game.duration || 0), 0) / gameGames.length;

    return { 
      plays: gameGames.length, 
      wins, 
      totalPoints, 
      bestScore, 
      avgTime: Math.round(avgTime) 
    };
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || 
                             game.difficulties.includes(difficultyFilter);
    return matchesSearch && matchesDifficulty;
  });

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Games Arena</h1>
          <p className="text-muted">Choose from 7 exciting skill-based games</p>
        </div>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{userData?.points || 0} Points</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="grid grid-1 md:grid-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Difficulties</option>
            {difficulties.slice(1).map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-1 md:grid-2 lg:grid-3 gap-6">
        {filteredGames.map((game) => {
          const stats = getGameStats(game.id);
          
          return (
            <div key={game.id} className="card hover-lift">
              <div 
                className="game-card-header p-4 rounded-t-lg text-white text-center"
                style={{ background: game.color }}
              >
                <div className="text-4xl mb-2">{game.icon}</div>
                <h3 className="text-xl font-bold">{game.name}</h3>
                <span className="text-sm opacity-90">{game.category}</span>
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
                      <span className="text-muted">Plays:</span>
                      <span className="font-semibold">{stats.plays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Wins:</span>
                      <span className="font-semibold text-success">{stats.wins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Best Score:</span>
                      <span className="font-semibold text-warning">{stats.bestScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Total Points:</span>
                      <span className="font-semibold text-primary">{stats.totalPoints}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => handleGameSelect(game)}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  Play Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <Search className="text-muted mx-auto mb-4" size={48} />
          <p className="text-muted">No games found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setDifficultyFilter('all');
            }}
            className="btn btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}

      {showModal && selectedGame && (
        <GameModal 
          game={selectedGame} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default GameList;