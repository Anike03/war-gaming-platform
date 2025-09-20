export class TicTacToeAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
  }

  getMove(board, player) {
    switch (this.difficulty) {
      case 'easy':
        return this.getEasyMove(board);
      case 'medium':
        return this.getMediumMove(board, player);
      case 'hard':
        return this.getHardMove(board, player);
      case 'extreme':
        return this.getExtremeMove(board, player);
      default:
        return this.getMediumMove(board, player);
    }
  }

  getEasyMove(board) {
    // Random move for easy difficulty
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  getMediumMove(board, player) {
    // Try to win if possible, otherwise block opponent, otherwise random
    const opponent = player === 'X' ? 'O' : 'X';
    
    // Check for winning move
    const winMove = this.findWinningMove(board, player);
    if (winMove) return winMove;
    
    // Block opponent's winning move
    const blockMove = this.findWinningMove(board, opponent);
    if (blockMove) return blockMove;
    
    // Take center if available
    if (board[1][1] === null) return { row: 1, col: 1 };
    
    // Take corner if available
    const corners = [
      { row: 0, col: 0 }, { row: 0, col: 2 },
      { row: 2, col: 0 }, { row: 2, col: 2 }
    ];
    
    const emptyCorners = corners.filter(({ row, col }) => board[row][col] === null);
    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }
    
    // Random move
    return this.getEasyMove(board);
  }

  getHardMove(board, player) {
    // Uses minimax algorithm for hard difficulty
    const opponent = player === 'X' ? 'O' : 'X';
    
    // Check for immediate wins or blocks
    const winMove = this.findWinningMove(board, player);
    if (winMove) return winMove;
    
    const blockMove = this.findWinningMove(board, opponent);
    if (blockMove) return blockMove;
    
    // Use minimax for optimal move
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = player;
          const score = this.minimax(board, 0, false, player);
          board[i][j] = null;
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }
    
    return bestMove;
  }

  getExtremeMove(board, player) {
    // Same as hard but with deeper search
    return this.getHardMove(board, player);
  }

  findWinningMove(board, player) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = player;
          if (this.checkWinner(board) === player) {
            board[i][j] = null;
            return { row: i, col: j };
          }
          board[i][j] = null;
        }
      }
    }
    return null;
  }

  minimax(board, depth, isMaximizing, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    const result = this.checkWinner(board);
    
    if (result === player) return 10 - depth;
    if (result === opponent) return depth - 10;
    if (this.isBoardFull(board)) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === null) {
            board[i][j] = player;
            const score = this.minimax(board, depth + 1, false, player);
            board[i][j] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === null) {
            board[i][j] = opponent;
            const score = this.minimax(board, depth + 1, true, player);
            board[i][j] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  checkWinner(board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0];
      }
    }
    
    // Check columns
    for (let j = 0; j < 3; j++) {
      if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
        return board[0][j];
      }
    }
    
    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2];
    }
    
    // Check for draw
    if (this.isBoardFull(board)) return 'draw';
    
    return null;
  }

  isBoardFull(board) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) return false;
      }
    }
    return true;
  }
}

// Helper function to create AI
export const createTicTacToeAI = (difficulty) => {
  return new TicTacToeAI(difficulty);
};