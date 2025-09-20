// Export all utils from a single file for easier imports

// Firebase
export { auth, db, storage, analytics } from './firebase';

// Helpers
export {
  formatNumber,
  formatDate,
  formatDuration,
  calculatePoints,
  validateEmail,
  validatePassword,
  debounce,
  generateId,
  copyToClipboard,
  getInitials,
  calculateLevel,
  formatPoints,
  getDifficultyColor,
  shuffleArray,
  getRandomInt,
  getRandomItem,
  capitalize,
  truncateText,
  isMobile,
  getScreenSize,
  getQueryParams,
  deepClone,
  deepMerge,
  throttle,
  getFileExtension,
  formatFileSize,
  generateGradient,
  sleep,
  generateUUID
} from './helpers';

// Game Logic
export {
  createNumberGridGame,
  NumberGridGame
} from './gameLogic/numberGrid';

export {
  createColorGridGame,
  ColorGridGame
} from './gameLogic/colorGrid';

export {
  createTicTacToeAI,
  TicTacToeAI
} from './gameLogic/ticTacToeAI';

export {
  createSudokuPuzzle,
  isValidSudokuMove
} from './gameLogic/sudokuGenerator';

export {
  createChessGame,
  getPieceSymbol
} from './gameLogic/chessEngine';

export {
  generateCrosswordPuzzle,
  isCrosswordComplete,
  calculateCrosswordScore,
  getRandomCityName,
  isValidCrosswordInput,
  CITY_NAMES,
  CROSSWORD_TEMPLATES
} from './gameLogic/crosswordData';

export {
  getQuizQuestions,
  calculateQuizScore,
  checkAnswer,
  generateQuestionId,
  getQuizCategories,
  getQuestionsByCategory,
  QUIZ_QUESTIONS
} from './gameLogic/quizData';