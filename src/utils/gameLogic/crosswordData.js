import { shuffleArray } from '../helpers';

// City names database for crossword puzzles
export const CITY_NAMES = [
  // Major world cities
  'PARIS', 'LONDON', 'TOKYO', 'BEIJING', 'MOSCOW', 'BERLIN', 'ROME', 'MADRID',
  'CAIRO', 'DELHI', 'MUMBAI', 'SYDNEY', 'DUBAI', 'ISTANBUL', 'SEOUL', 'BANGKOK',
  
  // US cities
  'NEWYORK', 'LOSANGELES', 'CHICAGO', 'HOUSTON', 'PHOENIX', 'PHILADELPHIA',
  'SANANTONIO', 'SANDIEGO', 'DALLAS', 'SANJOSE', 'AUSTIN', 'JACKSONVILLE',
  'SANFRANCISCO', 'COLUMBUS', 'INDIANAPOLIS', 'SEATTLE', 'DENVER', 'WASHINGTON',
  
  // Canadian cities
  'TORONTO', 'MONTREAL', 'VANCOUVER', 'CALGARY', 'EDMONTON', 'OTTAWA', 'WINNIPEG',
  
  // European cities
  'AMSTERDAM', 'BRUSSELS', 'VIENNA', 'PRAGUE', 'COPENHAGEN', 'HELSINKI', 'ATHENS',
  'DUBLIN', 'LISBON', 'OSLO', 'WARSAW', 'STOCKHOLM', 'ZURICH', 'BUDAPEST',
  
  // Asian cities
  'SHANGHAI', 'SINGAPORE', 'KUALALUMPUR', 'JAKARTA', 'MANILA', 'HANOI', 'TAIPEI',
  'HONGKONG', 'BANGALORE', 'CHENNAI', 'KOLKATA', 'HYDERABAD', 'PUNE', 'AHMEDABAD',
  
  // Other cities
  'MEXICO', 'BUENOSAIRES', 'RIODEJANEIRO', 'SANTIAGO', 'LIMA', 'BOGOTA', 'CARACAS',
  'JOHANNESBURG', 'CAPETOWN', 'NAIROBI', 'LAGOS', 'ACCRA', 'DARESSALAAM'
];

// Crossword puzzle templates
export const CROSSWORD_TEMPLATES = [
  {
    id: 1,
    title: "World Capitals",
    difficulty: "medium",
    grid: [
      [1, 2, 3, 4, 0, 5, 6, 7],
      [8, 0, 0, 0, 9, 0, 0, 0],
      [10, 0, 0, 0, 11, 0, 0, 0],
      [12, 0, 0, 0, 13, 0, 0, 0],
      [0, 14, 15, 16, 0, 17, 18, 19],
      [20, 0, 0, 0, 21, 0, 0, 0],
      [22, 0, 0, 0, 23, 0, 0, 0],
      [24, 0, 0, 0, 25, 0, 0, 0]
    ],
    across: {
      1: { clue: "City of Love", answer: "PARIS", row: 0, col: 0 },
      5: { clue: "Japanese capital", answer: "TOKYO", row: 0, col: 5 },
      8: { clue: "German capital", answer: "BERLIN", row: 1, col: 0 },
      10: { clue: "Italian capital", answer: "ROME", row: 2, col: 0 },
      12: { clue: "Spanish capital", answer: "MADRID", row: 3, col: 0 },
      14: { clue: "Russian capital", answer: "MOSCOW", row: 4, col: 1 },
      17: { clue: "Chinese capital", answer: "BEIJING", row: 4, col: 5 },
      20: { clue: "Australian city", answer: "SYDNEY", row: 5, col: 0 },
      22: { clue: "Turkish city", answer: "ISTANBUL", row: 6, col: 0 },
      24: { clue: "Egyptian capital", answer: "CAIRO", row: 7, col: 0 }
    },
    down: {
      1: { clue: "French capital", answer: "PARIS", row: 0, col: 0 },
      2: { clue: "English capital", answer: "LONDON", row: 0, col: 1 },
      3: { clue: "Indian capital", answer: "DELHI", row: 0, col: 2 },
      4: { clue: "South Korean capital", answer: "SEOUL", row: 0, col: 3 },
      6: { clue: "Thai capital", answer: "BANGKOK", row: 0, col: 6 },
      7: { clue: "Emirati city", answer: "DUBAI", row: 0, col: 7 },
      9: { clue: "Canadian city", answer: "TORONTO", row: 1, col: 4 },
      11: { clue: "American city", answer: "NEWYORK", row: 2, col: 4 },
      13: { clue: "Mexican capital", answer: "MEXICO", row: 3, col: 4 },
      15: { clue: "Brazilian city", answer: "RIODEJANEIRO", row: 4, col: 2 },
      18: { clue: "Argentinian capital", answer: "BUENOSAIRES", row: 4, col: 6 },
      21: { clue: "South African city", answer: "CAPETOWN", row: 5, col: 4 },
      23: { clue: "Kenyan capital", answer: "NAIROBI", row: 6, col: 4 },
      25: { clue: "Nigerian city", answer: "LAGOS", row: 7, col: 4 }
    }
  }
];

// Generate a random crossword puzzle
export const generateCrosswordPuzzle = (difficulty = 'medium') => {
  // For now, return a predefined template
  // In a real implementation, you would generate puzzles dynamically
  const template = CROSSWORD_TEMPLATES[0];
  
  return {
    ...template,
    difficulty,
    solution: generateSolutionGrid(template),
    userGrid: generateEmptyGrid(template.grid)
  };
};

// Generate solution grid from template
const generateSolutionGrid = (template) => {
  const grid = template.grid.map(row => [...row]);
  
  // Fill across words
  Object.values(template.across).forEach(({ answer, row, col }) => {
    for (let i = 0; i < answer.length; i++) {
      grid[row][col + i] = answer[i];
    }
  });
  
  // Fill down words
  Object.values(template.down).forEach(({ answer, row, col }) => {
    for (let i = 0; i < answer.length; i++) {
      grid[row + i][col] = answer[i];
    }
  });
  
  return grid;
};

// Generate empty grid for user input
const generateEmptyGrid = (templateGrid) => {
  return templateGrid.map(row => 
    row.map(cell => cell === 0 ? '#' : '')
  );
};

// Check if crossword is complete
export const isCrosswordComplete = (userGrid, solutionGrid) => {
  for (let row = 0; row < userGrid.length; row++) {
    for (let col = 0; col < userGrid[row].length; col++) {
      if (solutionGrid[row][col] !== '#' && userGrid[row][col] !== solutionGrid[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// Calculate crossword score
export const calculateCrosswordScore = (puzzle, timeTaken, mistakes) => {
  const baseScores = {
    easy: 100,
    medium: 200,
    hard: 300,
    extreme: 500
  };
  
  const baseScore = baseScores[puzzle.difficulty] || 200;
  const timeBonus = Math.max(0, 300 - timeTaken);
  const mistakePenalty = mistakes * 10;
  
  return Math.max(0, baseScore + timeBonus - mistakePenalty);
};

// Get random city name
export const getRandomCityName = () => {
  return shuffleArray(CITY_NAMES)[0];
};

// Validate crossword input
export const isValidCrosswordInput = (char) => {
  return /^[A-Za-z]$/.test(char);
};