import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ShieldCheck, Cpu } from 'lucide-react';
import type { Clue } from '../types';
import { soundEngine } from '../utils/sound';

interface ClueCardProps {
  clue: Clue;
  isDecrypted: boolean;
  isLocked: boolean;
  onDecrypt: (clueId: string) => void;
  onTriggerGlitch: () => void;
}

type DecryptStage = 'IDLE' | 'ACCESSING' | 'BYPASSING' | 'DECRYPTING' | 'GRANTED';

export const ClueCard: React.FC<ClueCardProps> = ({
  clue,
  isDecrypted,
  isLocked,
  onDecrypt,
  onTriggerGlitch,
}) => {
  const [stage, setStage] = useState<DecryptStage>('IDLE');
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (isLocked) {
      soundEngine.playBeep(220, 0.08, 'sawtooth', 0.04);
      return;
    }
    if (isDecrypted || stage !== 'IDLE') return;

    soundEngine.playTerminalKeystroke();
    setStage('ACCESSING');

    // Stage 1: ACCESSING...
    setTimeout(() => {
      soundEngine.playDecryptProgress();
      setStage('BYPASSING');

      // Stage 2: BYPASSING...
      setTimeout(() => {
        soundEngine.playDecryptProgress();
        setStage('DECRYPTING');

        // Stage 3: DECRYPTING...
        setTimeout(() => {
          setStage('GRANTED');
          soundEngine.playAccessGranted();
          onDecrypt(clue.id);

          if (clue.triggerGlitch) {
            onTriggerGlitch();
            soundEngine.playGlitch();
          }
        }, 650);
      }, 550);
    }, 450);
  };

  return (
    <motion.div
      whileHover={{ y: isLocked ? 0 : -3 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (!isLocked && !isDecrypted) soundEngine.playBeep(1200, 0.015, 'sine', 0.01);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`relative p-5 sm:p-6 rounded-lg font-mono text-left select-none overflow-hidden transition-all duration-300 border scroll-reveal-card ${
        isLocked
          ? 'bg-zinc-950/40 border-zinc-900 opacity-60 cursor-not-allowed'
          : isDecrypted
          ? 'bg-zinc-950/90 border-cyan-accent/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
          : 'bg-zinc-950/70 border-zinc-800 hover:border-cyan-accent/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] cursor-pointer'
      }`}
    >
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

      {/* Card Header: Label & Status Icon */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 tracking-wider">
            {clue.label}
          </span>
          {isDecrypted && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-dim text-cyan-accent font-semibold flex items-center gap-1 border border-cyan-accent/30">
              <Check className="w-2.5 h-2.5" />
              DECRYPTED
            </span>
          )}
        </div>

        <div>
          {isLocked ? (
            <Lock className="w-4 h-4 text-zinc-600" />
          ) : isDecrypted ? (
            <ShieldCheck className="w-4 h-4 text-cyan-accent" />
          ) : (
            <Cpu className="w-4 h-4 text-zinc-500 group-hover:text-cyan-accent" />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 my-4 min-h-[72px] flex flex-col justify-center">
        {isLocked ? (
          <div className="flex flex-col gap-1">
            <div className="text-zinc-600 font-bold tracking-widest text-sm">
              [ LOCKED // ENCRYPTED ]
            </div>
            <div className="text-[11px] text-zinc-500">
              REQUIRES {clue.requiredSignals || 5} DECRYPTED SIGNALS
            </div>
          </div>
        ) : isDecrypted ? (
          <div className="flex flex-col gap-1.5">
            <div className="text-cyan-accent text-sm font-semibold tracking-wide">
              {clue.revealedText}
            </div>
            <p className="text-zinc-200 text-xs font-sans italic leading-relaxed">
              {clue.unlockedHint}
            </p>
          </div>
        ) : stage !== 'IDLE' ? (
          /* Multi-stage interactive decryption steps */
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-cyan-accent font-bold tracking-widest animate-pulse">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-accent animate-ping" />
              {stage === 'ACCESSING' && 'ACCESSING MEMORY BLOCKS...'}
              {stage === 'BYPASSING' && 'BYPASSING FIREWALL HASH...'}
              {stage === 'DECRYPTING' && 'DECRYPTING TELEMETRY...'}
              {stage === 'GRANTED' && 'ACCESS GRANTED'}
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-accent transition-all duration-300"
                style={{
                  width:
                    stage === 'ACCESSING'
                      ? '30%'
                      : stage === 'BYPASSING'
                      ? '65%'
                      : stage === 'DECRYPTING'
                      ? '90%'
                      : '100%',
                }}
              />
            </div>
          </div>
        ) : (
          /* Idle State with Redacted Code */
          <div className="flex flex-col gap-1">
            <div className="text-zinc-300 text-base font-bold tracking-wider">
              {clue.code}
            </div>
            <div className="text-[11px] text-zinc-500">
              {isHovered ? 'CLICK TO INITIATE DECRYPTION' : 'SIGNAL ENCRYPTED'}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Signal Strength Metric */}
      <div className="relative z-10 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
        <span>SIGNAL STRENGTH:</span>
        <span className={`font-semibold ${isDecrypted ? 'text-cyan-accent' : 'text-zinc-400'}`}>
          {clue.strength}%
        </span>
      </div>

      {/* Animated progress bar along bottom edge on hover */}
      {isHovered && !isLocked && !isDecrypted && (
        <motion.div
          layoutId={`hover-bar-${clue.id}`}
          className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-accent shadow-[0_0_8px_#00f0ff]"
        />
      )}
    </motion.div>
  );
};
