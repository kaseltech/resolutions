'use client';

import Image from 'next/image';

export type IconName =
  | 'checkmark'
  | 'flame'
  | 'trophy'
  | 'gear'
  | 'compass'
  | 'heart'
  | 'calendar'
  | 'quill'
  | 'quill-scroll'
  | 'book'
  | 'target';

interface YearVowIconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function YearVowIcon({ name, size = 24, className, style }: YearVowIconProps) {
  return (
    <Image
      src={`/icons/${name}.png`}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: size > 32 ? '0.5rem' : '0.25rem',
        objectFit: 'contain',
        ...style,
      }}
    />
  );
}
