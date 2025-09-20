import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Play, Trophy, Gift, Users, Star, Shield, Clock } from 'lucide-react';
import ThreeScene from '../components/common/ThreeScene';

const Home = () => {
  const { userData } = useAuth();

  const features = [
    {
      icon: <Star size={40} />,
      title: "7 Skill-Based Games",
      description: "Challenge yourself with diverse games that test your cognitive abilities"
    },
    {
      icon: <Trophy size={40} />,
      title: "Earn Points",
      description: "Win games to earn points based on difficulty level"
    },
    {
      icon: <Gift size={40} />,
      title: "Redeem Rewards",
      description: "Exchange points for Starbucks or Tim Hortons gift cards"
    },
    {
      icon: <Shield size={40} />,
      title: "Secure Platform",
      description: "Your data and rewards are protected with enterprise-grade security"
    },
    {
      icon: <Clock size={40} />,
      title: "Quick Games",
      description: "Play short sessions that fit into your busy schedule"
    },
    {
      icon: <Users size={40} />,
      title: "Global Community",
      description: "Compete with players from around the world"
    }
  ];

  const games = [
    {
      name: "Number Grid",
      description: "Test your memory with numbers",
      gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
    },
    {
      name: "Color Grid",
      description: "Match the colors correctly",
      gradient: "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)"
    },
    {
      name: "Tic Tac Toe",
      description: "Classic game with AI opponent",
      gradient: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)"
    },
    {
      name: "QuizQuest",
      description: "Answer trivia questions",
      gradient: "linear-gradient(135deg, #5614b0 0%, #dbd65c 100%)"
    },
    {
      name: "Chess",
      description: "Strategic board game",
      gradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)"
    },
    {
      name: "Sudoku",
      description: "Logical number puzzle",
      gradient: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)"
    },
    {
      name: "Crossword",
      description: "Word puzzle challenge",
      gradient: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)"
    }
  ];

  return (
    <div className="container">
      {/* 3D Background */}
      <div className="canvas-container">
        <ThreeScene />
      </div>
      
      {/* Hero Section */}
      <section className="hero animate-fadeIn">
        <h1 className="text-gradient">WIN AND RULE</h1>
        <p>Test your skills, earn points, and redeem exciting rewards at our gaming arena!</p>
        
        {userData ? (
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/games" className="btn btn-primary btn-lg">
              <Play size={20} />
              Play Games
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg">
              <Trophy size={20} />
              View Leaderboard
            </Link>
            <Link to="/redeem" className="btn btn-accent btn-lg">
              <Gift size={20} />
              Redeem Points
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">
              Join Now
            </Link>
            <Link to="/games" className="btn btn-secondary btn-lg">
              View Games
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mt-5">
        <h2 className="text-center mb-4">Why Choose WAR?</h2>
        
        <div className="grid grid-3">
          {features.map((feature, index) => (
            <div key={index} className="card hover-lift">
              <div className="text-center mb-3" style={{ color: 'var(--primary)' }}>
                {feature.icon}
              </div>
              <h3 className="text-center mb-2">{feature.title}</h3>
              <p className="text-center text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Games Preview Section */}
      <section className="mt-5">
        <h2 className="text-center mb-4">Featured Games</h2>
        
        <div className="grid grid-3">
          {games.map((game, index) => (
            <div 
              key={index} 
              className="game-card hover-scale" 
              style={{ background: game.gradient }}
            >
              <div className="game-card-content">
                <h3>{game.name}</h3>
                <p>{game.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Link to="/games" className="btn btn-primary">
            View All Games
          </Link>
        </div>
      </section>

      {/* Points System Section */}
      <section className="mt-5">
        <div className="card">
          <h2 className="text-center mb-4">Earning Points</h2>
          
          <div className="grid grid-4 text-center">
            <div>
              <div className="badge badge-primary mb-2">Easy</div>
              <h3 className="text-success">25 Points</h3>
            </div>
            <div>
              <div className="badge badge-warning mb-2">Medium</div>
              <h3 className="text-warning">50 Points</h3>
            </div>
            <div>
              <div className="badge badge-accent mb-2">Hard</div>
              <h3 className="text-accent">75 Points</h3>
            </div>
            <div>
              <div className="badge badge-danger mb-2">Extreme</div>
              <h3 className="text-danger">100 Points</h3>
            </div>
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
          <Link to="/redeem" className="btn btn-accent">
            Redeem Now
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-5 mb-5">
        <div className="card text-center p-5">
          <Users size={80} className="mx-auto mb-4" style={{ color: 'var(--secondary)' }} />
          <h2 className="mb-3">Join Thousands of Players</h2>
          <p className="text-muted mb-4 max-w-2xl mx-auto">
            Become part of our growing community of gamers who test their skills, 
            climb the leaderboards, and earn real rewards for their achievements.
          </p>
          
          {!userData && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Sign Up Now - It's Free!
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;