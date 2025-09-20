import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../hooks';
import { Timer, RefreshCw, Target, Star } from 'lucide-react';

const NumberGrid = ({ difficulty, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [matchedNumbers, setMatchedNumbers] = useState([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { endGame, updateScore } = useGame();

  const gridSizes = {
    easy: 4,
    medium: 6,
    hard: 8,
    extreme: 10
  };

  const timeLimits = {
    easy: 120,
    medium: 90,
    hard: 60,
    extreme: 45
  };

  const numberRanges = {
    easy: 20,
    medium: 30,
    hard: 40,
    extreme: 50
  };

  const initializeGame = useCallback(() => {
    const size = gridSizes[difficulty];
    const totalCells = size * size;
    const range = numberRanges[difficulty];
    
    // Generate numbers
    const numbers = [];
    for (let i = 0; i < totalCells / 2; i++) {
      const num = Math.floor(Math.random() * range) + 1;
      numbers.push(num, num); // Add pairs
    }
    
    // Shuffle numbers
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    setGrid(numbers);
    setSelectedNumbers([]);
    setMatchedNumbers([]);
    setTargetNumber(Math.floor(Math.random() * range) + 1);
    setTimeLeft(timeLimits[difficulty]);
    setScore(0);
    setGameOver(false);
  }, [difficulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      endGameLogic();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const handleNumberClick = (index) => {
    if (gameOver || selectedNumbers.includes(index) || matchedNumbers.includes(index)) return;

    const newSelected = [...selectedNumbers, index];
    setSelectedNumbers(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (grid[first] === grid[second]) {
        // Match found
        setMatchedNumbers(prev => [...prev, first, second]);
        const pointsEarned = calculatePoints();
        setScore(prev => prev + pointsEarned);
        updateScore(pointsEarned);
        
        // Check if all matches found
        if (matchedNumbers.length + 2 === grid.length) {
          setTimeout(endGameLogic, 500);
        }
      }
      setTimeout(() => setSelectedNumbers([]), 500);
    }
  };

  const calculatePoints = () => {
    const basePoints = {
      easy: 5,
      medium: 10,
      hard: 15,
      extreme: 20
    };
    
    const timeBonus = Math.max(0, Math.floor(timeLeft / 10));
    return basePoints[difficulty] + timeBonus;
  };

  const endGameLogic = async () => {
    setGameOver(true);
    const finalScore = matchedNumbers.length / 2;
    const completed = matchedNumbers.length === grid.length;
    
    const result = await endGame(finalScore, completed);
    setTimeout(() => onGameEnd(), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameOver) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="text-lg mb-2">Final Score: {score}</p>
        <p className="text-muted mb-4">
          Matched {matchedNumbers.length / 2} pairs
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
          <Target size={20} />
          <span className="font-semibold">Find: {targetNumber}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star size={20} className="text-warning" />
          <span className="font-semibold">{score}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="grid gap-2 mx-auto mb-6"
        style={{ 
          gridTemplateColumns: `repeat(${gridSizes[difficulty]}, 1fr)`,
          maxWidth: '500px'
        }}
      >
        {grid.map((number, index) => {
          const isSelected = selectedNumbers.includes(index);
          const isMatched = matchedNumbers.includes(index);
          const isTarget = number === targetNumber;
          
          return (
            <button
              key={index}
              onClick={() => handleNumberClick(index)}
              disabled={isMatched || gameOver}
              className={`
                aspect-square rounded-lg text-lg font-bold transition-all duration-200
                ${isMatched ? 'bg-success text-white' : 
                  isSelected ? 'bg-primary text-white' : 
                  isTarget ? 'bg-accent text-white' : 
                  'bg-secondary text-primary'}
                ${isTarget ? 'animate-pulse' : ''}
                hover:transform hover:scale-105
              `}
            >
              {isSelected || isMatched ? number : '?'}
            </button>
          );
        })}
      </div>

      {/* Game Controls */}
      <div className="flex gap-4 justify-center">
        <button 
          onClick={initializeGame}
          className="btn btn-secondary"
        >
          <RefreshCw size={16} className="mr-2" />
          Restart
        </button>
        
        <button 
          onClick={endGameLogic}
          className="btn btn-danger"
        >
          End Game
        </button>
      </div>
    </div>
  );
};

export default NumberGrid;