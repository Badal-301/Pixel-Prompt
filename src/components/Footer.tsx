import React from 'react';
import { Radio, RefreshCw } from 'lucide-react';
import { PROJECT_METADATA } from '../config/launchConfig';
import { resetArgProgress } from '../utils/storage';
import { soundEngine } from '../utils/sound';

interface FooterProps {
  onReset: () => void;
  onTriggerGlitch: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReset, onTriggerGlitch }) => {
  const handleResetClick = () => {
    if (window.confirm('RESET CLASSIFIED ARG TELEMETRY & CLEAR PROGRESS?')) {
      soundEngine.playGlitch();
      onTriggerGlitch();
      resetArgProgress();
      onReset();
    }
  };

  return (
    <footer className="w-full py-12 px-4 sm:px-8 bg-zinc-950 border-t border-zinc-900 font-mono text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Left Telemetry Details */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-300 font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-accent" />
            <span>[REDACTED] LABS</span>
          </div>
          <div>{PROJECT_METADATA.codename}</div>
          <div>STATUS: <span className="text-zinc-400 font-semibold">CLASSIFIED</span></div>
          <div>TRANSMISSION ID: <span className="text-zinc-400">{PROJECT_METADATA.transmissionId}</span></div>
        </div>

        {/* Center Philosophy Statement */}
        <div className="text-zinc-400 font-sans italic text-sm">
          “The less you know, the better.”
        </div>

        {/* Right Admin / ARG Reset for Judges */}
        <div className="flex flex-col items-center md:items-end gap-2 text-[11px]">
          <div>COORDINATES: {PROJECT_METADATA.liveCoordinates}</div>
          <button
            onClick={handleResetClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-cyan-accent transition-colors"
            title="Reset decrypted clue states in localStorage"
          >
            <RefreshCw className="w-3 h-3" />
            <span>RESET ARG PROGRESS</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
