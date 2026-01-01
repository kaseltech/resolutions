'use client';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* North Star - Guidance, Direction, Hope, Stability */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8F8F5" />
          <stop offset="50%" stopColor="#F0F0EB" />
          <stop offset="100%" stopColor="#E8E8E3" />
        </linearGradient>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4C9A8" />
          <stop offset="50%" stopColor="#C4B898" />
          <stop offset="100%" stopColor="#B5A888" />
        </linearGradient>
        <linearGradient id="starCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFEF5" />
          <stop offset="100%" stopColor="#F5F0E0" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9AAA90" />
          <stop offset="100%" stopColor="#8A9A80" />
        </linearGradient>
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000010"/>
        </filter>
      </defs>

      {/* Main circle background - horizon feel */}
      <circle cx="50" cy="50" r="48" fill="url(#skyGradient)" filter="url(#softShadow)" />

      {/* Subtle outer ring */}
      <circle cx="50" cy="50" r="46" stroke="#D8D8D3" strokeWidth="1" fill="none" />

      {/* Distant stars - subtle background */}
      <circle cx="25" cy="30" r="1" fill="#C8C8C0" opacity="0.6" />
      <circle cx="75" cy="25" r="0.8" fill="#C8C8C0" opacity="0.5" />
      <circle cx="20" cy="55" r="0.6" fill="#C8C8C0" opacity="0.4" />
      <circle cx="80" cy="45" r="0.7" fill="#C8C8C0" opacity="0.5" />
      <circle cx="30" cy="70" r="0.5" fill="#C8C8C0" opacity="0.3" />
      <circle cx="70" cy="72" r="0.6" fill="#C8C8C0" opacity="0.4" />

      {/* North Star - Main 4-point star */}
      <g filter="url(#starGlow)">
        {/* Vertical beam */}
        <polygon
          points="50,15 52,45 50,50 48,45"
          fill="url(#starGradient)"
        />
        <polygon
          points="50,85 52,55 50,50 48,55"
          fill="url(#starGradient)"
        />

        {/* Horizontal beam */}
        <polygon
          points="15,50 45,48 50,50 45,52"
          fill="url(#starGradient)"
        />
        <polygon
          points="85,50 55,48 50,50 55,52"
          fill="url(#starGradient)"
        />

        {/* Diagonal beams - smaller, for 8-point effect */}
        <polygon
          points="26,26 44,46 50,50 46,44"
          fill="url(#starGradient)"
          opacity="0.7"
        />
        <polygon
          points="74,26 56,46 50,50 54,44"
          fill="url(#starGradient)"
          opacity="0.7"
        />
        <polygon
          points="26,74 44,54 50,50 46,56"
          fill="url(#starGradient)"
          opacity="0.7"
        />
        <polygon
          points="74,74 56,54 50,50 54,56"
          fill="url(#starGradient)"
          opacity="0.7"
        />
      </g>

      {/* Star center - bright core */}
      <circle cx="50" cy="50" r="6" fill="url(#starCenterGradient)" />
      <circle cx="50" cy="50" r="3" fill="#FFFEF8" />

      {/* Subtle horizon line at bottom */}
      <path
        d="M 10 75 Q 50 70 90 75"
        stroke="url(#accentGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      {/* 2026 text - grounded below the star */}
      <text
        x="50"
        y="93"
        textAnchor="middle"
        fill="#6A6A65"
        fontSize="12"
        fontWeight="600"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.05em"
      >
        2026
      </text>
    </svg>
  );
}
