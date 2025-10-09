// src/components/games/NumberGrid.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  getRuntimeConfig,
  generateNumberSequence,
  maybeInjectDistractors,
  revealTimeForRound,
  scoreFor,
  makeRNG
} from '../../utils/gameLogic/numberGrid';

const fullPoints = (d) =>
  d==='extreme' ? 100 : d==='hard' ? 75 : d==='medium' ? 50 : 25;

const failPointsMap = { easy: 5, medium: 10, hard: 15, extreme: 20 };

export default function NumberGrid({
  difficulty = 'easy',
  onGameEnd = () => {},
  onExit
}) {
  const cfg = useMemo(() => getRuntimeConfig(difficulty), [difficulty]);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [frames, setFrames] = useState([]);
  const [showing, setShowing] = useState(true);
  const [input, setInput] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);

  // over = { won, saved, pointsEarned, details }
  const [over, setOver] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const countdownRef = useRef(null);
  const submittedRef = useRef(false);

  const [seed] = useState(() => Date.now());
  const rng = useMemo(() => makeRNG(seed), [seed]);
  const progressRef = useRef(null);

  const keypad = cfg.keypad.split('');
  const totalRounds = cfg.endLen - cfg.startLen + 1;
  const isFinalRound = round >= totalRounds;

  // Reset game function
  const resetGame = () => {
    clearInterval(countdownRef.current);
    setOver(null);
    setRound(1);
    setSequence([]);
    setFrames([]);
    setShowing(true);
    setInput('');
    setMistakes(0);
    setStreak(0);
    setBestStreak(0);
    setScore(0);
    setCountdown(15);
    submittedRef.current = false;
  };

  // Build round
  useEffect(() => {
    if (over) return;
    
    const buildRound = () => {
      const seq = generateNumberSequence(round, cfg, rng);
      setSequence(seq);
      const reveal = maybeInjectDistractors(seq, cfg, rng);
      setFrames(reveal);
      setShowing(true);
      setInput('');

      const duration = revealTimeForRound(round, cfg);
      if (progressRef.current) {
        progressRef.current.style.animation = 'none';
        void progressRef.current.offsetWidth;
        progressRef.current.style.animation = `ngProgress ${duration}ms linear forwards`;
      }
      
      const t = setTimeout(() => {
        setShowing(false);
      }, duration);
      
      return t;
    };

    const timer = buildRound();
    return () => clearTimeout(timer);
  }, [round, cfg, rng, over]);

  // Keyboard (normal digits + numpad)
  useEffect(() => {
    const onKey = (e) => {
      if (over || showing) return;

      const isDigit = e.key >= '0' && e.key <= '9';
      const isNumpadDigit = e.code?.startsWith('Numpad') && /\d$/.test(e.code);

      if (isDigit || isNumpadDigit) {
        e.preventDefault();
        const digit = isDigit ? e.key : e.code.slice(-1);
        setInput((v) => {
          const newInput = (v + digit).slice(0, sequence.length);
          return newInput;
        });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setInput((v) => v.slice(0, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showing, over, sequence.length]);

  const maybeSubmitResultOnce = (payload) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try { 
      console.log('Calling onGameEnd with payload:', payload);
      onGameEnd(payload); 
    } catch (error) {
      console.error('Error in onGameEnd:', error);
    }
  };

  const startCountdownToExit = () => {
    clearInterval(countdownRef.current);
    setCountdown(15);
    console.log('Starting 15-second countdown to exit...');
    
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        const next = c - 1;
        console.log(`Countdown: ${next} seconds remaining`);
        
        if (next <= 0) {
          clearInterval(countdownRef.current);
          console.log('Countdown finished, calling onExit');
          if (typeof onExit === 'function') {
            onExit();
          }
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const endGame = (won, finalScore, points, extraMeta = {}) => {
    console.log('Game ending:', { won, finalScore, points, round });
    
    const payload = {
      completed: true,
      won,
      score: finalScore,
      pointsEarned: points,
      meta: {
        rounds: round,
        bestStreak,
        mistakes,
        ...extraMeta,
      }
    };

    // Call onGameEnd immediately when game ends
    maybeSubmitResultOnce(payload);
    
    // Set over state to show game over screen
    setOver({ won, saved: true, pointsEarned: points, details: payload });
    
    // Start countdown that will call onExit after 15 seconds
    startCountdownToExit();
  };

  const handleSubmit = () => {
    if (showing || over || input.length === 0) return;

    const expected = sequence.join('');
    const got = input.trim();

    // Validate input length
    if (got.length !== expected.length) {
      flashShake();
      return;
    }

    let correct = 0;
    for (let i = 0; i < Math.min(got.length, expected.length); i++) {
      if (got[i] === expected[i]) correct++; else break;
    }

    const thisRoundScore = scoreFor(correct, expected.length, streak);
    const nextScore = score + thisRoundScore;
    setScore(nextScore);

    if (got === expected) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));

      if (isFinalRound) {
        endGame(true, nextScore, fullPoints(difficulty));
      } else {
        setRound((currentRound) => {
          const nextRound = currentRound + 1;
          console.log(`Moving from round ${currentRound} to ${nextRound}, total rounds: ${totalRounds}`);
          return nextRound;
        });
      }
    } else {
      const m = mistakes + 1;
      setMistakes(m);
      setStreak(0);

      if (m > cfg.mistakesAllowed) {
        endGame(false, nextScore, failPointsMap[difficulty] ?? 0, {
          roundFailed: round,
          expected,
          got
        });
      } else {
        setInput('');
        flashShake();
      }
    }
  };

  const flashShake = () => {
    const el = document.querySelector('.ng-input-area');
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 350);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('NumberGrid unmounting, clearing intervals');
      clearInterval(countdownRef.current);
    };
  }, []);

  // Over screen (stays visible for full countdown)
  if (over) {
    return (
      <div className="ng-shell">
        <div className="card ng-over">
          <div className={`ng-over-title ${over.won ? 'win' : 'lose'}`}>
            {over.won ? 'Mission Complete' : 'Game Over'}
          </div>

          <div className="ng-over-body">
            <div className="ng-over-stat">
              <span className="label">Final Score</span>
              <span className="value">{over.details?.score ?? score}</span>
            </div>
            <div className="ng-over-stat">
              <span className="label">Best Streak</span>
              <span className="value">{bestStreak}</span>
            </div>
            <div className="ng-over-stat">
              <span className="label">Rounds Completed</span>
              <span className="value">{over.details?.meta?.rounds ?? round}</span>
            </div>
            {!over.won && (
              <div className="ng-over-note text-muted">
                You used all allowed mistakes.
              </div>
            )}
            <div className="ng-over-points">
              <span className="badge badge-success">Saved</span>
              <span className="text">+{over.pointsEarned} points</span>
            </div>

            <div className="ng-over-count">
              Returning to Games in <b>{countdown}</b>s…
            </div>
          </div>

          <div className="ng-over-actions">
            <button 
              className="btn btn-success" 
              onClick={resetGame}
            >
              Play Again
            </button>
            {onExit && (
              <button className="btn btn-primary" onClick={onExit}>
                Back to Games now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal play UI
  return (
    <div className="ng-shell">
      <div className="ng-top">
        <div className="ng-pill">
          <span className="ng-dot" /> 
          Round <strong>{round}/{totalRounds}</strong>
          {sequence.length > 0 && <small style={{marginLeft: '8px', opacity: 0.7}}>({sequence.length} digits)</small>}
        </div>
        <div className="ng-pill">Mistakes <strong>{mistakes}/{cfg.mistakesAllowed}</strong></div>
        <div className="ng-pill">Score <strong>{score}</strong></div>
      </div>

      {showing ? (
        <div className="ng-reveal card">
          <div className="ng-reveal-header">
            <div className="ng-progress"><div className="ng-progress-fill" ref={progressRef} /></div>
            <div className="ng-reveal-hint">Memorize the sequence</div>
          </div>

          <div className="ng-seq">
            {frames.map((f, i) => (
              <div key={i} className="ng-seq-cell">
                <div className="ng-seq-number">{f.value}</div>
                {f.flash && <div className="ng-flash">{f.flash}</div>}
              </div>
            ))}
          </div>

          <div className="ng-reveal-footer">
            <small className="text-muted">
              {isFinalRound 
                ? 'Final round — good luck!' 
                : `Round ${round} of ${totalRounds} - ${sequence.length} digits`
              }
            </small>
          </div>
        </div>
      ) : (
        <div className="ng-input card">
          <div className="ng-input-header">
            <div className="ng-reveal-hint">Enter the sequence</div>
            <div className="ng-lights">
              {Array.from({ length: sequence.length }).map((_, i) => (
                <span key={i} className={`ng-light ${i < input.length ? 'on' : ''}`} />
              ))}
            </div>
          </div>

          <div className="ng-input-area">
            <input
              className="input ng-input-field"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={`Enter ${sequence.length} digits`}
              value={input}
              onChange={(e)=>setInput(e.target.value.replace(/\D/g,'').slice(0, sequence.length))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="ng-ghost">
              {input.length}/{sequence.length} digits
              {input.length === sequence.length && ' - Press Enter to submit'}
            </div>
          </div>

          <div className="ng-keypad">
            {keypad.map((k) => (
              <button
                key={k}
                className="btn ng-key"
                onClick={() => setInput(v => (v + k).slice(0, sequence.length))}
                aria-label={`Key ${k}`}
              >
                {k}
              </button>
            ))}
            <button className="btn ng-key ng-back" onClick={()=>setInput(v=>v.slice(0,-1))}>⌫</button>
            <button 
              className="btn btn-primary ng-submit" 
              onClick={handleSubmit}
              disabled={input.length !== sequence.length}
            >
              Submit
            </button>
          </div>

          <div className="ng-stats">
            <div>Best Streak: <strong>{bestStreak}</strong></div>
            <div>Current Streak: <strong>{streak}</strong></div>
          </div>
        </div>
      )}

      <div className="ng-bottom">
        {onExit && <button className="btn btn-secondary" onClick={onExit}>Exit</button>}
        {!showing && <button className="btn" onClick={() => setInput('')}>Clear</button>}
      </div>
    </div>
  );
}