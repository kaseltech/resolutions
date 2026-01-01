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
      {/* Cloud Dancer inspired palette - serene whites and soft neutrals */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F5F0" />
          <stop offset="100%" stopColor="#E8E8E3" />
        </linearGradient>
        <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8B5A0" />
          <stop offset="100%" stopColor="#8FA085" />
        </linearGradient>
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5A0" />
          <stop offset="100%" stopColor="#B0A090" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000015"/>
        </filter>
      </defs>

      {/* Main circle background */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" filter="url(#softShadow)" />

      {/* Subtle outer ring */}
      <circle cx="50" cy="50" r="46" stroke="#D5D5D0" strokeWidth="1" fill="none" />

      {/* Target rings - soft grays */}
      <circle cx="50" cy="50" r="35" stroke="#C8C8C3" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="25" stroke="#BEBEB9" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="15" stroke="#B4B4AF" strokeWidth="2" fill="none" />

      {/* Bullseye center - muted sage */}
      <circle cx="50" cy="50" r="8" fill="url(#targetGradient)" />

      {/* Arrow hitting target */}
      <g transform="rotate(-45, 50, 50)">
        {/* Arrow shaft */}
        <rect x="50" y="15" width="4" height="30" fill="url(#arrowGradient)" rx="2" />
        {/* Arrow head */}
        <polygon points="52,10 46,20 58,20" fill="url(#arrowGradient)" />
        {/* Arrow fletching */}
        <polygon points="48,42 52,48 56,42" fill="#B5C4A5" />
      </g>

      {/* 2026 text - soft charcoal */}
      <text
        x="50"
        y="92"
        textAnchor="middle"
        fill="#5A5A55"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        2026
      </text>

      {/* Subtle cloud-like highlights */}
      <circle cx="30" cy="35" r="3" fill="white" opacity="0.6" />
      <circle cx="70" cy="30" r="2" fill="white" opacity="0.5" />
      <circle cx="75" cy="65" r="2.5" fill="white" opacity="0.4" />
    </svg>
  );
}
