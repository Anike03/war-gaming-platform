import React, { useState } from 'react';
import { useGame } from '../../hooks';
import { X, Play, Star, Clock, Award, Info } from 'lucide-react';
import NumberGrid from './NumberGrid';
import ColorGrid from './ColorGrid';
import TicTacToe from './TicTacToe';
import QuizQuest from './QuizQuest';
import Chess from './Chess';
import Sudoku from './Sudoku';
import Crossword from './Crossword';

const GameModal = ({ game, onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const { startGame } = useGame();

  const difficulties = [
    { id: 'easy', name: 'Easy', points: 25, description: 'Great for beginners' },
    { id: 'medium', name: 'Medium', points: 50, description: 'Balanced challenge' },
    { id: 'hard', name: 'Hard', points: 75, description: 'For experienced players' },
    { id: 'extreme', name: 'Extreme', points: 100, description: 'Ultimate challenge' }
  ];

  const handleStartGame = () => {
    startGame(game.id, selectedDifficulty);
    setGameStarted(true);
  };

  const handleGameEnd = () => {
    setGameStarted(false);
    onClose();
  };

  const renderGameComponent = () => {
    const props = {
      difficulty: selectedDifficulty,
      onGameEnd: handleGameEnd
    };

    switch (game.id) {
      case 'number-grid':
        return <NumberGrid {...props} />;
      case 'color-grid':
        return <ColorGrid {...props} />;
      case 'tic-tac-toe':
        return <TicTacToe {...props} />;
      case 'quizquest':
        return <QuizQuest {...props} />;
      case 'chess':
        return <Chess {...props} />;
      case 'sudoku':
        return <Sudoku {...props} />;
      case 'crossword':
        return <Crossword {...props} />;
      default:
        return <div>Game not found</div>;
    }
  };

  if (gameStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-border-color flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {game.icon} {game.name} - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
            {renderGameComponent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {game.icon} {game.name}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-muted mb-6">{game.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Difficulty</h3>
            <div className="grid grid-2 gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedDifficulty === diff.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border-color hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold mb-1">{diff.name}</div>
                  <div className="flex items-center gap-1 text-warning mb-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm">{diff.points} points</span>
                  </div>
                  <div className="text-sm text-muted">{diff.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info size={16} />
              How to Play
            </h4>
            <p className="text-sm text-muted">
              {game.id === 'number-grid' && 'Memorize number positions and find matching pairs within the time limit.'}
              {game.id === 'color-grid' && 'Match colors by remembering their positions on the grid.'}
              {game.id === 'tic-tac-toe' && 'Get three in a row horizontally, vertically, or diagonally before the AI does.'}
              {game.id === 'quizquest' && 'Answer trivia questions correctly to earn points. Faster answers earn bonus points.'}
              {game.id === 'chess' && 'Checkmate your opponent\'s king using strategic piece movement.'}
              {game.id === 'sudoku' && 'Fill the grid so that each row, column, and 3x3 box contains all digits from 1 to 9.'}
              {game.id === 'crossword' && 'Fill in the crossword puzzle with the correct words based on the clues provided.'}
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
          >
            <Play size={20} />
            Start Game - {difficulties.find(d => d.id === selectedDifficulty)?.points} Points
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;