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
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a5a8a" />
          <stop offset="100%" stopColor="#7a6a9a" />
        </linearGradient>
        <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d7a57" />
          <stop offset="100%" stopColor="#3d7a6a" />
        </linearGradient>
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9a7a4a" />
          <stop offset="100%" stopColor="#a85454" />
        </linearGradient>
      </defs>

      {/* Main circle background */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" />

      {/* Target rings */}
      <circle cx="50" cy="50" r="35" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="25" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="15" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" />

      {/* Bullseye center */}
      <circle cx="50" cy="50" r="8" fill="url(#targetGradient)" />

      {/* Arrow hitting target */}
      <g transform="rotate(-45, 50, 50)">
        {/* Arrow shaft */}
        <rect x="50" y="15" width="4" height="30" fill="url(#arrowGradient)" rx="2" />
        {/* Arrow head */}
        <polygon points="52,10 46,20 58,20" fill="url(#arrowGradient)" />
        {/* Arrow fletching */}
        <polygon points="48,42 52,48 56,42" fill="#a59a5a" />
      </g>

      {/* 2026 text */}
      <text
        x="50"
        y="92"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        2026
      </text>

      {/* Sparkle effects */}
      <circle cx="25" cy="30" r="2" fill="white" opacity="0.8" />
      <circle cx="75" cy="25" r="1.5" fill="white" opacity="0.6" />
      <circle cx="80" cy="70" r="2" fill="white" opacity="0.7" />
    </svg>
  );
}
