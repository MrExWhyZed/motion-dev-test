'use client';

import React, { useEffect, useRef, useState } from 'react';

// ─── Scroll-reveal words ───
const words = [
  'Build', 'once,', 'create', 'forever —',
  'your', 'product', 'becomes', 'a', 'living,',
  'breathing', 'digital', 'asset,', 'ready', 'to',
  'tell', 'a', 'new', 'story', 'every', 'single', 'time.',
];

const stats = [
  { value: 60, suffix: '%', label: 'Cost Reduction', sub: 'vs. traditional shoots', accent: '#C9A96E' },
  { value: 5, suffix: 'x', label: 'Faster Delivery', sub: 'average turnaround', accent: '#4A9EFF' },
  { value: 100, suffix: '+', label: 'Assets Per Product', sub: 'from one digital twin', accent: '#8B5CF6' },
  { value: 40, suffix: '%', label: 'Conversion Lift', sub: 'with interactive 3D', accent: '#C9A96E' },
];

const benefits = [
  {
    title: 'No Physical Shoots',
    description: 'Eliminate studio costs, photographer fees, travel, and logistics. Forever.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Faster Launches',
    description: 'From brief to final assets in 5 days. Not 5 weeks.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Infinite Variations',
    description: 'New colorway? New market? New season? Render it in hours.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Premium Visual Control',
    description: 'Perfect lighting. Perfect angle. Perfect mood. Every single time.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

// ─── Animated counter ───
function CounterItem({ value, suffix, label, sub, accent }: {
  value: number; suffix: string; label: string; sub: string; accent: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const steps = 70;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setCount(value); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, 2200 / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center py-2">
      <div className="flex items-baseline gap-0.5 mb-2">
        <span className="text-5xl sm:text-6xl font-black tracking-tighter" style={{ color: accent }}>{count}</span>
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: accent }}>{suffix}</span>
      </div>
      <p className="text-sm font-semibold text-foreground mb-1 tracking-tight">{label}</p>
      <p className="text-xs text-muted-foreground font-light tracking-wide">{sub}</p>
    </div>
  );
}

// ─── Benefit card with reveal ───
function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group flex gap-5 p-7 rounded-3xl border border-border/40 hover:border-primary/20 transition-all duration-700"
      style={{
        background: 'var(--card)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, border-color 0.5s ease, box-shadow 0.5s ease`,
        boxShadow: 'none',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(201,169,110,0.07)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary/15 group-hover:shadow-[0_0_16px_rgba(201,169,110,0.2)] transition-all duration-700">
        {benefit.icon}
      </div>
      <div>
        <h3 className="text-base font-bold tracking-tight text-foreground mb-2">{benefit.title}</h3>
        <p className="text-sm text-muted-foreground leading-[1.8] font-light">{benefit.description}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// MERGED SECTION
// ══════════════════════════════════════════
export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Scroll-reveal words
  useEffect(() => {
    const block = revealRef.current;
    if (!block) return;
    const wordEls = block.querySelectorAll<HTMLSpanElement>('.reveal-word');

    const onScroll = () => {
      const rect = block.getBoundingClientRect();
      const winH = window.innerHeight;
      const start = winH * 0.85;
      const end = winH * 0.15;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const activeCount = Math.floor(progress * wordEls.length);
      wordEls.forEach((w, i) =>
        i < activeCount ? w.classList.add('active') : w.classList.remove('active')
      );
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Heading & stats reveal
  useEffect(() => {
    const hObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.2 }
    );
    const sObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.15 }
    );
    if (headingRef.current) hObs.observe(headingRef.current);
    if (statsRef.current) sObs.observe(statsRef.current);
    return () => { hObs.disconnect(); sObs.disconnect(); };
  }, []);

  return (
    <section ref={sectionRef} id="why" className="relative overflow-hidden">

      {/* PART 1 — SCROLL REVEAL */}
      <div className="relative py-36 sm:py-48 px-6 sm:px-10">

        {/* Ambient glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '70vw',
            height: '50vw',
            background: 'radial-gradient(ellipse, rgba(201,169,110,0.055) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />

        <div ref={revealRef} className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-5 h-px bg-primary/50" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary/70">The CGI Advantage</span>
            <div className="w-5 h-px bg-primary/50" />
          </div>

          {/* Scroll-driven headline */}
          <h2 className="text-[clamp(2rem,5.5vw,4.2rem)] font-black tracking-tighter leading-[1.05] mb-0">
            {words.map((w, i) => (
              <span
                key={i}
                className={`reveal-word ${i === 0 || i === 2 ? 'text-gradient-gold-reveal' : ''}`}
              >
                {w}{' '}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Section bridge divider */}
      <div className="section-divider mx-6 sm:mx-10" />

      {/* PART 2 — WHY CHOOSE US */}
      <div className="relative py-28 sm:py-36 px-6 sm:px-10">

        {/* Subtle side glow */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '40vw',
            height: '80%',
            background: 'radial-gradient(ellipse at right, rgba(74,158,255,0.04) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Header block */}
          <div ref={headingRef} className="mb-16">
            <h2
              className="text-[clamp(1.5rem,5vw,3rem)] font-black tracking-tighter text-foreground leading-none"
              style={{
                opacity: headingVisible ? 1 : 0,
                transform: headingVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 1s ease 120ms, transform 1s ease 120ms',
              }}
            >
              Why Beauty Brands{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#B8935A 0%,#E8D4A0 45%,#C9A96E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Are Switching
              </span>
            </h2>
          </div>

          {/* Stats row */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 p-10 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, rgba(201,169,110,0.04) 0%, rgba(10,10,18,0.9) 100%)',
              border: '1px solid rgba(201,169,110,0.1)',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {stats.map((stat) => (
              <CounterItem key={stat.label} {...stat} />
            ))}
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={i} />
            ))}
          </div>

        </div>{/* end max-w-7xl */}
      </div>{/* end PART 2 */}

      {/* Styles */}
      <style>{`
        .reveal-word {
          display: inline;
          color: rgba(107,107,128,0.22);
          transition: color 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-word.active {
          color: var(--foreground);
        }
        .reveal-word.text-gradient-gold-reveal {
          -webkit-text-fill-color: transparent;
          background: linear-gradient(135deg,#B8935A 0%,#E8D4A0 45%,#C9A96E 100%);
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0.2;
          transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-word.text-gradient-gold-reveal.active {
          opacity: 1;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
