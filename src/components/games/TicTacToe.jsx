// src/components/games/TicTacToe.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Bot, Trophy, Home, RotateCcw, Pause, Play, Crown } from 'lucide-react';
import './tictactoe.css';

const TicTacToe = ({ difficulty = 'easy', onGameEnd, onExit }) => {
  const [gameMode, setGameMode] = useState(null); // '2player' or 'bot'
  const [players, setPlayers] = useState({ player1: '', player2: '' });
  const [gameState, setGameState] = useState(null);
  const [gameStatus, setGameStatus] = useState('setup'); // 'setup', 'playing', 'paused', 'roundEnd', 'gameEnd'
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [roundWinner, setRoundWinner] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [botThinking, setBotThinking] = useState(false);

  // Difficulty configurations - rounds and win rates
  const DIFFICULTY_CONFIG = {
    easy: { 
      totalRounds: 3,
      winRate: 0.2,      // 80% user wins
      smartMoves: 0.3
    },
    medium: { 
      totalRounds: 5,
      winRate: 0.4,      // 60% user wins
      smartMoves: 0.6
    },
    hard: { 
      totalRounds: 7,
      winRate: 0.6,      // 40% user wins
      smartMoves: 0.8
    },
    extreme: { 
      totalRounds: 10,
      winRate: 0.8,      // 20% user wins
      smartMoves: 0.95
    }
  };

  const config = DIFFICULTY_CONFIG[difficulty];
  const totalRounds = config.totalRounds;
  const pointsPerWin = 100;

  // Initialize game
  const initializeGame = useCallback(() => {
    const newGameState = {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      isDraw: false,
      moveCount: 0
    };
    
    setGameState(newGameState);
    setGameStatus('playing');
    setRoundWinner(null);
    setBotThinking(false);
  }, []);

  // Check for winner
  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], winningLine: lines[i] };
      }
    }

    if (board.every(cell => cell !== null)) {
      return { winner: null, winningLine: null, isDraw: true };
    }

    return null;
  };

  // Bot move logic
  const getBotMove = useCallback((board) => {
    // Sometimes make random moves based on difficulty
    if (Math.random() > config.smartMoves) {
      const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Try to win
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        if (checkWinner(newBoard)?.winner === 'O') {
          return i;
        }
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = 'X';
        if (checkWinner(newBoard)?.winner === 'X') {
          return i;
        }
      }
    }

    // Strategic moves - center first, then corners, then edges
    const center = 4;
    if (board[center] === null) return center;

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => board[index] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(index => board[index] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // Fallback to random
    const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [config]);

  // Handle bot move
  const handleBotMove = useCallback(() => {
    if (!gameState || gameState.currentPlayer !== 'O' || gameState.winner || gameState.isDraw) {
      return;
    }

    setBotThinking(true);
    
    // Add a small delay to make bot move feel natural
    setTimeout(() => {
      const botMoveIndex = getBotMove(gameState.board);
      if (botMoveIndex !== undefined && gameState.board[botMoveIndex] === null) {
        makeMove(botMoveIndex);
      }
      setBotThinking(false);
    }, 800);
  }, [gameState, getBotMove]);

  // Make a move (common function for both player and bot)
  const makeMove = useCallback((index) => {
    if (!gameState || gameStatus !== 'playing' || gameState.board[index] !== null || gameState.winner) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;
    
    const result = checkWinner(newBoard);
    const newMoveCount = gameState.moveCount + 1;

    let newGameState = {
      ...gameState,
      board: newBoard,
      moveCount: newMoveCount,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X'
    };

    if (result) {
      if (result.winner || result.isDraw) {
        newGameState = {
          ...newGameState,
          winner: result.winner,
          winningLine: result.winningLine,
          isDraw: result.isDraw
        };
        
        // Handle round end
        handleRoundEnd(result.winner, result.isDraw);
      }
    }

    setGameState(newGameState);
  }, [gameState, gameStatus]);

  // Handle cell click (player move)
  const handleCellClick = useCallback((index) => {
    if (botThinking) return;
    
    // In bot mode, only allow moves when it's player's turn
    if (gameMode === 'bot' && gameState.currentPlayer === 'O') {
      return;
    }

    makeMove(index);
  }, [gameMode, gameState, makeMove, botThinking]);

  // Handle round end
  const handleRoundEnd = useCallback((winner, isDraw) => {
    setGameStatus('roundEnd');
    
    let winnerName = '';
    if (isDraw) {
      setRoundWinner({ type: 'draw' });
    } else {
      if (gameMode === '2player') {
        winnerName = winner === 'X' ? players.player1 : players.player2;
      } else {
        winnerName = winner === 'X' ? players.player1 : 'Bot';
      }
      
      setRoundWinner({
        type: 'win',
        winner: winnerName,
        symbol: winner
      });

      // Update scores
      setScores(prev => ({
        ...prev,
        [winner === 'X' ? 'player1' : 'player2']: prev[winner === 'X' ? 'player1' : 'player2'] + pointsPerWin
      }));
    }

    // Check if game should end
    if (currentRound >= totalRounds) {
      setTimeout(() => {
        handleGameEnd();
      }, 2000);
    }
  }, [gameMode, players, currentRound, pointsPerWin, totalRounds]);

  // Handle game end
  const handleGameEnd = useCallback(() => {
    const finalWinner = scores.player1 > scores.player2 ? players.player1 : 
                       scores.player2 > scores.player1 ? (gameMode === '2player' ? players.player2 : 'Bot') : 
                       'Draw';
    
    const finalResults = {
      winner: finalWinner,
      scores,
      totalRounds,
      gameMode,
      player1: players.player1,
      player2: gameMode === '2player' ? players.player2 : 'Bot',
      difficulty: difficulty
    };

    setGameResults(finalResults);
    setGameStatus('gameEnd');

    // Send results to parent
    if (onGameEnd) {
      const payload = {
        completed: true,
        score: scores.player1 + scores.player2,
        pointsEarned: scores.player1, // Player 1's points
        duration: 0, // You can track this if needed
        meta: {
          winner: finalWinner,
          rounds: totalRounds,
          gameMode,
          difficulty
        }
      };
      onGameEnd(payload);
    }
  }, [scores, players, gameMode, totalRounds, difficulty, onGameEnd]);

  // Start next round
  const nextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      initializeGame();
    } else {
      handleGameEnd();
    }
  };

  // Play again (reset everything)
  const playAgain = () => {
    setScores({ player1: 0, player2: 0 });
    setCurrentRound(1);
    setGameResults(null);
    setGameStatus('setup');
  };

  // Toggle pause
  const togglePause = () => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // Start game with players
  const startGame = (mode, player1Name, player2Name = '') => {
    setGameMode(mode);
    setPlayers({
      player1: player1Name || 'Player 1',
      player2: mode === '2player' ? (player2Name || 'Player 2') : 'Bot'
    });
    setCurrentRound(1);
    setScores({ player1: 0, player2: 0 });
    initializeGame();
  };

  // Get current player name
  const getCurrentPlayerName = () => {
    if (gameMode === '2player') {
      return gameState.currentPlayer === 'X' ? players.player1 : players.player2;
    } else {
      return gameState.currentPlayer === 'X' ? players.player1 : 'Bot';
    }
  };

  // Effect to handle bot moves
  useEffect(() => {
    if (gameMode === 'bot' && gameStatus === 'playing' && gameState?.currentPlayer === 'O' && !botThinking) {
      handleBotMove();
    }
  }, [gameMode, gameStatus, gameState, botThinking, handleBotMove]);

  // Render setup screen
  const renderSetupScreen = () => (
    <div className="ttt-setup">
      <div className="ttt-setup-header">
        <Trophy size={48} className="ttt-icon" />
        <h1>Tic Tac Toe</h1>
        <p>Choose your game mode and enter player names</p>
      </div>

      <div className="ttt-mode-selection">
        <div className="ttt-mode-options">
          <button 
            className="ttt-mode-btn"
            onClick={() => setGameMode('2player')}
          >
            <Users size={24} />
            <span>Two Players</span>
            <small>Play with a friend</small>
          </button>
          
          <button 
            className="ttt-mode-btn"
            onClick={() => setGameMode('bot')}
          >
            <Bot size={24} />
            <span>Vs Bot</span>
            <small>Challenge the computer</small>
          </button>
        </div>

        {gameMode && (
          <div className="ttt-player-setup">
            <h3>
              {gameMode === '2player' ? 'Enter Player Names' : 'Enter Your Name'}
            </h3>
            
            <div className="ttt-name-inputs">
              <div className="ttt-input-group">
                <label>Player 1 (X)</label>
                <input
                  type="text"
                  placeholder="Enter name for Player 1"
                  value={players.player1}
                  onChange={(e) => setPlayers(prev => ({ ...prev, player1: e.target.value }))}
                  maxLength={20}
                />
              </div>

              {gameMode === '2player' && (
                <div className="ttt-input-group">
                  <label>Player 2 (O)</label>
                  <input
                    type="text"
                    placeholder="Enter name for Player 2"
                    value={players.player2}
                    onChange={(e) => setPlayers(prev => ({ ...prev, player2: e.target.value }))}
                    maxLength={20}
                  />
                </div>
              )}

              {gameMode === 'bot' && (
                <div className="ttt-difficulty-info">
                  <div className="ttt-difficulty-header">
                    <label>Bot Difficulty: <strong>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</strong></label>
                  </div>
                  <div className="ttt-difficulty-stats">
                    <div className="ttt-stat">
                      <span>Rounds:</span>
                      <strong>{totalRounds}</strong>
                    </div>
                    <div className="ttt-stat">
                      <span>Your Win Chance:</span>
                      <strong>{
                        difficulty === 'easy' ? '80%' :
                        difficulty === 'medium' ? '60%' :
                        difficulty === 'hard' ? '40%' :
                        '20%'
                      }</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary ttt-start-btn"
              onClick={() => startGame(gameMode, players.player1, players.player2)}
              disabled={!players.player1.trim() || (gameMode === '2player' && !players.player2.trim())}
            >
              Start Game - {totalRounds} Rounds
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render game board
  const renderGameBoard = () => (
    <div className="ttt-game">
      {/* Game Header */}
      <div className="ttt-game-header">
        <div className="ttt-game-info">
          <div className="ttt-round">Round {currentRound} of {totalRounds}</div>
          <div className="ttt-mode-badge">
            {gameMode === '2player' ? '2 Players' : 'Vs Bot'}
          </div>
          {gameMode === 'bot' && (
            <div className="ttt-difficulty-badge">
              {difficulty.toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="ttt-scores">
          <div className="ttt-score">
            <span className="ttt-player-name">{players.player1}</span>
            <span className="ttt-score-value">{scores.player1}</span>
          </div>
          <div className="ttt-vs">VS</div>
          <div className="ttt-score">
            <span className="ttt-player-name">
              {gameMode === '2player' ? players.player2 : 'Bot'}
            </span>
            <span className="ttt-score-value">{scores.player2}</span>
          </div>
        </div>
      </div>

      {/* Current Player */}
      <div className="ttt-current-player">
        <div className={`ttt-turn-indicator ${gameState.currentPlayer === 'X' ? 'player1' : 'player2'} ${botThinking ? 'bot-thinking' : ''}`}>
          <span>Current Turn:</span>
          <strong>
            {botThinking ? 'Bot Thinking...' : getCurrentPlayerName()}
          </strong>
          <div className={`ttt-symbol ${gameState.currentPlayer.toLowerCase()}`}>
            {gameState.currentPlayer}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="ttt-board">
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            className={`ttt-cell ${
              cell ? `ttt-cell-${cell.toLowerCase()}` : ''
            } ${
              gameState.winningLine?.includes(index) ? 'winning' : ''
            } ${botThinking ? 'disabled' : ''}`}
            onClick={() => handleCellClick(index)}
            disabled={cell !== null || gameState.winner || gameState.isDraw || botThinking}
          >
            {cell && <span>{cell}</span>}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      <div className="ttt-controls">
        <button className="btn btn-secondary" onClick={togglePause} disabled={botThinking}>
          {gameStatus === 'paused' ? <Play size={16} /> : <Pause size={16} />}
          {gameStatus === 'paused' ? 'Resume' : 'Pause'}
        </button>
        <button className="btn btn-secondary" onClick={initializeGame} disabled={botThinking}>
          <RotateCcw size={16} />
          Restart Round
        </button>
        <button className="btn btn-secondary" onClick={onExit} disabled={botThinking}>
          <Home size={16} />
          Exit Game
        </button>
      </div>
    </div>
  );

  // Render round end screen
  const renderRoundEnd = () => (
    <div className="ttt-round-end">
      <div className="ttt-round-result">
        {roundWinner.type === 'draw' ? (
          <>
            <div className="ttt-result-icon">🤝</div>
            <h2>Round Draw!</h2>
            <p>No points awarded for this round</p>
          </>
        ) : (
          <>
            <div className="ttt-result-icon">🎉</div>
            <h2>
              {roundWinner.winner === 'Bot' ? 'Hehe Bot Wins!' : `Wow ${roundWinner.winner} Wins!`}
            </h2>
            <p className="ttt-points-awarded">+{pointsPerWin} points awarded!</p>
          </>
        )}
        
        <div className="ttt-scores-display">
          <div className="ttt-score-display">
            <span>{players.player1}</span>
            <strong>{scores.player1}</strong>
          </div>
          <div className="ttt-vs">VS</div>
          <div className="ttt-score-display">
            <span>{gameMode === '2player' ? players.player2 : 'Bot'}</span>
            <strong>{scores.player2}</strong>
          </div>
        </div>

        <div className="ttt-round-progress">
          <div className="ttt-progress-text">
            Round {currentRound} of {totalRounds}
          </div>
          <div className="ttt-progress-bar">
            <div 
              className="ttt-progress-fill" 
              style={{ width: `${(currentRound / totalRounds) * 100}%` }}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={nextRound}>
          {currentRound < totalRounds ? 'Next Round' : 'See Final Results'}
        </button>
      </div>
    </div>
  );

  // Render game end screen
  const renderGameEnd = () => (
    <div className="ttt-game-end">
      <div className="ttt-final-results">
        <Trophy size={64} className="ttt-trophy" />
        
        <h1>Game Complete!</h1>
        
        <div className="ttt-final-winner">
          {gameResults.winner === 'Draw' ? (
            <>
              <div className="ttt-winner-icon">🤝</div>
              <h2>It's a Draw!</h2>
            </>
          ) : (
            <>
              <Crown size={32} className="ttt-crown" />
              <h2>
                {gameResults.winner === 'Bot' ? 'Bot Wins the Game!' : `${gameResults.winner} Wins the Game!`}
              </h2>
            </>
          )}
        </div>

        <div className="ttt-final-scores">
          <div className="ttt-final-score">
            <span className="ttt-player-label">{players.player1}</span>
            <span className="ttt-score-value">{scores.player1}</span>
            {gameResults.winner === players.player1 && <div className="ttt-winner-badge">Winner</div>}
          </div>
          <div className="ttt-final-score">
            <span className="ttt-player-label">{gameMode === '2player' ? players.player2 : 'Bot'}</span>
            <span className="ttt-score-value">{scores.player2}</span>
            {gameResults.winner === (gameMode === '2player' ? players.player2 : 'Bot') && <div className="ttt-winner-badge">Winner</div>}
          </div>
        </div>

        <div className="ttt-game-stats">
          <div className="ttt-stat-item">
            <span>Total Rounds:</span>
            <strong>{totalRounds}</strong>
          </div>
          <div className="ttt-stat-item">
            <span>Difficulty:</span>
            <strong>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</strong>
          </div>
          <div className="ttt-stat-item">
            <span>Total Points:</span>
            <strong>{scores.player1 + scores.player2}</strong>
          </div>
        </div>

        <div className="ttt-final-actions">
          <button className="btn btn-secondary" onClick={onExit}>
            <Home size={18} />
            Exit Game
          </button>
          <button className="btn btn-primary" onClick={playAgain}>
            <RotateCcw size={18} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );

  // Render paused screen
  const renderPausedScreen = () => (
    <div className="ttt-paused">
      <div className="ttt-paused-content">
        <Pause size={48} />
        <h2>Game Paused</h2>
        <p>Take your time...</p>
        <button className="btn btn-primary" onClick={togglePause}>
          <Play size={16} />
          Resume Game
        </button>
      </div>
    </div>
  );

  return (
    <div className="ttt-shell">
      {gameStatus === 'setup' && renderSetupScreen()}
      {gameStatus === 'playing' && renderGameBoard()}
      {gameStatus === 'roundEnd' && renderRoundEnd()}
      {gameStatus === 'gameEnd' && renderGameEnd()}
      {gameStatus === 'paused' && renderPausedScreen()}
    </div>
  );
};

export default TicTacToe;