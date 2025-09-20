import { shuffleArray, getRandomInt } from '../helpers';

// Quiz questions database
export const QUIZ_QUESTIONS = {
  easy: [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: "Paris",
      category: "Geography"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
      category: "Science"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
      category: "Math"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      answer: "Da Vinci",
      category: "Art"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      answer: "Pacific",
      category: "Geography"
    }
  ],
  medium: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      answer: "Au",
      category: "Science"
    },
    {
      question: "Which language has the most native speakers?",
      options: ["English", "Spanish", "Hindi", "Mandarin"],
      answer: "Mandarin",
      category: "General"
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1945", "1947", "1950"],
      answer: "1945",
      category: "History"
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      answer: "Blue Whale",
      category: "Science"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      answer: "William Shakespeare",
      category: "Literature"
    }
  ],
  hard: [
    {
      question: "What is the speed of light in vacuum?",
      options: ["299,792 km/s", "150,000 km/s", "450,000 km/s", "1,000,000 km/s"],
      answer: "299,792 km/s",
      category: "Science"
    },
    {
      question: "Which element has the atomic number 1?",
      options: ["Oxygen", "Hydrogen", "Helium", "Carbon"],
      answer: "Hydrogen",
      category: "Science"
    },
    {
      question: "What is the capital of Azerbaijan?",
      options: ["Baku", "Ankara", "Tbilisi", "Yerevan"],
      answer: "Baku",
      category: "Geography"
    },
    {
      question: "Who discovered penicillin?",
      options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"],
      answer: "Alexander Fleming",
      category: "Science"
    },
    {
      question: "What is the largest desert in the world?",
      options: ["Sahara", "Gobi", "Arabian", "Antarctic"],
      answer: "Antarctic",
      category: "Geography"
    }
  ],
  extreme: [
    {
      question: "What is the approximate value of the mathematical constant e?",
      options: ["2.71828", "3.14159", "1.61803", "0.57721"],
      answer: "2.71828",
      category: "Math"
    },
    {
      question: "Which philosopher said 'I think, therefore I am'?",
      options: ["Plato", "Aristotle", "Descartes", "Kant"],
      answer: "Descartes",
      category: "Philosophy"
    },
    {
      question: "What is the smallest bone in the human body?",
      options: ["Stapes", "Incus", "Malleus", "Cochlea"],
      answer: "Stapes",
      category: "Science"
    },
    {
      question: "In which year was the first iPhone released?",
      options: ["2005", "2007", "2009", "2010"],
      answer: "2007",
      category: "Technology"
    },
    {
      question: "What is the chemical formula for ammonia?",
      options: ["NH3", "NH4", "NO2", "CH4"],
      answer: "NH3",
      category: "Science"
    }
  ]
};

// Get quiz questions for a specific difficulty
export const getQuizQuestions = (difficulty = 'medium', count = 10) => {
  const questions = QUIZ_QUESTIONS[difficulty] || QUIZ_QUESTIONS.medium;
  return shuffleArray(questions).slice(0, count);
};

// Calculate quiz score
export const calculateQuizScore = (answers, timeTaken, difficulty) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const baseScore = correctAnswers * getBasePoints(difficulty);
  const timeBonus = Math.max(0, Math.floor((300 - timeTaken) / 10));
  
  return baseScore + timeBonus;
};

// Get base points for difficulty
const getBasePoints = (difficulty) => {
  const points = {
    easy: 10,
    medium: 20,
    hard: 30,
    extreme: 50
  };
  return points[difficulty] || 20;
};

// Check if answer is correct
export const checkAnswer = (question, selectedAnswer) => {
  return question.answer === selectedAnswer;
};

// Generate question ID
export const generateQuestionId = (question) => {
  return question.question.replace(/\s+/g, '_').toLowerCase();
};

// Get all quiz categories
export const getQuizCategories = () => {
  const categories = new Set();
  
  Object.values(QUIZ_QUESTIONS).forEach(difficultyQuestions => {
    difficultyQuestions.forEach(question => {
      categories.add(question.category);
    });
  });
  
  return Array.from(categories);
};

// Get questions by category
export const getQuestionsByCategory = (category, difficulty = 'medium') => {
  const questions = QUIZ_QUESTIONS[difficulty] || QUIZ_QUESTIONS.medium;
  return questions.filter(question => question.category === category);
};