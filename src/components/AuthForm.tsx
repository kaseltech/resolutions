'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import {
  isBiometricAvailable,
  isBiometricLoginEnabled,
  getBiometryType,
  getStoredCredentials,
  storeCredentials,
} from '@/lib/biometric';
import {
  signInWithApple,
  signInWithGoogle,
  initializeSocialLogin,
  isSocialLoginAvailable,
} from '@/lib/socialAuth';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Face ID state
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometryType, setBiometryType] = useState('Face ID');
  const [showEnablePrompt, setShowEnablePrompt] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);

  // Social login state
  const [socialLoginAvailable, setSocialLoginAvailable] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'apple' | 'google' | null>(null);

  // Check biometric and social login status on mount
  useEffect(() => {
    async function initialize() {
      // Check biometric availability
      const biometricAvail = await isBiometricAvailable();
      setBiometricAvailable(biometricAvail);

      if (biometricAvail) {
        const type = await getBiometryType();
        setBiometryType(type);

        const enabled = await isBiometricLoginEnabled();
        setBiometricEnabled(enabled);

        // Auto-trigger Face ID login if enabled
        if (enabled) {
          setTimeout(() => {
            handleBiometricLoginAuto();
          }, 500);
        }
      }

      // Initialize social login
      const socialAvail = isSocialLoginAvailable();
      setSocialLoginAvailable(socialAvail);
      if (socialAvail) {
        await initializeSocialLogin();
      }
    }
    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-trigger version (doesn't set loading state to avoid UI flash)
  const handleBiometricLoginAuto = async () => {
    try {
      const credentials = await getStoredCredentials();
      if (credentials) {
        setLoading(true);
        const { error } = await signIn(credentials.email, credentials.password);
        if (error) {
          setError('Face ID login failed. Please sign in with your password.');
        }
        setLoading(false);
      }
    } catch {
      // Silently fail - user can manually tap the button
    }
  };

  // Handle Face ID login
  const handleBiometricLogin = async () => {
    setError('');
    setLoading(true);

    const credentials = await getStoredCredentials();
    if (credentials) {
      const { error } = await signIn(credentials.email, credentials.password);
      if (error) {
        setError('Face ID login failed. Please sign in with your password.');
      }
    } else {
      setError('Face ID authentication failed. Try again or use password.');
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, username);
      if (error) {
        setError(error);
      } else {
        setMessage('Check your email to confirm your account!');
      }
      setLoading(false);
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        // Successful login - check if we should prompt for Face ID
        if (biometricAvailable && !biometricEnabled) {
          setPendingCredentials({ email, password });
          setShowEnablePrompt(true);
          setLoading(false);
          // Don't clear form - the prompt will handle navigation
        } else {
          setLoading(false);
        }
      }
    }
  };

  // Handle enabling Face ID after login
  const handleEnableBiometric = async () => {
    if (pendingCredentials) {
      await storeCredentials(pendingCredentials.email, pendingCredentials.password);
    }
    setShowEnablePrompt(false);
    setPendingCredentials(null);
  };

  const handleSkipBiometric = () => {
    setShowEnablePrompt(false);
    setPendingCredentials(null);
  };

  // Social login handlers
  const handleAppleSignIn = async () => {
    setError('');
    setSocialLoading('apple');
    const { error } = await signInWithApple();
    if (error) {
      setError(error);
    }
    setSocialLoading(null);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSocialLoading('google');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
    }
    setSocialLoading(null);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  };

  const inputFocusStyle = `
    input:focus {
      border-color: #C9A75A !important;
    }
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 'calc(1rem + env(safe-area-inset-top))',
      paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
    }}>
      {/* Background image - constellation night sky */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/login-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay for form readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 28, 46, 0.4) 0%, rgba(15, 28, 46, 0.6) 100%)',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Image
              src="/yearvow-wordmark.png"
              alt="YearVow 2026"
              width={280}
              height={90}
              style={{ objectFit: 'contain', maxWidth: '80vw' }}
              priority
              className="login-wordmark"
            />
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: inputFocusStyle }} />
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155',
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#94a3b8',
                  marginBottom: '0.5rem'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle}
                  placeholder="Your username"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.875rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{
                padding: '0.875rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontSize: '0.875rem',
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#C9A75A',
                color: '#1E3A5F',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: loading || socialLoading !== null ? 'not-allowed' : 'pointer',
                opacity: loading || socialLoading !== null ? 0.7 : 1,
                transition: 'all 0.15s ease',
                marginTop: '0.25rem',
              }}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            {/* Social Login Buttons */}
            {!isSignUp && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '0.875rem',
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>or continue with</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  {/* Sign in with Apple */}
                  <button
                    type="button"
                    onClick={handleAppleSignIn}
                    disabled={loading || socialLoading !== null}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#000000',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: loading || socialLoading !== null ? 'not-allowed' : 'pointer',
                      opacity: socialLoading === 'apple' ? 0.7 : 1,
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    {socialLoading === 'apple' ? 'Signing in...' : 'Apple'}
                  </button>

                  {/* Sign in with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading || socialLoading !== null}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      cursor: loading || socialLoading !== null ? 'not-allowed' : 'pointer',
                      opacity: socialLoading === 'google' ? 0.7 : 1,
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {socialLoading === 'google' ? 'Signing in...' : 'Google'}
                  </button>
                </div>
              </>
            )}

            {/* Face ID login button - only shown when not signing up and Face ID is enabled */}
            {!isSignUp && biometricEnabled && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1rem',
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
                </div>

                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'transparent',
                    color: '#f1f5f9',
                    fontWeight: '600',
                    fontSize: '1rem',
                    border: '1px solid #334155',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s',
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>
                    {biometryType === 'Face ID' ? '👤' : '👆'}
                  </span>
                  Sign in with {biometryType}
                </button>
              </>
            )}
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
              }}
              style={{
                color: '#94a3b8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : 'New to YearVow? Create an account'}
            </button>
          </div>
        </div>
      </div>

      {/* Face ID Enable Prompt - shown after successful login */}
      {showEnablePrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '1.25rem',
              padding: '2rem',
              maxWidth: '20rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid #334155',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {biometryType === 'Face ID' ? '👤' : '👆'}
            </div>
            <h3 style={{
              color: '#f1f5f9',
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: '0 0 0.5rem',
            }}>
              Enable {biometryType}?
            </h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              margin: '0 0 1.5rem',
              lineHeight: 1.5,
            }}>
              Sign in faster next time using {biometryType} instead of your password.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleEnableBiometric}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#C9A75A',
                  color: '#1E3A5F',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Enable {biometryType}
              </button>
              <button
                onClick={handleSkipBiometric}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
