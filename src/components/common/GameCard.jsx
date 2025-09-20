import React from 'react';
import { Play, Star, Clock, Award } from 'lucide-react';

const GameCard = ({
  game,
  onPlay,
  stats,
  className = ''
}) => {
  const {
    id,
    name,
    description,
    icon,
    difficulties = [],
    color = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
  } = game;

  return (
    <div className={`card hover-lift ${className}`}>
      {/* Header with gradient background */}
      <div 
        className="p-4 rounded-t-lg text-white text-center"
        style={{ background: color }}
      >
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="text-xl font-bold">{name}</h3>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-muted mb-4">{description}</p>
        
        {/* Difficulty badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {difficulties.map(diff => (
            <span key={diff} className="badge badge-secondary text-sm">
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </span>
          ))}
        </div>

        {/* Statistics */}
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

        {/* Play button */}
        <button 
          onClick={() => onPlay(game)}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Play Now
        </button>
      </div>
    </div>
  );
};

export default GameCard;