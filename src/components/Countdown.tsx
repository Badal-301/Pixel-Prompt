import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Radio } from 'lucide-react';
import { useCountdownSync } from '../utils/useCountdownSync';
import { soundEngine } from '../utils/sound';

interface CountdownProps {
  onTriggerGlitch: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ onTriggerGlitch }) => {
  const { timeLeft, isZeroState, toggleZeroState } = useCountdownSync();

  useEffect(() => {
    // Occasional tick sound
    if (Math.random() < 0.25) {
      soundEngine.playBeep(2400, 0.015, 'square', 0.01);
    }
  }, [timeLeft.seconds]);

  const handleToggleZero = () => {
    onTriggerGlitch();
    soundEngine.playGlitch();
    toggleZeroState();
  };

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <section 
      id="countdown" 
      className="relative w-full py-24 px-4 sm:px-8 border-t border-b border-zinc-900/90 bg-classified-dark overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Background ambient radar glow */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-25" />
      <div className="absolute w-96 h-96 rounded-full bg-cyan-dim blur-3xl pointer-events-none -top-20" />

      {/* Top Header Information */}
      <div className="relative z-10 max-w-3xl flex flex-col items-center">
        {/* Live transmission badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 mb-5">
          <span className="w-2 h-2 rounded-full bg-cyan-accent animate-ping" />
          <Radio className="w-3.5 h-3.5 text-cyan-accent" />
          <span className="font-semibold tracking-widest uppercase">LIVE TRANSMISSION // INCUBATION DOCK</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          THE REVEAL
        </h2>

        <p className="mt-3 text-zinc-400 font-mono text-xs sm:text-sm tracking-widest uppercase">
          TIME REMAINING BEFORE THE SHELL BREACHES AND CLASSIFICATION EXPIRES
        </p>
      </div>

      {/* Main Countdown Display */}
      <div className="relative z-10 mt-12 w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {!timeLeft.isExpired ? (
            <motion.div
              key="active-timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Giant Digit Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-6 md:gap-8 w-full max-w-4xl font-mono select-none">
                {/* DAYS */}
                <div className="flex flex-col items-center p-3 sm:p-6 rounded-lg bg-zinc-950/80 border border-zinc-900/90 group hover:border-cyan-accent/50 transition-colors">
                  <div className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-white">
                    {pad(timeLeft.days)}
                  </div>
                  <div className="mt-2 text-[10px] sm:text-xs font-semibold tracking-widest text-zinc-500 uppercase group-hover:text-cyan-accent transition-colors">
                    DAYS
                  </div>
                </div>

                {/* HOURS */}
                <div className="flex flex-col items-center p-3 sm:p-6 rounded-lg bg-zinc-950/80 border border-zinc-900/90 group hover:border-cyan-accent/50 transition-colors">
                  <div className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-white">
                    {pad(timeLeft.hours)}
                  </div>
                  <div className="mt-2 text-[10px] sm:text-xs font-semibold tracking-widest text-zinc-500 uppercase group-hover:text-cyan-accent transition-colors">
                    HOURS
                  </div>
                </div>

                {/* MINUTES */}
                <div className="flex flex-col items-center p-3 sm:p-6 rounded-lg bg-zinc-950/80 border border-zinc-900/90 group hover:border-cyan-accent/50 transition-colors">
                  <div className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-white">
                    {pad(timeLeft.minutes)}
                  </div>
                  <div className="mt-2 text-[10px] sm:text-xs font-semibold tracking-widest text-zinc-500 uppercase group-hover:text-cyan-accent transition-colors">
                    MINUTES
                  </div>
                </div>

                {/* SECONDS */}
                <div className="flex flex-col items-center p-3 sm:p-6 rounded-lg bg-zinc-950/80 border border-zinc-900/90 group hover:border-cyan-accent/50 transition-colors relative overflow-hidden">
                  <motion.div 
                    key={timeLeft.seconds}
                    initial={{ scale: 1.04, opacity: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-cyan-accent text-glow-cyan"
                  >
                    {pad(timeLeft.seconds)}
                  </motion.div>
                  <div className="mt-2 text-[10px] sm:text-xs font-semibold tracking-widest text-zinc-500 uppercase group-hover:text-cyan-accent transition-colors">
                    SECONDS
                  </div>
                  {/* Subtle sweep line on second change */}
                  <motion.div 
                    key={`line-${timeLeft.seconds}`}
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 0.8, ease: 'linear' }}
                    className="absolute top-0 w-1/2 h-[2px] bg-cyan-accent shadow-[0_0_10px_#00f0ff]" 
                  />
                </div>
              </div>

              {/* Synchronized Signal Metric */}
              <div className="mt-8 flex items-center gap-4 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>SYNC: ATOMIC CLOCK 07-UTC</span>
                </div>
                <span>•</span>
                <div className="text-cyan-accent/80">
                  SHELL FREQUENCY DRIFT: &lt; 0.0002ms
                </div>
              </div>
            </motion.div>
          ) : (
            /* ZERO STATE TRIGGERED */
            <motion.div
              key="expired-banner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 sm:p-12 rounded-lg bg-zinc-950 border border-cyan-accent/70 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-dim border border-cyan-accent flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-accent animate-pulse" />
              </div>

              <div className="text-xs font-mono text-cyan-accent tracking-widest uppercase mb-2">
                CRITICAL THRESHOLD REACHED.
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                THE SHELL HAS BROKEN.
              </h3>

              <p className="mt-4 max-w-xl text-zinc-400 text-sm font-mono leading-relaxed">
                THE INCUBATION PERIOD HAS CONCLUDED. THE BIOMECHANICAL CORE HAS BREACHED ITS CONTAINMENT SHELL AND INITIATED CARRIER WAVE TRANSMISSION.
              </p>

              <div className="mt-6 px-4 py-2 rounded bg-zinc-900 text-zinc-300 font-mono text-xs border border-zinc-800">
                AWAITING FULL ENTITY DECLASSIFICATION...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo trigger to toggle zero-state for testing */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleToggleZero}
            className="text-[11px] font-mono text-cyan-accent/70 hover:text-cyan-accent border border-zinc-800 hover:border-cyan-accent/40 bg-zinc-950/80 px-4 py-2 rounded transition-all duration-200"
          >
            [TEST HARNESS: {isZeroState ? 'RESTORE ACTIVE COUNTDOWN' : 'TRIGGER ZERO-STATE HATCH BREACH'}]
          </button>
        </div>
      </div>
    </section>
  );
};
