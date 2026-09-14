import React, { useState, useEffect, useCallback } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
  glitchOnHover?: boolean;
  periodicGlitch?: boolean;
  color?: string;
}

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________01';

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
  glitchOnHover = false,
  periodicGlitch = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [prevText, setPrevText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  // Sync state if text prop changes
  if (text !== prevText) {
    setPrevText(text);
    setDisplayText(text);
  }

  const triggerScramble = useCallback(() => {
    setIsGlitching(true);
    let iterations = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) return text[index];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      if (iterations >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }
      iterations += 1 / (maxIterations / text.length || 1);
    }, 30);
  }, [text]);

  useEffect(() => {
    if (!periodicGlitch) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        triggerScramble();
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [periodicGlitch, triggerScramble]);

  return (
    <Component
      onMouseEnter={() => {
        if (glitchOnHover && !isGlitching) triggerScramble();
      }}
      className={`relative inline-block tracking-wider transition-colors duration-150 ${className} ${
        isGlitching ? 'text-cyan-accent active-screen-glitch' : ''
      }`}
    >
      <span className="relative z-10">{displayText}</span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-red-500 opacity-70 pointer-events-none select-none -translate-x-[2px] translate-y-[1px]"
            aria-hidden="true"
          >
            {displayText}
          </span>
          <span
            className="absolute top-0 left-0 text-cyan-accent opacity-70 pointer-events-none select-none translate-x-[2px] -translate-y-[1px]"
            aria-hidden="true"
          >
            {displayText}
          </span>
        </>
      )}
    </Component>
  );
};
