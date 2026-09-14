import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Menu, X, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { toast } from '../utils/toast';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    return soundEngine.subscribe((val) => setAudioEnabled(val));
  }, []);

  // Modern Web Guidance: Scrollspy Navigation using IntersectionObserver fallback
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              setActiveSection(id);
            }
          }
        });
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    soundEngine.playTerminalKeystroke();
    
    if (next >= 5) {
      setLogoClicks(0);
      onTriggerGlitch();
      onTriggerEasterEgg();
      toast.show('CLASSIFIED ACCESS GRANTED', 'Emergency backdoor protocol initialized', 'success');
    } else if (next === 3) {
      onTriggerGlitch();
      toast.show('SECURITY WARNING', 'Unauthorized access attempts logged: 3/5', 'warning');
    }
  };

  const handleAudioToggle = () => {
    const next = soundEngine.toggle();
    setAudioEnabled(next);
    toast.show(
      'AUDIO INTERFACE',
      next ? 'Synthesizer online. Audio active.' : 'Audio channel muted.',
      'info'
    );
  };

  const navLinks = [
    { href: '#hero', label: '// SIGNAL', id: 'hero' },
    { href: '#countdown', label: '// REVEAL', id: 'countdown' },
    { href: '#signals', label: `// EVIDENCE (${decryptedCount}/${totalSignals})`, id: 'signals' },
    { href: '#transmit', label: '// WAITLIST', id: 'transmit' },
    { href: '#dossier', label: '// DOSSIER', id: 'dossier' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-classified-black/85 backdrop-blur-md border-b border-zinc-900/90 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
      {/* Brand / Easter egg trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group text-left flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-accent"
          aria-label="Classified Lab Home"
          title={logoClicks > 0 ? `Access attempts: ${logoClicks}/5` : "[REDACTED] LABS"}
        >
          <div className="w-8 h-8 rounded border border-zinc-800 group-hover:border-cyan-accent/80 bg-zinc-950 flex items-center justify-center transition-colors shadow-sm">
            <Radio className="w-4 h-4 text-zinc-400 group-hover:text-cyan-accent transition-colors" />
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
        <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
          <span>CLASSIFIED PROTOCOL ACTIVE</span>
        </div>
      </div>

      {/* Center Nav Links with Scrollspy */}
      <nav 
        data-scrollspy="true"
        aria-label="Main Navigation"
        className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-zinc-950/80 border border-zinc-900/90 font-mono text-xs text-zinc-400"
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.id}
              href={link.href}
              aria-current={isActive ? 'true' : undefined}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-cyan-accent font-semibold bg-cyan-950/60 border border-cyan-accent/50 shadow-[0_0_12px_rgba(0,240,255,0.18)]'
                  : 'hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Right Actions: Decrypted Counter & Audio Switch */}
      <div className="flex items-center gap-2.5">
        {/* Signals Progress Pill */}
        <a
          href="#signals"
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800/90 hover:border-cyan-accent/50 text-zinc-300 font-mono text-[11px] transition-all"
        >
          <span className="text-zinc-500">DECRYPTED:</span>
          <span className={`font-bold ${decryptedCount > 0 ? 'text-cyan-accent' : 'text-zinc-400'}`}>
            {decryptedCount} / {totalSignals}
          </span>
        </a>

        {/* Audio Toggle Button */}
        <button
          type="button"
          onClick={handleAudioToggle}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono border transition-all ${
            audioEnabled
              ? 'border-cyan-accent/60 bg-cyan-950/50 text-cyan-accent glow-cyan-subtle'
              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
          }`}
          aria-label={audioEnabled ? "Disable interface audio" : "Enable interface audio"}
          title={audioEnabled ? "Interface Audio: ACTIVE" : "Interface Audio: MUTED"}
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-cyan-accent hover:border-cyan-accent/50 transition-colors"
          aria-label="Toggle navigation drawer"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[58px] left-0 w-full bg-classified-black/95 backdrop-blur-xl border-b border-zinc-800 p-6 flex flex-col gap-4 font-mono text-sm z-50">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-accent" />
            <span>NAVIGATION PROTOCOLS</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded border transition-colors ${
                activeSection === link.id
                  ? 'border-cyan-accent/70 bg-cyan-950/40 text-cyan-accent font-bold'
                  : 'border-zinc-900 bg-zinc-950/60 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
