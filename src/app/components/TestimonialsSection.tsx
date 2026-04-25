'use client';

import React, { useRef, useEffect } from 'react';

const testimonials = [
  {
    quote: 'Motion Grace delivered 80 campaign-ready assets in 4 days. Our traditional agency needed 6 weeks and triple the budget for half the output.',
    name: 'Camille Fontaine',
    title: 'Brand Director',
    company: 'Maison Élite Paris',
    initials: 'CF',
    accent: '#C9A96E',
    metric: '4 days',
    metricLabel: 'delivery',
  },
  {
    quote: 'The digital twin they built of our serum is indistinguishable from a photograph. We launched three new colorways without a single shoot day.',
    name: 'Priya Nair',
    title: 'Head of Marketing',
    company: 'Glacé Beauty London',
    initials: 'PN',
    accent: '#4A9EFF',
    metric: '3×',
    metricLabel: 'SKUs, zero shoots',
  },
  {
    quote: 'Our AR try-on feature increased add-to-cart rate by 38% in the first month. The interactive 3D viewer alone paid for the entire project.',
    name: 'Sofia Marchetti',
    title: 'E-Commerce Director',
    company: 'Rouge Atelier Milan',
    initials: 'SM',
    accent: '#B06AB3',
    metric: '+38%',
    metricLabel: 'add-to-cart',
  },
  {
    quote: 'We replaced an entire in-house photography workflow with their pipeline. Quality is higher and turnaround dropped from weeks to hours.',
    name: 'Lena Hartmann',
    title: 'Creative Lead',
    company: 'Lumière Studios Berlin',
    initials: 'LH',
    accent: '#F97066',
    metric: 'Hours',
    metricLabel: 'not weeks',
  },
  {
    quote: 'I was skeptical at first. Now our seasonal lookbook is entirely CGI and our customers cannot tell the difference — conversion is up 52%.',
    name: 'Yuki Tanaka',
    title: 'VP of Digital',
    company: 'Sora Collective Tokyo',
    initials: 'YT',
    accent: '#34D399',
    metric: '+52%',
    metricLabel: 'conversion',
  },
  {
    quote: 'The level of craft in every render is astonishing. Our fragrance campaign visuals looked like a $500K production for a fraction of the cost.',
    name: 'Isabelle Dupont',
    title: 'CMO',
    company: 'Velour Parfums Paris',
    initials: 'ID',
    accent: '#FBBF24',
    metric: '10×',
    metricLabel: 'cost savings',
  },
  {
    quote: "Motion Grace's team understood our brand DNA from day one. Every asset felt like it came from our own creative director, not an outside vendor.",
    name: 'Marcus Webb',
    title: 'Founder',
    company: 'ARCN New York',
    initials: 'MW',
    accent: '#60A5FA',
    metric: '100%',
    metricLabel: 'brand match',
  },
  {
    quote: 'Six months ago we had no digital content pipeline. Today we ship 40 assets a week across every channel. This is infrastructure, not just a vendor.',
    name: 'Alara Yıldız',
    title: 'Head of Brand',
    company: 'Mirra Istanbul',
    initials: 'AY',
    accent: '#F472B6',
    metric: '40/wk',
    metricLabel: 'assets shipped',
  },
];

const row1 = testimonials.slice(0, 4);
const row2 = testimonials.slice(4);

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: '360px',
        background: 'rgba(255,255,255,0.022)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        marginRight: '16px',
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: 'absolute', top: 0, left: '28px', right: '28px', height: '1px',
        background: `linear-gradient(90deg, transparent, ${t.accent}60, transparent)`,
      }} />

      {/* Metric pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'baseline', gap: '6px',
        background: `${t.accent}12`,
        border: `1px solid ${t.accent}28`,
        borderRadius: '100px',
        padding: '4px 12px',
        marginBottom: '18px',
      }}>
        <span style={{ fontSize: '15px', fontWeight: 800, color: t.accent, letterSpacing: '-0.03em' }}>
          {t.metric}
        </span>
        <span style={{ fontSize: '10px', color: `${t.accent}90`, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {t.metricLabel}
        </span>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={t.accent} style={{ opacity: 0.85 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p style={{
        fontSize: '13.5px', lineHeight: 1.7, color: 'rgba(237,233,227,0.72)',
        margin: '0 0 22px', letterSpacing: '-0.01em',
      }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${t.accent}30, ${t.accent}10)`,
          border: `1px solid ${t.accent}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F1E2', letterSpacing: '-0.02em' }}>
            {t.name}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(201,169,110,0.55)', letterSpacing: '0.01em' }}>
            {t.title} · {t.company}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    const speed = reverse ? 0.38 : -0.38;
    let raf: number;
    const cardWidth = 376;
    const totalWidth = items.length * cardWidth;

    function tick() {
      x += speed;
      if (!reverse && x <= -totalWidth) x = 0;
      if (reverse && x >= 0) x = -totalWidth;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items, reverse]);

  const doubled = [...items, ...items];

  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
        background: 'linear-gradient(90deg, #020208, transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
        background: 'linear-gradient(270deg, #020208, transparent)',
        pointerEvents: 'none',
      }} />
      <div ref={trackRef} style={{ display: 'flex', willChange: 'transform' }}>
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      data-gsap-section="default"
      style={{
        background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 0 80px',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(201,169,110,0.045) 0%, transparent 65%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <p style={{
          fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'rgba(201,169,110,0.7)', fontWeight: 800, marginBottom: '14px',
        }}>
          CLIENT RESULTS
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
          letterSpacing: '-0.05em', color: '#F7F1E2', margin: '0 0 16px',
          lineHeight: 1.05,
        }}>
          Testimonials.
        </h2>
        <p style={{
          fontSize: '15px', color: 'rgba(237,233,227,0.45)', maxWidth: '420px',
          margin: '0 auto', lineHeight: 1.65, letterSpacing: '-0.01em',
        }}>
          From one-off shoots to perpetual content engines — the results speak.
        </p>
      </div>

      {/* Marquee rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>

      {/* Bottom stat bar */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '48px',
        marginTop: '56px', padding: '0 24px',
        position: 'relative', zIndex: 1, flexWrap: 'wrap',
      }}>
        {[
          { value: '200+', label: 'Brands served' },
          { value: '12,000+', label: 'Assets delivered' },
          { value: '4.9 / 5', label: 'Client satisfaction' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900,
              letterSpacing: '-0.05em', color: '#C9A96E', lineHeight: 1,
            }}>{s.value}</div>
            <div style={{
              fontSize: '10px', color: 'rgba(237,233,227,0.4)', marginTop: '5px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
