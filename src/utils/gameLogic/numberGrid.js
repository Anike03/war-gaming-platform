import { shuffleArray, getRandomInt } from '../helpers';

export class NumberGridGame {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.gridSize = this.getGridSize();
    this.numbers = [];
    this.selectedNumbers = [];
    this.targetNumber = null;
    this.score = 0;
    this.timeLimit = this.getTimeLimit();
    this.gameOver = false;
    this.generateGrid();
  }

  getGridSize() {
    const sizes = {
      easy: 4,
      medium: 6,
      hard: 8,
      extreme: 10
    };
    return sizes[this.difficulty] || 6;
  }

  getTimeLimit() {
    const limits = {
      easy: 90,
      medium: 60,
      hard: 45,
      extreme: 30
    };
    return limits[this.difficulty] || 60;
  }

  generateGrid() {
    const totalCells = this.gridSize * this.gridSize;
    const numberRange = this.getNumberRange();
    
    // Generate random numbers
    this.numbers = [];
    for (let i = 0; i < totalCells; i++) {
      this.numbers.push(getRandomInt(1, numberRange));
    }
    
    // Set target number (sum of some random numbers)
    const targetCount = getRandomInt(3, Math.min(6, this.gridSize));
    const indices = [];
    
    while (indices.length < targetCount) {
      const index = getRandomInt(0, totalCells - 1);
      if (!indices.includes(index)) {
        indices.push(index);
      }
    }
    
    this.targetNumber = indices.reduce((sum, index) => sum + this.numbers[index], 0);
    this.selectedNumbers = [];
    this.score = 0;
    this.gameOver = false;
  }

  getNumberRange() {
    const ranges = {
      easy: 10,
      medium: 20,
      hard: 30,
      extreme: 50
    };
    return ranges[this.difficulty] || 20;
  }

  selectNumber(index) {
    if (this.gameOver || this.selectedNumbers.includes(index)) {
      return false;
    }

    this.selectedNumbers.push(index);
    const currentSum = this.selectedNumbers.reduce((sum, idx) => sum + this.numbers[idx], 0);

    if (currentSum === this.targetNumber) {
      this.score += this.calculateScore();
      this.generateGrid(); // Generate new grid for next round
      return true;
    } else if (currentSum > this.targetNumber) {
      // Penalty for exceeding target
      this.selectedNumbers = [];
      this.score = Math.max(0, this.score - 5);
      return false;
    }

    return null; // Still selecting numbers
  }

  calculateScore() {
    const baseScores = {
      easy: 10,
      medium: 20,
      hard: 30,
      extreme: 50
    };
    
    const baseScore = baseScores[this.difficulty] || 20;
    const speedBonus = Math.max(0, 30 - this.selectedNumbers.length) * 2;
    
    return baseScore + speedBonus;
  }

  endGame() {
    this.gameOver = true;
    return this.score;
  }

  getGameState() {
    return {
      numbers: this.numbers,
      targetNumber: this.targetNumber,
      selectedNumbers: this.selectedNumbers,
      score: this.score,
      timeLimit: this.timeLimit,
      gameOver: this.gameOver,
      gridSize: this.gridSize
    };
  }
}

// Helper function to create a new game
export const createNumberGridGame = (difficulty) => {
  return new NumberGridGame(difficulty);
};