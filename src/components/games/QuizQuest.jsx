// src/components/games/QuizQuest.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Timer,
  Star,
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  Zap,
  Trophy,
  RotateCcw,
  Home,
  Clock,
} from 'lucide-react';
import { useGame } from '../../hooks';
import { getQuizQuestions, calculatePoints } from '../../utils/gameLogic/quizData';
import './QuizQuest.css';

const TIME_LIMITS = { easy: 20, medium: 15, hard: 10, extreme: 7 };
const QUESTION_COUNTS = { easy: 10, medium: 12, hard: 15, extreme: 18 };

const QuizQuest = ({ difficulty = 'easy', onGameEnd, onExit }) => {
  const { endGame, updateScore } = useGame();

  // ------------ State ------------
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);

  const [countdown, setCountdown] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [pointsEarnedThisQ, setPointsEarnedThisQ] = useState(0);

  const [results, setResults] = useState(null);

  // track total play time
  const startedAtRef = useRef(null);
  const perQuestionTimerRef = useRef(null);

  // ------------ Init ------------
  const qCount = useMemo(() => QUESTION_COUNTS[difficulty] || 10, [difficulty]);
  const perQTime = useMemo(() => TIME_LIMITS[difficulty] || 15, [difficulty]);

  const initGame = useCallback(() => {
    const qs = getQuizQuestions(difficulty, qCount);
    setQuestions(qs);
    setIdx(0);
    setSelected(null);
    setScore(0);
    setTimeLeft(perQTime);
    setGameOver(false);
    setShowResult(false);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setCountdown(0);
    setIsTransitioning(false);
    setTimeoutFlag(false);
    setPointsEarnedThisQ(0);
    setResults(null);
    startedAtRef.current = Date.now();
  }, [difficulty, perQTime, qCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // ------------ Timer for question ------------
  useEffect(() => {
    if (gameOver || showResult || isTransitioning || questions.length === 0) return;

    // run once per second
    perQuestionTimerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        return next >= 0 ? next : 0;
      });
    }, 1000);

    return () => {
      clearInterval(perQuestionTimerRef.current);
    };
  }, [gameOver, showResult, isTransitioning, questions.length]);

  // Trigger timeout exactly when timeLeft hits 0 (and we are not already showing result)
  useEffect(() => {
    if (!gameOver && !showResult && questions.length > 0 && timeLeft === 0) {
      handleTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ------------ Transition countdown (7s) ------------
  useEffect(() => {
    if (!isTransitioning) return;
    if (countdown <= 0) {
      // move to next question once countdown finishes
      moveNext();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [isTransitioning, countdown]);

  // ------------ Keyboard shortcuts ------------
  useEffect(() => {
    const onKey = (e) => {
      // 1..4 chooses option; ignore when locked
      if (gameOver || showResult || isTransitioning) return;
      if (e.key >= '1' && e.key <= '4') {
        const n = Number(e.key) - 1;
        const opts = questions[idx]?.options || [];
        if (opts[n] != null) {
          handleSelect(opts[n]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameOver, showResult, isTransitioning, idx, questions]);

  // ------------ Handlers ------------
  const handleSelect = (answer) => {
    if (selected || gameOver || isTransitioning) return;
    setSelected(answer);
    setShowResult(true);

    const q = questions[idx];
    const good = answer === q.answer;

    if (good) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setCorrect((c) => c + 1);

      const add = calculatePoints(difficulty, timeLeft, newStreak);
      setPointsEarnedThisQ(add);
      setScore((s) => s + add);
      updateScore(add);
    } else {
      setStreak(0);
      setPointsEarnedThisQ(0);
    }

    setIsTransitioning(true);
    setCountdown(7);
  };

  const handleTimeout = () => {
    setTimeoutFlag(true);
    setSelected(null);
    setShowResult(true);
    setStreak(0);
    setPointsEarnedThisQ(0);
    setIsTransitioning(true);
    setCountdown(7);
  };

  const moveNext = () => {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowResult(false);
      setTimeoutFlag(false);
      setIsTransitioning(false);
      setCountdown(0);
      setPointsEarnedThisQ(0);
      setTimeLeft(perQTime);
    } else {
      finishGame();
    }
  };

  const totalDurationSec = () =>
    Math.max(0, Math.round((Date.now() - (startedAtRef.current || Date.now())) / 1000));

  const finishGame = async () => {
    setGameOver(true);

    const totalQs = questions.length || 1;
    const accuracy = Math.round((correct / totalQs) * 100);
    const data = {
      score,
      correctAnswers: correct,
      totalQuestions: totalQs,
      accuracy,
      bestStreak,
      timeUsed: totalDurationSec(),
      completed: correct > 0,
    };
    setResults(data);

    // points to save (fallback: 30% of score, min 10, only if any correct)
    const finalPoints = data.completed ? Math.max(10, Math.floor(score * 0.3)) : 0;

    const payload = {
      score,
      completed: data.completed,
      pointsEarned: finalPoints,
      duration: data.timeUsed,
      meta: {
        correctAnswers: correct,
        totalQuestions: totalQs,
        accuracy,
        bestStreak,
      },
    };

    // Prefer GameModal's onGameEnd; otherwise use GameContext.endGame
    try {
      if (typeof onGameEnd === 'function') {
        await onGameEnd(payload);
      } else {
        // old signature: endGame(score, completed)
        await endGame(score, data.completed);
      }
    } catch (e) {
      // Non-fatal for the player UI
      // eslint-disable-next-line no-console
      console.error('Save quiz result failed:', e);
    }
  };

  const handleExit = () => onExit && onExit();

  // ------------ Render ------------
  if (gameOver && results) {
    return (
      <div className="quiz-shell">
        <div className="card quiz-results">
          <div className="quiz-results-header">
            <Trophy size={48} className="quiz-trophy" />
            <h1 className="quiz-results-title">Quiz Complete!</h1>
            <p className="quiz-results-subtitle">
              {results.correctAnswers === results.totalQuestions
                ? '🎉 Perfect Score! Amazing!'
                : results.accuracy >= 80
                ? '🌟 Great Job!'
                : results.accuracy >= 60
                ? '👍 Well Done!'
                : '💪 Keep Practicing!'}
            </p>
          </div>

          <div className="quiz-results-stats">
            <div className="quiz-results-stat main-stat">
              <span className="label">Final Score</span>
              <span className="value">{results.score}</span>
            </div>

            <div className="quiz-results-grid">
              <div className="quiz-results-stat">
                <span className="label">Correct Answers</span>
                <span className="value">
                  {results.correctAnswers}/{results.totalQuestions}
                </span>
              </div>

              <div className="quiz-results-stat">
                <span className="label">Accuracy</span>
                <span className="value">{results.accuracy}%</span>
              </div>

              <div className="quiz-results-stat">
                <span className="label">Best Streak</span>
                <span className="value">{results.bestStreak}</span>
              </div>

              <div className="quiz-results-stat">
                <span className="label">Time Used</span>
                <span className="value">
                  {Math.floor(results.timeUsed / 60)}:
                  {(results.timeUsed % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="quiz-results-stat highlight">
                <span className="label">Points Earned</span>
                <span className="value">
                  +{Math.max(10, Math.floor(results.score * 0.3))}
                </span>
              </div>
            </div>
          </div>

          <div className="quiz-results-actions">
            <button className="btn btn-secondary" onClick={handleExit}>
              <Home size={18} />
              Back to Games
            </button>
            <button className="btn btn-primary" onClick={initGame}>
              <RotateCcw size={18} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-shell">
        <div className="card quiz-loading">
          <div className="loading-spinner" />
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const progressPct = ((idx + 1) / questions.length) * 100;
  const isCorrectSel = selected === q.answer;

  return (
    <div className="quiz-shell">
      {/* Top bar */}
      <div className="quiz-top">
        <div className="quiz-pill">
          <span className={`quiz-dot ${difficulty}`} />
          Difficulty <strong>{difficulty}</strong>
        </div>
        {!showResult && (
          <div className="quiz-pill">
            <Timer size={14} />
            Time <strong>{timeLeft}s</strong>
          </div>
        )}
        <div className="quiz-pill">
          <Star size={14} />
          Score <strong>{score}</strong>
        </div>
        <div className="quiz-pill">
          <Zap size={14} />
          Streak <strong>{streak}</strong>
        </div>
        {showResult && isTransitioning && (
          <div className="quiz-pill countdown-pill">
            <Clock size={14} />
            Next in <strong>{countdown}s</strong>
          </div>
        )}
      </div>

      {/* Question */}
      <div className={`card quiz-question-card ${showResult ? 'show-result' : ''}`}>
        <div className="quiz-question-header">
          <div className="quiz-category-badge">{q.category}</div>
          <div className="quiz-question-counter">
            <HelpCircle size={16} />
            {idx + 1}/{questions.length}
          </div>
        </div>

        <h2 className="quiz-question-text">{q.question}</h2>

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            const selectedThis = selected === opt;
            const showCorrect = showResult && opt === q.answer;
            const showIncorrect = showResult && selectedThis && opt !== q.answer;
            const showTimeoutMark = showResult && timeoutFlag && opt === q.answer;

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showResult || isTransitioning}
                className={`quiz-option
                  ${selectedThis ? 'selected' : ''}
                  ${showCorrect ? 'correct' : ''}
                  ${showIncorrect ? 'incorrect' : ''}
                  ${showTimeoutMark ? 'correct' : ''}`}
                aria-label={`Answer option ${i + 1}`}
              >
                <div className="quiz-option-content">
                  <span className="quiz-option-text">{opt}</span>

                  {showCorrect && (
                    <div className="quiz-option-feedback">
                      <CheckCircle size={20} className="correct-icon" />
                      <span className="feedback-text">Correct!</span>
                    </div>
                  )}
                  {showIncorrect && (
                    <div className="quiz-option-feedback">
                      <XCircle size={20} className="incorrect-icon" />
                      <span className="feedback-text">Incorrect</span>
                    </div>
                  )}
                  {showTimeoutMark && (
                    <div className="quiz-option-feedback">
                      <CheckCircle size={20} className="correct-icon" />
                      <span className="feedback-text">Correct Answer</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Per-question result */}
        {showResult && (
          <div
            className={`quiz-result-summary ${
              isCorrectSel ? 'ok' : timeoutFlag ? 'timeout' : 'bad'
            }`}
          >
            <div className="quiz-result-header">
              {isCorrectSel ? (
                <>
                  <CheckCircle size={24} />
                  <span>Correct Answer!</span>
                  <span className="points-earned">+{pointsEarnedThisQ} points</span>
                </>
              ) : timeoutFlag ? (
                <>
                  <XCircle size={24} />
                  <span>Time’s Up!</span>
                  <span className="points-earned">+0 points</span>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <span>Incorrect Answer</span>
                  <span className="points-earned">+0 points</span>
                </>
              )}
            </div>
            <div className="quiz-correct-answer">
              <strong>Correct Answer:</strong> {q.answer}
            </div>
          </div>
        )}

        {/* Explanation */}
        {showResult && q.explanation && (
          <div className="quiz-explanation">
            <div className="quiz-explanation-header">
              <Award size={16} />
              <span>Explanation</span>
            </div>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Bottom transition */}
        {isTransitioning && (
          <div className="quiz-next-countdown">
            <div className="quiz-countdown-display">
              <div className="quiz-countdown-circle">
                <div className="quiz-countdown-number">{countdown}</div>
                <svg className="quiz-countdown-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="quiz-countdown-circle-bg" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="quiz-countdown-circle-fill"
                    style={{
                      strokeDashoffset: 283 - (283 * (7 - countdown)) / 7,
                    }}
                  />
                </svg>
              </div>
              <h3>Next Question In...</h3>
            </div>

            <button
              type="button"
              className="btn-ghost quiz-skip-btn"
              onClick={moveNext}
              aria-label="Skip countdown and go to next question"
            >
              Skip
            </button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="quiz-progress-card card">
        <div className="quiz-progress-header">
          <span>Progress</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="quiz-progress-stats">
          <div>
            Correct: <strong>{correct}</strong>
          </div>
          <div>
            Best Streak: <strong>{bestStreak}</strong>
          </div>
          <div>
            Current Streak: <strong>{streak}</strong>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="quiz-bottom">
        <button className="btn btn-secondary" onClick={handleExit}>
          Exit Quiz
        </button>
        <button className="btn" onClick={initGame}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default QuizQuest;
