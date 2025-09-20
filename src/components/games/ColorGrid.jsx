import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../hooks';
import { Timer, RefreshCw, Palette, Star } from 'lucide-react';

const ColorGrid = ({ difficulty, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [matchedColors, setMatchedColors] = useState([]);
  const [targetColor, setTargetColor] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { endGame, updateScore } = useGame();

  const gridSizes = {
    easy: 3,
    medium: 4,
    hard: 5,
    extreme: 6
  };

  const timeLimits = {
    easy: 90,
    medium: 60,
    hard: 45,
    extreme: 30
  };

  const colorPalettes = {
    easy: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A826', '#6C5CE7', '#FD79A8'],
    medium: ['#E84393', '#0984E3', '#00B894', '#FDCB6E', '#636E72', '#D63031'],
    hard: ['#4834D4', '#130F40', '#EB4D4B', '#6AB04C', '#F0932B', '#686DE0'],
    extreme: ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C']
  };

  const initializeGame = useCallback(() => {
    const size = gridSizes[difficulty];
    const totalCells = size * size;
    const palette = colorPalettes[difficulty];
    const colorsNeeded = Math.floor(totalCells / 2);
    
    // Select colors for this game
    const gameColors = [];
    for (let i = 0; i < colorsNeeded; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      gameColors.push(color, color); // Add pairs
    }
    
    // Fill remaining cells with unique colors if needed
    while (gameColors.length < totalCells) {
      const uniqueColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      if (!gameColors.includes(uniqueColor)) {
        gameColors.push(uniqueColor);
      }
    }
    
    // Shuffle colors
    for (let i = gameColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameColors[i], gameColors[j]] = [gameColors[j], gameColors[i]];
    }
    
    setGrid(gameColors);
    setSelectedColors([]);
    setMatchedColors([]);
    setTargetColor(palette[Math.floor(Math.random() * palette.length)]);
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

  const handleColorClick = (index) => {
    if (gameOver || selectedColors.includes(index) || matchedColors.includes(index)) return;

    const newSelected = [...selectedColors, index];
    setSelectedColors(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (grid[first] === grid[second]) {
        // Match found
        setMatchedColors(prev => [...prev, first, second]);
        const pointsEarned = calculatePoints();
        setScore(prev => prev + pointsEarned);
        updateScore(pointsEarned);
        
        // Check if all matches found
        if (matchedColors.length + 2 === grid.length) {
          setTimeout(endGameLogic, 500);
        }
      }
      setTimeout(() => setSelectedColors([]), 1000);
    }
  };

  const calculatePoints = () => {
    const basePoints = {
      easy: 8,
      medium: 15,
      hard: 25,
      extreme: 40
    };
    
    const timeBonus = Math.max(0, Math.floor(timeLeft / 5));
    return basePoints[difficulty] + timeBonus;
  };

  const endGameLogic = async () => {
    setGameOver(true);
    const finalScore = matchedColors.length / 2;
    const completed = matchedColors.length === grid.length;
    
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
          Matched {matchedColors.length / 2} color pairs
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
          <Palette size={20} />
          <span 
            className="font-semibold inline-block w-4 h-4 rounded-full"
            style={{ backgroundColor: targetColor }}
          ></span>
          <span>Find this color</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star size={20} className="text-warning" />
          <span className="font-semibold">{score}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="grid gap-3 mx-auto mb-6"
        style={{ 
          gridTemplateColumns: `repeat(${gridSizes[difficulty]}, 1fr)`,
          maxWidth: '500px'
        }}
      >
        {grid.map((color, index) => {
          const isSelected = selectedColors.includes(index);
          const isMatched = matchedColors.includes(index);
          const isTarget = color === targetColor;
          
          return (
            <button
              key={index}
              onClick={() => handleColorClick(index)}
              disabled={isMatched || gameOver}
              className={`
                aspect-square rounded-lg transition-all duration-300
                ${isMatched ? 'ring-4 ring-success ring-offset-2' : 
                  isSelected ? 'ring-4 ring-primary ring-offset-2' : 
                  isTarget ? 'ring-4 ring-accent ring-offset-2 animate-pulse' : 
                  'hover:scale-105'}
              `}
              style={{ 
                backgroundColor: isSelected || isMatched ? color : '#374151',
                cursor: isMatched ? 'not-allowed' : 'pointer'
              }}
              title={isSelected || isMatched ? color : 'Hidden color'}
            >
              {isSelected || isMatched ? '' : '?'}
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

      {/* Instructions */}
      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted">
          Find matching color pairs. Click on two tiles to reveal their colors. 
          If they match, they'll stay revealed. Find all pairs before time runs out!
        </p>
      </div>
    </div>
  );
};

export default ColorGrid;