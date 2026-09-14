import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Terminal } from 'lucide-react';
import { ClueCard } from './ClueCard';
import { CLUES_CONFIG } from '../config/launchConfig';
import { saveDecryptedClueId } from '../utils/storage';
import { soundEngine } from '../utils/sound';
import { toast } from '../utils/toast';

interface ClueSystemProps {
  decryptedClueIds: string[];
  onDecryptedUpdate: (ids: string[]) => void;
  onTriggerGlitch: () => void;
}

export const ClueSystem: React.FC<ClueSystemProps> = ({
  decryptedClueIds,
  onDecryptedUpdate,
  onTriggerGlitch,
}) => {
  const [securityAlert, setSecurityAlert] = useState<'NONE' | 'GETTING_CLOSE' | 'ACCESS_REVOKED'>('NONE');

  const decryptedCount = decryptedClueIds.length;
  const totalClues = CLUES_CONFIG.length;

  const handleDecrypt = (clueId: string) => {
    const updated = saveDecryptedClueId(clueId);
    onDecryptedUpdate(updated);

    const clue = CLUES_CONFIG.find((c) => c.id === clueId);
    toast.show(
      'SIGNAL ARCHIVE UNSEALED',
      clue ? `Decrypted: ${clue.label} — ${clue.revealedText}` : 'Classified signal record accessed',
      'success'
    );

    // If reached 6/6 clues, trigger the climax:
    // "YOU'RE GETTING CLOSE." -> "ACCESS REVOKED." -> heavy screen glitch!
    if (updated.length === 6) {
      toast.show('SECURITY BREACH DETECTED', 'All classified carrier wave vectors unsealed', 'alert');
      setTimeout(() => {
        setSecurityAlert('GETTING_CLOSE');
        soundEngine.playBeep(880, 0.15, 'triangle', 0.08);

        setTimeout(() => {
          setSecurityAlert('ACCESS_REVOKED');
          onTriggerGlitch();
          soundEngine.playGlitch();

          setTimeout(() => {
            setSecurityAlert('NONE');
          }, 3500);
        }, 1600);
      }, 500);
    }
  };

  return (
    <section 
      id="signals" 
      className="relative w-full py-24 px-4 sm:px-8 bg-classified-black overflow-hidden flex flex-col items-center"
    >
      {/* Background Classified Pattern */}
      <div className="absolute inset-0 bg-classified-grid opacity-30 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 max-w-3xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4 uppercase tracking-widest">
          <Terminal className="w-3.5 h-3.5 text-cyan-accent" />
          <span>ARG INTERCEPT // SECTOR 07</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          WE LEFT SOME THINGS BEHIND.
        </h2>

        <p className="mt-3 text-zinc-400 text-sm sm:text-base font-sans leading-relaxed">
          Maybe you can figure it out before we tell you.
        </p>

        {/* Progress Tracker Pill */}
        <div className="mt-6 flex flex-col items-center gap-2 font-mono">
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300">
            SIGNALS DECRYPTED: <span className="text-cyan-accent font-bold">{decryptedCount}</span> / {totalClues}
          </div>

          <div className="w-64 sm:w-80 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
            <motion.div
              className="h-full bg-cyan-accent glow-cyan-subtle"
              initial={{ width: 0 }}
              animate={{ width: `${(decryptedCount / totalClues) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Dynamic Progress Hint Status */}
          <div className="text-[11px] text-zinc-500 mt-1">
            {decryptedCount === 0 && 'Awaiting cryptographic injection.'}
            {decryptedCount >= 1 && decryptedCount <= 2 && 'Subtle resonance detected in prototype rim telemetry.'}
            {decryptedCount >= 3 && decryptedCount <= 4 && 'Internal stress lattice geometry illuminated.'}
            {decryptedCount === 5 && 'Holographic security glyph unlocked in prototype dock.'}
            {decryptedCount === 6 && 'Maximum threshold reached. Decryption limit achieved.'}
          </div>
        </div>
      </div>

      {/* Clue Cards Grid */}
      <div className="relative z-10 mt-14 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {CLUES_CONFIG.map((clue) => {
          const isDecrypted = decryptedClueIds.includes(clue.id);
          const isLocked = Boolean(clue.requiredSignals && decryptedCount < clue.requiredSignals);

          return (
            <ClueCard
              key={clue.id}
              clue={clue}
              isDecrypted={isDecrypted}
              isLocked={isLocked}
              onDecrypt={handleDecrypt}
              onTriggerGlitch={onTriggerGlitch}
            />
          );
        })}
      </div>

      {/* CLIMAX POPUP: YOU'RE GETTING CLOSE -> ACCESS REVOKED */}
      <AnimatePresence>
        {securityAlert !== 'NONE' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className="relative max-w-md w-full p-8 rounded-xl bg-zinc-950 border-2 border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.4)] text-center font-mono">
              <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500 mx-auto flex items-center justify-center mb-4">
                <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
              </div>

              {securityAlert === 'GETTING_CLOSE' && (
                <div className="space-y-2">
                  <div className="text-red-400 text-xs tracking-widest uppercase">
                    CRITICAL EXPOSURE WARNING
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    YOU'RE GETTING CLOSE.
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Synthesizing intercepted telemetry vectors...
                  </p>
                </div>
              )}

              {securityAlert === 'ACCESS_REVOKED' && (
                <div className="space-y-2">
                  <div className="text-red-500 text-xs tracking-widest uppercase font-bold animate-pulse">
                    FIREWALL COUNTERMEASURE TRIGGERED
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-red-500 active-screen-glitch">
                    ACCESS REVOKED.
                  </h3>
                  <p className="text-zinc-300 text-xs">
                    Unauthorized probe isolated. Telemetry shrouded.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
