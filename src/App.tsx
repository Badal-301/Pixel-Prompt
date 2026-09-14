import { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { ClueSystem } from './components/ClueSystem';
import { EmailSignup } from './components/EmailSignup';
import { ShareCard } from './components/ShareCard';
import { EasterEgg } from './components/EasterEgg';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { HUDToast } from './components/HUDToast';
import { getDecryptedClueIds } from './utils/storage';
import { CLUES_CONFIG } from './config/launchConfig';

export function App() {
  const [decryptedClueIds, setDecryptedClueIds] = useState<string[]>(() => getDecryptedClueIds());
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState<boolean>(false);

  // Storage and backdoor event listeners
  useEffect(() => {
    const handleProgressUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ decryptedCount: number }>;
      if (customEvent.detail && typeof customEvent.detail.decryptedCount === 'number') {
        setDecryptedClueIds(getDecryptedClueIds());
      }
    };

    const handleOpenBackdoor = () => {
      setIsEasterEggOpen(true);
    };

    window.addEventListener('pixel_progress_updated', handleProgressUpdate);
    window.addEventListener('pixel_open_backdoor', handleOpenBackdoor);

    return () => {
      window.removeEventListener('pixel_progress_updated', handleProgressUpdate);
      window.removeEventListener('pixel_open_backdoor', handleOpenBackdoor);
    };
  }, []);

  // Global Glitch trigger
  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
    }, 450);
  }, []);

  const handleReset = () => {
    setDecryptedClueIds([]);
  };

  return (
    <div className={`relative min-h-screen bg-classified-black text-white selection:bg-cyan-accent selection:text-black overflow-x-hidden ${isGlitching ? 'active-screen-glitch' : ''}`}>
      {/* 1. Global Scanline & Vignette Overlays */}
      <div className="fixed inset-0 scanline-overlay pointer-events-none z-30 opacity-20" />
      <div className="fixed inset-0 crt-vignette pointer-events-none z-30 opacity-70" />
      <div className="fixed inset-0 bg-grain pointer-events-none z-30" />

      {/* 2. Top Navigation */}
      <Navigation
        decryptedCount={decryptedClueIds.length}
        totalSignals={CLUES_CONFIG.length}
        onTriggerEasterEgg={() => setIsEasterEggOpen(true)}
        onTriggerGlitch={triggerGlitch}
      />

      {/* 3. Main Cinematic Flow */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* HERO (100vh with 3D Egg, HUD, Typography, CTAs, Temporal Matrix) */}
        <Hero
          decryptedCount={decryptedClueIds.length}
          isGlitching={isGlitching}
          onTriggerGlitch={triggerGlitch}
        />

        {/* COUNTDOWN */}
        <Countdown onTriggerGlitch={triggerGlitch} />

        {/* WE LEFT SOME THINGS BEHIND (ARG Clue System) */}
        <ClueSystem
          decryptedClueIds={decryptedClueIds}
          onDecryptedUpdate={setDecryptedClueIds}
          onTriggerGlitch={triggerGlitch}
        />

        {/* EMAIL TRANSMISSION SIGNUP */}
        <EmailSignup onTriggerGlitch={triggerGlitch} />

        {/* CLASSIFIED DOSSIER SHARE CARD */}
        <ShareCard />

        {/* FINAL CLOSING SCENE */}
        <FinalCTA onTriggerGlitch={triggerGlitch} />
      </main>

      {/* 4. Footer */}
      <Footer
        onReset={handleReset}
        onTriggerGlitch={triggerGlitch}
      />

      {/* 5. Secret Backdoor Terminal Easter Egg */}
      <EasterEgg
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
        onTriggerGlitch={triggerGlitch}
      />

      {/* 6. Persistent High-Tech HUD Toast System */}
      <HUDToast />
    </div>
  );
}

export default App;
