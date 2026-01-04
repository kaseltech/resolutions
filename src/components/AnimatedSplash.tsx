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
        background: 'linear-gradient(180deg, #1E3A5F 0%, #2A4A6F 50%, #1E3A5F 100%)',
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
            backgroundColor: '#F5F1EA',
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
        <Logo size="xl" />
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: '1rem',
          fontSize: '1rem',
          color: '#B8C4D0',
          letterSpacing: '0.02em',
          opacity: phase !== 'initial' ? 1 : 0,
          transform: phase !== 'initial' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease-out 0.2s',
        }}
      >
        Make your resolutions count
      </p>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
