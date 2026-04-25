'use client';

import React, { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    quote: 'Motion Grace delivered 80 campaign-ready assets in 4 days. Our traditional agency needed 6 weeks and triple the budget for half the output.',
    name: 'Camille Fontaine',
    title: 'Brand Director',
    company: 'Maison Élite Paris',
    initials: 'CF',
    accent: '#C9A96E',
  },
  {
    quote: 'The digital twin they built of our serum is indistinguishable from a photograph. We launched three new colorways without a single shoot day.',
    name: 'Priya Nair',
    title: 'Head of Marketing',
    company: 'Glacé Beauty London',
    initials: 'PN',
    accent: '#4A9EFF',
  },
  {
    quote: 'Our AR try-on feature increased add-to-cart rate by 38% in the first month. The interactive 3D viewer alone paid for the entire project.',
    name: 'Sofia Marchetti',
    title: 'E-Commerce Director',
    company: 'Rouge Atelier Milan',
    initials: 'SM',
    accent: '#8B5CF6',
  },
  {
    quote: 'We replaced an entire in-house photography workflow with their pipeline. The quality is higher and our turnaround time dropped from weeks to hours.',
    name: 'Lena Hartmann',
    title: 'Creative Lead',
    company: 'Lumière Studios Berlin',
    initials: 'LH',
    accent: '#F97066',
  },
  {
    quote: 'I was skeptical at first. Now our seasonal lookbook is entirely CGI and our customers cannot tell the difference — conversion is up 52%.',
    name: 'Yuki Tanaka',
    title: 'VP of Digital',
    company: 'Sora Collective Tokyo',
    initials: 'YT',
    accent: '#34D399',
  },
  {
    quote: 'The level of craft in every render is astonishing. Our fragrance campaign visuals looked like a $500K production for a fraction of the cost.',
    name: 'Isabelle Dupont',
    title: 'CMO',
    company: 'Velour Parfums Paris',
    initials: 'ID',
    accent: '#FBBF24',
  },
];

/* Deterministic float offsets per card */
const floatConfigs = testimonials.map((_, i) => ({
  dx: ((i * 37.3 + 11) % 100) - 50,  // -50 to +50
  dy: ((i * 51.7 + 23) % 60) - 30,   // -30 to +30
  duration: 8 + (i % 5) * 1.5,
  delay: i * 0.6,
}));

function TestimonialCard({
  item,
  index,
  sectionProgress,
}: {
  item: typeof testimonials[0];
  index: number;
  sectionProgress: number;
}) {
  const assemble = Math.max(0, Math.min(1, (sectionProgress - index * 0.08) / 0.5));
  const config = floatConfigs[index];

  return (
    <div
      style={{
        opacity: assemble,
        transform: `translate(${(1 - assemble) * config.dx * 0.5}px, ${(1 - assemble) * config.dy * 0.5}px) scale(${0.85 + assemble * 0.15})`,
        transition: 'none',
        animation: assemble > 0.9 ? `float-card-${index % 3} ${config.duration}s ease-in-out infinite` : 'none',
        animationDelay: `${config.delay}s`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'rgba(10,10,18,0.8)',
          border: `1px solid rgba(255,255,255,0.04)`,
          backdropFilter: 'blur(12px)',
          boxShadow: `0 0 40px rgba(0,0,0,0.4), 0 0 0 1px ${item.accent}0A`,
          transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Soft glow */}
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: '1rem',
            background: `radial-gradient(ellipse 60% 50% at 30% 30%, ${item.accent}06 0%, transparent 70%)`,
            pointerEvents: 'none',
            animation: `opacity-pulse ${4 + index}s ease-in-out infinite`,
            animationDelay: `${index * 0.4}s`,
          }}
        />

        {/* Quote mark */}
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            lineHeight: 0.8,
            marginBottom: '0.5rem',
            color: item.accent,
            opacity: 0.25,
            fontFamily: 'Georgia, serif',
          }}
        >
          "
        </div>

        {/* Quote text */}
        <p
          style={{
            fontSize: '0.82rem',
            lineHeight: 1.8,
            color: 'rgba(237,233,227,0.65)',
            fontWeight: 300,
            margin: '0 0 1.5rem',
            fontStyle: 'italic',
          }}
        >
          {item.quote}
        </p>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: `${item.accent}18`,
              border: `1px solid ${item.accent}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
              color: item.accent,
              flexShrink: 0,
            }}
          >
            {item.initials}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(237,233,227,0.9)', letterSpacing: '0.03em' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(237,233,227,0.35)', letterSpacing: '0.05em', marginTop: '1px' }}>
              {item.title} · {item.company}
            </div>
          </div>
        </div>

        {/* Accent line bottom */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${item.accent}30, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

export default function FloatingTestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionProgress, setSectionProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / (vh * 0.85)));
      setSectionProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-gsap-section="default"
      className="relative overflow-hidden py-32 sm:py-48 px-6 sm:px-10"
      style={{
        background: 'linear-gradient(to bottom, #0A0C16 0%, #06060C 100%)',
      }}
    >
      {/* Background glow pool */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(74,158,255,0.025) 0%, transparent 70%)',
          opacity: sectionProgress,
        }}
      />

      {/* Section header */}
      <div
        className="relative z-10 text-center mb-20"
        style={{
          opacity: sectionProgress > 0.05 ? 1 : 0,
          transform: `translateY(${sectionProgress > 0.05 ? 0 : 24}px)`,
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3))' }} />
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(201,169,110,0.5)' }}>
            Client Stories
          </span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.3), transparent)' }} />
        </div>

        <h2
          className="font-black tracking-tighter"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
        >
          <span style={{ color: 'rgba(237,233,227,0.85)' }}>Brands that </span>
          <span
            style={{
              background: 'linear-gradient(135deg, #8B6F3E 0%, #F2E4C4 40%, #D4A96A 70%, #C9956E 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            never look back.
          </span>
        </h2>
      </div>

      {/* Cards grid — masonry-like with different heights */}
      <div
        className="relative z-10 max-w-6xl mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {testimonials.map((item, i) => (
          <TestimonialCard
            key={i}
            item={item}
            index={i}
            sectionProgress={sectionProgress as number}
          />
        ))}
      </div>

      {/* Aggregate rating row */}
      <div
        className="relative z-10 max-w-6xl mx-auto mt-20 flex flex-wrap items-center justify-center gap-8 sm:gap-16"
        style={{
          opacity: sectionProgress > 0.7 ? 1 : 0,
          transform: `translateY(${sectionProgress > 0.7 ? 0 : 16}px)`,
          transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s',
        }}
      >
        {[
          { value: '98%', label: 'Client satisfaction' },
          { value: '5.0', label: 'Average rating' },
          { value: '300+', label: 'Happy brands' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div
              className="font-black"
              style={{
                fontSize: '2rem', letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #C9A96E, #f0d49a)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {stat.value}
            </div>
            <div className="text-[10px] tracking-widest uppercase mt-1" style={{ color: 'rgba(237,233,227,0.3)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float-card-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(0.3deg); }
        }
        @keyframes float-card-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-6px) rotate(-0.2deg); }
        }
        @keyframes float-card-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(0.4deg); }
        }
        @keyframes opacity-pulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
