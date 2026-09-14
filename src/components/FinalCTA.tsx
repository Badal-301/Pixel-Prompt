import React from 'react';
import { ArrowUp } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface FinalCTAProps {
  onTriggerGlitch: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onTriggerGlitch }) => {
  const handleScrollToReveal = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playBeep(660, 0.05, 'sine', 0.05);
    onTriggerGlitch();
    const elem = document.getElementById('transmit') || document.getElementById('countdown');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] py-28 px-4 sm:px-8 bg-black flex flex-col items-center justify-center text-center overflow-hidden border-t border-zinc-900">
      {/* Deep Background Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      <div className="relative z-10 max-w-3xl flex flex-col items-center">
        <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-4">
          PROJECT STATUS
        </div>

        <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight">
          CLASSIFIED.
        </h2>

        <div className="text-3xl sm:text-6xl lg:text-7xl font-black text-zinc-500 tracking-tight mt-1">
          FOR NOW.
        </div>

        <p className="mt-8 font-mono text-zinc-300 text-sm sm:text-base font-bold tracking-widest uppercase">
          READY TO KNOW?
        </p>

        <div className="mt-8">
          <a
            href="#transmit"
            onClick={handleScrollToReveal}
            className="px-8 py-4 rounded bg-cyan-accent hover:bg-cyan-300 text-black font-mono font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] flex items-center gap-2.5 group"
          >
            <span>[ GET THE REVEAL → ]</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
