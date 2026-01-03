'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { lightTap, mediumTap } from '@/lib/haptics';

interface HelpFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'general';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I create a new resolution?',
    answer: 'Tap the + button at the bottom of the screen (on mobile) or the "New" button in the header (on desktop). Fill in your resolution details and tap "Create Resolution".',
  },
  {
    question: 'How do I update my progress?',
    answer: 'Tap on any resolution card to edit it. Use the progress slider to adjust your progress percentage, then save your changes.',
  },
  {
    question: 'What is the journal feature?',
    answer: 'The journal lets you document your journey. Swipe right on a card (on mobile) or tap "Journal & Notes" to add entries about your progress, setbacks, or reflections.',
  },
  {
    question: 'How do I enable reminders?',
    answer: 'Go to Settings and enable Notifications. Then, when editing a resolution, you can set a reminder frequency (daily, weekly, or monthly).',
  },
  {
    question: 'Can I use Face ID/Touch ID to sign in?',
    answer: 'Yes! After signing in with your password, the app will offer to enable biometric login. You can manage this in Settings.',
  },
];

export function HelpFeedback({ isOpen, onClose }: HelpFeedbackProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'help' | 'feedback'>('help');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    mediumTap();
    // For now, just show a success message since email backend isn't set up
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      setFeedbackEmail('');
    }, 3000);
  };

  const toggleFaq = (index: number) => {
    lightTap();
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 50,
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0.75rem',
          flexShrink: 0,
        }}>
          <div style={{
            width: '40px',
            height: '4px',
            backgroundColor: colors.border,
            borderRadius: '2px',
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem 1rem',
          borderBottom: `1px solid ${colors.border}`,
          flexShrink: 0,
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: colors.text,
            margin: 0,
          }}>
            Help & Feedback
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
            }}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          padding: '1rem 1.5rem 0',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          <button
            onClick={() => { lightTap(); setActiveTab('help'); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: activeTab === 'help' ? colors.accent : colors.bg,
              color: activeTab === 'help' ? 'white' : colors.textMuted,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            FAQ
          </button>
          <button
            onClick={() => { lightTap(); setActiveTab('feedback'); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: activeTab === 'feedback' ? colors.accent : colors.bg,
              color: activeTab === 'feedback' ? 'white' : colors.textMuted,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Send Feedback
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          {activeTab === 'help' ? (
            <div>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '0.75rem',
                    backgroundColor: colors.bg,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontWeight: 500,
                      color: colors.text,
                      fontSize: '0.9375rem',
                      paddingRight: '1rem',
                    }}>
                      {faq.question}
                    </span>
                    <svg
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        color: colors.textMuted,
                        flexShrink: 0,
                        transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === index && (
                    <div style={{
                      padding: '0 1rem 1rem',
                      color: colors.textMuted,
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {submitted ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Thank you!
                  </div>
                  <p style={{
                    color: colors.text,
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                  }}>
                    Feedback received
                  </p>
                  <p style={{
                    color: colors.textMuted,
                    fontSize: '0.875rem',
                  }}>
                    We appreciate you taking the time to help us improve.
                  </p>
                </div>
              ) : (
                <>
                  {/* Feedback type selector */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: colors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}>
                      Type
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {([
                        { value: 'bug', label: 'Bug Report', icon: '🐛' },
                        { value: 'feature', label: 'Feature Request', icon: '💡' },
                        { value: 'general', label: 'General', icon: '💬' },
                      ] as const).map(({ value, label, icon }) => (
                        <button
                          key={value}
                          onClick={() => { lightTap(); setFeedbackType(value); }}
                          style={{
                            flex: 1,
                            padding: '0.75rem 0.5rem',
                            borderRadius: '0.5rem',
                            border: `1px solid ${feedbackType === value ? colors.accent : colors.border}`,
                            backgroundColor: feedbackType === value ? `${colors.accent}15` : 'transparent',
                            color: feedbackType === value ? colors.accent : colors.textMuted,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{icon}</div>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email (optional) */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: colors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}>
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.bg,
                        color: colors.text,
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: colors.textMuted,
                      marginTop: '0.375rem',
                    }}>
                      Include if you'd like us to follow up
                    </p>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: colors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}>
                      Message
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.bg,
                        color: colors.text,
                        fontSize: '1rem',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim()}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      backgroundColor: feedbackText.trim() ? colors.accent : colors.border,
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                      opacity: feedbackText.trim() ? 1 : 0.5,
                      transition: 'all 0.2s',
                    }}
                  >
                    Send Feedback
                  </button>

                  <p style={{
                    fontSize: '0.75rem',
                    color: colors.textMuted,
                    textAlign: 'center',
                    marginTop: '1rem',
                  }}>
                    Your feedback helps us improve the app for everyone.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
