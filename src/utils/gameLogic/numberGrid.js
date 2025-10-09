// src/utils/gameLogic/numberGrid.js

/**
 * Advanced Number Grid logic:
 * - Generates numeric sequences with optional "distractor" flashes.
 * - Supports seeded randomness (optional) for reproducible tests.
 * - Returns helpers for timing and scoring.
 */

function mulberry32(seed) {
  let t = seed + 0x6D2B79F5;
  return function() {
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * getRuntimeConfig(difficulty)
 * Controls length ramp, reveal time, distractors, etc.
 */
export function getRuntimeConfig(difficulty) {
  switch (difficulty) {
    case 'extreme':
      return {
        startLen: 4,
        endLen: 14,
        baseRevealMs: 950,     // base time to show per round (shrinks each round)
        minRevealMs: 450,
        distractorChance: 0.35,
        keypad: '1234567890',
        mistakesAllowed: 0,    // tiny room for error
      };
    case 'hard':
      return {
        startLen: 4,
        endLen: 12,
        baseRevealMs: 1050,
        minRevealMs: 550,
        distractorChance: 0.25,
        keypad: '1234567890',
        mistakesAllowed: 1,
      };
    case 'medium':
      return {
        startLen: 3,
        endLen: 10,
        baseRevealMs: 1200,
        minRevealMs: 650,
        distractorChance: 0.15,
        keypad: '1234567890',
        mistakesAllowed: 1,
      };
    default: // easy
      return {
        startLen: 3,
        endLen: 8,
        baseRevealMs: 1300,
        minRevealMs: 750,
        distractorChance: 0.08,
        keypad: '1234567890',
        mistakesAllowed: 2,
      };
  }
}

/**
 * generateNumberSequence(round, rng?)
 * Builds a sequence whose length scales with round.
 * Round 1 => length = startLen, final round => endLen.
 */
export function generateNumberSequence(round, cfg, rng) {
  const { startLen, endLen } = cfg;
  const steps = Math.max(0, round - 1);
  const length = Math.min(endLen, startLen + steps);
  const sequence = [];
  for (let i = 0; i < length; i++) {
    const n = Math.floor((rng ? rng() : Math.random()) * 10);
    sequence.push(n);
  }
  return sequence;
}

/**
 * maybeInjectDistractors(array, cfg, rng?)
 * Randomly replaces a small portion of the reveal frames with noisy blips (⚡)
 * purely visual—doesn't change the true sequence.
 */
export function maybeInjectDistractors(seq, cfg, rng) {
  const out = [];
  const r = rng || Math.random;
  for (let i = 0; i < seq.length; i++) {
    const n = seq[i];
    const distract = r() < cfg.distractorChance;
    out.push({
      value: n,
      flash: distract && r() < 0.5 ? '⚡' : null
    });
  }
  return out;
}

/**
 * revealTimeForRound(round, cfg)
 * Linearly shrinks reveal time each round, never below minRevealMs.
 */
export function revealTimeForRound(round, cfg) {
  const decay = Math.max(cfg.minRevealMs, cfg.baseRevealMs - (round - 1) * 80);
  return decay;
}

/**
 * scoreFor(correctLen, totalLen, streak)
 * Weighted score rewarding streaks.
 */
export function scoreFor(correctLen, totalLen, streak) {
  const ratio = totalLen ? correctLen / totalLen : 0;
  const base = Math.round(ratio * 100);
  const bonus = Math.min(50, streak * 5);
  return base + bonus;
}

/**
 * makeRNG(seed?) optional seeded randomness
 */
export function makeRNG(seed) {
  if (seed == null) return null;
  const numeric = typeof seed === 'number' ? seed : [...String(seed)].reduce((a,c)=>a+c.charCodeAt(0),0);
  return mulberry32(numeric);
}
