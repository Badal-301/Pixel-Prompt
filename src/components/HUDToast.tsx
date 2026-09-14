import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast, type ToastItem } from '../utils/toast';
import { soundEngine } from '../utils/sound';

export const HUDToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = toast.subscribe((updated) => {
      setToasts(updated);
      if (updated.length > 0) {
        soundEngine.playBeep(720, 0.03, 'sine', 0.02);
      }
    });
    return unsub;
  }, []);

  return (
    <aside 
      aria-label="System Notifications" 
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full select-none"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          let borderColor = 'border-zinc-800 hover:border-cyan-accent/60';
          let iconColor = 'text-cyan-accent';
          let glowClass = 'shadow-[0_0_15px_rgba(0,240,255,0.15)]';

          if (t.type === 'success') {
            borderColor = 'border-cyan-accent/70';
            iconColor = 'text-cyan-accent';
            glowClass = 'shadow-[0_0_20px_rgba(0,240,255,0.25)]';
          } else if (t.type === 'alert' || t.type === 'warning') {
            borderColor = 'border-red-500/70';
            iconColor = 'text-red-400';
            glowClass = 'shadow-[0_0_20px_rgba(239,68,68,0.2)]';
          }

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => toast.dismiss(t.id)}
              className={`pointer-events-auto cursor-pointer p-3.5 rounded-lg bg-zinc-950/95 backdrop-blur-md border ${borderColor} ${glowClass} flex items-start gap-3 transition-colors relative overflow-hidden group`}
            >
              {/* Scanline pattern on toast */}
              <div className="absolute inset-0 bg-classified-grid opacity-20 pointer-events-none" />

              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' ? (
                  <CheckCircle className={`w-4 h-4 ${iconColor}`} />
                ) : t.type === 'alert' ? (
                  <AlertTriangle className={`w-4 h-4 ${iconColor} animate-pulse`} />
                ) : (
                  <Radio className={`w-4 h-4 ${iconColor}`} />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 font-mono">
                <div className="text-[11px] font-bold tracking-wider text-zinc-100 uppercase flex items-center gap-1.5">
                  <span>{t.title}</span>
                  <span className="w-1 h-1 rounded-full bg-cyan-accent" />
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5 tracking-wide leading-relaxed">
                  {t.message}
                </div>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.dismiss(t.id);
                }}
                className="shrink-0 p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Bottom energy indicator bar */}
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-accent to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};
