// src/components/games/ColorGrid.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, RefreshCw, Target, Star, Zap, Trophy, RotateCcw, Home } from 'lucide-react';
import './ColorGrid.css';

const DIFFICULTY_CONFIG = {
  easy: {
    gridSize: 4, // 4x4 = 16 cards = 8 pairs
    timeLimit: 120,
    colorsCount: 8,
    pointsMultiplier: 1
  },
  medium: {
    gridSize: 5, // 5x5 = 25 cards = 12 pairs (one extra card)
    timeLimit: 150,
    colorsCount: 12,
    pointsMultiplier: 1.2
  },
  hard: {
    gridSize: 6, // 6x6 = 36 cards = 18 pairs (closest to 16)
    timeLimit: 180,
    colorsCount: 16,
    pointsMultiplier: 1.5
  },
  extreme: {
    gridSize: 8, // 8x8 = 64 cards = 32 pairs
    timeLimit: 300,
    colorsCount: 32,
    pointsMultiplier: 2
  }
};

const ColorGrid = ({ difficulty = 'easy', onGameEnd, onExit }) => {
  const [gameState, setGameState] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  
  const submittedRef = useRef(false);

  // Game end handler
  const handleGameEnd = useCallback((completed) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const finalScore = gameState?.score || 0;
    const pointsEarned = completed ? finalScore : Math.max(10, Math.floor(finalScore * 0.5));
    
    const payload = {
      completed,
      score: finalScore,
      pointsEarned: pointsEarned,
      duration: gameState ? (gameState.timeLimit - gameState.timeRemaining) : 0,
      meta: {
        bestStreak: gameState?.bestStreak || 0,
        matches: gameState ? (gameState.matchedCells.length / 2) : 0,
        totalPairs: gameState ? Math.floor(gameState.grid.length / 2) : 0,
        moves: gameState?.moves || 0,
        accuracy: gameState ? Math.round(gameState.accuracy * 100) : 0
      }
    };

    // Store results for display
    setGameResults({
      completed,
      score: finalScore,
      pointsEarned,
      bestStreak: gameState?.bestStreak || 0,
      matches: gameState ? Math.floor(gameState.matchedCells.length / 2) : 0,
      totalPairs: gameState ? Math.floor(gameState.grid.length / 2) : 0,
      moves: gameState?.moves || 0,
      accuracy: gameState ? Math.round(gameState.accuracy * 100) : 0,
      timeUsed: gameState ? (gameState.timeLimit - gameState.timeRemaining) : 0
    });

    // Call the parent game end handler
    if (onGameEnd) {
      onGameEnd(payload);
    }
    
    setGameCompleted(true);
  }, [gameState, onGameEnd]);

  // Generate random colors
  const generateColors = useCallback((count) => {
    const colors = [];
    const hueStep = 360 / count;
    
    for (let i = 0; i < count; i++) {
      const hue = (i * hueStep) % 360;
      const saturation = 70 + Math.random() * 25;
      const lightness = 45 + Math.random() * 25;
      
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }
    
    return colors;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const colors = generateColors(config.colorsCount);
    
    // Calculate exact number of pairs needed
    const totalCells = config.gridSize * config.gridSize;
    const totalPairs = Math.floor(totalCells / 2);
    
    // Create exactly the required number of pairs
    const colorPairs = [];
    let colorIndex = 0;
    
    for (let i = 0; i < totalPairs; i++) {
      const color = colors[colorIndex % colors.length];
      colorPairs.push(color);
      colorPairs.push(color);
      colorIndex++;
    }

    // If odd number of cells (like 5x5=25), add one extra random color
    if (totalCells % 2 === 1) {
      const extraColor = colors[Math.floor(Math.random() * colors.length)];
      colorPairs.push(extraColor);
    }

    // Shuffle pairs
    for (let i = colorPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorPairs[i], colorPairs[j]] = [colorPairs[j], colorPairs[i]];
    }

    // Create grid cells
    const grid = [];
    
    for (let i = 0; i < totalCells; i++) {
      grid.push({
        color: colorPairs[i],
        index: i,
        isMatched: false,
        isSelected: false,
        isRevealed: false
      });
    }

    // Find a color that has at least 2 occurrences for target
    const colorCounts = {};
    colorPairs.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });

    let targetColor = grid[0].color;
    for (const [color, count] of Object.entries(colorCounts)) {
      if (count >= 2) {
        targetColor = color;
        break;
      }
    }

    const newGameState = {
      grid,
      targetColor,
      selectedCells: [],
      matchedCells: [],
      score: 0,
      streak: 0,
      bestStreak: 0,
      moves: 0,
      accuracy: 1,
      timeRemaining: config.timeLimit,
      timeLimit: config.timeLimit,
      gridSize: config.gridSize
    };

    setGameState(newGameState);
    setGameCompleted(false);
    setGameResults(null);
    submittedRef.current = false;
  }, [difficulty, generateColors]);

  // Handle cell click
  const handleCellClick = useCallback((index) => {
    if (!gameState || gameCompleted) return;

    const cell = gameState.grid[index];
    
    // Don't allow clicking on matched, selected, or already revealed cells
    if (cell.isMatched || cell.isSelected || gameState.selectedCells.length >= 2) {
      return;
    }

    // Reveal the cell
    const newGrid = gameState.grid.map((c, i) => 
      i === index ? { ...c, isRevealed: true, isSelected: true } : c
    );

    const newSelectedCells = [...gameState.selectedCells, index];
    const newMoves = gameState.moves + 1;

    let newGameState = {
      ...gameState,
      grid: newGrid,
      selectedCells: newSelectedCells,
      moves: newMoves
    };

    // Check for match when two cells are selected
    if (newSelectedCells.length === 2) {
      const [firstIndex, secondIndex] = newSelectedCells;
      const firstColor = gameState.grid[firstIndex].color;
      const secondColor = gameState.grid[secondIndex].color;
      
      const isMatch = firstColor === secondColor && firstColor === gameState.targetColor;
      
      if (isMatch) {
        // Successful match
        const newMatchedCells = [...gameState.matchedCells, firstIndex, secondIndex];
        const newStreak = gameState.streak + 1;
        const newBestStreak = Math.max(gameState.bestStreak, newStreak);
        
        const basePoints = 100 * DIFFICULTY_CONFIG[difficulty].pointsMultiplier;
        const streakBonus = newStreak * 25;
        const timeBonus = Math.floor((gameState.timeRemaining / gameState.timeLimit) * 50);
        
        const newScore = gameState.score + basePoints + streakBonus + timeBonus;
        
        // Mark cells as matched
        const updatedGrid = newGrid.map((cell, idx) => 
          newMatchedCells.includes(idx) ? { ...cell, isMatched: true } : cell
        );
        
        newGameState = {
          ...newGameState,
          grid: updatedGrid,
          matchedCells: newMatchedCells,
          streak: newStreak,
          bestStreak: newBestStreak,
          score: newScore,
          selectedCells: []
        };
        
        // Find next target color that has at least one unmatched pair
        const unmatchedCells = newGameState.grid.filter(cell => !newMatchedCells.includes(cell.index));
        if (unmatchedCells.length > 0) {
          const unmatchedColorCounts = {};
          unmatchedCells.forEach(cell => {
            unmatchedColorCounts[cell.color] = (unmatchedColorCounts[cell.color] || 0) + 1;
          });

          // Find a color with at least 2 unmatched occurrences
          let nextTargetColor = null;
          for (const [color, count] of Object.entries(unmatchedColorCounts)) {
            if (count >= 2) {
              nextTargetColor = color;
              break;
            }
          }

          if (nextTargetColor) {
            newGameState.targetColor = nextTargetColor;
          }
        }
        
        // Update accuracy
        newGameState.accuracy = newMatchedCells.length / (newMoves * 0.5);
        
        // Check if game is completed
        if (newMatchedCells.length === newGameState.grid.length) {
          setTimeout(() => {
            handleGameEnd(true);
          }, 500);
        }
      } else {
        // Failed match
        newGameState = {
          ...newGameState,
          streak: 0
        };
        
        // Update accuracy
        newGameState.accuracy = gameState.matchedCells.length / (newMoves * 0.5);
        
        // Hide cells after delay
        setTimeout(() => {
          setGameState(prev => {
            if (!prev) return prev;
            
            const updatedState = {
              ...prev,
              grid: prev.grid.map((cell, idx) => 
                newSelectedCells.includes(idx) && !prev.matchedCells.includes(idx) 
                  ? { ...cell, isRevealed: false, isSelected: false }
                  : cell
              ),
              selectedCells: []
            };
            
            return updatedState;
          });
        }, 1000);
      }
    }
    
    setGameState(newGameState);
  }, [gameState, gameCompleted, difficulty, handleGameEnd]);

  // Auto-completion check
  useEffect(() => {
    if (gameState && !gameCompleted && !submittedRef.current) {
      const allMatched = gameState.matchedCells.length === gameState.grid.length;
      if (allMatched) {
        setTimeout(() => {
          handleGameEnd(true);
        }, 500);
      }
    }
  }, [gameState, gameCompleted, handleGameEnd]);

  // Game timer
  useEffect(() => {
    if (!gameState || gameCompleted) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;
        
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
        
        if (newTimeRemaining <= 0 && !submittedRef.current) {
          handleGameEnd(false);
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, gameCompleted, handleGameEnd]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const resetGame = () => {
    initializeGame();
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state
  if (!gameState) {
    return (
      <div className="cg-shell">
        <div className="card cg-loading">
          <div className="loading-spinner">Loading Game...</div>
        </div>
      </div>
    );
  }

  // Show results screen when game is completed
  if (gameCompleted && gameResults) {
    return (
      <div className="cg-shell">
        <div className="card cg-results">
          <div className="cg-results-header">
            <Trophy size={48} className="cg-trophy" />
            <h1 className="cg-results-title">Game Completed!</h1>
            <p className="cg-results-subtitle">
              {gameResults.completed ? '🎉 Congratulations! You matched all pairs!' : '⏰ Time ran out! Better luck next time!'}
            </p>
          </div>

          <div className="cg-results-stats">
            <div className="cg-results-stat main-stat">
              <span className="label">Final Score</span>
              <span className="value">{gameResults.score}</span>
            </div>
            
            <div className="cg-results-grid">
              <div className="cg-results-stat">
                <span className="label">Best Streak</span>
                <span className="value">{gameResults.bestStreak}</span>
              </div>
              
              <div className="cg-results-stat">
                <span className="label">Pairs Matched</span>
                <span className="value">{gameResults.matches}/{gameResults.totalPairs}</span>
              </div>
              
              <div className="cg-results-stat">
                <span className="label">Total Moves</span>
                <span className="value">{gameResults.moves}</span>
              </div>
              
              <div className="cg-results-stat">
                <span className="label">Accuracy</span>
                <span className="value">{gameResults.accuracy}%</span>
              </div>
              
              <div className="cg-results-stat">
                <span className="label">Time Used</span>
                <span className="value">{formatTime(gameResults.timeUsed)}</span>
              </div>
              
              <div className="cg-results-stat highlight">
                <span className="label">Points Earned</span>
                <span className="value">+{gameResults.pointsEarned}</span>
              </div>
            </div>
          </div>

          <div className="cg-results-actions">
            <button className="btn btn-secondary" onClick={handleExit}>
              <Home size={18} />
              Back to Games
            </button>
            <button className="btn btn-primary" onClick={resetGame}>
              <RotateCcw size={18} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="cg-shell">
      {/* Header Stats */}
      <div className="cg-top">
        <div className="cg-pill">
          <span className="cg-dot" /> 
          Difficulty <strong>{difficulty}</strong>
        </div>
        <div className="cg-pill">
          <Timer size={14} />
          Time <strong>{formatTime(gameState.timeRemaining)}</strong>
        </div>
        <div className="cg-pill">
          <Star size={14} />
          Score <strong>{gameState.score}</strong>
        </div>
        <div className="cg-pill">
          <Zap size={14} />
          Streak <strong>{gameState.streak}</strong>
        </div>
      </div>

      {/* Target Color Display */}
      <div className="cg-target card">
        <div className="cg-target-header">
          <Target size={18} />
          <span>Find This Color</span>
        </div>
        <div className="cg-target-color" style={{ backgroundColor: gameState.targetColor }}>
          <div className="cg-target-glow" />
          {/* Removed the hex code display */}
        </div>
      </div>

      {/* Game Grid */}
      <div className="cg-grid-container card">
        <div 
          className="cg-grid"
          style={{ 
            gridTemplateColumns: `repeat(${gameState.gridSize}, 1fr)`
          }}
        >
          {gameState.grid.map((cell) => (
            <button
              key={cell.index}
              className={`cg-cell ${
                cell.isSelected ? 'selected' : ''
              } ${
                cell.isMatched ? 'matched' : ''
              }`}
              onClick={() => handleCellClick(cell.index)}
              disabled={cell.isMatched || gameState.selectedCells.length >= 2}
            >
              <div className="cg-cell-inner">
                {cell.isRevealed || cell.isMatched ? (
                  <div 
                    className="cg-cell-color"
                    style={{ backgroundColor: cell.color }}
                  />
                ) : (
                  <div className="cg-cell-hidden">
                    <div className="cg-cell-pattern" />
                    <span>?</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Game Stats */}
      <div className="cg-stats">
        <div>Moves: <strong>{gameState.moves}</strong></div>
        <div>Accuracy: <strong>{Math.round(gameState.accuracy * 100)}%</strong></div>
        <div>Pairs Left: <strong>{Math.floor((gameState.grid.length - gameState.matchedCells.length) / 2)}</strong></div>
      </div>

      {/* Game Controls */}
      <div className="cg-bottom">
        <button className="btn btn-secondary" onClick={resetGame}>
          <RefreshCw size={16} />
          Restart
        </button>
        <button className="btn btn-secondary" onClick={handleExit}>
          Exit Game
        </button>
      </div>
    </div>
  );
};

export default ColorGrid;