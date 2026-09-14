import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Mail, Radio } from 'lucide-react';
import { saveRegistration, getRegistration } from '../utils/storage';
import type { TransmissionRegistration } from '../types';
import { soundEngine } from '../utils/sound';
import { toast } from '../utils/toast';

interface EmailSignupProps {
  onTriggerGlitch: () => void;
}

export const EmailSignup: React.FC<EmailSignupProps> = ({ onTriggerGlitch }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registration, setRegistration] = useState<TransmissionRegistration | null>(() => getRegistration());
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('INVALID COMM-LINK FORMAT. VERIFY EMAIL.');
      soundEngine.playBeep(220, 0.1, 'sawtooth', 0.05);
      toast.show('VALIDATION FAILED', 'Please enter a valid comm-link address', 'warning');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    soundEngine.playTerminalKeystroke();

    // Trigger submission sequence with cinematic glitch
    setTimeout(() => {
      onTriggerGlitch();
      soundEngine.playGlitch();

      setTimeout(() => {
        const reg = saveRegistration(email);
        setRegistration(reg);
        setIsSubmitting(false);
        soundEngine.playAccessGranted();
        toast.show('COMM-LINK REGISTERED', `Transmission ID: ${reg.transmissionId}`, 'success');
      }, 500);
    }, 400);
  };

  return (
    <section
      id="transmit"
      className="relative w-full py-24 px-4 sm:px-8 border-t border-zinc-900 bg-classified-dark overflow-hidden flex flex-col items-center text-center"
    >
      {/* Background Volumetric Beam */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-dim/40 blur-[120px] pointer-events-none -bottom-40" />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        {/* Classified Beacon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4 uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 text-cyan-accent" />
          <span>DIRECT ENCRYPTED UPLINK</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          WANT TO KNOW BEFORE EVERYONE ELSE?
        </h2>

        <p className="mt-3 text-zinc-400 text-sm sm:text-base font-sans">
          Leave your signal. We'll handle the rest.
        </p>

        {/* Form or Confirmation Card */}
        <div className="mt-10 w-full max-w-md scroll-reveal-card">
          <AnimatePresence mode="wait">
            {!registration ? (
              <motion.form
                key="signup-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-3 font-mono"
              >
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    disabled={isSubmitting}
                    className="w-full pl-11 pr-4 py-3.5 rounded bg-zinc-950/90 border border-zinc-800 focus:border-cyan-accent focus:outline-none focus:ring-1 focus:ring-cyan-accent text-zinc-100 placeholder:text-zinc-600 text-xs tracking-wider transition-all"
                  />
                </div>

                {errorMsg && (
                  <div className="text-[11px] text-red-400 text-left pl-1 tracking-wider animate-flicker">
                    ! {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded bg-zinc-100 hover:bg-white text-black font-bold text-xs tracking-widest uppercase transition-all duration-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING PACKETS...</span>
                  ) : (
                    <>
                      <span>[ TRANSMIT → ]</span>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="mt-2 text-[11px] text-zinc-600 tracking-widest uppercase">
                  NO SPAM. NO SPOILERS.
                </div>
              </motion.form>
            ) : (
              /* Success / Registered Clearance Card */
              <motion.div
                key="registered-badge"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-lg bg-zinc-950 border border-cyan-accent/60 shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col items-center font-mono text-center"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-dim border border-cyan-accent flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-accent" />
                </div>

                <div className="text-xs text-cyan-accent font-bold tracking-widest uppercase">
                  TRANSMISSION RECEIVED.
                </div>

                <div className="mt-1 text-base font-bold text-white tracking-wide">
                  YOUR ACCESS HAS BEEN REGISTERED.
                </div>

                <div className="my-4 px-3 py-2 rounded bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 w-full flex items-center justify-between">
                  <span className="text-zinc-500">TRANSMISSION ID:</span>
                  <span className="text-cyan-accent font-bold tracking-widest">{registration.transmissionId}</span>
                </div>

                <div className="text-xs text-zinc-400">
                  DON'T MISS THE REVEAL.
                </div>

                <div className="mt-3 text-[10px] text-zinc-600">
                  CLEARANCE TOKEN STORED IN LOCAL STORAGE
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
