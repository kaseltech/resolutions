'use client';

import { useState, useRef, useEffect } from 'react';
import { Category, CATEGORIES, getCategoryInfo } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';

const colors = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#475569',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
};

interface CategoryFilterProps {
  selected: Category | 'all';
  onChange: (category: Category | 'all') => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getUsedCategories, resolutions } = useResolutions();

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
    ? { icon: '📋', label: 'All Categories', color: '' }
    : getCategoryInfo(selected);

  const selectedCount = selected === 'all'
    ? resolutions.length
    : resolutions.filter(r => r.category === selected).length;

  if (categoriesWithCounts.length === 0) {
    return null;
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
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{selectedInfo.icon}</span>
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
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
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
              backgroundColor: selected === 'all' ? 'rgba(74, 111, 165, 0.2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.text,
              fontSize: '0.875rem',
              textAlign: 'left',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span>
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
                backgroundColor: selected === cat.value ? 'rgba(74, 111, 165, 0.2)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.text,
                fontSize: '0.875rem',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{cat.icon}</span>
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
