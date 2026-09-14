import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/sound';

interface HUDProps {
  onTriggerGlitch: () => void;
  crackProgress?: number;
}

export const HUD: React.FC<HUDProps> = ({ onTriggerGlitch, crackProgress = 0.08 }) => {
  const [signalStrength, setSignalStrength] = useState(87.4);
  const [warnHovered, setWarnHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Fluctuate signal telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.8;
      setSignalStrength((prev) => +(prev + delta).toFixed(1));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleWarnEnter = () => {
    setWarnHovered(true);
    soundEngine.playGlitch();
    onTriggerGlitch();
  };

  const handleWarnLeave = () => {
    setTimeout(() => {
      setWarnHovered(false);
    }, 1200);
  };

  // Compute dynamic biological/containment telemetry based on crack state
  const shellIntegrity = Math.max(0, 100 - crackProgress * 100).toFixed(1);
  const coreLuminescence = Math.min(100, Math.floor(18 + crackProgress * 82));
  const internalPressure = (1.02 + crackProgress * 8.94).toFixed(2);

  let statusLabel = 'STABLE // INCUBATING';
  let statusColor = 'text-zinc-300';
  if (crackProgress >= 0.88) {
    statusLabel = 'SUPERCRITICAL // HATCH IMMINENT';
    statusColor = 'text-cyan-accent animate-pulse font-bold';
  } else if (crackProgress >= 0.55) {
    statusLabel = 'SEISMIC FISSURES // ACTIVE';
    statusColor = 'text-cyan-400 font-semibold';
  } else if (crackProgress >= 0.2) {
    statusLabel = 'STRUCTURAL STRAIN DETECTED';
    statusColor = 'text-cyan-300';
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 font-mono text-[11px] text-zinc-400">
      {/* Top Left Telemetry */}
      <div 
        className="absolute top-16 sm:top-20 left-4 sm:left-12 flex flex-col gap-1.5 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px)` }}
      >
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${crackProgress > 0.7 ? 'bg-cyan-accent animate-ping' : 'bg-cyan-accent/80'}`} />
          <span className="text-zinc-100 tracking-widest font-bold text-xs">SPECIMEN_07</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-cyan-accent font-semibold tracking-wider">
            BIOMECHANICAL OVOID
          </span>
        </div>
        <div className="text-zinc-500">
          STATUS: <span className={statusColor}>{statusLabel}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <span>SHELL INTEGRITY: <span className={`font-semibold ${crackProgress > 0.6 ? 'text-red-400' : 'text-zinc-200'}`}>{shellIntegrity}%</span></span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">CORE GLOW: <span className="text-cyan-accent font-semibold">{coreLuminescence}%</span></span>
        </div>
      </div>

      {/* Top Right Coordinates & Pressure Telemetry */}
      <div 
        className="absolute top-16 sm:top-20 right-4 sm:right-12 text-right flex flex-col gap-1.5 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${-mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px)` }}
      >
        <div className="text-zinc-500">
          CORE PRESSURE: <span className="text-zinc-200 font-semibold">{internalPressure} MPa</span>
        </div>
        <div className="text-zinc-500">
          RESONANCE FREQ: <span className="text-cyan-accent font-semibold">{signalStrength} MHz</span>
        </div>
        <div className="text-[10px] text-cyan-accent/70 tracking-widest">
          37°14'06"N 115°48'40"W
        </div>
      </div>

      {/* Center Reticle Corner Brackets */}
      <div className="absolute inset-0 m-auto w-[290px] h-[330px] sm:w-[380px] sm:h-[440px] pointer-events-none opacity-40">
        {/* Top-left */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-accent/60" />
        {/* Top-right */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-accent/60" />
        {/* Bottom-left */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-accent/60" />
        {/* Bottom-right */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-accent/60" />
        {/* Center reticle dot */}
        <div className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${crackProgress > 0.6 ? 'bg-cyan-accent shadow-[0_0_8px_#00f0ff]' : 'bg-cyan-accent/60'}`} />
      </div>

      {/* Bottom Left Containment Level */}
      <div 
        className="absolute bottom-28 left-4 sm:left-12 flex flex-col gap-1 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${mouseOffset.x * 0.4}px, ${-mouseOffset.y * 0.4}px)` }}
      >
        <div className="text-zinc-500">CONTAINMENT LEVEL:</div>
        <div className="text-zinc-300 tracking-wider flex items-center gap-1.5 font-semibold">
          <span className="text-cyan-accent">[CLASS-A CLASSIFIED]</span>
          <span className="text-[9px] text-zinc-600">INCUBATOR // 07</span>
        </div>
      </div>

      {/* Bottom Right Secret Warning Trigger */}
      <div 
        className="absolute bottom-28 right-4 sm:right-12 pointer-events-auto cursor-help select-none"
        onMouseEnter={handleWarnEnter}
        onMouseLeave={handleWarnLeave}
        onClick={handleWarnEnter}
        title="Warning"
      >
        <div className="group flex items-center gap-2 p-2 rounded bg-zinc-950/60 border border-zinc-900/80 hover:border-cyan-accent/60 hover:bg-zinc-900/90 transition-all duration-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 group-hover:bg-cyan-accent transition-colors" />
          <span className={`transition-colors duration-200 ${warnHovered ? 'text-cyan-accent font-semibold tracking-wide' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            {warnHovered ? '...fissures widening.' : "DON'T TAP THE SHELL."}
          </span>
        </div>
      </div>
    </div>
  );
};
