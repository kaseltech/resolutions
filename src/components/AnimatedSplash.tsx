'use client';

import { useState, useEffect, useMemo } from 'react';
import { Logo } from './Logo';

interface AnimatedSplashProps {
  onComplete: () => void;
  duration?: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function AnimatedSplash({ onComplete, duration = 2000 }: AnimatedSplashProps) {
  const [phase, setPhase] = useState<'initial' | 'visible' | 'fadeOut'>('initial');

  // Generate random stars once
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 1.5,
    }));
  }, []);

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
        background: 'linear-gradient(180deg, #0a0f1a 0%, #0f172a 50%, #1e293b 100%)',
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
      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: 0,
            animation: phase !== 'initial'
              ? `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`
              : 'none',
          }}
        />
      ))}

      {/* Logo */}
      <div
        style={{
          opacity: phase !== 'initial' ? 1 : 0,
          transform: phase !== 'initial' ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Logo size={160} />
      </div>

      {/* App name */}
      <h1
        style={{
          marginTop: '1.5rem',
          fontSize: '1.75rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 50%, #0d9488 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
          opacity: phase !== 'initial' ? 1 : 0,
          transform: phase !== 'initial' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease-out 0.2s',
        }}
      >
        2026 Resolutions
      </h1>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
