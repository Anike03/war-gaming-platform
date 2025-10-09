// src/components/games/GameLoader.jsx
import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';

import NumberGrid from './NumberGrid';
import ColorGrid from './ColorGrid';
import TicTacToe from './TicTacToe';
import QuizQuest from './QuizQuest';
import Chess from './Chess';
import Sudoku from './Sudoku';
import Crossword from './Crossword';

const GAME_MAP = {
  'number-grid': NumberGrid,
  'color-grid': ColorGrid,
  'tic-tac-toe': TicTacToe,
  'quizquest': QuizQuest,
  'chess': Chess,
  'sudoku': Sudoku,
  'crossword': Crossword,
};

const base = {
  easy:    { speed: 1, timeLimit: 120, grid: 3, ai: 'easy',    questions: 5  },
  medium:  { speed: 2, timeLimit: 90,  grid: 4, ai: 'medium',  questions: 8  },
  hard:    { speed: 3, timeLimit: 60,  grid: 5, ai: 'hard',    questions: 12 },
  extreme: { speed: 4, timeLimit: 45,  grid: 6, ai: 'extreme', questions: 15 },
};

function makeSettings(gameId, difficulty) {
  const d = base[difficulty] || base.easy;
  switch (gameId) {
    case 'number-grid': return { gridSize: d.grid, timeLimit: d.timeLimit };
    case 'color-grid':  return { gridSize: d.grid, rounds: d.questions, timeLimit: d.timeLimit };
    case 'tic-tac-toe': return { aiLevel: d.ai };
    case 'quizquest':   return { numQuestions: d.questions, timeLimit: d.timeLimit };
    case 'chess':       return { aiLevel: d.ai, moveTime: d.timeLimit };
    case 'sudoku':      return { difficulty };
    case 'crossword':   return { difficulty, timeLimit: d.timeLimit };
    default:            return { difficulty };
  }
}

export default function GameLoader() {
  const { gameId } = useParams();
  const [sp] = useSearchParams();
  const difficulty = (sp.get('difficulty') || 'easy').toLowerCase();
  const Component = GAME_MAP[gameId];
  const settings = useMemo(() => makeSettings(gameId, difficulty), [gameId, difficulty]);

  if (!Component) {
    return (
      <div className="container">
        <div className="card">
          <h2>Game not found</h2>
          <p className="text-muted">The game you tried to open doesn’t exist.</p>
          <Link to="/games" className="btn btn-primary" style={{marginTop:12}}>Back to Games</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ marginBottom: 4, textTransform: 'capitalize' }}>
              {gameId.replace(/-/g, ' ')}
            </h2>
            <div className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
              Difficulty: {difficulty}
            </div>
          </div>
          <Link to="/games" className="btn btn-secondary">Back</Link>
        </div>
      </div>

      <Component difficulty={difficulty} settings={settings} />
    </div>
  );
}
