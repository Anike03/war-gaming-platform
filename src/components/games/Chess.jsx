import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks';
import { Timer, Star, RefreshCw, Crown, Sword } from 'lucide-react';

const Chess = ({ difficulty, onGameEnd }) => {
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameStatus, setGameStatus] = useState('playing');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const { endGame, updateScore } = useGame();

  const timeLimits = {
    easy: 600,
    medium: 300,
    hard: 180,
    extreme: 120
  };

  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  const pieceValues = {
    'p': 1, 'P': 1,
    'n': 3, 'N': 3,
    'b': 3, 'B': 3,
    'r': 5, 'R': 5,
    'q': 9, 'Q': 9,
    'k': 0, 'K': 0
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft <= 0 && gameStatus === 'playing') {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  const initializeGame = () => {
    setBoard(initialBoard.map(row => [...row]));
    setSelectedPiece(null);
    setCurrentPlayer('white');
    setGameStatus('playing');
    setTimeLeft(timeLimits[difficulty]);
    setScore(0);
  };

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;

    const piece = board[row][col];
    
    // If no piece is selected and clicked on own piece
    if (!selectedPiece && piece && isOwnPiece(piece, currentPlayer)) {
      setSelectedPiece({ row, col, piece });
      return;
    }

    // If piece is selected and clicked on another square
    if (selectedPiece) {
      // If clicked on own piece, select that piece instead
      if (piece && isOwnPiece(piece, currentPlayer)) {
        setSelectedPiece({ row, col, piece });
        return;
      }

      // Attempt to move piece
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        movePiece(selectedPiece.row, selectedPiece.col, row, col);
        setSelectedPiece(null);
        
        // Switch player after move
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        
        // TODO: Add AI move for black
        setTimeout(() => makeAIMove(), 1000);
      }
    }
  };

  const isOwnPiece = (piece, player) => {
    const isWhite = piece === piece.toUpperCase();
    return (player === 'white' && isWhite) || (player === 'black' && !isWhite);
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    // Simplified move validation - in a real game, you'd use chess.js
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    // Basic movement rules
    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        return validatePawnMove(fromRow, fromCol, toRow, toCol);
      case 'r': // Rook
        return validateRookMove(fromRow, fromCol, toRow, toCol);
      case 'n': // Knight
        return validateKnightMove(fromRow, fromCol, toRow, toCol);
      case 'b': // Bishop
        return validateBishopMove(fromRow, fromCol, toRow, toCol);
      case 'q': // Queen
        return validateQueenMove(fromRow, fromCol, toRow, toCol);
      case 'k': // King
        return validateKingMove(fromRow, fromCol, toRow, toCol);
      default:
        return false;
    }
  };

  // Simplified move validation functions
  const validatePawnMove = (fromRow, fromCol, toRow, toCol) => {
    const direction = board[fromRow][fromCol] === 'P' ? -1 : 1;
    return toCol === fromCol && toRow === fromRow + direction;
  };

  const validateRookMove = (fromRow, fromCol, toRow, toCol) => {
    return fromRow === toRow || fromCol === toCol;
  };

  const validateKnightMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const validateBishopMove = (fromRow, fromCol, toRow, toCol) => {
    return Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol);
  };

  const validateQueenMove = (fromRow, fromCol, toRow, toCol) => {
    return validateRookMove(fromRow, fromCol, toRow, toCol) || 
           validateBishopMove(fromRow, fromCol, toRow, toCol);
  };

  const validateKingMove = (fromRow, fromCol, toRow, toCol) => {
    return Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1;
  };

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = board.map(row => [...row]);
    const capturedPiece = newBoard[toRow][toCol];
    
    if (capturedPiece) {
      // Add points for captured piece
      const points = pieceValues[capturedPiece] || 0;
      setScore(prev => prev + points);
      updateScore(points);
    }

    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = '';
    setBoard(newBoard);

    // Check for game end conditions
    checkGameStatus(newBoard);
  };

  const makeAIMove = () => {
    if (gameStatus !== 'playing' || currentPlayer === 'white') return;

    // Simple AI: random valid move
    const possibleMoves = [];
    
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && isOwnPiece(piece, 'black')) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                possibleMoves.push({ fromRow, fromCol, toRow, toCol });
              }
            }
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      movePiece(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol);
      setCurrentPlayer('white');
    }
  };

  const checkGameStatus = (board) => {
    // Check for checkmate or stalemate (simplified)
    let whiteKing = false;
    let blackKing = false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 'K') whiteKing = true;
        if (board[row][col] === 'k') blackKing = true;
      }
    }

    if (!whiteKing) {
      setGameStatus('black_wins');
      endGameLogic(false);
    } else if (!blackKing) {
      setGameStatus('white_wins');
      endGameLogic(true);
    }
  };

  const handleTimeOut = () => {
    setGameStatus('timeout');
    endGameLogic(false);
  };

  const endGameLogic = async (won) => {
    const points = won ? calculatePoints() : 0;
    await endGame(score + points, won);
    setTimeout(() => onGameEnd(), 3000);
  };

  const calculatePoints = () => {
    const basePoints = {
      easy: 50,
      medium: 100,
      hard: 150,
      extreme: 200
    };
    return basePoints[difficulty];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPieceSymbol = (piece) => {
    const symbols = {
      'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
      'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
      '': ''
    };
    return symbols[piece] || '';
  };

  if (gameStatus !== 'playing') {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">
          {gameStatus === 'white_wins' ? 'Checkmate! You Win! 🎉' :
           gameStatus === 'black_wins' ? 'Checkmate! AI Wins! 🤖' :
           'Time\'s Up! ⏰'}
        </h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-warning mb-4">
          <Star size={32} className="text-warning" fill="currentColor" />
          <span>{score} Points</span>
        </div>
        <button 
          onClick={initializeGame}
          className="btn btn-primary"
        >
          <RefreshCw size={16} className="mr-2" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Timer size={20} />
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star size={20} className="text-warning" />
          <span className="font-semibold">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Crown size={20} />
          <span className="font-semibold capitalize">{currentPlayer}'s turn</span>
        </div>
      </div>

      {/* Chess Board */}
      <div className="mx-auto mb-6" style={{ maxWidth: '500px' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((piece, colIndex) => {
              const isSelected = selectedPiece && 
                selectedPiece.row === rowIndex && 
                selectedPiece.col === colIndex;
              const isLight = (rowIndex + colIndex) % 2 === 0;
              
              return (
                <div
                  key={colIndex}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`
                    w-12 h-12 flex items-center justify-center cursor-pointer
                    ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    hover:bg-amber-200
                  `}
                >
                  <span className="text-2xl">
                    {getPieceSymbol(piece)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game Info */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center gap-2 justify-center">
          <Sword size={16} />
          Chess Game - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </h3>
        <p className="text-sm text-muted">
          Capture pieces to earn points. Checkmate the king to win the game!
        </p>
      </div>
    </div>
  );
};

export default Chess;