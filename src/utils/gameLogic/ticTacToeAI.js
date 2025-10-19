// src/utils/gameLogic/ticTacToe.js

export const TIC_TAC_TOE_CONFIG = {
  easy: {
    winRate: 0.2,      // 20% chance bot wins (80% user wins)
    smartMoves: 0.3    // 30% of moves are strategic
  },
  medium: {
    winRate: 0.4,      // 40% chance bot wins (60% user wins)
    smartMoves: 0.6    // 60% of moves are strategic
  },
  hard: {
    winRate: 0.6,      // 60% chance bot wins (40% user wins)
    smartMoves: 0.8    // 80% of moves are strategic
  },
  extreme: {
    winRate: 0.8,      // 80% chance bot wins (20% user wins)
    smartMoves: 0.95   // 95% of moves are strategic
  }
};

// Winning combinations
export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Check for winner
export function checkWinner(board) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningLine: WINNING_LINES[i],
        isDraw: false
      };
    }
  }

  // Check for draw
  if (board.every(cell => cell !== null)) {
    return {
      winner: null,
      winningLine: null,
      isDraw: true
    };
  }

  return null;
}

// Get available moves
export function getAvailableMoves(board) {
  return board
    .map((cell, index) => cell === null ? index : null)
    .filter(index => index !== null);
}

// Bot AI logic
export function getBotMove(board, difficulty = 'easy') {
  const config = TIC_TAC_TOE_CONFIG[difficulty];
  const availableMoves = getAvailableMoves(board);

  // Sometimes make completely random moves based on difficulty
  if (Math.random() > config.smartMoves) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 1. Check for winning move
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'O';
    if (checkWinner(testBoard)?.winner === 'O') {
      return move;
    }
  }

  // 2. Block opponent's winning move
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'X';
    if (checkWinner(testBoard)?.winner === 'X') {
      return move;
    }
  }

  // 3. Strategic moves based on difficulty
  const strategicMoves = getStrategicMoves(board);
  if (strategicMoves.length > 0) {
    // Sometimes make suboptimal moves based on difficulty
    if (Math.random() > config.winRate) {
      return strategicMoves[Math.floor(Math.random() * strategicMoves.length)];
    }
  }

  // 4. Fallback to random move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Get strategic moves (center, corners, edges)
function getStrategicMoves(board) {
  const strategicMoves = [];
  const availableMoves = getAvailableMoves(board);

  // Prefer center
  if (board[4] === null) {
    strategicMoves.push(4);
  }

  // Then corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(index => board[index] === null);
  strategicMoves.push(...availableCorners);

  // Then edges
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter(index => board[index] === null);
  strategicMoves.push(...availableEdges);

  // Filter to only available moves
  return strategicMoves.filter(move => availableMoves.includes(move));
}

// Calculate game score based on performance
export function calculateGameScore(winner, playerSymbol, difficulty, moves) {
  let baseScore = 0;
  
  if (winner === playerSymbol) {
    baseScore = 100;
    
    // Bonus for fewer moves (quick win)
    const moveBonus = Math.max(0, 50 - (moves * 5));
    baseScore += moveBonus;
    
    // Difficulty multiplier
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.2,
      hard: 1.5,
      extreme: 2
    }[difficulty];
    
    baseScore *= difficultyMultiplier;
  } else if (winner === null) {
    baseScore = 25; // Draw
  } else {
    baseScore = 10; // Loss
  }
  
  return Math.round(baseScore);
}

// Initialize game state
export function initializeGameState() {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    isDraw: false,
    moveCount: 0
  };
}

// Check if move is valid
export function isValidMove(board, index) {
  return index >= 0 && index < 9 && board[index] === null;
}

// Get game status message
export function getGameStatusMessage(gameState, players, gameMode) {
  if (gameState.winner) {
    const winnerName = gameState.winner === 'X' 
      ? players.player1 
      : (gameMode === '2player' ? players.player2 : 'Bot');
    return `${winnerName} wins!`;
  } else if (gameState.isDraw) {
    return "It's a draw!";
  } else {
    const currentPlayerName = gameState.currentPlayer === 'X'
      ? players.player1
      : (gameMode === '2player' ? players.player2 : 'Bot');
    return `${currentPlayerName}'s turn`;
  }
}