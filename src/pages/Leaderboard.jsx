import React, { useState, useEffect } from 'react';
import { useGame, useAuth } from '../hooks';
import { Trophy, Crown, Award, TrendingUp, User, Star } from 'lucide-react';

const Leaderboard = () => {
  const { userData } = useAuth();
  const { leaderboard, getLeaderboard } = useGame();
  const [activeTab, setActiveTab] = useState('global');
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [timeRange, setTimeRange] = useState('all-time');

  const games = [
    { id: null, name: 'All Games' },
    { id: 'number-grid', name: 'Number Grid' },
    { id: 'color-grid', name: 'Color Grid' },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe' },
    { id: 'quizquest', name: 'QuizQuest' },
    { id: 'chess', name: 'Chess' },
    { id: 'sudoku', name: 'Sudoku' },
    { id: 'crossword', name: 'Crossword' }
  ];

  const difficulties = [
    { id: null, name: 'All Difficulties' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
    { id: 'extreme', name: 'Extreme' }
  ];

  const timeRanges = [
    { id: 'all-time', name: 'All Time' },
    { id: 'monthly', name: 'This Month' },
    { id: 'weekly', name: 'This Week' },
    { id: 'daily', name: 'Today' }
  ];

  useEffect(() => {
    getLeaderboard(selectedGame, selectedDifficulty);
  }, [selectedGame, selectedDifficulty]);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-400" size={20} />;
    if (index === 1) return <Award className="text-gray-400" size={20} />;
    if (index === 2) return <Award className="text-amber-700" size={20} />;
    return <span className="text-lg font-bold">{index + 1}</span>;
  };

  const getTopPlayers = () => {
    return leaderboard.slice(0, 3);
  };

  const getOtherPlayers = () => {
    return leaderboard.slice(3);
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3">
          <Trophy className="text-yellow-400" size={32} />
          Leaderboard
        </h1>
        <div className="wallet-badge">
          <Star size={20} />
          <span>{userData?.points || 0} Points</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-3 gap-4">
          <div>
            <label className="form-label">Game</label>
            <select 
              className="form-select"
              value={selectedGame || ''}
              onChange={(e) => setSelectedGame(e.target.value || null)}
            >
              {games.map(game => (
                <option key={game.id || 'all'} value={game.id || ''}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Difficulty</label>
            <select 
              className="form-select"
              value={selectedDifficulty || ''}
              onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            >
              {difficulties.map(diff => (
                <option key={diff.id || 'all'} value={diff.id || ''}>
                  {diff.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Time Range</label>
            <select 
              className="form-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Players */}
      {getTopPlayers().length > 0 && (
        <div className="grid grid-3 gap-6 mb-8">
          {getTopPlayers().map((player, index) => (
            <div key={player.id} className={`card text-center p-6 ${index === 0 ? 'animate-glow' : ''}`}>
              <div className="mb-4">
                {getRankIcon(index)}
              </div>
              
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-white" />
              </div>
              
              <h3 className="mb-2">{player.user?.displayName || 'Anonymous'}</h3>
              <p className="text-muted mb-3">Score: {player.score}</p>
              
              <div className="flex items-center justify-center gap-2 text-warning">
                <Star size={16} fill="currentColor" />
                <span className="font-bold">{player.pointsEarned || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="card">
        <h2 className="mb-4">Global Rankings</h2>
        
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy size={48} className="text-muted mx-auto mb-4" />
            <p className="text-muted">No records yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Game</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Points</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {getOtherPlayers().map((player, index) => (
                  <tr key={player.id} className={player.userId === userData?.id ? 'bg-primary/10' : ''}>
                    <td className="font-bold">{index + 4}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        {player.user?.displayName || 'Anonymous'}
                        {player.userId === userData?.id && (
                          <span className="badge badge-primary">You</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">
                        {player.name}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        player.difficulty === 'easy' ? 'badge-success' :
                        player.difficulty === 'medium' ? 'badge-warning' :
                        player.difficulty === 'hard' ? 'badge-accent' :
                        'badge-danger'
                      }`}>
                        {player.difficulty}
                      </span>
                    </td>
                    <td className="font-bold">{player.score}</td>
                    <td>
                      <div className="flex items-center gap-1 text-warning">
                        <Star size={14} fill="currentColor" />
                        {player.pointsEarned || 0}
                      </div>
                    </td>
                    <td>{player.duration}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Stats */}
      {userData && (
        <div className="card mt-6">
          <h3 className="mb-4">Your Statistics</h3>
          <div className="grid grid-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">15</div>
              <div className="text-muted">Games Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">10</div>
              <div className="text-muted">Games Won</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">1250</div>
              <div className="text-muted">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">24</div>
              <div className="text-muted">Global Rank</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;