'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    description: 'Tap here to add a new resolution. Choose a tracking type: habits, savings goals, weight targets, or reflections.',
    position: 'top',
  },
  {
    target: 'resolution-card',
    title: 'Your Resolutions',
    description: 'Tap a card to expand notes. Long-press (or tap the menu) to edit, log progress, or delete.',
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

function getElement(target: string): Element | null {
  return document.querySelector(`[data-tutorial="${target}"]`);
}

function getElementRect(element: Element): ElementRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
  };
}

function scrollElementIntoView(element: Element): Promise<void> {
  return new Promise((resolve) => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if element is already mostly visible
    const isVisible = rect.top >= 50 && rect.bottom <= viewportHeight - 150;

    if (isVisible) {
      resolve();
      return;
    }

    // Calculate scroll position to center element with room for tooltip
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const targetScroll = elementCenter - viewportHeight / 2;

    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth'
    });

    // Wait for scroll to complete
    setTimeout(resolve, 400);
  });
}

export function SpotlightTutorial({ onComplete }: SpotlightTutorialProps) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [ready, setReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mountedRef = useRef(true);

  const step = tutorialSteps[currentStep];

  // Find valid step (skip steps with missing elements)
  const findNextValidStep = useCallback((startStep: number, direction: 1 | -1 = 1): number => {
    let checkStep = startStep;
    while (checkStep >= 0 && checkStep < tutorialSteps.length) {
      const element = getElement(tutorialSteps[checkStep].target);
      if (element) return checkStep;
      checkStep += direction;
    }
    return -1;
  }, []);

  // Initialize and find first valid step
  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      const validStep = findNextValidStep(0);
      if (validStep === -1) {
        await markOnboardingComplete();
        onComplete();
        return;
      }

      const element = getElement(tutorialSteps[validStep].target);
      if (!element) return;

      await scrollElementIntoView(element);

      if (!mountedRef.current) return;

      setCurrentStep(validStep);
      setTargetRect(getElementRect(element));
      setReady(true);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(init, 300);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, [findNextValidStep, onComplete]);

  // Update rect on scroll/resize
  useEffect(() => {
    if (!ready) return;

    const updateRect = () => {
      const element = getElement(step.target);
      if (element && mountedRef.current && !isTransitioning) {
        setTargetRect(getElementRect(element));
      }
    };

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [ready, step.target, isTransitioning]);

  const handleComplete = useCallback(async () => {
    lightTap();
    await markOnboardingComplete();
    onComplete();
  }, [onComplete]);

  const goToStep = useCallback(async (stepIndex: number) => {
    const element = getElement(tutorialSteps[stepIndex].target);
    if (!element) return;

    setIsTransitioning(true);

    await scrollElementIntoView(element);

    if (!mountedRef.current) return;

    setCurrentStep(stepIndex);
    setTargetRect(getElementRect(element));
    setIsTransitioning(false);
  }, []);

  const handleNext = useCallback(async () => {
    lightTap();

    if (currentStep >= tutorialSteps.length - 1) {
      handleComplete();
      return;
    }

    const nextValid = findNextValidStep(currentStep + 1, 1);
    if (nextValid === -1) {
      handleComplete();
      return;
    }

    await goToStep(nextValid);
  }, [currentStep, findNextValidStep, handleComplete, goToStep]);

  const handlePrev = useCallback(async () => {
    lightTap();

    if (currentStep <= 0) return;

    const prevValid = findNextValidStep(currentStep - 1, -1);
    if (prevValid === -1) return;

    await goToStep(prevValid);
  }, [currentStep, findNextValidStep, goToStep]);

  // Show loading until ready
  if (!ready || !targetRect) {
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
          <p style={{ color: colors.textMuted, margin: 0 }}>Loading tutorial...</p>
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
  const tooltipWidth = Math.min(280, window.innerWidth - padding * 2);
  const tooltipHeight = 200; // Approximate height

  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    width: tooltipWidth,
    zIndex: 10002,
    left: Math.max(padding, Math.min(
      targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
      window.innerWidth - tooltipWidth - padding
    )),
  };

  // Determine if tooltip should go above or below the element
  const spaceAbove = targetRect.top;
  const spaceBelow = window.innerHeight - targetRect.bottom;

  // Prefer the position specified, but flip if not enough room
  let position = step.position;
  if (position === 'bottom' && spaceBelow < tooltipHeight + padding && spaceAbove > spaceBelow) {
    position = 'top';
  } else if (position === 'top' && spaceAbove < tooltipHeight + padding && spaceBelow > spaceAbove) {
    position = 'bottom';
  }

  if (position === 'top') {
    tooltipStyle.bottom = window.innerHeight - targetRect.top + padding;
  } else {
    tooltipStyle.top = Math.min(targetRect.bottom + padding, window.innerHeight - tooltipHeight - padding);
  }

  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
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
          {!isFirstStep && (
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
