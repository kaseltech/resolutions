'use client';

import { useState, useRef, useEffect } from 'react';
import { Category, CATEGORIES, getCategoryInfo } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { CategoryIcon } from './CategoryIcon';

interface CategoryFilterProps {
  selected: Category | 'all';
  onChange: (category: Category | 'all') => void;
  variant?: 'dropdown' | 'list';
}

export function CategoryFilter({ selected, onChange, variant = 'dropdown' }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getUsedCategories, resolutions } = useResolutions();
  const { colors } = useTheme();

  const usedCategories = getUsedCategories();
  const categoriesWithCounts = CATEGORIES
    .filter(cat => usedCategories.includes(cat.value))
    .map(cat => ({
      ...cat,
      count: resolutions.filter(r => r.category === cat.value).length,
    }));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedInfo = selected === 'all'
    ? { label: 'All Categories', color: '' }
    : getCategoryInfo(selected);

  const selectedCount = selected === 'all'
    ? resolutions.length
    : resolutions.filter(r => r.category === selected).length;

  if (categoriesWithCounts.length === 0) {
    return null;
  }

  // List variant - renders inline buttons for use in dropdowns
  if (variant === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <button
          onClick={() => onChange('all')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '0.5rem 0.5rem',
            backgroundColor: selected === 'all' ? `${colors.accent}15` : 'transparent',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            color: selected === 'all' ? colors.accent : colors.text,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {selected === 'all' && (
            <svg style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.5rem' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
          <span style={{ marginLeft: selected === 'all' ? 0 : '1.25rem' }}>All</span>
        </button>
        {categoriesWithCounts.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.5rem 0.5rem',
              backgroundColor: selected === cat.value ? `${colors.accent}15` : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              color: selected === cat.value ? colors.accent : colors.text,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {selected === cat.value && (
              <svg style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
            <span style={{ marginLeft: selected === cat.value ? 0 : '1.25rem' }}>{cat.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '0.5rem',
          color: colors.text,
          cursor: 'pointer',
          fontSize: '0.875rem',
          minWidth: '200px',
          justifyContent: 'space-between',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selected === 'all' ? (
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          ) : (
            <CategoryIcon category={selected} size={16} />
          )}
          <span>{selectedInfo.label}</span>
          <span style={{
            backgroundColor: colors.border,
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            color: colors.textMuted,
          }}>
            {selectedCount}
          </span>
        </span>
        <svg
          style={{
            width: '1rem',
            height: '1rem',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.25rem',
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: 50,
            minWidth: '220px',
            overflow: 'hidden',
          }}
        >
          {/* All option */}
          <button
            onClick={() => {
              onChange('all');
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: selected === 'all' ? `${colors.accent}20` : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.text,
              fontSize: '0.875rem',
              textAlign: 'left',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>All Categories</span>
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: colors.textMuted,
              backgroundColor: colors.border,
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
            }}>
              {resolutions.length}
            </span>
          </button>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: colors.border }} />

          {/* Category options */}
          {categoriesWithCounts.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                onChange(cat.value);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: selected === cat.value ? `${colors.accent}20` : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.text,
                fontSize: '0.875rem',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CategoryIcon category={cat.value} size={16} />
                <span>{cat.label}</span>
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: colors.textMuted,
                backgroundColor: colors.border,
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
              }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
