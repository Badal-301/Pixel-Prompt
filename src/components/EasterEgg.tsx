import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { toast } from '../utils/toast';
import { CLUES_CONFIG } from '../config/launchConfig';
import { saveDecryptedClueId } from '../utils/storage';

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

const INITIAL_TERMINAL_LINES = [
  '...SECURITY OVERRIDE DETECTED.',
  '...INITIALIZING ROOT BACKDOOR.',
  '...YOU FOUND THE BACKDOOR.',
  'THAT WASN\'T SUPPOSED TO WORK.',
  'CLASSIFIED LOG 07X-DEEP-CORE:',
  '“The vessel is not built to reflect light, but to bend it.”',
  '“When the zero hour strikes, the silhouette dissolves into form.”',
  'AUTHENTICATED: CLEARANCE LEVEL OMEGA GRANTED.',
  'TYPE "help" FOR AVAILABLE OVERRIDE COMMANDS.',
];

export const EasterEgg: React.FC<EasterEggProps> = ({
  isOpen,
  onClose,
  onTriggerGlitch,
}) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Key sequence listener for Konami code and Escape to close
  useEffect(() => {
    let keyBuffer: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      keyBuffer.push(e.key);
      if (keyBuffer.length > KONAMI_CODE.length) {
        keyBuffer.shift();
      }

      if (keyBuffer.join(',') === KONAMI_CODE.join(',')) {
        keyBuffer = [];
        onTriggerGlitch();
        soundEngine.playGlitch();
        window.dispatchEvent(new CustomEvent('pixel_open_backdoor'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTriggerGlitch]);

  // Terminal typewriter sequence when modal opens
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    soundEngine.playGlitch();
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < INITIAL_TERMINAL_LINES.length) {
        setTypedLines((prev) => [...prev, INITIAL_TERMINAL_LINES[currentIdx]]);
        soundEngine.playTerminalKeystroke();
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
        soundEngine.playAccessGranted();
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [typedLines]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    soundEngine.playTerminalKeystroke();
    const userLine = `> ${commandInput}`;
    setCommandInput('');

    let responses: string[] = [];

    if (cmd === 'help') {
      responses = [
        'OVERRIDE COMMAND MATRIX:',
        '  help         - Display command protocols',
        '  decrypt all  - Unseal all 6 classified carrier signals',
        '  glitch       - Trigger electromagnetic scan pulse',
        '  status       - Read incubation bio-metric telemetry',
        '  clear        - Clear console buffer',
        '  exit         - Terminate backdoor interface',
      ];
    } else if (cmd === 'decrypt all' || cmd === 'decrypt') {
      CLUES_CONFIG.forEach((c) => saveDecryptedClueId(c.id));
      responses = [
        '...EXECUTING FORCED DECRYPTION FOR ALL 6 CHANNELS',
        'SUCCESS: ALL SIGNALS UNSEALED. TELEMETRY SYNCHRONIZED.',
      ];
      soundEngine.playAccessGranted();
      toast.show('OVERRIDE COMPLETE', 'All 6 classified signals decrypted', 'success');
    } else if (cmd === 'glitch') {
      onTriggerGlitch();
      soundEngine.playGlitch();
      responses = ['...ELECTROMAGNETIC PULSE DISCHARGED'];
    } else if (cmd === 'status') {
      responses = [
        'SPECIMEN 07 // CLASSIFICATION: OVOID CARRIER',
        'TELEMETRY: RESONANCE 1420.405 MHz',
        'INCUBATOR STATUS: FRACTURES DETECTED',
      ];
    } else if (cmd === 'clear') {
      setTypedLines([]);
      return;
    } else if (cmd === 'exit') {
      handleClose();
      return;
    } else {
      responses = [`ERROR: UNRECOGNIZED COMMAND "${cmd}". TYPE "help" FOR PROTOCOLS.`];
      soundEngine.playBeep(260, 0.08, 'sawtooth', 0.04);
    }

    setTypedLines((prev) => [...prev, userLine, ...responses]);
  };

  const handleClose = () => {
    soundEngine.playBeep(440, 0.05, 'sine', 0.05);
    setTypedLines([]);
    setIsTypingDone(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="terminal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl font-mono select-none"
      >
        {/* CRT Scanline */}
        <div className="absolute inset-0 scanline-overlay opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-2xl w-full p-6 sm:p-8 rounded-xl bg-zinc-950 border-2 border-cyan-accent shadow-[0_0_80px_rgba(0,240,255,0.3)] text-left overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 shrink-0">
            <div className="flex items-center gap-2 text-cyan-accent text-xs font-bold tracking-widest uppercase" id="terminal-title">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>[ROOT_OVERRIDE // SECTOR 07 INTERACTIVE TERMINAL]</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors focus-visible:ring-1 focus-visible:ring-cyan-accent"
              aria-label="Close backdoor terminal (Esc)"
              title="Close terminal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Terminal Console Text Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 text-xs sm:text-sm text-zinc-300 pr-2 min-h-[220px]">
            {typedLines.map((line, idx) => {
              const isSpecial = line.includes('YOU FOUND THE BACKDOOR') || line.includes('THAT WASN\'T SUPPOSED TO WORK');
              const isLog = line.startsWith('“');
              const isUser = line.startsWith('>');
              const isHelp = line.startsWith('  ');

              return (
                <div
                  key={idx}
                  className={`${
                    isSpecial
                      ? 'text-cyan-accent font-bold text-sm sm:text-base tracking-wide'
                      : isLog
                      ? 'text-white italic bg-zinc-900/90 p-2.5 rounded border-l-2 border-cyan-accent font-sans'
                      : isUser
                      ? 'text-cyan-accent font-semibold'
                      : isHelp
                      ? 'text-zinc-400 font-mono pl-2'
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
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Command Input Prompt */}
          {isTypingDone && (
            <form onSubmit={handleCommandSubmit} className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2">
              <div className="flex items-center gap-1 text-cyan-accent font-bold text-sm">
                <span>root@sector07:~$</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-accent" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="type command (e.g. help, decrypt all, status, exit)..."
                className="flex-1 bg-transparent border-none text-zinc-100 placeholder:text-zinc-700 text-xs sm:text-sm focus:outline-none tracking-wide"
                autoFocus
              />
            </form>
          )}

          {/* Footer status */}
          <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TERMINAL SECURE</span>
            </div>
            <div className="text-zinc-600">
              PRESS <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">ESC</kbd> TO CLOSE
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
