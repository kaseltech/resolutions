'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';

// Decorative star component for the background
function Star({ x, y, size, opacity, delay }: { x: string; y: string; size: number; opacity: number; delay: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        animation: `twinkle 3s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z"
          fill="#C4B898"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

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
    borderRadius: '0.75rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E0DB',
    color: '#4A4A45',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #F8F8F5 0%, #F0F0EB 50%, #E8E8E3 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated twinkle keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(196, 184, 152, 0.2); }
          50% { box-shadow: 0 0 40px rgba(196, 184, 152, 0.4); }
        }
      `}</style>

      {/* Decorative background stars */}
      <Star x="5%" y="15%" size={20} opacity={0.4} delay={0} />
      <Star x="15%" y="70%" size={16} opacity={0.3} delay={0.5} />
      <Star x="85%" y="20%" size={24} opacity={0.5} delay={1} />
      <Star x="90%" y="60%" size={18} opacity={0.35} delay={1.5} />
      <Star x="75%" y="80%" size={14} opacity={0.25} delay={2} />
      <Star x="25%" y="85%" size={12} opacity={0.3} delay={2.5} />
      <Star x="10%" y="40%" size={10} opacity={0.2} delay={0.8} />
      <Star x="95%" y="40%" size={16} opacity={0.4} delay={1.2} />

      {/* Large decorative north star - top left */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '8%',
        width: '60px',
        height: '60px',
        opacity: 0.15,
        animation: 'float 6s ease-in-out infinite',
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 52,45 50,50 48,45" fill="#B5A888" />
          <polygon points="50,95 52,55 50,50 48,55" fill="#B5A888" />
          <polygon points="5,50 45,48 50,50 45,52" fill="#B5A888" />
          <polygon points="95,50 55,48 50,50 55,52" fill="#B5A888" />
        </svg>
      </div>

      {/* Large decorative north star - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        right: '10%',
        width: '80px',
        height: '80px',
        opacity: 0.12,
        animation: 'float 8s ease-in-out 1s infinite',
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <polygon points="50,10 52,45 50,50 48,45" fill="#B5A888" />
          <polygon points="50,90 52,55 50,50 48,55" fill="#B5A888" />
          <polygon points="10,50 45,48 50,50 45,52" fill="#B5A888" />
          <polygon points="90,50 55,48 50,50 55,52" fill="#B5A888" />
        </svg>
      </div>

      {/* Subtle radial glow behind form */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(ellipse, rgba(196, 184, 152, 0.15) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Soft cloud-like elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '200px',
        height: '100px',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '10%',
        width: '180px',
        height: '90px',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(35px)',
      }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div
            className="flex justify-center mb-4"
            style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}
          >
            <Logo size={90} />
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
            Let your north star guide your journey
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 60px rgba(196, 184, 152, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
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
                color: '#6A6A65',
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
                color: '#6A6A65',
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
                backgroundColor: 'rgba(138, 154, 128, 0.15)',
                border: '1px solid rgba(138, 154, 128, 0.3)',
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
