'use client';

import { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface AnimatedSplashProps {
  onComplete: () => void;
  duration?: number;
}

export function AnimatedSplash({ onComplete, duration = 2000 }: AnimatedSplashProps) {
  const [phase, setPhase] = useState<'initial' | 'visible' | 'fadeOut'>('initial');

  useEffect(() => {
    // Show content after brief delay
    const showTimer = setTimeout(() => setPhase('visible'), 100);

    // Start fade out
    const fadeTimer = setTimeout(() => setPhase('fadeOut'), duration - 400);

    // Complete
    const doneTimer = setTimeout(() => onComplete(), duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: phase === 'fadeOut' ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Background image - golden path */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/splash-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: phase !== 'initial' ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 28, 46, 0.3) 0%, rgba(15, 28, 46, 0.5) 50%, rgba(15, 28, 46, 0.7) 100%)',
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: phase !== 'initial' ? 1 : 0,
          transform: phase !== 'initial' ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Logo size="xl" />
      </div>

      {/* Tagline */}
      <p
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '1rem',
          fontSize: '1rem',
          color: '#F5F1EA',
          letterSpacing: '0.02em',
          opacity: phase !== 'initial' ? 0.9 : 0,
          transform: phase !== 'initial' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease-out 0.2s',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        }}
      >
        Make your resolutions count
      </p>
    </div>
  );
}
