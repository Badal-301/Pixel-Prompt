import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ShieldAlert, Sparkles, Activity, Clock } from 'lucide-react';
import { Silhouette } from './Silhouette';
import { HUD } from './HUD';
import { GlitchText } from './GlitchText';
import { soundEngine } from '../utils/sound';
import { useCountdownSync, type SimulatedStage } from '../utils/useCountdownSync';

interface HeroProps {
  decryptedCount: number;
  isGlitching: boolean;
  onTriggerGlitch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  decryptedCount,
  isGlitching,
  onTriggerGlitch,
}) => {
  const { crackProgress, timeLeft, activeStage, setStage } = useCountdownSync(decryptedCount);

  // Cinematic intro stages: 0 = start empty, 1 = transmission, 2 = detected, 3 = classification, 4 = scan sweep, 5 = fully loaded
  const [introPhase, setIntroPhase] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setIntroPhase(1);
      soundEngine.playBeep(440, 0.04, 'sine', 0.03);
    }, 400);

    const t2 = setTimeout(() => {
      setIntroPhase(2);
      soundEngine.playBeep(580, 0.05, 'sine', 0.04);
    }, 1200);

    const t3 = setTimeout(() => {
      setIntroPhase(3);
      soundEngine.playBeep(880, 0.06, 'triangle', 0.05);
    }, 2000);

    const t4 = setTimeout(() => {
      setIntroPhase(4);
      soundEngine.playSubDrone();
    }, 2800);

    const t5 = setTimeout(() => {
      setIntroPhase(5);
      soundEngine.playAccessGranted();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleStageSelect = (stage: SimulatedStage) => {
    soundEngine.playBeep(stage === 'hatch' ? 950 : 620, 0.05, 'triangle', 0.04);
    if (stage === 'breach' || stage === 'hatch') {
      onTriggerGlitch();
    }
    setStage(stage);
  };

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-screen flex flex-col items-center justify-between pt-20 pb-12 px-4 sm:px-8 overflow-hidden bg-classified-black"
    >
      {/* Laser Scanline Sweep on Phase 4 */}
      {introPhase === 4 && (
        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 0.8, ease: 'linear' }}
          className="absolute left-0 w-full h-[2px] bg-cyan-accent shadow-[0_0_20px_#00f0ff] z-40 pointer-events-none"
        />
      )}

      {/* 1. INITIAL INCOMING TRANSMISSION SEQUENCE (Phases 1-3) */}
      <div className="absolute top-28 left-0 w-full flex flex-col items-center justify-center z-30 pointer-events-none">
        <AnimatePresence>
          {introPhase >= 1 && introPhase < 5 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-1.5 font-mono text-xs"
            >
              {introPhase >= 1 && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-ping" />
                  <span className="tracking-widest">INCOMING TRANSMISSION...</span>
                </div>
              )}
              {introPhase >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-cyan-accent font-semibold tracking-wider"
                >
                  [ SIGNAL DETECTED — 1420.405 MHz ]
                </motion.div>
              )}
              {introPhase >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-zinc-500 tracking-widest text-[11px]"
                >
                  CLASSIFICATION: <span className="text-zinc-300 font-bold bg-zinc-900 px-1.5 py-0.5 rounded">█████████</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CENTRAL 3D CRACKING EGG & HUD (Revealed at Phase 4+) */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        {introPhase >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl flex items-center justify-center"
          >
            <Silhouette
              decryptedCount={decryptedCount}
              forcedGlitch={isGlitching}
              crackProgress={crackProgress}
              timeLeft={timeLeft}
            />
            <HUD 
              onTriggerGlitch={onTriggerGlitch} 
              crackProgress={crackProgress} 
            />
          </motion.div>
        )}
      </div>

      {/* 3. HERO COPY & CALLS TO ACTION (Phases 5+) */}
      <div className="relative z-30 w-full max-w-4xl text-center flex flex-col items-center -mt-16 sm:-mt-24">
        {introPhase >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            {/* Classification Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800/90 text-zinc-400 text-xs font-mono mb-3 tracking-widest uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-accent" />
              <span>PROJECT CODE: // 07X-REDACTED • BIO-CORE INCUBATOR</span>
            </div>

            {/* Giant Cinematic Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] sm:leading-[1.02]">
              YOU'RE NOT<br />
              <span className="text-zinc-500">SUPPOSED</span><br />
              TO KNOW.
            </h1>

            {/* Subtext with typewriter cadence */}
            <div className="mt-4 sm:mt-5 font-mono text-zinc-400 text-sm sm:text-base tracking-widest flex items-center gap-2">
              <GlitchText text="...YET." className="text-cyan-accent font-bold" />
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300 font-medium">The shell is beginning to crack.</span>
            </div>

            {/* INTERACTIVE TIME-PROXIMITY CRACK CONTROLLER DOCK */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 w-full max-w-2xl px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-900/90 backdrop-blur-md shadow-2xl flex flex-col items-center gap-3"
            >
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 text-cyan-accent">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span className="tracking-widest font-semibold uppercase">TEMPORAL FRACTURE MATRIX</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">CORE ENERGY:</span>
                  <span className="text-cyan-accent font-bold">{(crackProgress * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Progress gauge bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white shadow-[0_0_12px_#00f0ff]"
                  style={{ width: `${Math.max(4, crackProgress * 100)}%` }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                />
              </div>

              {/* Stage selectors */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 w-full font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => handleStageSelect('live')}
                  className={`px-2 py-1.5 rounded border transition-all flex items-center justify-center gap-1 ${
                    activeStage === 'live'
                      ? 'bg-cyan-950/70 border-cyan-accent text-cyan-accent font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  title="Track real countdown clock"
                >
                  <Clock className="w-2.5 h-2.5" />
                  <span>SYNC LIVE</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStageSelect('pristine')}
                  className={`px-2 py-1.5 rounded border transition-all ${
                    activeStage === 'pristine'
                      ? 'bg-cyan-950/70 border-cyan-accent text-cyan-accent font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  title="Pristine shell with faint hairline cracks"
                >
                  <span>DORMANT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStageSelect('stress')}
                  className={`px-2 py-1.5 rounded border transition-all ${
                    activeStage === 'stress'
                      ? 'bg-cyan-950/70 border-cyan-accent text-cyan-accent font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  title="Structural strain, cyan fissures begin glowing"
                >
                  <span>STRAIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStageSelect('fracture')}
                  className={`px-2 py-1.5 rounded border transition-all ${
                    activeStage === 'fracture'
                      ? 'bg-cyan-950/70 border-cyan-accent text-cyan-accent font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  title="Deep glowing fractures, core light leaking"
                >
                  <span>FRACTURE</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStageSelect('breach')}
                  className={`px-2 py-1.5 rounded border transition-all ${
                    activeStage === 'breach'
                      ? 'bg-cyan-950/70 border-cyan-accent text-cyan-accent font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  title="Supercritical breach, sparks flying, blinding glow"
                >
                  <span className="flex items-center justify-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>BREACH</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStageSelect('hatch')}
                  className={`px-2 py-1.5 rounded border transition-all ${
                    activeStage === 'hatch'
                      ? 'bg-red-950/80 border-cyan-accent text-cyan-accent font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  title="Full shell split open"
                >
                  <span>HATCH T-0</span>
                </button>
              </div>
            </motion.div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="#transmit"
                onClick={() => soundEngine.playBeep(660, 0.05, 'sine', 0.05)}
                className="w-full sm:w-auto px-7 py-3.5 rounded bg-zinc-100 hover:bg-white text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] flex items-center justify-center gap-2 group"
              >
                <span>[ ENTER THE WAITLIST ]</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#countdown"
                onClick={() => soundEngine.playBeep(440, 0.05, 'sine', 0.04)}
                className="w-full sm:w-auto px-7 py-3.5 rounded bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-accent/60 text-zinc-300 hover:text-cyan-accent font-mono text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>[ INSPECT COUNTDOWN ]</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Scroll Prompt Indicator */}
      <div className="absolute bottom-3 left-0 w-full flex justify-center pointer-events-none opacity-40">
        <div className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase flex items-center gap-2">
          <span>CLASSIFIED TELEMETRY DOCK</span>
          <span className="inline-block w-1 h-1 rounded-full bg-cyan-accent" />
          <span>SCROLL TO PROCEED</span>
        </div>
      </div>
    </section>
  );
};
