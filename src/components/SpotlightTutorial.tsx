'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Preferences } from '@capacitor/preferences';
import { lightTap } from '@/lib/haptics';

const ONBOARDING_KEY = 'hasSeenOnboarding';

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    target: 'add-button',
    title: 'Create Resolutions',
    description: 'Tap here to add a new resolution. Set your goal, deadline, and category.',
    position: 'top',
  },
  {
    target: 'resolution-card',
    title: 'Your Resolutions',
    description: 'Tap any card to edit it and update your progress. Swipe left to edit, swipe right to add a journal entry.',
    position: 'bottom',
  },
  {
    target: 'view-toggle',
    title: 'Switch Views',
    description: 'Toggle between Dashboard view (with stats) and List view (cards only).',
    position: 'bottom',
  },
  {
    target: 'settings-button',
    title: 'Settings & Help',
    description: 'Access notifications, Face ID settings, and help from here. You can also replay this tutorial anytime.',
    position: 'bottom',
  },
];

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const { value } = await Preferences.get({ key: ONBOARDING_KEY });
    return value === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingComplete(): Promise<void> {
  await Preferences.set({ key: ONBOARDING_KEY, value: 'true' });
}

export async function resetOnboarding(): Promise<void> {
  await Preferences.remove({ key: ONBOARDING_KEY });
}

interface SpotlightTutorialProps {
  onComplete: () => void;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function SpotlightTutorial({ onComplete }: SpotlightTutorialProps) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const completeCalledRef = useRef(false);

  const step = tutorialSteps[currentStep];

  // Find the target element for current step
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const findElement = () => {
      const element = document.querySelector(`[data-tutorial="${step.target}"]`);

      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right,
        });
        setIsAnimating(false);
        return true;
      }
      return false;
    };

    // Try to find element immediately, then retry a few times
    if (!findElement()) {
      const interval = setInterval(() => {
        attempts++;
        if (findElement() || attempts >= maxAttempts) {
          clearInterval(interval);

          // If element still not found after retries, skip to next step
          if (attempts >= maxAttempts && !document.querySelector(`[data-tutorial="${step.target}"]`)) {
            if (currentStep < tutorialSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
            } else if (!completeCalledRef.current) {
              completeCalledRef.current = true;
              handleComplete();
            }
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStep, step.target]);

  // Update rect on scroll/resize
  useEffect(() => {
    const updateRect = () => {
      const element = document.querySelector(`[data-tutorial="${step.target}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right,
        });
      }
    };

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [step.target]);

  const handleNext = () => {
    lightTap();
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTargetRect(null); // Clear old rect
      setTimeout(() => setCurrentStep(prev => prev + 1), 100);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    lightTap();
    if (currentStep > 0) {
      setIsAnimating(true);
      setTargetRect(null); // Clear old rect
      setTimeout(() => setCurrentStep(prev => prev - 1), 100);
    }
  };

  const handleComplete = async () => {
    if (completeCalledRef.current) return;
    completeCalledRef.current = true;
    lightTap();
    await markOnboardingComplete();
    onComplete();
  };

  // Show loading overlay while finding element
  if (!targetRect) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: 16,
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: `3px solid ${colors.border}`,
              borderTopColor: colors.accent,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: colors.textMuted, margin: 0 }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Calculate tooltip position
  const padding = 12;
  const spotlightPadding = 8;
  const tooltipWidth = 280;

  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    width: tooltipWidth,
    zIndex: 10002,
  };

  switch (step.position) {
    case 'top':
      tooltipStyle.bottom = `calc(100vh - ${targetRect.top - padding}px)`;
      tooltipStyle.left = Math.max(padding, Math.min(
        targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        window.innerWidth - tooltipWidth - padding
      ));
      break;
    case 'bottom':
      tooltipStyle.top = targetRect.bottom + padding;
      tooltipStyle.left = Math.max(padding, Math.min(
        targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        window.innerWidth - tooltipWidth - padding
      ));
      break;
    case 'left':
      tooltipStyle.top = targetRect.top + targetRect.height / 2 - 60;
      tooltipStyle.right = `calc(100vw - ${targetRect.left - padding}px)`;
      break;
    case 'right':
      tooltipStyle.top = targetRect.top + targetRect.height / 2 - 60;
      tooltipStyle.left = targetRect.right + padding;
      break;
  }

  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
      }}
    >
      {/* Dark overlay with spotlight cutout */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            ${targetRect.left - spotlightPadding}px 100%,
            ${targetRect.left - spotlightPadding}px ${targetRect.top - spotlightPadding}px,
            ${targetRect.right + spotlightPadding}px ${targetRect.top - spotlightPadding}px,
            ${targetRect.right + spotlightPadding}px ${targetRect.bottom + spotlightPadding}px,
            ${targetRect.left - spotlightPadding}px ${targetRect.bottom + spotlightPadding}px,
            ${targetRect.left - spotlightPadding}px 100%,
            100% 100%,
            100% 0%
          )`,
        }}
        onClick={handleComplete}
      />

      {/* Spotlight border/glow */}
      <div
        style={{
          position: 'fixed',
          top: targetRect.top - spotlightPadding,
          left: targetRect.left - spotlightPadding,
          width: targetRect.width + spotlightPadding * 2,
          height: targetRect.height + spotlightPadding * 2,
          border: `2px solid ${colors.accent}`,
          borderRadius: 12,
          boxShadow: `0 0 0 4px ${colors.accent}30, 0 0 20px ${colors.accent}50`,
          pointerEvents: 'none',
          zIndex: 10001,
        }}
      />

      {/* Tooltip card */}
      <div
        style={{
          ...tooltipStyle,
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: '1.25rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Step indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentStep ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === currentStep ? colors.accent : colors.border,
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
          <button
            onClick={handleComplete}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.textMuted,
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: colors.text,
          margin: '0 0 0.5rem',
        }}>
          {step.title}
        </h3>
        <p style={{
          fontSize: '0.9375rem',
          color: colors.textMuted,
          lineHeight: 1.5,
          margin: '0 0 1rem',
        }}>
          {step.description}
        </p>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                color: colors.text,
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: 8,
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
