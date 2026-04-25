'use client';

import React, { useEffect, useRef } from 'react';

/* ─── Descending particles that bridge hero → next section ─── */
const bridgeParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 9.3 + 3) % 96}%`,
  size: i % 2 === 0 ? 2 : 1.5,
  delay: i * 0.3,
  duration: 6 + (i % 4) * 1.2,
  color: i % 3 === 0
    ? 'rgba(201,169,110,0.6)'
    : i % 3 === 1
    ? 'rgba(74,158,255,0.4)'
    : 'rgba(139,92,246,0.35)',
}));

export default function HeroBridge() {
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!bridgeRef.current) return;
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (scrollY - vh * 0.5) / (vh * 0.5)));
        bridgeRef.current.style.opacity = `${progress}`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={bridgeRef}
      data-gsap-section="bridge"
      className="relative pointer-events-none overflow-hidden"
      style={{
        height: '180px',
        marginTop: '-180px',
        zIndex: 5,
        opacity: 0,
      }}
    >
      {/* Gradient bridge */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(4,4,10,0.6) 40%, rgba(4,4,10,0.95) 100%)',
        }}
      />

      {/* Descending particles */}
      {bridgeParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animation: `bridge-descend ${p.duration}s ease-in infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes bridge-descend {
          0%   { transform: translateY(0px) scale(1);   opacity: 0;   }
          10%  { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(180px) scale(0.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
