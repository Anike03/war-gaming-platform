import { shuffleArray, getRandomInt } from '../helpers';

export class ColorGridGame {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.gridSize = this.getGridSize();
    this.colors = [];
    this.targetColor = null;
    this.selectedCells = [];
    this.score = 0;
    this.timeLimit = this.getTimeLimit();
    this.gameOver = false;
    this.generateGrid();
  }

  getGridSize() {
    const sizes = {
      easy: 3,
      medium: 4,
      hard: 5,
      extreme: 6
    };
    return sizes[this.difficulty] || 4;
  }

  getTimeLimit() {
    const limits = {
      easy: 120,
      medium: 90,
      hard: 60,
      extreme: 45
    };
    return limits[this.difficulty] || 90;
  }

  generateGrid() {
    const totalCells = this.gridSize * this.gridSize;
    const colorPalette = this.getColorPalette();
    
    // Generate random colors
    this.colors = [];
    for (let i = 0; i < totalCells; i++) {
      this.colors.push(colorPalette[getRandomInt(0, colorPalette.length - 1)]);
    }
    
    // Set target color (one of the colors in the grid)
    const targetIndex = getRandomInt(0, totalCells - 1);
    this.targetColor = this.colors[targetIndex];
    
    this.selectedCells = [];
    this.gameOver = false;
  }

  getColorPalette() {
    // Basic color palettes for different difficulties
    const palettes = {
      easy: [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
      ],
      medium: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A826', '#6C5CE7', '#FD79A8'
      ],
      hard: [
        '#E84393', '#0984E3', '#00B894', '#FDCB6E', '#636E72', '#D63031'
      ],
      extreme: [
        '#4834D4', '#130F40', '#EB4D4B', '#6AB04C', '#F0932B', '#686DE0'
      ]
    };
    
    return palettes[this.difficulty] || palettes.medium;
  }

  selectCell(index) {
    if (this.gameOver || this.selectedCells.includes(index)) {
      return false;
    }

    this.selectedCells.push(index);
    const isCorrect = this.colors[index] === this.targetColor;

    if (isCorrect) {
      this.score += this.calculateScore();
      this.generateGrid(); // Generate new grid for next round
      return true;
    } else {
      // Penalty for wrong selection
      this.selectedCells = [];
      this.score = Math.max(0, this.score - 3);
      return false;
    }
  }

  calculateScore() {
    const baseScores = {
      easy: 15,
      medium: 25,
      hard: 40,
      extreme: 60
    };
    
    return baseScores[this.difficulty] || 25;
  }

  endGame() {
    this.gameOver = true;
    return this.score;
  }

  getGameState() {
    return {
      colors: this.colors,
      targetColor: this.targetColor,
      selectedCells: this.selectedCells,
      score: this.score,
      timeLimit: this.timeLimit,
      gameOver: this.gameOver,
      gridSize: this.gridSize
    };
  }
}

// Helper function to create a new game
export const createColorGridGame = (difficulty) => {
  return new ColorGridGame(difficulty);
};