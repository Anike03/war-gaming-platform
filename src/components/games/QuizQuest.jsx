import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks';
import { Timer, Star, HelpCircle, CheckCircle, XCircle, Award } from 'lucide-react';

const QuizQuest = ({ difficulty, onGameEnd }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { endGame, updateScore } = useGame();

  const timeLimits = {
    easy: 30,
    medium: 25,
    hard: 20,
    extreme: 15
  };

  const questionPools = {
    easy: [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        category: "Geography"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        category: "Science"
      },
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        category: "Math"
      }
    ],
    medium: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: "Au",
        category: "Science"
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: "William Shakespeare",
        category: "Literature"
      }
    ],
    hard: [
      {
        question: "What is the speed of light in vacuum?",
        options: ["299,792 km/s", "150,000 km/s", "450,000 km/s", "1,000,000 km/s"],
        correctAnswer: "299,792 km/s",
        category: "Science"
      }
    ],
    extreme: [
      {
        question: "What is the approximate value of the mathematical constant e?",
        options: ["2.71828", "3.14159", "1.61803", "0.57721"],
        correctAnswer: "2.71828",
        category: "Math"
      }
    ]
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver && questions.length > 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const initializeGame = () => {
    const pool = questionPools[difficulty];
    const randomQuestions = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    
    setQuestions(randomQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(timeLimits[difficulty]);
    setGameOver(false);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer || gameOver) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      const pointsEarned = calculatePoints(timeLeft);
      setScore(prev => prev + pointsEarned);
      updateScore(pointsEarned);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(timeLimits[difficulty]);
      } else {
        endGameLogic();
      }
    }, 2000);
  };

  const handleTimeOut = () => {
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(timeLimits[difficulty]);
      } else {
        endGameLogic();
      }
    }, 2000);
  };

  const calculatePoints = (timeRemaining) => {
    const basePoints = {
      easy: 10,
      medium: 20,
      hard: 30,
      extreme: 50
    };
    
    const timeBonus = Math.floor(timeRemaining / 5) * 2;
    return basePoints[difficulty] + timeBonus;
  };

  const endGameLogic = async () => {
    setGameOver(true);
    const completed = score > 0;
    await endGame(score, completed);
    setTimeout(() => onGameEnd(), 3000);
  };

  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  if (gameOver) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-warning mb-4">
          <Star size={32} className="text-warning" fill="currentColor" />
          <span>{score} Points</span>
        </div>
        <p className="text-muted mb-6">
          You answered {score > 0 ? 'some' : 'no'} questions correctly
        </p>
        <button 
          onClick={initializeGame}
          className="btn btn-primary"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Timer size={20} />
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star size={20} className="text-warning" />
          <span className="font-semibold">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <HelpCircle size={20} />
          <span className="font-semibold">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="text-sm text-muted mb-2 uppercase tracking-wide">
          {currentQ.category}
        </div>
        <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>
        
        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQ.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all
                  ${isSelected ? 'border-primary bg-primary/10' : 'border-border-color'}
                  ${showCorrect ? 'border-success bg-success/10' : ''}
                  ${showIncorrect ? 'border-danger bg-danger/10' : ''}
                  hover:border-primary/50
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <CheckCircle size={20} className="text-success" />}
                  {showIncorrect && <XCircle size={20} className="text-danger" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuest;