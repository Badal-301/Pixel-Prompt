import { useState, useEffect, useCallback } from 'react';
import { GET_INITIAL_REVEAL_TIMESTAMP, REVEAL_OFFSET_DAYS, REVEAL_OFFSET_HOURS, REVEAL_OFFSET_MINUTES, REVEAL_OFFSET_SECONDS } from '../config/launchConfig';
import type { CountdownTime } from '../types';

// Total reference window from launch config in milliseconds
export const TOTAL_REVEAL_SPAN_MS = 
  (REVEAL_OFFSET_DAYS * 24 * 60 * 60 * 1000) +
  (REVEAL_OFFSET_HOURS * 60 * 60 * 1000) +
  (REVEAL_OFFSET_MINUTES * 60 * 1000) +
  (REVEAL_OFFSET_SECONDS * 1000);

export type SimulatedStage = 'live' | 'pristine' | 'stress' | 'fracture' | 'breach' | 'hatch';

export const STAGE_PROGRESS_VALUES: Record<Exclude<SimulatedStage, 'live'>, number> = {
  pristine: 0.05,   // Hairline whispers, faint dormant glow
  stress: 0.35,     // Noticeable jagged cracks, bright cyan glow begins
  fracture: 0.68,   // Deep glowing fissures, internal core light leaking
  breach: 0.92,     // Extreme cracks, intense white-cyan core blast, sparks spewing
  hatch: 1.0,       // Full tectonic shell split, critical hatch zero-state
};

const GLOBAL_EVENT_SYNC = 'pixel_global_time_sync';

export interface GlobalTimeSyncState {
  stage: SimulatedStage;
  isZeroState: boolean;
}

export const broadcastTimeSync = (state: GlobalTimeSyncState) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GLOBAL_EVENT_SYNC, { detail: state }));
  }
};

export const useCountdownSync = (decryptedCount: number = 0) => {
  const [targetTimestamp] = useState<number>(() => GET_INITIAL_REVEAL_TIMESTAMP());
  const [activeStage, setActiveStage] = useState<SimulatedStage>('live');
  const [isZeroState, setIsZeroState] = useState<boolean>(false);
  const [now, setNow] = useState<number>(() => Date.now());

  // Listen to global sync events from either Hero scrubber or Countdown section
  useEffect(() => {
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent<GlobalTimeSyncState>).detail;
      if (detail) {
        setActiveStage(detail.stage);
        setIsZeroState(detail.isZeroState);
      }
    };

    window.addEventListener(GLOBAL_EVENT_SYNC, handleSync);
    return () => window.removeEventListener(GLOBAL_EVENT_SYNC, handleSync);
  }, []);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate remaining time
  const calculateTime = useCallback((): CountdownTime => {
    if (isZeroState || activeStage === 'hatch') {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMsRemaining: 0,
        isExpired: true,
      };
    }

    if (activeStage !== 'live') {
      const simulatedRatio = 1 - STAGE_PROGRESS_VALUES[activeStage];
      const remainingMs = Math.max(0, TOTAL_REVEAL_SPAN_MS * simulatedRatio);
      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
      const seconds = Math.floor((remainingMs / 1000) % 60);

      return {
        days,
        hours,
        minutes,
        seconds,
        totalMsRemaining: remainingMs,
        isExpired: remainingMs <= 0,
      };
    }

    const diff = targetTimestamp - now;
    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMsRemaining: 0,
        isExpired: true,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMsRemaining: diff,
      isExpired: false,
    };
  }, [isZeroState, activeStage, targetTimestamp, now]);

  const timeLeft = calculateTime();

  // Compute crack progress factor [0..1]
  // Based on time remaining + clue decryption stress
  let crackProgress = 0;
  if (isZeroState || activeStage === 'hatch') {
    crackProgress = 1.0;
  } else if (activeStage !== 'live') {
    crackProgress = STAGE_PROGRESS_VALUES[activeStage];
  } else {
    // Natural progression as time draws closer
    const elapsedRatio = Math.max(0, Math.min(1, 1 - (timeLeft.totalMsRemaining / TOTAL_REVEAL_SPAN_MS)));
    // Decrypted clues add up to +0.35 additional resonance stress
    const clueBonus = (decryptedCount / 6) * 0.35;
    crackProgress = Math.min(0.98, elapsedRatio + clueBonus);
  }

  const setStage = (stage: SimulatedStage) => {
    const zero = stage === 'hatch';
    setActiveStage(stage);
    setIsZeroState(zero);
    broadcastTimeSync({ stage, isZeroState: zero });
  };

  const toggleZeroState = () => {
    const nextZero = !isZeroState;
    setIsZeroState(nextZero);
    const nextStage = nextZero ? 'hatch' : 'live';
    setActiveStage(nextStage);
    broadcastTimeSync({ stage: nextStage, isZeroState: nextZero });
  };

  return {
    timeLeft,
    crackProgress,
    activeStage,
    isZeroState,
    setStage,
    toggleZeroState,
  };
};
