// src/components/games/GameModal.jsx
import React, { useState, useCallback, useEffect } from "react";
import { X, PlayCircle, CheckCircle2, Star, Target, Zap } from "lucide-react";

// Game components
import NumberGrid from "./NumberGrid";
import ColorGrid from "./ColorGrid";
import TicTacToe from "./TicTacToe";
import QuizQuest from "./QuizQuest";
import Chess from "./Chess";
import Sudoku from "./Sudoku";
import Crossword from "./Crossword";

import { useGame } from "../../context/GameContext";

const DIFF_LABEL = { 
  easy: "Easy", 
  medium: "Medium", 
  hard: "Hard", 
  extreme: "Extreme" 
};

const DIFF_COLORS = {
  easy: "from-green-500 to-emerald-500",
  medium: "from-blue-500 to-cyan-500",
  hard: "from-orange-500 to-red-500",
  extreme: "from-purple-500 to-pink-500"
};

const GameModal = ({ game, onClose, onGameEnd }) => {
  const { saveGameResult, POINTS_SYSTEM } = useGame();

  const [difficulty, setDifficulty] = useState("easy");
  const [launched, setLaunched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState("");
  const [gameCompleted, setGameCompleted] = useState(false);

  const start = () => { 
    setError(""); 
    setLaunched(true); 
    setGameCompleted(false);
    setSaved(null);
  };

  const handleChildEnd = useCallback(
    async (payload) => {
      // Only process if we haven't already completed a game
      if (gameCompleted) return;
      
      // expected from child: { score, completed, pointsEarned?, duration? }
      const safe = {
        score: Math.max(0, Math.floor(payload?.score || 0)),
        completed: !!payload?.completed,
        duration: typeof payload?.duration === 'number' ? Math.max(0, Math.floor(payload.duration)) : 0,
      };

      let pts = typeof payload?.pointsEarned === 'number' ? payload.pointsEarned : 0;
      if (pts <= 0 && safe.completed && safe.score > 0) {
        pts = POINTS_SYSTEM[difficulty] || 0;
      }
      safe.pointsEarned = Math.max(0, Math.floor(pts));

      try {
        setSaving(true);
        setError("");
        setGameCompleted(true);

        if (typeof onGameEnd === "function") {
          await onGameEnd({
            ...safe,
            gameId: game.id,
            gameName: game.name,
            difficulty,
            endedAt: new Date().toISOString(),
          });
        } else {
          await saveGameResult({
            gameId: game.id,
            gameName: game.name,
            difficulty,
            score: safe.score,
            completed: safe.completed,
            pointsEarned: safe.pointsEarned,
            duration: safe.duration,
          });
        }

        // Store the saved result to show later
        setSaved(safe);
        
      } catch (e) {
        setError(e?.message || "Could not save your result. Please try again.");
        setGameCompleted(false); // Reset if save failed
      } finally {
        setSaving(false);
      }
    },
    [POINTS_SYSTEM, difficulty, game?.id, game?.name, onGameEnd, saveGameResult, gameCompleted]
  );

  // This function handles when the game wants to exit (after countdown)
  const handleGameExit = useCallback(() => {
    // If we have saved results, show them instead of closing
    if (saved) {
      // We're already showing the results via the saved state
      console.log("Game exit called with saved results");
    } else {
      // No results yet, just close
      onClose();
    }
  }, [saved, onClose]);

  const commonProps = { 
    difficulty, 
    onGameEnd: handleChildEnd, 
    onExit: handleGameExit
  };

  const renderGame = () => {
    switch (game.id) {
      case "number-grid": return <NumberGrid {...commonProps} />;
      case "color-grid":  return <ColorGrid {...commonProps} />;
      case "tic-tac-toe": return <TicTacToe {...commonProps} />;
      case "quizquest":   return <QuizQuest {...commonProps} />;
      case "chess":       return <Chess {...commonProps} />;
      case "sudoku":      return <Sudoku {...commonProps} />;
      case "crossword":   return <Crossword {...commonProps} />;
      default:            return <div className="p-4">Coming soon…</div>;
    }
  };

  const handlePlayAgain = () => {
    setSaved(null);
    setGameCompleted(false);
    setLaunched(false);
    setError("");
  };

  const handleClose = () => {
    setSaved(null);
    setGameCompleted(false);
    setLaunched(false);
    setError("");
    onClose();
  };

  // If we have saved results and the game is still "launched", 
  // it means the game component is showing its countdown
  // We should wait for the game's onExit to be called
  const showGameResults = saved && !launched;
  const showGameComponent = launched && !saved;

  // Game-specific descriptions and features
  const getGameFeatures = () => {
    switch (game.id) {
      case "color-grid":
        return [
          "3D rotating color cubes with advanced animations",
          "Real-time hover effects and visual feedback",
          "Multiple difficulty levels with progressive challenges",
          "Combo streaks and accuracy tracking",
          "Time-based scoring with bonuses"
        ];
      case "number-grid":
        return [
          "Memory challenge with numeric sequences",
          "Distractor elements to test focus",
          "Progressive difficulty with longer sequences",
          "Keyboard and on-screen input support",
          "Streak-based scoring system"
        ];
      case "tic-tac-toe":
        return [
          "Classic 3-in-a-row gameplay",
          "Smart AI opponents",
          "Earn points while playing against the bot, play for fun with friends",
          "Multiple difficulty levels",
          "Quick strategic matches",
          "Perfect for short gaming sessions"
        ];
      default:
        return [
          "Engaging gameplay mechanics",
          "Multiple difficulty settings",
          "Score tracking and progression",
          "Skill-based challenges",
          "Regular updates and improvements"
        ];
    }
  };

  const getGameIcon = () => {
    switch (game.id) {
      case "color-grid":
        return <Target className="text-white" size={24} />;
      case "number-grid":
        return <Zap className="text-white" size={24} />;
      default:
        return <Star className="text-white" size={24} />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="game-modal">
        <div 
          className="game-modal-header" 
          style={{ 
            background: `linear-gradient(135deg, ${game.color}30, ${game.color}60)`,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="game-modal-title">
            <div className="game-icon-wrapper" style={{ backgroundColor: game.color }}>
              {getGameIcon()}
            </div>
            <div>
              <h2>{game.name}</h2>
              <p className="game-modal-subtitle">Test your skills and earn points!</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="game-modal-content">
          {showGameResults ? (
            <>
              <div className="game-modal-section">
                <div className="banner banner-success">
                  <CheckCircle2 size={20} />
                  <span>Game Complete — Points Saved!</span>
                </div>
                
                <div className="results-grid">
                  <div className="result-card">
                    <div className="result-label">Difficulty</div>
                    <div className={`result-value difficulty-${difficulty}`}>
                      {DIFF_LABEL[difficulty]}
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Score</div>
                    <div className="result-value score-value">{saved.score}</div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Completed</div>
                    <div className={`result-value ${saved.completed ? 'completed-yes' : 'completed-no'}`}>
                      {saved.completed ? "✓ Success" : "✗ Failed"}
                    </div>
                  </div>
                  
                  <div className="result-card highlight">
                    <div className="result-label">Points Earned</div>
                    <div className="result-value points-value">+{saved.pointsEarned}</div>
                  </div>
                </div>

                {saved.completed && (
                  <div className="achievement-badge">
                    <Star size={16} />
                    <span>Mission Accomplished!</span>
                  </div>
                )}
              </div>

              <div className="game-modal-actions">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Back to Games
                </button>
                <button className="btn btn-primary" onClick={handlePlayAgain}>
                  <PlayCircle size={18} />
                  Play Again
                </button>
              </div>
            </>
          ) : !launched ? (
            <>
              <div className="game-modal-section">
                <h3>About This Game</h3>
                <p className="game-description">{game.description}</p>
                
                <div className="features-list">
                  <h4>Features:</h4>
                  <ul>
                    {getGameFeatures().map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="game-modal-meta">
                <div className={`difficulty-badge ${difficulty}`}>
                  <span>Selected Difficulty</span>
                  <strong>{DIFF_LABEL[difficulty]}</strong>
                </div>
                <div className="points-info">
                  <span>Potential Rewards</span>
                  <div className="points-breakdown">
                    <span className="point-item easy">Easy: {POINTS_SYSTEM.easy}</span>
                    <span className="point-item medium">Medium: {POINTS_SYSTEM.medium}</span>
                    <span className="point-item hard">Hard: {POINTS_SYSTEM.hard}</span>
                    <span className="point-item extreme">Extreme: {POINTS_SYSTEM.extreme}</span>
                  </div>
                </div>
              </div>

              <div className="game-modal-section">
                <h3>Select Difficulty</h3>
                <div className="difficulty-selector">
                  {["easy","medium","hard","extreme"].map(d => (
                    <button 
                      key={d} 
                      className={`difficulty-btn ${d} ${d===difficulty?"active":""}`}
                      onClick={() => setDifficulty(d)}
                    >
                      <span className="difficulty-name">{DIFF_LABEL[d]}</span>
                      <span className="difficulty-points">{POINTS_SYSTEM[d]} pts</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="banner banner-error">
                  {error}
                </div>
              )}

              <div className="game-modal-actions">
                <button 
                  className="btn btn-primary start-btn" 
                  onClick={start} 
                  disabled={saving}
                >
                  <PlayCircle size={20} />
                  {saving ? "Starting..." : "Start Game"}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleClose} 
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {error && (
                <div className="banner banner-error">
                  {error}
                </div>
              )}
              <div className="game-container">
                {renderGame()}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .game-modal {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .game-modal-header {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .game-modal-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .game-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .game-modal-title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .game-modal-subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .game-modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .game-modal-section {
          margin-bottom: 24px;
        }

        .game-modal-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: white;
        }

        .game-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .features-list {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
        }

        .features-list h4 {
          margin: 0 0 12px 0;
          color: white;
          font-size: 16px;
        }

        .features-list ul {
          margin: 0;
          padding-left: 16px;
          color: rgba(255, 255, 255, 0.7);
        }

        .features-list li {
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .game-modal-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .difficulty-badge {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .difficulty-badge.easy {
          border-left: 4px solid #10b981;
        }

        .difficulty-badge.medium {
          border-left: 4px solid #3b82f6;
        }

        .difficulty-badge.hard {
          border-left: 4px solid #f59e0b;
        }

        .difficulty-badge.extreme {
          border-left: 4px solid #ef4444;
        }

        .difficulty-badge span {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }

        .difficulty-badge strong {
          display: block;
          font-size: 18px;
          color: white;
        }

        .points-info {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .points-info span {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .points-breakdown {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .point-item {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          text-align: center;
        }

        .point-item.easy {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .point-item.medium {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .point-item.hard {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .point-item.extreme {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .difficulty-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .difficulty-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 16px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .difficulty-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
        }

        .difficulty-btn.active {
          border-color: currentColor;
          transform: scale(1.05);
        }

        .difficulty-btn.easy {
          color: #10b981;
        }

        .difficulty-btn.medium {
          color: #3b82f6;
        }

        .difficulty-btn.hard {
          color: #f59e0b;
        }

        .difficulty-btn.extreme {
          color: #ef4444;
        }

        .difficulty-btn.active.easy {
          background: rgba(16, 185, 129, 0.2);
        }

        .difficulty-btn.active.medium {
          background: rgba(59, 130, 246, 0.2);
        }

        .difficulty-btn.active.hard {
          background: rgba(245, 158, 11, 0.2);
        }

        .difficulty-btn.active.extreme {
          background: rgba(239, 68, 68, 0.2);
        }

        .difficulty-name {
          font-weight: 600;
          font-size: 14px;
        }

        .difficulty-points {
          font-size: 12px;
          opacity: 0.8;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .result-card.highlight {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .result-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .result-value {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .difficulty-easy { color: #10b981; }
        .difficulty-medium { color: #3b82f6; }
        .difficulty-hard { color: #f59e0b; }
        .difficulty-extreme { color: #ef4444; }

        .score-value { color: #f59e0b; }
        .points-value { color: #10b981; }
        .completed-yes { color: #10b981; }
        .completed-no { color: #ef4444; }

        .achievement-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-top: 16px;
        }

        .banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .banner-success {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .banner-error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .game-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          color: white;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .start-btn {
          background: linear-gradient(45deg, ${game.color}, ${game.color}dd);
          font-size: 16px;
          padding: 14px 28px;
        }

        .game-container {
          border-radius: 12px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }

          .game-modal {
            max-height: 95vh;
          }

          .game-modal-header {
            padding: 16px;
          }

          .game-modal-content {
            padding: 16px;
          }

          .game-modal-meta {
            grid-template-columns: 1fr;
          }

          .difficulty-selector {
            grid-template-columns: 1fr 1fr;
          }

          .results-grid {
            grid-template-columns: 1fr 1fr;
          }

          .game-modal-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .results-grid {
            grid-template-columns: 1fr;
          }

          .difficulty-selector {
            grid-template-columns: 1fr;
          }

          .points-breakdown {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GameModal;