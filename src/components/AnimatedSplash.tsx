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
        background: 'linear-gradient(180deg, #152838 0%, #1E3A5F 40%, #1E3A5F 100%)',
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
      {/* Static stars - low opacity */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y * 0.6}%`, // Keep stars in upper portion
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#F5F1EA',
            borderRadius: '50%',
            opacity: phase !== 'initial' ? 0.3 + (star.size / 10) : 0,
            transition: 'opacity 1s ease-out',
          }}
        />
      ))}

      {/* Mountain layers */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '45%',
          opacity: phase !== 'initial' ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
        }}
        viewBox="0 0 100 45"
        preserveAspectRatio="none"
      >
        {/* Back mountains - darkest */}
        <path
          d="M0,45 L0,30 L15,18 L25,25 L35,12 L50,22 L60,15 L75,20 L85,10 L100,20 L100,45 Z"
          fill="#0D1C28"
        />
        {/* Peak highlights - back */}
        <path
          d="M35,12 L36,13 L34,13 Z M85,10 L86,11 L84,11 Z"
          fill="#1A3045"
        />
        {/* Mid-ground mountains */}
        <path
          d="M0,45 L0,35 L10,28 L20,32 L30,22 L45,30 L55,20 L70,28 L80,18 L95,28 L100,25 L100,45 Z"
          fill="#152838"
        />
        {/* Peak highlights - mid */}
        <path
          d="M30,22 L31,23.5 L29,23.5 Z M55,20 L56,21.5 L54,21.5 Z M80,18 L81,19.5 L79,19.5 Z"
          fill="#1E3A50"
        />
        {/* Foreground mountains - lightest */}
        <path
          d="M0,45 L0,38 L12,32 L25,38 L40,28 L55,35 L65,30 L78,36 L90,30 L100,35 L100,45 Z"
          fill="#1E3A5F"
        />
        {/* Peak highlights - foreground */}
        <path
          d="M40,28 L41.5,30 L38.5,30 Z M65,30 L66.5,32 L63.5,32 Z M90,30 L91.5,32 L88.5,32 Z"
          fill="#264A6F"
        />
      </svg>

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

      {/* No animations - calm, static presentation */}
    </div>
  );
}
