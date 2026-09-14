import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface NavigationProps {
  decryptedCount: number;
  totalSignals: number;
  onTriggerEasterEgg: () => void;
  onTriggerGlitch: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  decryptedCount,
  totalSignals,
  onTriggerEasterEgg,
  onTriggerGlitch,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(soundEngine.getEnabled());
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    return soundEngine.subscribe((val) => setAudioEnabled(val));
  }, []);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    soundEngine.playTerminalKeystroke();
    
    if (next >= 5) {
      setLogoClicks(0);
      onTriggerGlitch();
      onTriggerEasterEgg();
    } else if (next === 3) {
      onTriggerGlitch();
    }
  };

  const handleAudioToggle = () => {
    const next = soundEngine.toggle();
    setAudioEnabled(next);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-classified-black/80 backdrop-blur-md border-b border-zinc-900/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
      {/* Brand / Easter egg trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          className="group text-left flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-accent"
          aria-label="Classified Lab Home"
          title={logoClicks > 0 ? `Access attempts: ${logoClicks}/5` : "[REDACTED] LABS"}
        >
          <div className="w-7 h-7 rounded border border-zinc-800 group-hover:border-cyan-accent/80 bg-zinc-950 flex items-center justify-center transition-colors">
            <Radio className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-accent transition-colors" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-zinc-200 group-hover:text-cyan-accent transition-colors">
              [REDACTED] LABS
            </div>
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              PROJECT // 07X-ALPHA
            </div>
          </div>
        </button>

        {/* Live Status indicator */}
        <div className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
          <span>CLASSIFIED PROTOCOL</span>
        </div>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-zinc-400">
        <a href="#hero" className="hover:text-cyan-accent transition-colors">
          // SIGNAL
        </a>
        <a href="#countdown" className="hover:text-cyan-accent transition-colors">
          // REVEAL
        </a>
        <a href="#signals" className="hover:text-cyan-accent transition-colors">
          // EVIDENCE ({decryptedCount}/{totalSignals})
        </a>
        <a href="#transmit" className="hover:text-cyan-accent transition-colors">
          // WAITLIST
        </a>
        <a href="#dossier" className="hover:text-cyan-accent transition-colors">
          // DOSSIER
        </a>
      </nav>

      {/* Right Actions: Decrypted Counter & Audio Switch */}
      <div className="flex items-center gap-3">
        {/* Signals Progress Pill */}
        <a
          href="#signals"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 font-mono text-[11px] transition-all"
        >
          <span className="text-zinc-500">DECRYPTED:</span>
          <span className={`font-bold ${decryptedCount > 0 ? 'text-cyan-accent' : 'text-zinc-400'}`}>
            {decryptedCount} / {totalSignals}
          </span>
        </a>

        {/* Audio Toggle Button */}
        <button
          onClick={handleAudioToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
            audioEnabled
              ? 'border-cyan-accent/60 bg-cyan-dim text-cyan-accent glow-cyan-subtle'
              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
          }`}
          aria-label={audioEnabled ? "Disable interface audio" : "Enable interface audio"}
          title={audioEnabled ? "Interface Audio: ACTIVE" : "Interface Audio: MUTED (Click to enable)"}
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
        </button>
      </div>
    </header>
  );
};
