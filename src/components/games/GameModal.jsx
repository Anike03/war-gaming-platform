// src/components/games/GameModal.jsx
import React, { useState, useCallback, useEffect } from "react";
import { X, PlayCircle, CheckCircle2 } from "lucide-react";

// Game components
import NumberGrid from "./NumberGrid";
import ColorGrid from "./ColorGrid";
import TicTacToe from "./TicTacToe";
import QuizQuest from "./QuizQuest";
import Chess from "./Chess";
import Sudoku from "./Sudoku";
import Crossword from "./Crossword";

import { useGame } from "../../context/GameContext";

const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard", extreme: "Extreme" };

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

  return (
    <div className="modal-overlay">
      <div className="game-modal">
        <div className="game-modal-header" style={{ background: game.color }}>
          <div className="game-modal-title">
            <span style={{ fontSize: 28 }} aria-hidden>{game.icon}</span>
            <h2>{game.name}</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="game-modal-content">
          {showGameResults ? (
            <>
              <div className="game-modal-section">
                <div className="banner banner-success" style={{ marginTop: 0 }}>
                  <CheckCircle2 size={18} />
                  <span>Game Over — your points have been saved!</span>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="card">
                    <div className="text-muted">Difficulty</div>
                    <div className="text-2xl font-bold">{DIFF_LABEL[difficulty]}</div>
                  </div>
                  <div className="card">
                    <div className="text-muted">Score</div>
                    <div className="text-2xl font-bold">{saved.score}</div>
                  </div>
                  <div className="card">
                    <div className="text-muted">Completed</div>
                    <div className="text-2xl font-bold">{saved.completed ? "Yes" : "No"}</div>
                  </div>
                  <div className="card">
                    <div className="text-muted">Points Earned</div>
                    <div className="text-2xl font-bold text-success">{saved.pointsEarned}</div>
                  </div>
                </div>
              </div>

              <div className="game-modal-actions">
                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button className="btn btn-primary" onClick={handlePlayAgain}>
                  Play Again
                </button>
              </div>
            </>
          ) : !launched ? (
            <>
              <div className="game-modal-section">
                <h3>About</h3>
                <p>{game.description}</p>
              </div>

              <div className="game-modal-meta">
                <div className="difficulty-badge">
                  <span>Difficulty</span>
                  <strong>{DIFF_LABEL[difficulty]}</strong>
                </div>
                <div className="points-info">
                  <span>Rewards</span>
                  <strong>
                    Easy {POINTS_SYSTEM.easy} • Medium {POINTS_SYSTEM.medium} • Hard {POINTS_SYSTEM.hard} • Extreme {POINTS_SYSTEM.extreme}
                  </strong>
                </div>
              </div>

              <div className="game-modal-section">
                <h3>Choose difficulty</h3>
                <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                  {["easy","medium","hard","extreme"].map(d => (
                    <button key={d} className={`btn ${d===difficulty?"btn-primary":""}`} onClick={() => setDifficulty(d)}>
                      {DIFF_LABEL[d]}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="banner banner-error" style={{ marginTop: 4 }}>{error}</div>}

              <div className="game-modal-actions">
                <button className="btn btn-primary" onClick={start} disabled={saving}>
                  <PlayCircle size={18} /> Start Game
                </button>
                <button className="btn btn-secondary" onClick={handleClose} disabled={saving}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              {error && <div className="banner banner-error" style={{ marginBottom: 10 }}>{error}</div>}
              {renderGame()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;