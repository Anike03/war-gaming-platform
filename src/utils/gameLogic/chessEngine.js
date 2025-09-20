// Simplified chess engine for the game
export class ChessEngine {
  constructor() {
    this.board = this.createInitialBoard();
    this.currentPlayer = 'white';
    this.moveHistory = [];
    this.gameOver = false;
    this.winner = null;
  }

  createInitialBoard() {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
  }

  getPieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return false;
    
    const pieceColor = this.getPieceColor(piece);
    if (pieceColor !== this.currentPlayer) return false;
    
    const targetPiece = this.board[toRow][toCol];
    const targetColor = this.getPieceColor(targetPiece);
    
    // Can't capture own pieces
    if (targetColor === pieceColor) return false;
    
    // Check piece-specific movement rules
    return this.checkPieceMovement(piece, fromRow, fromCol, toRow, toCol);
  }

  checkPieceMovement(piece, fromRow, fromCol, toRow, toCol) {
    const pieceType = piece.toLowerCase();
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    switch (pieceType) {
      case 'p': // Pawn
        return this.isValidPawnMove(piece, fromRow, fromCol, toRow, toCol);
      case 'r': // Rook
        return (rowDiff === 0 || colDiff === 0) && this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'n': // Knight
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      case 'b': // Bishop
        return rowDiff === colDiff && this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'q': // Queen
        return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && 
               this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'k': // King
        return rowDiff <= 1 && colDiff <= 1;
      default:
        return false;
    }
  }

  isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
    const direction = piece === 'P' ? -1 : 1;
    const startRow = piece === 'P' ? 6 : 1;
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    
    // Moving forward
    if (toCol === fromCol) {
      // Single move forward
      if (rowDiff === direction) return !this.board[toRow][toCol];
      // Double move from starting position
      if (fromRow === startRow && rowDiff === 2 * direction) {
        return !this.board[fromRow + direction][fromCol] && !this.board[toRow][toCol];
      }
    }
    
    // Capturing diagonally
    if (colDiff === 1 && rowDiff === direction) {
      return !!this.board[toRow][toCol] || this.isEnPassant(fromRow, fromCol, toRow, toCol);
    }
    
    return false;
  }

  isEnPassant(fromRow, fromCol, toRow, toCol) {
    // Simplified en passant check
    const lastMove = this.moveHistory[this.moveHistory.length - 1];
    if (!lastMove) return false;
    
    const { from, to, piece } = lastMove;
    if (piece.toLowerCase() !== 'p') return false;
    
    const pawnDirection = piece === 'P' ? -1 : 1;
    if (Math.abs(from.row - to.row) !== 2) return false;
    
    return to.row === fromRow && to.col === toCol && from.col === toCol;
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;
    
    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    
    // Record move
    this.moveHistory.push({
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece,
      captured: capturedPiece
    });
    
    // Execute move
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = '';
    
    // Check for pawn promotion
    if ((piece === 'P' && toRow === 0) || (piece === 'p' && toRow === 7)) {
      this.board[toRow][toCol] = piece === 'P' ? 'Q' : 'q'; // Always promote to queen for simplicity
    }
    
    // Check for game over
    if (this.isCheckmate()) {
      this.gameOver = true;
      this.winner = this.currentPlayer;
    } else if (this.isStalemate()) {
      this.gameOver = true;
      this.winner = 'draw';
    }
    
    // Switch player
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    return true;
  }

  isInCheck(color) {
    // Find king position
    let kingRow, kingCol;
    const king = color === 'white' ? 'K' : 'k';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === king) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
    }
    
    // Check if any opponent piece can capture the king
    const opponent = color === 'white' ? 'black' : 'white';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && this.getPieceColor(piece) === opponent) {
          if (this.checkPieceMovement(piece, row, col, kingRow, kingCol)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  isCheckmate() {
    if (!this.isInCheck(this.currentPlayer)) return false;
    
    // Check if any move can get out of check
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = this.board[fromRow][fromCol];
        if (piece && this.getPieceColor(piece) === this.currentPlayer) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                // Try the move
                const originalBoard = this.board.map(row => [...row]);
                this.makeMove(fromRow, fromCol, toRow, toCol);
                const stillInCheck = this.isInCheck(this.currentPlayer);
                
                // Restore board
                this.board = originalBoard;
                this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
                this.moveHistory.pop();
                
                if (!stillInCheck) return false;
              }
            }
          }
        }
      }
    }
    
    return true;
  }

  isStalemate() {
    if (this.isInCheck(this.currentPlayer)) return false;
    
    // Check if any legal moves exist
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = this.board[fromRow][fromCol];
        if (piece && this.getPieceColor(piece) === this.currentPlayer) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                return false;
              }
            }
          }
        }
      }
    }
    
    return true;
  }

  getBoard() {
    return this.board.map(row => [...row]);
  }

  getGameState() {
    return {
      board: this.getBoard(),
      currentPlayer: this.currentPlayer,
      moveHistory: [...this.moveHistory],
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}

// Helper function to create a new chess game
export const createChessGame = () => {
  return new ChessEngine();
};

// Helper function to get piece Unicode symbols
export const getPieceSymbol = (piece) => {
  const symbols = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };
  return symbols[piece] || '';
};