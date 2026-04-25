'use client';

import { useState, useEffect, useRef } from "react";

const reelItems = [
  {
    id: 1,
    category: 'Fragrance',
    title: 'Nocturne Parfum',
    client: 'Maison Élite',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1063c0052-1768622315711.png",
    alt: 'Luxury perfume bottle in deep darkness with gold light refraction',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    span: 'tall'
  },
  {
    id: 2,
    category: 'Skincare',
    title: 'Lumière Serum',
    client: 'Glacé Beauty',
    image: "https://images.unsplash.com/photo-1619407884060-54145a659baf?w=800",
    alt: 'Minimalist skincare serum bottle on reflective surface',
    accent: '#4A9EFF',
    accentRgb: '74,158,255',
    span: 'normal'
  },
  {
    id: 3,
    category: 'Cosmetics',
    title: 'Velvet Lip Kit',
    client: 'Rouge Atelier',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16c0b74ab-1769009930510.png",
    alt: 'Luxury lipstick cosmetics product on dark marble',
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    span: 'normal'
  },
  {
    id: 4,
    category: 'Haircare',
    title: 'Aura Oil',
    client: 'Silk & Stone',
    image: "https://images.unsplash.com/photo-1669212408620-957229726535?w=1200",
    alt: 'Hair oil bottle with botanical ingredients',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    span: 'wide'
  }
];

function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function ParticleField({ accent, accentRgb, active }) {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="sr-particles" style={{ opacity: active ? 1 : 0 }}>
      {particles.map(i => (
        <div
          key={i}
          className="sr-particle"
          style={{
            '--accent': accent,
            '--delay': `${(i * 0.15) % 1.8}s`,
            '--x': `${10 + (i * 37 % 80)}%`,
            '--size': `${2 + (i % 3)}px`,
            '--duration': `${2 + (i % 3) * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

function ScanLine({ active }) {
  return (
    <div
      className="sr-scan"
      style={{ opacity: active ? 1 : 0 }}
    />
  );
}

function Card({ item, delay, className, children, style }) {
  const [hovered, setHovered] = useState(false);
  const [sectionRef, visible] = useIntersectionObserver();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div
      ref={sectionRef}
      className={`sr-card-wrap ${className}`}
      style={{
        '--delay': `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style
      }}
    >
      <div
        ref={cardRef}
        className={`sr-card ${hovered ? 'sr-card-hovered' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          '--accent': item.accent,
          '--accent-rgb': item.accentRgb,
          '--mx': mousePos.x,
          '--my': mousePos.y,
        }}
      >
        {/* Image */}
        <div className="sr-img-wrap">
          <img
            src={item.image}
            alt={item.alt}
            className="sr-img"
            style={{
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 3s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>

        {/* Gradient overlays */}
        <div className="sr-grad-base" />
        <div className="sr-grad-side" />
        <div className="sr-glow" style={{ opacity: hovered ? 1 : 0 }} />

        {/* Mouse-follow light */}
        <div
          className="sr-mouse-light"
          style={{
            opacity: hovered ? 0.15 : 0,
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(${item.accentRgb},0.5) 0%, transparent 60%)`,
          }}
        />

        {/* Scan line effect */}
        <ScanLine active={hovered} />

        {/* Particles */}
        <ParticleField accent={item.accent} accentRgb={item.accentRgb} active={hovered} />

        {/* Corner decorations */}
        <div className="sr-corner sr-corner-tl" style={{ opacity: hovered ? 1 : 0 }} />
        <div className="sr-corner sr-corner-tr" style={{ opacity: hovered ? 1 : 0 }} />
        <div className="sr-corner sr-corner-bl" style={{ opacity: hovered ? 1 : 0 }} />
        <div className="sr-corner sr-corner-br" style={{ opacity: hovered ? 1 : 0 }} />

        {/* Content */}
        {children({ hovered, item })}
      </div>
    </div>
  );
}

function CardContent({ hovered, item, wide = false }) {
  return (
    <div className={`sr-content ${wide ? 'sr-content-wide' : ''}`}>
      <div className="card-content-left">
        <span
          className="sr-badge"
          style={{
            background: `rgba(${item.accentRgb},0.12)`,
            color: item.accent,
            borderColor: `rgba(${item.accentRgb},0.25)`,
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            opacity: hovered ? 1 : 0.8,
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span
            className="sr-dot"
            style={{
              background: item.accent,
              boxShadow: hovered ? `0 0 6px ${item.accent}` : 'none',
            }}
          />
          {item.category}
        </span>

        <h3
          className="sr-card-title"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s',
          }}
        >
          {item.title}
        </h3>

        {item.client && (
          <p
            className="sr-client"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              opacity: hovered ? 0.6 : 0.4,
              transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            {item.client}
          </p>
        )}
      </div>

      {wide && (
        <div
          className="sr-view-btn"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0) translateX(0)' : 'translateY(8px) translateX(8px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
            borderColor: `rgba(${item.accentRgb},0.3)`,
          }}
        >
          <span>View Case</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function ShowreelSection() {
  const [headerRef, headerVisible] = useIntersectionObserver();
  const [countRef, countVisible] = useIntersectionObserver();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!countVisible) return;
    let frame;
    let start = null;
    const target = 48;
    const duration = 1800;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [countVisible]);

  return (
    <>
      <style>{`
        /* ─── ALL STYLES SCOPED UNDER .sr-root TO PREVENT LEAKING INTO OTHER SECTIONS ─── */

        .sr-root {
          padding: 7rem 1.5rem 8rem;
          background: #04040A;
          position: relative;
          overflow: hidden;
        }

        .sr-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 60% 40% at 20% 0%, rgba(201,169,110,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 80% 100%, rgba(139,92,246,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .sr-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
        }

        /* Divider */
        .sr-divider {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }
        .sr-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent);
        }
        .sr-divider-diamond {
          width: 6px;
          height: 6px;
          background: #C9A96E;
          transform: rotate(45deg);
          box-shadow: 0 0 12px rgba(201,169,110,0.5);
        }

        /* Header */
        .sr-header-row {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        @media (min-width: 640px) {
          .sr-header-row {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        .sr-header-left { position: relative; }

        .sr-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.7);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sr-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: rgba(201,169,110,0.5);
        }

        .sr-title {
          font-size: clamp(1.5rem, 5vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f5f0e8;
          line-height: 1.1;
          margin: 0;
        }
        .sr-title-gold {
          background: linear-gradient(135deg, #C9A96E 0%, #f0d49a 40%, #C9A96E 70%, #8a6a30 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sr-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        @media (min-width: 640px) {
          .sr-header-right { align-items: flex-end; }
        }

        .sr-tagline {
          font-size: 0.8rem;
          color: rgba(245,240,232,0.35);
          font-weight: 300;
          letter-spacing: 0.06em;
          max-width: 220px;
          line-height: 1.7;
          text-align: right;
        }

        .sr-counter {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .sr-counter-num {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #C9A96E, #f0d49a);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-variant-numeric: tabular-nums;
        }
        .sr-counter-label {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.3);
        }

        /* GRID */
        .sr-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .sr-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .sr-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto auto;
          }
        }

        .sr-card-wrap { position: relative; }

        .sr-card-tall { min-height: 460px; }
        @media (min-width: 1024px) {
          .sr-card-tall { grid-row: span 2; min-height: unset; }
        }
        .sr-card-normal { min-height: 300px; }
        .sr-card-wide { min-height: 300px; }
        @media (min-width: 1024px) {
          .sr-card-wide { grid-column: span 2; }
        }

        /* Card */
        .sr-card {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: inherit;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.5s ease, box-shadow 0.5s ease;
        }
        .sr-card-hovered {
          border-color: rgba(var(--accent-rgb), 0.2);
          box-shadow: 
            0 0 0 1px rgba(var(--accent-rgb), 0.1),
            0 32px 64px rgba(0,0,0,0.6),
            0 0 80px rgba(var(--accent-rgb), 0.06);
        }

        .sr-img-wrap { position: absolute; inset: 0; }
        .sr-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }

        .sr-grad-base {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.1) 100%);
        }
        .sr-grad-side {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(5,5,5,0.4) 0%, transparent 60%);
        }
        .sr-glow {
          position: absolute; inset: 0;
          border-radius: 20px;
          box-shadow: inset 0 0 80px rgba(var(--accent-rgb), 0.12);
          transition: opacity 1s ease;
          pointer-events: none;
        }
        .sr-mouse-light {
          position: absolute; inset: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* Scan line — uses transform instead of top to avoid layout cascade */
        .sr-scan {
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          animation: sr-scan-anim 3s linear infinite;
          transition: opacity 0.5s;
          pointer-events: none;
          will-change: transform;
        }
        @keyframes sr-scan-anim {
          0%   { transform: translateY(0); }
          100% { transform: translateY(var(--card-h, 300px)); }
        }

        /* Particles */
        .sr-particles {
          position: absolute; inset: 0;
          pointer-events: none;
          transition: opacity 0.8s ease;
        }
        .sr-particle {
          position: absolute;
          bottom: 20%;
          left: var(--x);
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          animation: sr-float-up var(--duration) ease-in var(--delay) infinite;
          opacity: 0;
          will-change: transform, opacity;
        }
        @keyframes sr-float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          20%  { opacity: 0.8; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }

        /* Corners */
        .sr-corner {
          position: absolute;
          width: 16px; height: 16px;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .sr-corner::before, .sr-corner::after {
          content: '';
          position: absolute;
          background: rgba(var(--accent-rgb), 0.6);
        }
        .sr-corner::before { width: 100%; height: 1px; }
        .sr-corner::after  { height: 100%; width: 1px; }
        .sr-corner-tl { top: 12px; left: 12px; }
        .sr-corner-tl::before { top: 0; left: 0; }
        .sr-corner-tl::after  { top: 0; left: 0; }
        .sr-corner-tr { top: 12px; right: 12px; }
        .sr-corner-tr::before { top: 0; right: 0; }
        .sr-corner-tr::after  { top: 0; right: 0; }
        .sr-corner-bl { bottom: 12px; left: 12px; }
        .sr-corner-bl::before { bottom: 0; left: 0; }
        .sr-corner-bl::after  { bottom: 0; left: 0; }
        .sr-corner-br { bottom: 12px; right: 12px; }
        .sr-corner-br::before { bottom: 0; right: 0; }
        .sr-corner-br::after  { bottom: 0; right: 0; }

        /* Card content */
        .sr-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 1.75rem;
        }
        .sr-content-wide {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .sr-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
          border: 1px solid;
          margin-bottom: 0.85rem;
          transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .sr-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: box-shadow 0.4s;
        }
        .sr-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #f5f0e8;
          margin: 0 0 0.4rem;
          line-height: 1.2;
        }
        .sr-card-tall .sr-card-title { font-size: 1.35rem; }
        .sr-client {
          font-size: 0.7rem;
          color: rgba(245,240,232,0.5);
          font-weight: 300;
          letter-spacing: 0.08em;
          margin: 0;
          transition: all 0.7s ease;
        }

        .sr-view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          border: 1px solid;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          color: rgba(245,240,232,0.75);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }

        /* Reveal */
        .sr-reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .sr-reveal.sr-visible { opacity: 1; transform: translateY(0); }
        .sr-reveal.sr-delay-200 { transition-delay: 200ms; }

        /* Noise */
        .sr-noise {
          position: absolute; inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }
      `}</style>

      <section className="sr-root">
        <div className="sr-noise" />
        <div className="sr-inner">

          {/* Divider */}
          <div className="sr-divider">
            <div className="sr-divider-line" />
            <div className="sr-divider-diamond" />
            <div className="sr-divider-line" />
          </div>

          {/* Header */}
          <div className="sr-header-row" ref={headerRef}>
            <div className={`sr-header-left sr-reveal ${headerVisible ? 'sr-visible' : ''}`}>
              <p className="sr-eyebrow">Selected Work</p>
              <h2 className="sr-title">
                See What&apos;s{' '}
                <span className="sr-title-gold">Possible</span>
              </h2>
            </div>

            <div className={`sr-header-right sr-reveal sr-delay-200 ${headerVisible ? 'sr-visible' : ''}`}>
              <div className="sr-counter" ref={countRef}>
                <span className="sr-counter-num">{count}</span>
                <span className="sr-counter-label">+&nbsp;Projects</span>
              </div>
              <p className="sr-tagline">
                Where beauty meets computation.
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="sr-grid">

            <Card item={reelItems[0]} delay={0} className="sr-card-tall">
              {({ hovered, item }) => <CardContent hovered={hovered} item={item} />}
            </Card>

            <Card item={reelItems[1]} delay={120} className="sr-card-normal">
              {({ hovered, item }) => <CardContent hovered={hovered} item={item} />}
            </Card>

            <Card item={reelItems[2]} delay={240} className="sr-card-normal">
              {({ hovered, item }) => <CardContent hovered={hovered} item={item} />}
            </Card>

            <Card item={reelItems[3]} delay={360} className="sr-card-wide">
              {({ hovered, item }) => <CardContent hovered={hovered} item={item} wide />}
            </Card>

          </div>
        </div>
      </section>
    </>
  );
}
