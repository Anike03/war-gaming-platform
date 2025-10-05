import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import {
  Play, Trophy, Gift, Users, Star, Shield, Clock,
  Grid3X3, Brain, Sword, Shapes, Dice5, Puzzle, X
} from 'lucide-react';
import ThreeScene from '../components/common/ThreeScene';

const Home = () => {
  const { userData } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);

  const features = [
    { icon: <Star size={40} />,   title: "7 Skill-Based Games", description: "Challenge yourself with diverse games that test your cognitive abilities" },
    { icon: <Trophy size={40} />, title: "Earn Points",         description: "Win games to earn points based on difficulty level" },
    { icon: <Gift size={40} />,   title: "Redeem Rewards",      description: "Exchange points for Starbucks or Tim Hortons gift cards" },
    { icon: <Shield size={40} />, title: "Secure Platform",     description: "Your data and rewards are protected with enterprise-grade security" },
    { icon: <Clock size={40} />,  title: "Quick Games",         description: "Play short sessions that fit into your busy schedule" },
    { icon: <Users size={40} />,  title: "Global Community",    description: "Compete with players from around the world" }
  ];

  // Enhanced games data with detailed rules and descriptions
  const games = [
    { 
      name: "Number Grid", 
      description: "Test your memory with numbers",  
      gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", 
      icon: Dice5,
      detailedDescription: "A challenging memory game where you need to remember number sequences and patterns.",
      rules: [
        "Memorize the numbers shown in the grid",
        "Recreate the sequence in the correct order",
        "Each level increases the grid size and complexity",
        "Complete within the time limit to earn maximum points"
      ],
      difficulty: "Easy to Hard"
    },
    { 
      name: "Color Grid",  
      description: "Match the colors correctly",     
      gradient: "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)", 
      icon: Shapes,
      detailedDescription: "Test your color memory and pattern recognition skills in this vibrant game.",
      rules: [
        "Remember the color pattern displayed",
        "Replicate the exact color sequence",
        "Colors will flash for a limited time",
        "Accuracy matters more than speed"
      ],
      difficulty: "Easy to Medium"
    },
    { 
      name: "Tic Tac Toe", 
      description: "Classic game with AI opponent",  
      gradient: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)", 
      icon: Grid3X3,
      detailedDescription: "The timeless classic with smart AI opponents at various difficulty levels.",
      rules: [
        "Place your mark (X or O) on a 3x3 grid",
        "Get three in a row horizontally, vertically, or diagonally",
        "Play against AI with adjustable difficulty",
        "Draw games award fewer points than wins"
      ],
      difficulty: "Easy to Extreme"
    },
    { 
      name: "QuizQuest",   
      description: "Answer trivia questions",        
      gradient: "linear-gradient(135deg, #5614b0 0%, #dbd65c 100%)", 
      icon: Puzzle,
      detailedDescription: "Test your knowledge across various categories with timed trivia challenges.",
      rules: [
        "Answer multiple-choice questions correctly",
        "Each correct answer earns points",
        "Faster answers earn bonus points",
        "Use power-ups strategically (if available)"
      ],
      difficulty: "Medium to Hard"
    },
    { 
      name: "Chess",       
      description: "Strategic board game",           
      gradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)", 
      icon: Sword,
      detailedDescription: "The ultimate test of strategy and foresight against intelligent AI.",
      rules: [
        "Standard chess rules apply",
        "Checkmate the opponent's king to win",
        "Different time controls available",
        "Earn bonus points for quick victories"
      ],
      difficulty: "Hard to Extreme"
    },
    { 
      name: "Sudoku",      
      description: "Logical number puzzle",          
      gradient: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)", 
      icon: Brain,
      detailedDescription: "Challenge your logical thinking with classic Sudoku puzzles.",
      rules: [
        "Fill the 9x9 grid with numbers 1-9",
        "No duplicates in any row, column, or 3x3 box",
        "Complete the puzzle as quickly as possible",
        "Fewer mistakes = higher score"
      ],
      difficulty: "Medium to Extreme"
    },
    { 
      name: "Crossword",   
      description: "Word puzzle challenge",          
      gradient: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)", 
      icon: Puzzle,
      detailedDescription: "Expand your vocabulary and test your word knowledge with daily puzzles.",
      rules: [
        "Fill in words based on given clues",
        "Words intersect with each other",
        "Complete the entire puzzle",
        "Use hints sparingly for maximum points"
      ],
      difficulty: "Medium to Hard"
    }
  ];

  const openGameModal = (game) => {
    setSelectedGame(game);
  };

  const closeGameModal = () => {
    setSelectedGame(null);
  };

  // Close modal when clicking outside content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeGameModal();
    }
  };

  return (
    <div className="container">
      {/* 3D Background */}
      <div className="canvas-container">
        <ThreeScene />
      </div>

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="modal-overlay" onClick={handleBackdropClick}>
          <div className="game-modal">
            <div className="game-modal-header" style={{ background: selectedGame.gradient }}>
              <div className="game-modal-title">
                <selectedGame.icon size={24} />
                <h2>{selectedGame.name}</h2>
              </div>
              <button className="modal-close-btn" onClick={closeGameModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="game-modal-content">
              <div className="game-modal-section">
                <h3>About This Game</h3>
                <p>{selectedGame.detailedDescription}</p>
              </div>

              <div className="game-modal-section">
                <h3>How to Play</h3>
                <ul className="game-rules-list">
                  {selectedGame.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="game-modal-meta">
                <div className="difficulty-badge">
                  <span>Difficulty:</span>
                  <strong>{selectedGame.difficulty}</strong>
                </div>
                <div className="points-info">
                  <span>Points Range:</span>
                  <strong>25 - 100 points</strong>
                </div>
              </div>

              <div className="game-modal-actions">
                <Link 
                  to="/games" 
                  className="btn btn-primary"
                  onClick={closeGameModal}
                >
                  <Play size={16} />
                  Play Now
                </Link>
                <button 
                  className="btn btn-secondary"
                  onClick={closeGameModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero animate-fadeIn">
        <h1 className="text-gradient">WIN AND RULE</h1>
        <p>Test your skills, earn points, and redeem exciting rewards at our gaming arena!</p>

        {userData ? (
          <div className="cta-center">
            <Link to="/games" className="btn btn-primary btn-lg">
              <Play size={20} /> Play Games
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg">
              <Trophy size={20} /> View Leaderboard
            </Link>
            <Link to="/redeem" className="btn btn-accent btn-lg">
              <Gift size={20} /> Redeem Points
            </Link>
          </div>
        ) : (
          <div className="cta-center">
            <Link to="/register" className="btn btn-primary btn-lg">Join Now</Link>
            <Link to="/games" className="btn btn-secondary btn-lg">View Games</Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mt-5">
        <h2 className="text-center mb-4">Why Choose WAR?</h2>
        <div className="grid grid-3">
          {features.map((f, i) => (
            <div key={i} className="card hover-lift">
              <div className="text-center mb-3" style={{ color: 'var(--primary)' }}>{f.icon}</div>
              <h3 className="text-center mb-2">{f.title}</h3>
              <p className="text-center text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section className="mt-5">
        <h2 className="text-center mb-4">Featured Games</h2>
        <div className="grid grid-3">
          {games.map((g) => {
            const Icon = g.icon;
            return (
              <div 
                key={g.name} 
                className="game-card hover-scale" 
                style={{ background: g.gradient }}
                onClick={() => openGameModal(g)}
              >
                <div className="game-card-content">
                  <div className="game-card-top">
                    <div className="game-icon-badge"><Icon size={18} /></div>
                    <h3>{g.name}</h3>
                  </div>
                  <p>{g.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4">
          <Link to="/games" className="btn btn-primary">View All Games</Link>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      {/* Points Section */}
      <section className="mt-5">
        <div className="card">
          <h2 className="text-center mb-4">Earning Points</h2>
          <div className="grid grid-4 text-center">
            <div><div className="badge badge-primary mb-2">Easy</div><h3 className="text-success">25 Points</h3></div>
            <div><div className="badge badge-warning mb-2">Medium</div><h3 className="text-warning">50 Points</h3></div>
            <div><div className="badge badge-accent  mb-2">Hard</div><h3 className="text-accent">75 Points</h3></div>
            <div><div className="badge badge-danger  mb-2">Extreme</div><h3 className="text-danger">100 Points</h3></div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="mt-5">
        <h2 className="text-center mb-4">Redeem Your Points</h2>
        <div className="grid grid-3">
          <div className="card text-center">
            <Gift size={60} className="mx-auto mb-3" style={{ color: 'var(--success)' }} />
            <h3>$10 Gift Card</h3>
            <p className="text-muted mb-3">10,000 Points</p>
            <div className="badge badge-success">Starbucks & Tim Hortons</div>
          </div>
          <div className="card text-center">
            <Gift size={60} className="mx-auto mb-3" style={{ color: 'var(--primary)' }} />
            <h3>$20 Gift Card</h3>
            <p className="text-muted mb-3">20,000 Points</p>
            <div className="badge badge-primary">Starbucks & Tim Hortons</div>
          </div>
          <div className="card text-center">
            <Gift size={60} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <h3>$30 Gift Card</h3>
            <p className="text-muted mb-3">30,000 Points</p>
            <div className="badge badge-accent">Starbucks & Tim Hortons</div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/redeem" className="btn btn-accent">Redeem Now</Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-5 mb-5">
        <div className="card text-center p-5">
          <Users size={80} className="mx-auto mb-4" style={{ color: 'var(--secondary)' }} />
          <h2 className="mb-3">Join Thousands of Players</h2>
          <p className="text-muted mb-4 max-w-2xl mx-auto">
            Become part of our growing community of gamers who test their skills,
            climb the leaderboards, and earn real rewards for their achievements.
          </p>
          {!userData && (
            <Link to="/register" className="btn btn-primary btn-lg">Sign Up Now - It's Free!</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;