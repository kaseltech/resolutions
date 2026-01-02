'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      }
    }

    setLoading(false);
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
    transition: 'all 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 'calc(1rem + env(safe-area-inset-top))',
      paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
    }}>
      {/* Stars background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Static stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: '#e2e8f0',
              borderRadius: '50%',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouette */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '40%',
        }}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Back mountains */}
        <path
          d="M0 400 L0 280 L180 180 L320 250 L480 120 L600 200 L780 80 L900 180 L1080 100 L1200 200 L1350 140 L1440 220 L1440 400 Z"
          fill="#1e293b"
        />
        {/* Front mountains */}
        <path
          d="M0 400 L0 320 L150 240 L280 300 L420 180 L560 280 L720 160 L880 260 L1020 200 L1180 300 L1320 220 L1440 280 L1440 400 Z"
          fill="#0f172a"
          opacity="0.8"
        />
      </svg>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={120} />
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#f1f5f9',
            letterSpacing: '0.02em',
            marginBottom: '0.5rem'
          }}>
            2026 Resolutions
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '400' }}>
            Chart your course for the year ahead
          </p>
        </div>

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
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#047857',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                marginTop: '0.5rem',
              }}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
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
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
