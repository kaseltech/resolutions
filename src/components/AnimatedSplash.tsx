'use client';

import { useState, useEffect } from 'react';
import { YEAR_COLORS } from './Logo';

interface AnimatedSplashProps {
  onComplete: () => void;
  duration?: number;
}

export function AnimatedSplash({ onComplete, duration = 2500 }: AnimatedSplashProps) {
  const [phase, setPhase] = useState<'initial' | 'compass' | 'path' | 'complete' | 'fadeOut'>('initial');

  useEffect(() => {
    // Phase 1: Compass appears and needle spins (200ms)
    const compassTimer = setTimeout(() => setPhase('compass'), 200);

    // Phase 2: Path draws (800ms)
    const pathTimer = setTimeout(() => setPhase('path'), 800);

    // Phase 3: Complete state (1400ms)
    const completeTimer = setTimeout(() => setPhase('complete'), 1400);

    // Phase 4: Start fade out
    const fadeTimer = setTimeout(() => setPhase('fadeOut'), duration - 400);

    // Complete
    const doneTimer = setTimeout(() => onComplete(), duration);

    return () => {
      clearTimeout(compassTimer);
      clearTimeout(pathTimer);
      clearTimeout(completeTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onComplete]);

  const colors = YEAR_COLORS;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #0a0f1a 0%, #0f172a 40%, #1e293b 100%)',
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
      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(45, 212, 191, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: phase !== 'initial' ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Journey path SVG */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.1" />
            <stop offset="50%" stopColor={colors.accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Curved journey path */}
        <path
          d="M 15 75 Q 25 65 35 60 T 50 50"
          stroke="url(#pathGradient)"
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="60"
          style={{
            strokeDashoffset: phase === 'path' || phase === 'complete' || phase === 'fadeOut' ? 0 : 60,
            transition: 'stroke-dashoffset 0.8s ease-out',
          }}
        />

        {/* Path dots/waypoints */}
        {[
          { x: 20, y: 72, delay: 0 },
          { x: 32, y: 62, delay: 0.2 },
          { x: 42, y: 55, delay: 0.4 },
        ].map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="1"
            fill={colors.accent}
            style={{
              opacity: phase === 'path' || phase === 'complete' || phase === 'fadeOut' ? 0.6 : 0,
              transition: `opacity 0.3s ease ${point.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* Compass logo */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          opacity: phase !== 'initial' ? 1 : 0,
          transform: phase !== 'initial' ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="splashNeedleNorth" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={colors.glow} />
              <stop offset="100%" stopColor={colors.primary} />
            </linearGradient>
            <linearGradient id="splashNeedleSouth" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <filter id="splashGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer ring - draws in */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`rgba(45, 212, 191, 0.25)`}
            strokeWidth="2.5"
            style={{
              strokeDasharray: 289,
              strokeDashoffset: phase === 'complete' || phase === 'fadeOut' ? 0 : 289,
              transition: 'stroke-dashoffset 0.6s ease-out',
            }}
          />

          {/* Background */}
          <circle cx="50" cy="50" r="43" fill="#0f172a" />

          {/* Cardinal marks */}
          <g stroke="#334155" strokeWidth="2" strokeLinecap="round">
            <line x1="50" y1="12" x2="50" y2="18" />
            <line x1="88" y1="50" x2="82" y2="50" />
            <line x1="50" y1="88" x2="50" y2="82" />
            <line x1="12" y1="50" x2="18" y2="50" />
          </g>

          {/* Minor ticks */}
          <g stroke="#334155" strokeWidth="1" strokeLinecap="round" opacity="0.5">
            <line x1="76.5" y1="23.5" x2="72.5" y2="27.5" />
            <line x1="76.5" y1="76.5" x2="72.5" y2="72.5" />
            <line x1="23.5" y1="76.5" x2="27.5" y2="72.5" />
            <line x1="23.5" y1="23.5" x2="27.5" y2="27.5" />
          </g>

          {/* Compass needle with spin animation */}
          <g
            filter="url(#splashGlow)"
            style={{
              transformOrigin: '50px 50px',
              transform: phase === 'initial' ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* North needle */}
            <path d="M50 18 L55 50 L50 54 L45 50 Z" fill="url(#splashNeedleNorth)">
              {(phase === 'complete' || phase === 'fadeOut') && (
                <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
              )}
            </path>
            {/* South needle */}
            <path d="M50 82 L55 50 L50 46 L45 50 Z" fill="url(#splashNeedleSouth)" />
          </g>

          {/* Center pivot */}
          <circle cx="50" cy="50" r="6" fill="#0f172a" stroke={colors.primary} strokeWidth="2" />
          <circle cx="50" cy="50" r="3" fill={colors.accent} />
          <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* App name */}
      <h1
        style={{
          marginTop: '1.5rem',
          fontSize: '1.75rem',
          fontWeight: 600,
          background: `linear-gradient(135deg, ${colors.glow} 0%, ${colors.accent} 50%, ${colors.primary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
          opacity: phase === 'complete' || phase === 'fadeOut' ? 1 : 0,
          transform: phase === 'complete' || phase === 'fadeOut' ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.5s ease-out 0.2s',
        }}
      >
        2026 Resolutions
      </h1>

      {/* Tagline */}
      <p
        style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#94a3b8',
          letterSpacing: '0.1em',
          opacity: phase === 'complete' || phase === 'fadeOut' ? 1 : 0,
          transform: phase === 'complete' || phase === 'fadeOut' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.4s ease-out 0.4s',
        }}
      >
        Chart your journey
      </p>
    </div>
  );
}
