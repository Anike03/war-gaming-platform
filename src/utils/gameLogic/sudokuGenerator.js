import { getRandomInt, shuffleArray } from '../helpers';

export class SudokuGenerator {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.grid = this.createEmptyGrid();
    this.solution = null;
    this.generatePuzzle();
  }

  createEmptyGrid() {
    return Array(9).fill().map(() => Array(9).fill(0));
  }

  generatePuzzle() {
    // Generate a complete solution
    this.solution = this.createEmptyGrid();
    this.solveSudoku(this.solution);
    
    // Create a puzzle by removing numbers based on difficulty
    this.grid = this.solution.map(row => [...row]);
    this.removeNumbers();
  }

  solveSudoku(grid) {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return true; // Puzzle solved
    
    const [row, col] = emptyCell;
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (this.isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (this.solveSudoku(grid)) return true;
        
        grid[row][col] = 0; // Backtrack
      }
    }
    
    return false; // No solution found
  }

  findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  isValidPlacement(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let y = 0; y < 9; y++) {
      if (grid[y][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (grid[boxRow + y][boxCol + x] === num) return false;
      }
    }
    
    return true;
  }

  removeNumbers() {
    const cellsToRemove = this.getCellsToRemove();
    let removed = 0;
    
    while (removed < cellsToRemove) {
      const row = getRandomInt(0, 8);
      const col = getRandomInt(0, 8);
      
      if (this.grid[row][col] !== 0) {
        // Store the value in case we need to backtrack
        const backup = this.grid[row][col];
        this.grid[row][col] = 0;
        
        // Check if the puzzle still has a unique solution
        const tempGrid = this.grid.map(row => [...row]);
        if (this.countSolutions(tempGrid) !== 1) {
          this.grid[row][col] = backup; // Backtrack
        } else {
          removed++;
        }
      }
    }
  }

  getCellsToRemove() {
    const levels = {
      easy: 35,   // 46 cells remaining
      medium: 45, // 36 cells remaining
      hard: 52,   // 29 cells remaining
      extreme: 58 // 23 cells remaining
    };
    return levels[this.difficulty] || 45;
  }

  countSolutions(grid) {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return 1;
    
    const [row, col] = emptyCell;
    let count = 0;
    
    for (let num = 1; num <= 9 && count < 2; num++) {
      if (this.isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        count += this.countSolutions(grid);
        grid[row][col] = 0;
      }
    }
    
    return count;
  }

  isSolved() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) return false;
        if (!this.isValidPlacement(this.grid, row, col, this.grid[row][col])) return false;
      }
    }
    return true;
  }

  getPuzzle() {
    return {
      grid: this.grid.map(row => [...row]),
      solution: this.solution.map(row => [...row]),
      difficulty: this.difficulty
    };
  }
}

// Helper function to create a new sudoku puzzle
export const createSudokuPuzzle = (difficulty) => {
  const generator = new SudokuGenerator(difficulty);
  return generator.getPuzzle();
};

// Helper function to check if a move is valid
export const isValidSudokuMove = (grid, row, col, num) => {
  // Check if the cell is empty
  if (grid[row][col] !== 0) return false;
  
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[boxRow + y][boxCol + x] === num) return false;
    }
  }
  
  return true;
};