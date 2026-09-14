import React, { useState } from 'react';
import { Copy, Check, Share2, MessageSquare, Radio, Shield } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { toast } from '../utils/toast';

export const ShareCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const shareTitle = "CLASSIFIED // PROJECT [REDACTED] INTERCEPT";
  const shareText = "Unauthorized transmission intercepted. Something is coming. Decrypt the signal before classification expires:";
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://pixelprompt.project';

  const handleCopy = async () => {
    soundEngine.playTerminalKeystroke();
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast.show('DOSSIER COPIED', 'Encrypted transmission link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.show('CLIPBOARD ERROR', 'Unable to access clipboard directly', 'warning');
    }
  };

  const handleNativeShare = async () => {
    soundEngine.playBeep(880, 0.05, 'sine', 0.04);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const shareX = () => {
    soundEngine.playTerminalKeystroke();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareWhatsApp = () => {
    soundEngine.playTerminalKeystroke();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedIn = () => {
    soundEngine.playTerminalKeystroke();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="dossier"
      className="relative w-full py-24 px-4 sm:px-8 bg-classified-black overflow-hidden flex flex-col items-center"
    >
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4 uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5 text-cyan-accent" />
          <span>SECURITY DOSSIER PASS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          SHARE THE SIGNAL
        </h2>

        <p className="mt-3 text-zinc-400 text-sm sm:text-base font-sans">
          Transmit the encrypted clearance card to other operatives.
        </p>

        {/* The Screenshot-Worthy Classified Dossier Card */}
        <div className="mt-10 w-full max-w-md p-6 sm:p-8 rounded-xl bg-gradient-to-b from-zinc-950 to-zinc-900/90 border border-zinc-700/80 shadow-[0_15px_45px_rgba(0,0,0,0.8)] relative font-mono text-left select-none overflow-hidden group scroll-reveal-card">
          {/* Card Scanline & Border Accent */}
          <div className="absolute inset-0 scanline-overlay opacity-25 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-700 via-cyan-accent to-zinc-700" />

          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-300">
              <Radio className="w-3.5 h-3.5 text-cyan-accent" />
              <span>[REDACTED] LABS</span>
            </div>
            <div className="text-[10px] text-zinc-500 tracking-wider">
              DOSSIER // 07X-PASS
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-4">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              SOMETHING<br />
              IS COMING.
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] pt-1 border-t border-zinc-800/60">
              <div>
                <span className="text-zinc-500 block">STATUS:</span>
                <span className="text-cyan-accent font-bold">CLASSIFIED</span>
              </div>
              <div>
                <span className="text-zinc-500 block">CLEARANCE:</span>
                <span className="text-zinc-300 font-medium">LEVEL 5 — OMNI</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800/80 text-[11px] text-zinc-400">
              <span className="text-zinc-500 block text-[10px]">REVEAL COUNTDOWN:</span>
              <span className="font-bold text-white text-xs">07 : 18 : 42 : 09</span>
            </div>

            {/* Redacted Barcode Strip */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-zinc-600 font-mono tracking-widest select-none">
                ████████████████
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">
                DO NOT DISTRIBUTE
              </div>
            </div>
          </div>

          {/* Corner classification watermark */}
          <div className="absolute -bottom-6 -right-6 text-7xl font-black text-zinc-900/40 pointer-events-none select-none font-sans">
            TOP
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-md font-mono text-xs">
          <button
            onClick={handleCopy}
            className="flex-1 min-w-[140px] py-3 px-4 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:border-cyan-accent flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-cyan-accent" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'LINK COPIED' : 'COPY LINK'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 min-w-[140px] py-3 px-4 rounded bg-cyan-dim hover:bg-cyan-accent/20 border border-cyan-accent/50 text-cyan-accent flex items-center justify-center gap-2 transition-all glow-cyan-subtle"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE SIGNAL</span>
          </button>
        </div>

        {/* Social Network Quick Icons */}
        <div className="mt-5 flex items-center gap-4 text-zinc-500">
          <span className="text-xs font-mono">DIRECT DISPATCH:</span>
          {/* X / Twitter Custom SVG */}
          <button
            onClick={shareX}
            aria-label="Share on X"
            className="p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          {/* WhatsApp */}
          <button
            onClick={shareWhatsApp}
            aria-label="Share on WhatsApp"
            className="p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-emerald-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          {/* LinkedIn Custom SVG */}
          <button
            onClick={shareLinkedIn}
            aria-label="Share on LinkedIn"
            className="p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-blue-400 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
