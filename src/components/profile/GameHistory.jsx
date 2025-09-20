import React, { useState } from 'react';
import { useGame } from '../../hooks';
import { History, Filter, Search, Trophy, Clock, Star, Calendar } from 'lucide-react';

const GameHistory = () => {
  const { gameHistory } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const games = ['all', 'number-grid', 'color-grid', 'tic-tac-toe', 'quizquest', 'chess', 'sudoku', 'crossword'];
  const difficulties = ['all', 'easy', 'medium', 'hard', 'extreme'];

  const filteredGames = gameHistory.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.difficulty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || game.name === gameFilter;
    const matchesDifficulty = difficultyFilter === 'all' || game.difficulty === difficultyFilter;
    
    return matchesSearch && matchesGame && matchesDifficulty;
  });

  const stats = {
    total: filteredGames.length,
    wins: filteredGames.filter(g => g.completed).length,
    totalPoints: filteredGames.reduce((sum, game) => sum + (game.pointsEarned || 0), 0),
    averageScore: filteredGames.length > 0 
      ? Math.round(filteredGames.reduce((sum, game) => sum + (game.score || 0), 0) / filteredGames.length)
      : 0
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getGameIcon = (gameName) => {
    const icons = {
      'number-grid': '🔢',
      'color-grid': '🎨',
      'tic-tac-toe': '❌',
      'quizquest': '❓',
      'chess': '♟️',
      'sudoku': '9️⃣',
      'crossword': '📝'
    };
    return icons[gameName] || '🎮';
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <History size={24} />
          Game History
        </h2>
        <div className="text-lg font-semibold text-warning flex items-center gap-2">
          <Star size={20} fill="currentColor" />
          {stats.totalPoints} Total Points
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-1 md:grid-4 gap-4 mb-6">
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
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="form-select"
        >
          {games.map(game => (
            <option key={game} value={game}>
              {game === 'all' ? 'All Games' : game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="form-select"
        >
          {difficulties.map(diff => (
            <option key={diff} value={diff}>
              {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-2 md:grid-4 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-muted">Total Games</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.wins}</div>
          <div className="text-muted">Wins</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">{stats.averageScore}</div>
          <div className="text-muted">Avg Score</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0}%
          </div>
          <div className="text-muted">Win Rate</div>
        </div>
      </div>

      {/* Game List */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Difficulty</th>
              <th>Score</th>
              <th>Points</th>
              <th>Time</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getGameIcon(game.name)}</span>
                    <div>
                      <div className="font-medium capitalize">{game.name.replace('-', ' ')}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    game.difficulty === 'easy' ? 'badge-success' :
                    game.difficulty === 'medium' ? 'badge-warning' :
                    game.difficulty === 'hard' ? 'badge-accent' :
                    'badge-danger'
                  }`}>
                    {game.difficulty}
                  </span>
                </td>
                <td className="font-bold text-warning">{game.score}</td>
                <td>
                  <div className="flex items-center gap-1 text-success">
                    <Star size={14} fill="currentColor" />
                    {game.pointsEarned || 0}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-muted">
                    <Clock size={14} />
                    {formatDuration(game.duration)}
                  </div>
                </td>
                <td>
                  {game.createdAt ? new Date(game.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <span className={`badge ${game.completed ? 'badge-success' : 'badge-danger'}`}>
                    {game.completed ? 'Won' : 'Lost'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <History className="text-muted mx-auto mb-4" size={48} />
          <p className="text-muted">No games found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default GameHistory;