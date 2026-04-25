"use client";

import React, { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    quote: 'Motion Grace delivered 80 campaign-ready assets in 4 days. Our traditional agency needed 6 weeks and triple the budget for half the output.',
    name: 'Camille Fontaine',
    title: 'Brand Director',
    company: 'Maison Élite Paris',
    initials: 'CF',
    accent: '#C9A96E',
    accentDark: '#a07840',
  },
  {
    quote: 'The digital twin they built of our serum is indistinguishable from a photograph. We launched three new colorways without a single shoot day.',
    name: 'Priya Nair',
    title: 'Head of Marketing',
    company: 'Glacé Beauty London',
    initials: 'PN',
    accent: '#4A9EFF',
    accentDark: '#1a6edf',
  },
  {
    quote: 'Our AR try-on feature increased add-to-cart rate by 38% in the first month. The interactive 3D viewer alone paid for the entire project.',
    name: 'Sofia Marchetti',
    title: 'E-Commerce Director',
    company: 'Rouge Atelier Milan',
    initials: 'SM',
    accent: '#B06AB3',
    accentDark: '#7a3d8a',
  },
  {
    quote: 'We replaced an entire in-house photography workflow with their pipeline. The quality is higher and our turnaround time dropped from weeks to hours.',
    name: 'Lena Hartmann',
    title: 'Creative Lead',
    company: 'Lumière Studios Berlin',
    initials: 'LH',
    accent: '#F97066',
    accentDark: '#c44035',
  },
  {
    quote: 'I was skeptical at first. Now our seasonal lookbook is entirely CGI and our customers cannot tell the difference — conversion is up 52%.',
    name: 'Yuki Tanaka',
    title: 'VP of Digital',
    company: 'Sora Collective Tokyo',
    initials: 'YT',
    accent: '#34D399',
    accentDark: '#0f9e68',
  },
  {
    quote: 'The level of craft in every render is astonishing. Our fragrance campaign visuals looked like a $500K production for a fraction of the cost.',
    name: 'Isabelle Dupont',
    title: 'CMO',
    company: 'Velour Parfums Paris',
    initials: 'ID',
    accent: '#FBBF24',
    accentDark: '#c48a00',
  },
  {
    quote: "Motion Grace's team understood our brand DNA from day one. Every asset felt like it came from our own creative director, not an outside vendor.",
    name: 'Marcus Webb',
    title: 'Founder',
    company: 'ARCN New York',
    initials: 'MW',
    accent: '#60A5FA',
    accentDark: '#2563eb',
  },
];

const HexCard = ({ t, index, visible }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hex-wrapper"
      style={{ '--i': index, '--accent': t.accent, '--accent-dark': t.accentDark }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`hex-card ${visible ? 'hex-visible' : ''} ${hovered ? 'hex-hovered' : ''}`}>
        {/* Hex clip shape */}
        <div className="hex-inner">
          {/* Glow */}
          <div className="hex-glow" />
          {/* Stars */}
          <div className="hex-stars">
            {[...Array(5)].map((_, si) => (
              <svg key={si} width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          {/* Quote mark */}
          <div className="hex-quote-mark">&ldquo;</div>
          {/* Quote text */}
          <p className="hex-quote">{t.quote}</p>
          {/* Divider */}
          <div className="hex-divider" />
          {/* Author */}
          <div className="hex-author">
            <div className="hex-avatar">
              {t.initials}
            </div>
            <div className="hex-author-info">
              <p className="hex-name">{t.name}</p>
              <p className="hex-role">{t.title} · {t.company}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            testimonials.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...new Set([...prev, i])]);
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .testimonials-section {
          padding: 72px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          background: transparent;
        }

        /* Subtle ambient bg glow */
        .testimonials-section::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .testimonials-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .testimonials-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .testimonials-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--primary, #C9A96E);
          opacity: 0.8;
          margin-bottom: 12px;
        }
        .testimonials-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--foreground, #f0ede8);
          line-height: 1.1;
          margin: 0;
        }
        .testimonials-title em {
          font-style: normal;
          color: var(--primary, #C9A96E);
        }

        /* Honeycomb grid */
        .hex-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0;
          /* Honeycomb offset rows */
        }

        /* Each wrapper offsets every other item */
        .hex-wrapper {
          width: calc(100% / 4);
          max-width: 260px;
          min-width: 200px;
          padding: 6px;
          position: relative;
          /* Every other card in row is offset down */
        }

        /* Honeycomb row offset: items 2,4 shift down */
        .hex-wrapper:nth-child(4n+2),
        .hex-wrapper:nth-child(4n+4) {
          margin-top: 56px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hex-wrapper {
            width: calc(100% / 3);
          }
          .hex-wrapper:nth-child(3n+2) {
            margin-top: 50px;
          }
          .hex-wrapper:nth-child(4n+2),
          .hex-wrapper:nth-child(4n+4) {
            margin-top: 0;
          }
          .hex-wrapper:nth-child(3n+2) {
            margin-top: 50px;
          }
        }

        @media (max-width: 600px) {
          .hex-wrapper {
            width: 100%;
            max-width: 360px;
          }
          .hex-wrapper:nth-child(n) {
            margin-top: 0 !important;
          }
        }

        /* Card */
        .hex-card {
          width: 100%;
          opacity: 0;
          transform: translateY(40px) scale(0.94);
          transition:
            opacity 0.65s cubic-bezier(0.22,1,0.36,1),
            transform 0.65s cubic-bezier(0.22,1,0.36,1);
          transition-delay: calc(var(--i) * 0.09s);
        }
        .hex-card.hex-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .hex-inner {
          position: relative;
          border-radius: 20px;
          padding: 28px 24px 24px;
          background: var(--card, rgba(18,16,14,0.7));
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          cursor: default;
          transition:
            border-color 0.4s ease,
            transform 0.4s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.4s ease;
          /* Clip to hexagon-ish shape via large border-radius */
        }

        .hex-card.hex-hovered .hex-inner {
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
          transform: translateY(-6px) scale(1.02);
          box-shadow:
            0 24px 48px -12px rgba(0,0,0,0.5),
            0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent),
            0 0 60px -20px var(--accent);
        }

        /* Animated background glow */
        .hex-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(circle at 60% 40%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        .hex-card.hex-hovered .hex-glow {
          opacity: 1;
        }

        /* Animated border shimmer */
        .hex-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            transparent 0%,
            color-mix(in srgb, var(--accent) 8%, transparent) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 0;
        }
        .hex-card.hex-hovered .hex-inner::after {
          opacity: 1;
        }

        /* Stars */
        .hex-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 14px;
          color: var(--accent);
          opacity: 0.8;
          position: relative;
          z-index: 1;
        }

        /* Big decorative quote */
        .hex-quote-mark {
          font-family: 'Inter', sans-serif;
          font-size: 72px;
          line-height: 0.6;
          color: var(--accent);
          opacity: 0.18;
          position: absolute;
          top: 20px;
          right: 18px;
          font-weight: 300;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.4s ease;
        }
        .hex-card.hex-hovered .hex-quote-mark {
          opacity: 0.28;
        }

        /* Quote text */
        .hex-quote {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.8;
          color: var(--muted-foreground, rgba(255,255,255,0.65));
          margin: 0 0 18px 0;
          position: relative;
          z-index: 1;
          letter-spacing: 0.01em;
        }

        /* Divider */
        .hex-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--accent) 40%, transparent) 40%,
            transparent
          );
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        /* Author row */
        .hex-author {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        /* Avatar */
        .hex-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.05em;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .hex-card.hex-hovered .hex-avatar {
          background: color-mix(in srgb, var(--accent) 20%, transparent);
          border-color: color-mix(in srgb, var(--accent) 45%, transparent);
        }

        .hex-author-info { flex: 1; min-width: 0; }

        .hex-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--foreground, rgba(255,255,255,0.92));
          letter-spacing: -0.01em;
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hex-role {
          font-size: 11px;
          font-weight: 300;
          color: var(--muted-foreground, rgba(255,255,255,0.45));
          letter-spacing: 0.02em;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Floating honeycomb dot accent */
        .hex-bg-pattern {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.025;
          background-image:
            radial-gradient(circle, rgba(201,169,110,1) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      <section id="testimonials" className="testimonials-section" ref={sectionRef}>
        {/* Subtle dot pattern */}
        <div className="hex-bg-pattern" />

        <div className="testimonials-inner">
          {/* Header */}
          <div className="testimonials-header">
            <p className="testimonials-eyebrow">Client Stories</p>
            <h2 className="testimonials-title">
              What Clients <em>Say</em>
            </h2>
          </div>

          {/* Honeycomb Cards */}
          <div className="hex-grid">
            {testimonials.map((t, i) => (
              <HexCard key={t.name} t={t} index={i} visible={visibleCards.includes(i)} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
