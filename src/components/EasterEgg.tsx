import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface EasterEggProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerGlitch: () => void;
}

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
];

export const EasterEgg: React.FC<EasterEggProps> = ({
  isOpen,
  onClose,
  onTriggerGlitch,
}) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Key sequence listener for Konami code
  useEffect(() => {
    let keyBuffer: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer.push(e.key);
      if (keyBuffer.length > KONAMI_CODE.length) {
        keyBuffer.shift();
      }

      if (keyBuffer.join(',') === KONAMI_CODE.join(',')) {
        keyBuffer = [];
        onTriggerGlitch();
        soundEngine.playGlitch();
        // Open modal via parent trigger
        const event = new CustomEvent('pixel_open_backdoor');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTriggerGlitch]);

  // Terminal typewriter sequence when modal opens
  useEffect(() => {
    if (!isOpen) {
      setTypedLines([]);
      setIsTypingDone(false);
      return;
    }

    soundEngine.playGlitch();
    const lines = [
      '...SECURITY OVERRIDE DETECTED.',
      '...INITIALIZING ROOT BACKDOOR.',
      '...YOU FOUND THE BACKDOOR.',
      'THAT WASN\'T SUPPOSED TO WORK.',
      'CLASSIFIED LOG 07X-DEEP-CORE:',
      '“The vessel is not built to reflect light, but to bend it.”',
      '“When the zero hour strikes, the silhouette dissolves into form.”',
      'AUTHENTICATED: CLEARANCE LEVEL OMEGA GRANTED.',
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < lines.length) {
        setTypedLines((prev) => [...prev, lines[currentIdx]]);
        soundEngine.playTerminalKeystroke();
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
        soundEngine.playAccessGranted();
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl font-mono select-none">
        {/* CRT Scanline & Screen Glitch */}
        <div className="absolute inset-0 scanline-overlay opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-2xl w-full p-6 sm:p-8 rounded-xl bg-zinc-950 border-2 border-cyan-accent shadow-[0_0_80px_rgba(0,240,255,0.3)] text-left overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-5">
            <div className="flex items-center gap-2 text-cyan-accent text-xs font-bold tracking-widest uppercase">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>[ROOT_OVERRIDE // SECTOR 07]</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playBeep(440, 0.05, 'sine', 0.05);
                onClose();
              }}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Close backdoor terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Terminal Console Text */}
          <div className="space-y-2 text-xs sm:text-sm text-zinc-300 min-h-[220px]">
            {typedLines.map((line, idx) => {
              const isSpecial = line.includes('YOU FOUND THE BACKDOOR') || line.includes('THAT WASN\'T SUPPOSED TO WORK');
              const isLog = line.startsWith('“');

              return (
                <div
                  key={idx}
                  className={`${
                    isSpecial
                      ? 'text-cyan-accent font-bold text-sm sm:text-base tracking-wide'
                      : isLog
                      ? 'text-white italic bg-zinc-900/90 p-2 rounded border-l-2 border-cyan-accent font-sans'
                      : 'text-zinc-400'
                  }`}
                >
                  {line}
                </div>
              );
            })}

            {!isTypingDone && (
              <span className="inline-block w-2 h-4 bg-cyan-accent animate-ping ml-1" />
            )}
          </div>

          {/* Radar Schematic Graphic when done typing */}
          {isTypingDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>SECRET DISCOVERY LOGGED IN SESSION</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playBeep(520, 0.05, 'sine', 0.05);
                  onClose();
                }}
                className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold tracking-wider uppercase transition-colors"
              >
                [ EXIT BACKDOOR ]
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
