'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Particle: chaos → order
const PARTICLE_COUNT = 36;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  // Spread across full width
  startX: `${(i * 11.7 + 3) % 100}%`,
  // Randomish vertical entry
  delay: (i * 0.09) % 1.8,
  duration: 2.2 + (i % 5) * 0.4,
  size: i % 7 === 0 ? 3 : i % 4 === 0 ? 2 : 1,
  // Color: mix of red (chaos) fading to gold (clarity)
  color: i % 4 === 0
    ? `rgba(255,${80 + (i % 3) * 20},${80 + (i % 2) * 20},`
    : i % 3 === 1
    ? `rgba(201,169,110,`
    : `rgba(74,158,255,`,
}));

// Light streaks – horizontal sweeping
const STREAK_COUNT = 8;
const streaks = Array.from({ length: STREAK_COUNT }, (_, i) => ({
  id: i,
  top: `${10 + i * 10}%`,
  delay: i * 0.28,
  width: 80 + (i % 3) * 60,
  opacity: 0.06 + (i % 3) * 0.03,
}));

export default function SolutionBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0→1 as section scrolls through viewport

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress=0 when top of element at bottom of viewport
    // progress=1 when bottom of element exits top of viewport
    const p = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh)));
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Noise opacity fades from 1 → 0 as progress increases
  const noiseOpacity = Math.max(0, 0.05 - progress * 0.05);
  // Scanlines fade out
  const scanlinesOpacity = Math.max(0, 0.35 - progress * 0.35);
  // Red tint fades, gold glow rises
  const redOpacity = Math.max(0, 1 - progress * 2.5);
  const goldOpacity = Math.min(1, progress * 2);
  // Background transitions from dark-red-toned to deep-blue-dark
  const bgR = Math.round(6 + progress * 2);
  const bgG = Math.round(4 + progress * 4);
  const bgB = Math.round(8 + progress * 14);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        height: '380px',
        background: `linear-gradient(to bottom,
          rgb(${bgR},4,8) 0%,
          rgb(${Math.round(6+progress*2)},${Math.round(4+progress*6)},${Math.round(10+progress*18)}) 40%,
          rgb(${Math.round(6+progress*2)},${Math.round(6+progress*8)},${Math.round(14+progress*20)}) 100%
        )`,
        transition: 'background 0.1s linear',
      }}
    >
      {/* ── Noise grain fading out ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: noiseOpacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        animation: noiseOpacity > 0.01 ? 'bridge-noise 0.5s steps(3) infinite' : 'none',
      }} />

      {/* ── Scanlines fading out ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        opacity: scanlinesOpacity,
      }} />

      {/* ── Red veil fading out ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(180,30,30,0.08) 0%, transparent 70%)',
        opacity: redOpacity,
      }} />

      {/* ── Gold clarity glow rising from below ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,169,110,0.08) 0%, transparent 65%)',
        opacity: goldOpacity,
        filter: 'blur(20px)',
      }} />

      {/* ── Falling particles (chaos → drift down, settle) ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.startX,
            top: '-4px',
            width: p.size,
            height: p.size,
            background: `${p.color}${0.3 + (progress * 0.4).toFixed(2)})`,
            boxShadow: p.size > 1 ? `0 0 ${p.size * 3}px ${p.color}0.5)` : 'none',
            animation: `particle-fall-${p.id % 4} ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ── Light streaks sweeping horizontally ── */}
      {streaks.map((s) => (
        <div key={s.id} className="absolute pointer-events-none overflow-hidden" style={{
          top: s.top, left: 0, right: 0,
          height: '1px',
          opacity: s.opacity * Math.min(1, progress * 3),
        }}>
          <div style={{
            height: '1px',
            width: `${s.width}px`,
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), rgba(201,169,110,0.9), rgba(201,169,110,0.6), transparent)',
            animation: `streak-slide ${2.5 + s.id * 0.3}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }} />
        </div>
      ))}

      {/* ── Central convergence beam ── */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{
        top: 0, bottom: 0, width: '2px',
        background: `linear-gradient(to bottom,
          transparent 0%,
          rgba(201,169,110,${(goldOpacity * 0.15).toFixed(3)}) 30%,
          rgba(201,169,110,${(goldOpacity * 0.3).toFixed(3)}) 50%,
          rgba(201,169,110,${(goldOpacity * 0.15).toFixed(3)}) 70%,
          transparent 100%
        )`,
        filter: 'blur(1px)',
        transition: 'all 0.15s ease',
      }} />

      {/* ── Text dissolve: chaos → clarity ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* "— chaos —" fades out */}
        <div style={{
          opacity: Math.max(0, 1 - progress * 3.5),
          transform: `translateY(${progress * -20}px) scale(${1 - progress * 0.08})`,
          transition: 'all 0.1s ease',
        }}>
          <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(255,107,107,0.25)' }}>
            ✦ &nbsp; chaos &nbsp; ✦
          </span>
        </div>

        {/* Center dot that morphs */}
        <div className="my-5 relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{
            background: `conic-gradient(from ${progress * 360}deg, rgba(255,80,80,${Math.max(0, 0.3 - progress * 0.3)}) 0%, rgba(201,169,110,${Math.min(0.4, progress * 0.6)}) 50%, transparent 100%)`,
            animation: 'morph-spin 3s linear infinite',
            filter: 'blur(1px)',
          }} />
          <div className="w-2 h-2 rounded-full" style={{
            background: `rgba(${Math.round(255 - progress * 54)},${Math.round(80 + progress * 89)},${Math.round(80 + progress * 30)},0.8)`,
            boxShadow: `0 0 12px rgba(${Math.round(255 - progress * 54)},${Math.round(80 + progress * 89)},${Math.round(80 + progress * 30)},0.5)`,
            transition: 'all 0.1s ease',
          }} />
        </div>

        {/* "— clarity —" fades in */}
        <div style={{
          opacity: Math.max(0, progress * 3.5 - 2.5),
          transform: `translateY(${Math.max(0, (1 - progress) * 20)}px) scale(${0.95 + progress * 0.05})`,
          transition: 'all 0.1s ease',
        }}>
          <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(201,169,110,0.3)' }}>
            ✦ &nbsp; clarity &nbsp; ✦
          </span>
        </div>
      </div>

      {/* ── Bottom feather into services ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 0%, var(--background, #080812) 100%)',
      }} />

      <style>{`
        @keyframes bridge-noise {
          0%   { background-position: 0 0 }
          33%  { background-position: -8px 12px }
          66%  { background-position: 5px -8px }
          100% { background-position: 0 0 }
        }
        @keyframes particle-fall-0 {
          0%   { transform: translateY(-10px) translateX(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(400px) translateX(12px); opacity: 0; }
        }
        @keyframes particle-fall-1 {
          0%   { transform: translateY(-10px) translateX(0px); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(400px) translateX(-18px); opacity: 0; }
        }
        @keyframes particle-fall-2 {
          0%   { transform: translateY(-10px) translateX(0px); opacity: 0; }
          15%  { opacity: 0.9; }
          85%  { opacity: 0.3; }
          100% { transform: translateY(400px) translateX(8px); opacity: 0; }
        }
        @keyframes particle-fall-3 {
          0%   { transform: translateY(-10px) translateX(0px); opacity: 0; }
          12%  { opacity: 0.7; }
          88%  { opacity: 0.5; }
          100% { transform: translateY(400px) translateX(-6px); opacity: 0; }
        }
        @keyframes streak-slide {
          0%   { transform: translateX(-200px); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
        }
        @keyframes morph-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
