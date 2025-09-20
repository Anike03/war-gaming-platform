import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks';
import { Timer, Star, HelpCircle, CheckCircle, Type } from 'lucide-react';

const Crossword = ({ difficulty, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [clues, setClues] = useState({ across: [], down: [] });
  const [userInput, setUserInput] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { endGame, updateScore } = useGame();

  const timeLimits = {
    easy: 600,
    medium: 450,
    hard: 300,
    extreme: 240
  };

  const crosswordData = {
    easy: {
      grid: [
        [1, 2, 3, 4, 0, 5],
        [0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 7, 0],
        [0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 9, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      across: [
        { number: 1, clue: "Capital of France", answer: "PARIS", row: 0, col: 0 },
        { number: 4, clue: "Large feline", answer: "TIGER", row: 0, col: 3 },
        { number: 5, clue: "Planet we live on", answer: "EARTH", row: 0, col: 5 },
        { number: 6, clue: "Sweet substance from bees", answer: "HONEY", row: 2, col: 0 },
        { number: 7, clue: "Opposite of day", answer: "NIGHT", row: 2, col: 4 },
        { number: 8, clue: "Frozen water", answer: "ICE", row: 4, col: 0 },
        { number: 9, clue: "King of the jungle", answer: "LION", row: 4, col: 4 }
      ],
      down: [
        { number: 1, clue: "Programming language", answer: "PYTHON", row: 0, col: 0 },
        { number: 2, clue: "Musical instrument with strings", answer: "VIOLIN", row: 0, col: 1 },
        { number: 3, clue: "Color of the sky", answer: "BLUE", row: 0, col: 2 },
        { number: 4, clue: "Season after summer", answer: "FALL", row: 0, col: 3 },
        { number: 5, clue: "Largest ocean", answer: "PACIFIC", row: 0, col: 5 },
        { number: 7, clue: "Opposite of yes", answer: "NO", row: 2, col: 4 },
        { number: 9, clue: "12-month period", answer: "YEAR", row: 4, col: 4 }
      ]
    },
    medium: {
      grid: [
        [1, 2, 3, 4, 0, 5, 6],
        [0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 8, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 10, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [11, 0, 0, 0, 12, 0, 0]
      ],
      across: [
        { number: 1, clue: "Capital of Italy", answer: "ROME", row: 0, col: 0 },
        { number: 4, clue: "Chemical symbol for gold", answer: "AU", row: 0, col: 3 },
        { number: 5, clue: "Largest planet", answer: "JUPITER", row: 0, col: 5 },
        { number: 6, clue: "Author of Hamlet", answer: "SHAKESPEARE", row: 0, col: 6 },
        { number: 7, clue: "Unit of electrical resistance", answer: "OHM", row: 2, col: 0 },
        { number: 8, clue: "Capital of Japan", answer: "TOKYO", row: 2, col: 4 },
        { number: 9, clue: "Smallest prime number", answer: "TWO", row: 4, col: 0 },
        { number: 10, clue: "Largest mammal", answer: "WHALE", row: 4, col: 4 },
        { number: 11, clue: "Chemical symbol for iron", answer: "FE", row: 6, col: 0 },
        { number: 12, clue: "Capital of Egypt", answer: "CAIRO", row: 6, col: 4 }
      ],
      down: [
        { number: 1, clue: "Red planet", answer: "MARS", row: 0, col: 0 },
        { number: 2, clue: "Programming language created by Google", answer: "GO", row: 0, col: 1 },
        { number: 3, clue: "Unit of frequency", answer: "HERTZ", row: 0, col: 2 },
        { number: 4, clue: "Chemical symbol for silver", answer: "AG", row: 0, col: 3 },
        { number: 5, clue: "Largest bone in human body", answer: "FEMUR", row: 0, col: 5 },
        { number: 6, clue: "Author of 1984", answer: "ORWELL", row: 0, col: 6 },
        { number: 8, clue: "Chemical symbol for oxygen", answer: "O", row: 2, col: 4 },
        { number: 10, clue: "Capital of Australia", answer: "CANBERRA", row: 4, col: 4 },
        { number: 12, clue: "Chemical symbol for carbon", answer: "C", row: 6, col: 4 }
      ]
    }
  };

  useEffect(() => {
    const data = crosswordData[difficulty] || crosswordData.easy;
    setGrid(data.grid);
    setClues(data);
    
    // Initialize user input grid
    const initialInput = data.grid.map(row => row.map(cell => cell === 0 ? null : ''));
    setUserInput(initialInput);
    
    setTimeLeft(timeLimits[difficulty] || timeLimits.easy);
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      handleGameEnd(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const handleCellClick = (row, col) => {
    if (grid[row][col] === 0) return;
    setSelectedCell({ row, col });
  };

  const handleInput = (e) => {
    if (!selectedCell || gameOver) return;

    const { row, col } = selectedCell;
    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE') {
      const newInput = [...userInput];
      newInput[row][col] = '';
      setUserInput(newInput);
      
      // Move to previous cell
      if (col > 0 && grid[row][col - 1] !== 0) {
        setSelectedCell({ row, col: col - 1 });
      }
      return;
    }

    if (!/^[A-Z]$/.test(key)) return;

    const newInput = [...userInput];
    newInput[row][col] = key;
    setUserInput(newInput);

    // Auto-move to next cell
    const nextCol = col + 1;
    if (nextCol < grid[0].length && grid[row][nextCol] !== 0) {
      setSelectedCell({ row, col: nextCol });
    }

    checkCompletion();
  };

  const checkCompletion = () => {
    let allCorrect = true;
    
    clues.across.forEach(clue => {
      const word = getUserInputForClue(clue);
      if (word !== clue.answer) {
        allCorrect = false;
      }
    });

    clues.down.forEach(clue => {
      const word = getUserInputForClue(clue);
      if (word !== clue.answer) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      handleGameEnd(true);
    }
  };

  const getUserInputForClue = (clue) => {
    const { row, col, answer } = clue;
    let word = '';
    
    // Determine direction (across or down)
    const isAcross = answer.length <= (grid[0].length - col);
    
    for (let i = 0; i < answer.length; i++) {
      const currentRow = isAcross ? row : row + i;
      const currentCol = isAcross ? col + i : col;
      
      if (currentRow >= grid.length || currentCol >= grid[0].length) break;
      
      word += userInput[currentRow][currentCol] || '';
    }
    
    return word;
  };

  const handleGameEnd = (isWin) => {
    setGameOver(true);
    const finalScore = isWin ? calculateScore() : 0;
    setScore(finalScore);
    updateScore(finalScore);
    onGameEnd?.(isWin, finalScore);
  };

  const calculateScore = () => {
    const baseScore = 1000;
    const timeBonus = Math.floor(timeLeft * 2);
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      extreme: 3
    }[difficulty] || 1;
    
    return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellClass = (row, col) => {
    const classes = ['crossword-cell'];
    
    if (grid[row][col] === 0) {
      classes.push('black');
    } else {
      classes.push('white');
    }
    
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      classes.push('selected');
    }
    
    return classes.join(' ');
  };

  const revealAnswer = () => {
    const revealedInput = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === 0) return null;
        
        // Find the correct letter for this cell
        for (const clue of [...clues.across, ...clues.down]) {
          const { row: clueRow, col: clueCol, answer } = clue;
          
          // Check across words
          if (rowIndex === clueRow && colIndex >= clueCol && colIndex < clueCol + answer.length) {
            return answer[colIndex - clueCol];
          }
          
          // Check down words
          if (colIndex === clueCol && rowIndex >= clueRow && rowIndex < clueRow + answer.length) {
            return answer[rowIndex - clueRow];
          }
        }
        
        return '';
      })
    );
    
    setUserInput(revealedInput);
    handleGameEnd(false);
  };

  if (grid.length === 0) {
    return <div className="crossword-loading">Loading crossword...</div>;
  }

  return (
    <div className="crossword-container" onKeyDown={handleInput} tabIndex={0}>
      <div className="crossword-header">
        <div className="timer">
          <Timer size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="score">
          <Star size={20} />
          <span>{score}</span>
        </div>
        <button className="hint-btn" onClick={revealAnswer} disabled={gameOver}>
          <HelpCircle size={20} />
          Reveal Answer
        </button>
      </div>

      <div className="crossword-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="crossword-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 && (
                  <>
                    <div className="cell-number">{cell}</div>
                    <div className="cell-input">
                      {userInput[rowIndex][colIndex]}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="clues-section">
        <div className="clues-column">
          <h3><Type size={18} /> Across</h3>
          {clues.across.map((clue, index) => (
            <div key={index} className="clue-item">
              <span className="clue-number">{clue.number}.</span>
              <span className="clue-text">{clue.clue}</span>
            </div>
          ))}
        </div>
        
        <div className="clues-column">
          <h3><Type size={18} /> Down</h3>
          {clues.down.map((clue, index) => (
            <div key={index} className="clue-item">
              <span className="clue-number">{clue.number}.</span>
              <span className="clue-text">{clue.clue}</span>
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <CheckCircle size={48} className="success-icon" />
            <h2>Game {score > 0 ? 'Completed!' : 'Over'}</h2>
            <p>Final Score: {score}</p>
            <button onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crossword;