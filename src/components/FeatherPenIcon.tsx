'use client';

interface FeatherPenIconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Gold feather pen icon - YearVow brand element
export function FeatherPenIcon({ size = 20, color = '#C9A75A', className }: FeatherPenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Feather body with elegant curve */}
      <path
        d="M20.5 3.5C18 1 12 3 8 7C4 11 2.5 17 3.5 20.5C3.5 20.5 4.5 20 6 19C7.5 18 9.5 16.5 11 15C12.5 13.5 14 11.5 15 10C16 8.5 17 7 17 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Feather barbs - top */}
      <path
        d="M17 7C17 7 19 5.5 20.5 3.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Feather vane detail lines */}
      <path
        d="M14 5C14 5 11 8 9 11"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M18 6C18 6 15 9 12 12"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M11 8C11 8 8 11 6 14"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Pen nib/tip */}
      <path
        d="M3.5 20.5L5 19L4.5 18L3.5 20.5Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
