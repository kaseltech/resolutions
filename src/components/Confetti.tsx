'use client';

import { useEffect, useRef, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const COLORS = [
  '#10b981', // emerald
  '#34d399', // light emerald
  '#fbbf24', // amber
  '#f59e0b', // orange
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#3b82f6', // blue
];

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Create initial particles
    const newParticles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;

    for (let i = 0; i < 150; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 8 + Math.random() * 12;

      newParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    setParticles(newParticles);
    startTimeRef.current = Date.now();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || particles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTimeRef.current;
      const duration = 3000; // 3 seconds

      let allDone = true;

      setParticles(prev => {
        const updated = prev.map(p => {
          const newP = { ...p };
          newP.x += newP.vx;
          newP.y += newP.vy;
          newP.vy += 0.3; // gravity
          newP.vx *= 0.99; // air resistance
          newP.rotation += newP.rotationSpeed;

          // Fade out near the end
          if (elapsed > duration * 0.6) {
            newP.opacity = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
          }

          if (newP.opacity > 0) allDone = false;

          return newP;
        });

        return updated;
      });

      // Draw particles
      particles.forEach(p => {
        if (p.opacity <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Draw confetti shape (rectangle)
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);

        ctx.restore();
      });

      if (!allDone && elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setParticles([]);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, onComplete]);

  if (!active && particles.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
