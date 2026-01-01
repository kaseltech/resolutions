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

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #F8F8F5 0%, #F0F0EB 50%, #E8E8E3 100%)',
    }}>
      {/* Subtle cloud-like decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '200px',
        height: '100px',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '250px',
        height: '120px',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '150px',
        height: '80px',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
      }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={80} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            color: '#4A4A45',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            2026 Resolutions
          </h1>
          <p style={{ color: '#8A8A85', fontSize: '1rem', fontWeight: '300' }}>
            A year of calm reflection and purposeful growth
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '400',
            color: '#4A4A45',
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
                  color: '#6A6A65',
                  marginBottom: '0.5rem'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#F8F8F5',
                    border: '1px solid #E0E0DB',
                    color: '#4A4A45',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
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
                color: '#6A6A65',
                marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#F8F8F5',
                  border: '1px solid #E0E0DB',
                  color: '#4A4A45',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6A6A65',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#F8F8F5',
                  border: '1px solid #E0E0DB',
                  color: '#4A4A45',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.875rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(180, 100, 100, 0.1)',
                border: '1px solid rgba(180, 100, 100, 0.2)',
                color: '#8B5A5A',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{
                padding: '0.875rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(100, 140, 100, 0.1)',
                border: '1px solid rgba(100, 140, 100, 0.2)',
                color: '#5A7A5A',
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
                borderRadius: '0.75rem',
                backgroundColor: '#8A9A80',
                color: 'white',
                fontWeight: '500',
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
                color: '#8A8A85',
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

        <p style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#A0A09B',
          fontSize: '0.75rem',
          fontWeight: '300'
        }}>
          Inspired by Cloud Dancer — Pantone Color of the Year 2026
        </p>
      </div>
    </div>
  );
}
