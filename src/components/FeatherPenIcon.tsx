'use client';

interface FeatherPenIconProps {
  size?: number;
  color?: string;
  className?: string;
  filled?: boolean;
}

// Gold feather quill with scroll - YearVow journal icon
export function FeatherPenIcon({ size = 20, color = '#C9A75A', className, filled = false }: FeatherPenIconProps) {
  // Darker shade for outlines/details
  const darkColor = '#A8863A';

  if (filled) {
    // Filled version for modal headers - quill with scroll
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ display: 'block' }}
      >
        {/* Scroll/paper base */}
        <path
          d="M8 22C6.5 22 5.5 21.5 5 21C4.5 20.5 4.5 19.5 5 19L7 17L13 15L15 17C15 17 14.5 19 14 20C13.5 21 12 22 10 22H8Z"
          fill={color}
          opacity="0.3"
        />
        <path
          d="M5 19C5 19 6 20 8 20C10 20 12 19 13 17"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Feather body - main shape */}
        <path
          d="M19 2C19 2 20 2.5 20 4C20 6 18 8 16 10L10 16L8 14C8 14 10 10 12 8C14 6 17 3 19 2Z"
          fill={color}
        />

        {/* Feather spine */}
        <path
          d="M19 2C17 4 13 8 9 15"
          stroke={darkColor}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />

        {/* Feather barbs - left side */}
        <path
          d="M17 4C15 5 13 7 11 10"
          stroke={darkColor}
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M15 6C13 8 11 10 9 13"
          stroke={darkColor}
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Nib */}
        <path
          d="M9 15L7 18L10 16L9 15Z"
          fill={darkColor}
        />

        {/* Ink flourish */}
        <path
          d="M7 18C6 19 5 19.5 4 20"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  // Outline version for card buttons - simpler quill with scroll hint
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Scroll hint at bottom */}
      <path
        d="M5 20C5.5 20.5 7 21 9 21C11 21 13 20 14 18"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Feather body outline */}
      <path
        d="M19 2C19 2 20.5 3 20 5C19.5 7 17 9 15 11L9 16L7 14L11 9C13 7 16 4 19 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Feather spine */}
      <path
        d="M19 2C16 5 12 9 8 15"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Barb details */}
      <path
        d="M16 5C14 7 12 9 10 12"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Nib */}
      <path
        d="M8 15L6 18L9 16L8 15Z"
        fill={color}
      />

      {/* Ink flourish */}
      <path
        d="M6 18C5 19 4 20 3 20.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
