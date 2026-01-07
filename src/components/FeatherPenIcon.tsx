'use client';

interface FeatherPenIconProps {
  size?: number;
  color?: string;
  className?: string;
  filled?: boolean;
}

// Gold feather pen icon - YearVow brand element
export function FeatherPenIcon({ size = 20, color = '#C9A75A', className, filled = false }: FeatherPenIconProps) {
  if (filled) {
    // Filled, elegant quill for modal headers
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ display: 'block' }}
      >
        {/* Main feather body - filled */}
        <path
          d="M20.5 2C20.5 2 21 3 20 4.5C18.5 6.5 16 8 14 10C12 12 9 15 7 17C5.5 18.5 4 19.5 3 20.5L2.5 21L3 20C4 18 6 15 8 12C10 9 13 6 16 4C18 2.5 20 2 20.5 2Z"
          fill={color}
          opacity="0.9"
        />
        {/* Feather spine/rachis */}
        <path
          d="M20.5 2C18 4 14 8 10 13C7 17 4 19.5 3 20.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Quill tip */}
        <path
          d="M3 20.5L2 22L3.5 21L3 20.5Z"
          fill={color}
        />
        {/* Barb details */}
        <path
          d="M18 4C16 5.5 14 7.5 12 10"
          stroke="white"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M15 6C13 8 10 11 8 14"
          stroke="white"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    );
  }

  // Outline version for card buttons
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
