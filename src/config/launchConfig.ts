import type { Clue } from '../types';

/**
 * SINGLE SOURCE OF TRUTH FOR LAUNCH REVEAL DATE
 * Set 7 days, 18 hours, 42 minutes, 09 seconds from standard anchor,
 * dynamically calculable or configurable to an exact future epoch.
 */
export const REVEAL_OFFSET_DAYS = 7;
export const REVEAL_OFFSET_HOURS = 18;
export const REVEAL_OFFSET_MINUTES = 42;
export const REVEAL_OFFSET_SECONDS = 9;

// Global target launch timestamp (7 days, 18 hrs, 42 mins, 9 secs in future relative to initial session)
export const GET_INITIAL_REVEAL_TIMESTAMP = (): number => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('pixel_launch_timestamp') : null;
  if (stored) {
    return parseInt(stored, 10);
  }
  const future = Date.now() + 
    (REVEAL_OFFSET_DAYS * 24 * 60 * 60 * 1000) +
    (REVEAL_OFFSET_HOURS * 60 * 60 * 1000) +
    (REVEAL_OFFSET_MINUTES * 60 * 1000) +
    (REVEAL_OFFSET_SECONDS * 1000);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('pixel_launch_timestamp', future.toString());
  }
  return future;
};

export const PROJECT_METADATA = {
  codename: 'PROJECT: ███████',
  transmissionId: '07X-88219-CLASSIFIED',
  securityLevel: 'LEVEL 5 — OMNI-CLEARANCE REQUIRED',
  division: '[REDACTED] ADVANCED AERONAUTICS & HYPER-COMPUTE LABS',
  liveCoordinates: '37°14\'06.0"N 115°48\'40.0"W',
};

export const CLUES_CONFIG: Clue[] = [
  {
    id: 'signal-01',
    label: 'SIGNAL_01',
    code: '████████',
    revealedText: 'SUB-SURFACE ANOMALY',
    strength: 14,
    unlockedHint: '“It was never designed to be obvious.”',
    triggerGlitch: false,
  },
  {
    id: 'signal-02',
    label: 'SIGNAL_02',
    code: 'ARCHIVE // 02',
    revealedText: 'CLASSIFIED SPECIFICATION',
    strength: 38,
    unlockedHint: '“The smallest detail may be the biggest clue.”',
    triggerGlitch: false,
  },
  {
    id: 'signal-03',
    label: 'SIGNAL_03',
    code: 'PROTOCOL // UNKNOWN',
    revealedText: 'NEURAL RESONANCE VECTOR',
    strength: 57,
    unlockedHint: "“You already know what it is. You just don't know that you know.”",
    triggerGlitch: false,
  },
  {
    id: 'signal-04',
    label: 'SIGNAL_04',
    code: '████ ███ █████',
    revealedText: 'THERMAL SHADOW INTERCEPT',
    strength: 72,
    unlockedHint: "“Look at what isn't being shown.”",
    triggerGlitch: false,
  },
  {
    id: 'signal-05',
    label: 'SIGNAL_05',
    code: 'TRANSMISSION LOST',
    revealedText: 'REDACTED FREQUENCY HARMONIC',
    strength: 89,
    unlockedHint: "“Good. You weren't supposed to see that.”",
    triggerGlitch: true, // triggers immediate screen glitch on decryption!
  },
  {
    id: 'signal-06',
    label: 'SIGNAL_06',
    code: 'FINAL SIGNAL',
    revealedText: 'SYNTHESIS COMPLETE',
    strength: 99,
    unlockedHint: '“The architecture lives in the negative space.”',
    requiredSignals: 5, // Unlocks only after first 5 signals are decrypted
    triggerGlitch: true,
  },
];
