import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks';
import { Timer, Star, RefreshCw, CheckCircle, Edit } from 'lucide-react';

const Sudoku = ({ difficulty, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const { endGame, updateScore } = useGame();

  const timeLimits = {
    easy: 600,
    medium: 450,
    hard: 300,
    extreme: 180
  };

  const difficulties = {
    easy: 35, // cells to remove
    medium: 45,
    hard: 52,
    extreme: 58
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      endGameLogic(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const initializeGame = () => {
    const newGrid = generateSudoku();
    setGrid(newGrid);
    setSolution(generateSolution([...newGrid]));
    setSelectedCell(null);
    setTimeLeft(timeLimits[difficulty]);
    setScore(0);
    setGameOver(false);
    setMistakes(0);
  };

  const generateSudoku = () => {
    // Create a solved Sudoku puzzle
    const solved = generateSolution(Array(9).fill().map(() => Array(9).fill(0)));
    
    // Remove numbers based on difficulty
    const puzzle = solved.map(row => [...row]);
    const cellsToRemove = difficulties[difficulty];
    
    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
      } else {
        i--; // Try again if cell is already empty
      }
    }
    
    return puzzle;
  };

  const generateSolution = (board) => {
    // Backtracking algorithm to generate a solved Sudoku
    const findEmpty = (board) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) return [i, j];
        }
      }
      return null;
    };

    const isValid = (board, num, pos) => {
      // Check row
      for (let i = 0; i < 9; i++) {
        if (board[pos[0]][i] === num && i !== pos[1]) return false;
      }

      // Check column
      for (let i = 0; i < 9; i++) {
        if (board[i][pos[1]] === num && i !== pos[0]) return false;
      }

      // Check 3x3 box
      const boxX = Math.floor(pos[1] / 3);
      const boxY = Math.floor(pos[0] / 3);

      for (let i = boxY * 3; i < boxY * 3 + 3; i++) {
        for (let j = boxX * 3; j < boxX * 3 + 3; j++) {
          if (board[i][j] === num && i !== pos[0] && j !== pos[1]) return false;
        }
      }

      return true;
    };

    const solve = () => {
      const empty = findEmpty(board);
      if (!empty) return true;

      const [row, col] = empty;

      for (let i = 1; i <= 9; i++) {
        if (isValid(board, i, [row, col])) {
          board[row][col] = i;

          if (solve()) return true;

          board[row][col] = 0;
        }
      }

      return false;
    };

    solve();
    return board;
  };

  const handleCellClick = (row, col) => {
    if (gameOver || grid[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    if (!selectedCell || gameOver) return;

    const { row, col } = selectedCell;
    const newGrid = grid.map(r => [...r]);
    
    if (solution[row][col] === number) {
      newGrid[row][col] = number;
      setGrid(newGrid);
      
      const pointsEarned = calculatePoints();
      setScore(prev => prev + pointsEarned);
      updateScore(pointsEarned);

      // Check if puzzle is complete
      if (isPuzzleComplete(newGrid)) {
        endGameLogic(true);
      }
    } else {
      // Wrong number
      setMistakes(prev => prev + 1);
      if (mistakes >= 2) { // Allow 3 mistakes max
        endGameLogic(false);
      }
    }
  };

  const isPuzzleComplete = (currentGrid) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentGrid[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  const calculatePoints = () => {
    const basePoints = {
      easy: 10,
      medium: 20,
      hard: 30,
      extreme: 50
    };
    
    const timeBonus = Math.max(0, Math.floor(timeLeft / 30));
    return basePoints[difficulty] + timeBonus;
  };

  const endGameLogic = async (won) => {
    setGameOver(true);
    const points = won ? calculatePoints() : 0;
    await endGame(score + points, won);
    setTimeout(() => onGameEnd(), 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameOver) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">
          {isPuzzleComplete(grid) ? 'Puzzle Complete! 🎉' : 'Game Over!'}
        </h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-warning mb-4">
          <Star size={32} className="text-warning" fill="currentColor" />
          <span>{score} Points</span>
        </div>
        <p className="text-muted mb-6">
          {mistakes} mistake{mistakes !== 1 ? 's' : ''}
        </p>
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
          <span className="font-semibold">Mistakes: {mistakes}/3</span>
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="mx-auto mb-6" style={{ maxWidth: '400px' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell && 
                selectedCell.row === rowIndex && 
                selectedCell.col === colIndex;
              const isFixed = grid[rowIndex][colIndex] !== 0;
              const boxTop = rowIndex % 3 === 0;
              const boxLeft = colIndex % 3 === 0;
              
              return (
                <div
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    w-10 h-10 flex items-center justify-center border border-gray-300
                    ${boxTop ? 'border-t-2 border-t-gray-500' : ''}
                    ${boxLeft ? 'border-l-2 border-l-gray-500' : ''}
                    ${rowIndex === 8 ? 'border-b-2 border-b-gray-500' : ''}
                    ${colIndex === 8 ? 'border-r-2 border-r-gray-500' : ''}
                    ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                    ${isFixed ? 'font-bold bg-gray-100' : 'cursor-pointer hover:bg-gray-50'}
                  `}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Number Pad */}
      <div className="grid grid-3 gap-2 max-w-xs mx-auto mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-12 h-12 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary-dark"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Game Info */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center gap-2 justify-center">
          <Edit size={16} />
          Sudoku - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </h3>
        <p className="text-sm text-muted">
          Fill the grid so that every row, column, and 3x3 box contains all digits from 1 to 9.
        </p>
      </div>
    </div>
  );
};

export default Sudoku;