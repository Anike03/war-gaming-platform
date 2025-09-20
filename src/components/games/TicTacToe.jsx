import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks';
import { RefreshCw, X, Circle, Star, Timer, Brain } from 'lucide-react';

const TicTacToe = ({ difficulty, onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ player: 0, ai: 0, ties: 0 });
  const [gameOver, setGameOver] = useState(false);
  const { endGame, updateScore } = useGame();

  const difficultySettings = {
    easy: { depth: 1, name: 'Easy' },
    medium: { depth: 3, name: 'Medium' },
    hard: { depth: 5, name: 'Hard' },
    extreme: { depth: 7, name: 'Extreme' }
  };

  useEffect(() => {
    // AI makes move if it's AI's turn and game is not over
    if (!isXNext && !winner && !gameOver) {
      setTimeout(() => makeAIMove(), 500);
    }
  }, [isXNext, winner, gameOver]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'draw';
    }

    return null;
  };

  const minimax = (squares, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
    const result = calculateWinner(squares);
    
    if (result === 'X') return { score: -10 + depth };
    if (result === 'O') return { score: 10 - depth };
    if (result === 'draw') return { score: 0 };
    if (depth === 0) return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const { score } = minimax(squares, depth - 1, false, alpha, beta);
          squares[i] = null;

          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }

          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
      }

      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = -1;

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const { score } = minimax(squares, depth - 1, true, alpha, beta);
          squares[i] = null;

          if (score < bestScore) {
            bestScore = score;
            bestMove = i;
          }

          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }

      return { score: bestScore, move: bestMove };
    }
  };

  const makeAIMove = () => {
    const squares = [...board];
    const { depth } = difficultySettings[difficulty];
    const { move } = minimax(squares, depth, true);
    
    if (move !== -1) {
      squares[move] = 'O';
      setBoard(squares);
      
      const newWinner = calculateWinner(squares);
      if (newWinner) {
        handleGameEnd(newWinner);
      } else {
        setIsXNext(true);
      }
    }
  };

  const handleClick = (index) => {
    if (winner || board[index] || !isXNext || gameOver) return;

    const squares = [...board];
    squares[index] = 'X';
    setBoard(squares);
    
    const newWinner = calculateWinner(squares);
    if (newWinner) {
      handleGameEnd(newWinner);
    } else {
      setIsXNext(false);
    }
  };

  const handleGameEnd = async (result) => {
    setWinner(result);
    setGameOver(true);
    
    let points = 0;
    if (result === 'X') {
      points = calculatePoints();
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (result === 'O') {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
    } else {
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
    }

    if (result === 'X') {
      updateScore(points);
      await endGame(1, true); // 1 point for win, completed
    } else {
      await endGame(0, false); // 0 points for loss/draw, not completed
    }
    
    setTimeout(() => onGameEnd(), 3000);
  };

  const calculatePoints = () => {
    const basePoints = {
      easy: 25,
      medium: 50,
      hard: 75,
      extreme: 100
    };
    return basePoints[difficulty];
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameOver(false);
  };

  const renderSquare = (index) => {
    const value = board[index];
    return (
      <button
        className={`
          w-16 h-16 md:w-20 md:h-20 text-3xl font-bold border-2 border-primary
          flex items-center justify-center transition-all
          ${value ? 'cursor-not-allowed' : 'hover:bg-primary/10'}
          ${winner && value ? 'animate-bounce' : ''}
        `}
        onClick={() => handleClick(index)}
        disabled={!!value || winner || !isXNext}
      >
        {value === 'X' ? (
          <X size={32} className="text-accent" />
        ) : value === 'O' ? (
          <Circle size={28} className="text-primary" />
        ) : null}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (winner === 'X') return 'You win! 🎉';
    if (winner === 'O') return 'AI wins! 🤖';
    if (winner === 'draw') return 'Draw game! 🤝';
    return isXNext ? 'Your turn' : 'AI thinking...';
  };

  return (
    <div className="text-center">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain size={20} />
          <span className="font-semibold">{difficultySettings[difficulty].name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star size={20} className="text-warning" />
          <span className="font-semibold">{calculatePoints()} points for win</span>
        </div>
      </div>

      {/* Score Board */}
      <div className="grid grid-3 gap-4 mb-6">
        <div className="bg-card p-3 rounded-lg">
          <div className="text-2xl font-bold text-accent">{score.player}</div>
          <div className="text-sm text-muted">You</div>
        </div>
        <div className="bg-card p-3 rounded-lg">
          <div className="text-2xl font-bold text-primary">{score.ties}</div>
          <div className="text-sm text-muted">Draws</div>
        </div>
        <div className="bg-card p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-400">{score.ai}</div>
          <div className="text-sm text-muted">AI</div>
        </div>
      </div>

      {/* Game Status */}
      <div className={`text-lg font-semibold mb-4 ${
        winner === 'X' ? 'text-success' :
        winner === 'O' ? 'text-danger' :
        'text-primary'
      }`}>
        {getStatusMessage()}
      </div>

      {/* Game Board */}
      <div className="grid grid-3 gap-2 mx-auto mb-6" style={{ maxWidth: '300px' }}>
        {[0, 1, 2].map(row => (
          <div key={row} className="grid grid-3 gap-2">
            {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>

      {/* Game Controls */}
      <div className="flex gap-4 justify-center">
        <button 
          onClick={resetGame}
          className="btn btn-secondary"
          disabled={!gameOver}
        >
          <RefreshCw size={16} className="mr-2" />
          New Game
        </button>
        
        <button 
          onClick={() => onGameEnd()}
          className="btn btn-danger"
        >
          Exit Game
        </button>
      </div>

      {/* Instructions */}
      {!gameOver && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted">
            Get three in a row horizontally, vertically, or diagonally to win. 
            You play as X, the AI plays as O.
          </p>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;