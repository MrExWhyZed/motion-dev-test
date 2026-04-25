'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Spring lerp helper — smoothly interpolates a value each frame ─── */
function spring(current: number, target: number, stiffness = 0.1): number {
  return current + (target - current) * stiffness;
}

const showcaseItems = [
  {
    id: 1,
    category: 'Fragrance',
    title: 'Nocturne Parfum',
    client: 'Maison Élite',
    year: '2024',
    stat: '340%',
    statLabel: 'engagement lift',
    desc: 'A cinematic product identity dissolving light into darkness.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1063c0052-1768622315711.png',
    alt: 'Luxury perfume bottle in deep darkness with gold light refraction',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    depth: 0,
  },
  {
    id: 2,
    category: 'Skincare',
    title: 'Lumière Serum',
    client: 'Glacé Beauty',
    year: '2024',
    stat: '12×',
    statLabel: 'faster delivery',
    desc: 'Liquid light captured at 16K — skin-science made sacred.',
    image: 'https://images.unsplash.com/photo-1619407884060-54145a659baf?w=800',
    alt: 'Minimalist skincare serum bottle on reflective surface',
    accent: '#4A9EFF',
    accentRgb: '74,158,255',
    depth: 1,
  },
  {
    id: 3,
    category: 'Cosmetics',
    title: 'Velvet Lip Kit',
    client: 'Rouge Atelier',
    year: '2023',
    stat: '280+',
    statLabel: 'assets generated',
    desc: 'Every shade, every angle — no studio, no limits.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_16c0b74ab-1769009930510.png',
    alt: 'Luxury lipstick cosmetics product on dark marble',
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    depth: 2,
  },
  {
    id: 4,
    category: 'Haircare',
    title: 'Aura Oil',
    client: 'Silk & Stone',
    year: '2024',
    stat: '6 weeks',
    statLabel: 'saved per campaign',
    desc: 'Botanical essence rendered with molecular precision.',
    image: 'https://images.unsplash.com/photo-1669212408620-957229726535?w=1200',
    alt: 'Hair oil bottle with botanical ingredients',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    depth: 0,
  },
  {
    id: 5,
    category: 'Wellness',
    title: 'Aura Diffuser',
    client: 'Sora Collective',
    year: '2024',
    stat: '99%',
    statLabel: 'client satisfaction',
    desc: 'Stillness made visible. Breath as brand language.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
    alt: 'Minimalist white diffuser on marble surface',
    accent: '#34D399',
    accentRgb: '52,211,153',
    depth: 1,
  },
  {
    id: 6,
    category: 'Jewellery',
    title: 'Lumière Ring',
    client: 'Velour Atelier',
    year: '2023',
    stat: '∞',
    statLabel: 'colourways on demand',
    desc: 'Refracting desire — the stone reimagined each sunrise.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    alt: 'Elegant gold ring with diamond on dark background',
    accent: '#FBBF24',
    accentRgb: '251,191,36',
    depth: 2,
  },
];

/* ── Particle system for hovered card ── */
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number };

function useParticles(active: boolean, accentRgb: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const idRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!active) {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const spawn = () => {
      const edge = Math.random();
      let x = 0, y = 0;
      if (edge < 0.25)      { x = Math.random() * canvas.width;  y = 0; }
      else if (edge < 0.5)  { x = canvas.width;                  y = Math.random() * canvas.height; }
      else if (edge < 0.75) { x = Math.random() * canvas.width;  y = canvas.height; }
      else                  { x = 0;                              y = Math.random() * canvas.height; }
      const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
      const speed = 0.3 + Math.random() * 0.7;
      particlesRef.current.push({
        id: idRef.current++, x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0, maxLife: 80 + Math.random() * 60,
        size: 1 + Math.random() * 2,
      });
    };

    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 3 === 0) spawn();
      frame++;

      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life++;
        const t = p.life / p.maxLife;
        const alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb},${alpha * 0.55})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, accentRgb]);

  return canvasRef;
}

/* ── Individual Card ── */
function ShowcaseCard({
  item,
  isHovered,
  isNeighbor,
  onEnter,
  onLeave,
}: {
  item: typeof showcaseItems[0];
  isHovered: boolean;
  isNeighbor: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  /* Spring-animated mouse position — avoids hard resets on card switch */
  const mouseLiveRef  = useRef({ x: 0.5, y: 0.5 });   // raw cursor
  const mouseSpringRef = useRef({ x: 0.5, y: 0.5 });  // interpolated
  const magnetSpringRef = useRef({ x: 0, y: 0 });      // magnetic offset
  const rafSpringRef  = useRef<number>(0);
  const [renderMouse, setRenderMouse]   = useState({ x: 0.5, y: 0.5 });
  const [renderMagnet, setRenderMagnet] = useState({ x: 0, y: 0 });

  const [revealed, setRevealed]   = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleCanvas = useParticles(isHovered, item.accentRgb);

  /* Run spring loop whenever card is active */
  useEffect(() => {
    const loop = () => {
      const targetX = isHovered ? mouseLiveRef.current.x : 0.5;
      const targetY = isHovered ? mouseLiveRef.current.y : 0.5;

      mouseSpringRef.current.x  = spring(mouseSpringRef.current.x,  targetX, 0.14);
      mouseSpringRef.current.y  = spring(mouseSpringRef.current.y,  targetY, 0.14);
      magnetSpringRef.current.x = spring(magnetSpringRef.current.x, isHovered ? (targetX - 0.5) * 18 : 0, 0.10);
      magnetSpringRef.current.y = spring(magnetSpringRef.current.y, isHovered ? (targetY - 0.5) * 10 : 0, 0.10);

      setRenderMouse({ x: mouseSpringRef.current.x, y: mouseSpringRef.current.y });
      setRenderMagnet({ x: magnetSpringRef.current.x, y: magnetSpringRef.current.y });

      rafSpringRef.current = requestAnimationFrame(loop);
    };
    rafSpringRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafSpringRef.current);
  }, [isHovered]);

  /* Stagger content reveal after card fully expands */
  useEffect(() => {
    if (isHovered) {
      revealTimer.current = setTimeout(() => setRevealed(true), 110);
    } else {
      if (revealTimer.current) clearTimeout(revealTimer.current);
      setRevealed(false);
    }
    return () => { if (revealTimer.current) clearTimeout(revealTimer.current); };
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseLiveRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    };
  }, []);

  /* Don't call onLeave immediately — let parent debounce handle it */
  const handleMouseLeave = useCallback(() => {
    onLeave();
  }, [onLeave]);

  const tiltX = isHovered ? (renderMouse.y - 0.5) * -14 : 0;
  const tiltY = isHovered ? (renderMouse.x - 0.5) * 14  : 0;
  const depthY = [0, -24, -48][item.depth];

  return (
    <div
      style={{
        flexShrink: 0,
        width: isHovered ? 'clamp(480px, 46vw, 620px)' : 'clamp(260px, 26vw, 340px)',
        transform: `translateY(${depthY}px) translate(${renderMagnet.x * 0.4}px, ${renderMagnet.y * 0.4}px)`,
        /* No transition on transform — spring loop handles it */
        transition: 'width 0.65s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform, width',
        opacity: isNeighbor ? 0.38 : 1,
        filter: isNeighbor ? 'saturate(0.3) blur(1px)' : 'none',
        /* Smooth neighbor fade — generous duration so card-to-card feels fluid */
        transitionProperty: 'width, opacity, filter',
        transitionDuration: '0.65s, 0.5s, 0.5s',
        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1), ease, ease',
        zIndex: isHovered ? 10 : 1,
        position: 'relative',
      }}
    >
      <div
        ref={cardRef}
        onMouseEnter={onEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          borderRadius: '18px',
          overflow: 'hidden',
          height: isHovered ? 'clamp(420px, 55vw, 560px)' : 'clamp(340px, 44vw, 460px)',
          cursor: 'none',
          border: `1px solid rgba(${item.accentRgb},${isHovered ? 0.3 : 0.07})`,
          transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate(${renderMagnet.x * 0.6}px, ${renderMagnet.y * 0.6}px)`,
          /* No CSS transition on transform — spring handles smoothness */
          transition: 'height 0.65s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease, box-shadow 0.4s ease',
          boxShadow: isHovered
            ? `0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(${item.accentRgb},0.15), 0 0 80px rgba(${item.accentRgb},0.1)`
            : `0 16px 40px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Particle canvas */}
        <canvas
          ref={particleCanvas}
          width={620}
          height={560}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 5,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Image */}
        <img
          src={item.image}
          alt={item.alt}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transform: isHovered
              ? `scale(1.12) translate(${(renderMouse.x - 0.5) * -8}px, ${(renderMouse.y - 0.5) * -8}px)`
              : 'scale(1)',
            transition: isHovered ? 'none' : 'transform 2s cubic-bezier(0.16,1,0.3,1)',
            filter: `saturate(${isHovered ? 1.1 : 0.8}) brightness(${isHovered ? 0.9 : 0.8})`,
          }}
        />

        {/* Base gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(4,4,10,0.98) 0%, rgba(4,4,10,0.25) 52%, transparent 100%)',
        }} />

        {/* Radial cursor light */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${renderMouse.x * 100}% ${renderMouse.y * 100}%, rgba(${item.accentRgb},0.18) 0%, transparent 55%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          mixBlendMode: 'screen',
        }} />

        {/* Scanline shimmer — sweeps top to bottom on enter */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: `linear-gradient(to bottom,
            transparent 0%,
            rgba(${item.accentRgb},0.06) 50%,
            transparent 100%
          )`,
          transform: isHovered ? 'translateY(100%)' : 'translateY(-100%)',
          transition: isHovered ? 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' : 'none',
          pointerEvents: 'none',
        }} />

        {/* Inset glow ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '18px',
          boxShadow: `inset 0 0 80px rgba(${item.accentRgb},${isHovered ? 0.2 : 0.04})`,
          transition: 'box-shadow 0.5s ease',
          pointerEvents: 'none',
          zIndex: 6,
        }} />

        {/* ── EXPANDED CONTENT ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: isHovered ? '2rem' : '1.75rem',
          transition: 'padding 0.5s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 8,
        }}>
          {/* Year + category badge row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
              padding: '0.32rem 0.7rem', borderRadius: '100px',
              background: `rgba(${item.accentRgb},${isHovered ? 0.15 : 0.1})`,
              border: `1px solid rgba(${item.accentRgb},${isHovered ? 0.35 : 0.2})`,
              color: item.accent,
              transition: 'all 0.5s ease',
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: item.accent,
                boxShadow: isHovered ? `0 0 8px ${item.accent}` : 'none',
                flexShrink: 0,
                transition: 'box-shadow 0.4s ease',
                animation: isHovered ? 'dot-pulse 1.8s ease-in-out infinite' : 'none',
              }} />
              {item.category}
            </div>
            <span style={{
              fontSize: '9px', letterSpacing: '0.15em',
              color: `rgba(${item.accentRgb},0.4)`,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(8px)',
              transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}>{item.year}</span>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: isHovered ? '1.55rem' : '1.2rem',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#f5f0e8', margin: '0 0 0.35rem', lineHeight: 1.1,
            transition: 'font-size 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {item.title}
          </h3>

          {/* Client */}
          <p style={{
            fontSize: '0.68rem', color: 'rgba(245,240,232,0.38)', fontWeight: 300,
            letterSpacing: '0.1em', margin: '0 0 0', textTransform: 'uppercase',
            transition: 'margin 0.5s ease',
          }}>
            {item.client}
          </p>

          {/* ── EXPANDED ZONE — only visible on hover ── */}
          <div style={{
            overflow: 'hidden',
            maxHeight: revealed ? '200px' : '0px',
            opacity: revealed ? 1 : 0,
            transition: 'max-height 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease 0.1s',
          }}>
            {/* Divider */}
            <div style={{
              height: '1px', margin: '1.1rem 0 1rem',
              background: `linear-gradient(90deg, rgba(${item.accentRgb},0.35), rgba(${item.accentRgb},0.08), transparent)`,
              transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }} />

            {/* Desc */}
            <p style={{
              fontSize: '0.78rem', lineHeight: 1.65,
              color: 'rgba(245,240,232,0.55)',
              fontWeight: 300, letterSpacing: '0.02em',
              margin: '0 0 1.1rem',
              transform: revealed ? 'translateY(0)' : 'translateY(10px)',
              transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}>
              {item.desc}
            </p>

            {/* Stat row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{
                fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1,
                background: `linear-gradient(135deg, ${item.accent}, rgba(${item.accentRgb},0.6))`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                transform: revealed ? 'translateY(0)' : 'translateY(14px)',
                display: 'inline-block',
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.28s, opacity 0.5s ease 0.28s',
                opacity: revealed ? 1 : 0,
              }}>
                {item.stat}
              </span>
              <span style={{
                fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: `rgba(${item.accentRgb},0.45)`,
                transform: revealed ? 'translateY(0)' : 'translateY(10px)',
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s, opacity 0.5s ease 0.35s',
                opacity: revealed ? 1 : 0,
              }}>
                {item.statLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Corner filigree — animated in on hover */}
        {[
          { top: 14, left: 14, bt: true, bl: true },
          { top: 14, right: 14, bt: true, br: true },
          { bottom: 14, left: 14, bb: true, bl: true },
          { bottom: 14, right: 14, bb: true, br: true },
        ].map((c, ci) => (
          <div key={ci} style={{
            position: 'absolute', width: '20px', height: '20px', zIndex: 7,
            top: c.top, bottom: c.bottom, left: c.left, right: c.right,
            borderTop: c.bt ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            borderBottom: c.bb ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            borderLeft: c.bl ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            borderRight: c.br ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.6)',
            transition: `opacity 0.5s ease ${ci * 0.06}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${ci * 0.06}s`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Custom cursor dot — spring-driven, no CSS transition needed */}
        <div style={{
          position: 'absolute', zIndex: 20, pointerEvents: 'none',
          left: `calc(${renderMouse.x * 100}% - 5px)`,
          top:  `calc(${renderMouse.y * 100}% - 5px)`,
          width: '10px', height: '10px', borderRadius: '50%',
          background: item.accent,
          boxShadow: `0 0 16px 4px rgba(${item.accentRgb},0.5)`,
          opacity: isHovered ? 0.9 : 0,
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'screen',
        }} />

        {/* Outer ring cursor — lags slightly behind dot for depth */}
        <div style={{
          position: 'absolute', zIndex: 19, pointerEvents: 'none',
          left: `calc(${renderMouse.x * 100}% - 22px)`,
          top:  `calc(${renderMouse.y * 100}% - 22px)`,
          width: '44px', height: '44px', borderRadius: '50%',
          border: `1px solid rgba(${item.accentRgb},0.35)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />
      </div>
    </div>
  );
}

/* ── Section ── */
export default function ShowcaseSection() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [hoveredId, setHoveredId]           = useState<number | null>(null);

  const animFrameRef     = useRef<number>(0);
  const currentXRef      = useRef(0);
  const targetXRef       = useRef(0);
  const isPausedRef      = useRef(false);
  const velocityRef      = useRef(1);           // 0–1 speed multiplier
  const arrowSpeedRef    = useRef(0);           // added speed from arrows (can be negative)
  const holdLRef         = useRef(false);
  const holdRRef         = useRef(false);

  /* Debounce card-to-card hover — prevents flicker when cursor crosses gap */
  const pendingIdRef    = useRef<number | null>(null);
  const switchTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((id: number) => {
    pendingIdRef.current = id;
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      setHoveredId(pendingIdRef.current);
      isPausedRef.current = true;
    }, 28); // 28ms grace — undetectable to human, eliminates gap flicker
  }, []);

  const handleLeave = useCallback(() => {
    pendingIdRef.current = null;
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      // Only clear if no new card was entered during the grace window
      if (pendingIdRef.current === null) {
        setHoveredId(null);
        isPausedRef.current = false;
      }
    }, 40);
  }, []);

  /* Intersection */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSectionVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Auto-scroll + arrow control loop */
  useEffect(() => {
    const BASE_SPEED = 0.42;
    const ARROW_MAX  = 6;        // max arrow speed px/frame
    const ARROW_ACCEL = 0.18;    // acceleration per frame when held
    const ARROW_DECAY = 0.88;    // friction when released
    let lastTime = 0;

    const loop = (time: number) => {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;
      if (!trackRef.current) { animFrameRef.current = requestAnimationFrame(loop); return; }

      const trackWidth = trackRef.current.scrollWidth / 2;

      /* Arrow speed ramping */
      if (holdRRef.current) {
        arrowSpeedRef.current = Math.min(arrowSpeedRef.current + ARROW_ACCEL, ARROW_MAX);
      } else if (holdLRef.current) {
        arrowSpeedRef.current = Math.max(arrowSpeedRef.current - ARROW_ACCEL, -ARROW_MAX);
      } else {
        /* Decay back toward 0 */
        arrowSpeedRef.current *= ARROW_DECAY;
        if (Math.abs(arrowSpeedRef.current) < 0.02) arrowSpeedRef.current = 0;
      }

      /* Auto-scroll velocity envelope */
      if (!isPausedRef.current) {
        velocityRef.current = Math.min(velocityRef.current + 0.02, 1);
      } else {
        velocityRef.current = Math.max(velocityRef.current - 0.05, 0);
      }

      const autoMove  = BASE_SPEED * (delta / 16) * velocityRef.current;
      const arrowMove = arrowSpeedRef.current * (delta / 16);
      targetXRef.current = (targetXRef.current + autoMove + arrowMove + trackWidth) % trackWidth;

      /* Smooth lerp */
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.07;
      if (currentXRef.current < 0) currentXRef.current += trackWidth;

      trackRef.current.style.transform = `translateX(-${currentXRef.current}px)`;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  /* Arrow button state */
  const [leftActive, setLeftActive]   = useState(false);
  const [rightActive, setRightActive] = useState(false);

  const startLeft = useCallback(() => {
    holdLRef.current = true; holdRRef.current = false;
    setLeftActive(true); setRightActive(false);
  }, []);
  const startRight = useCallback(() => {
    holdRRef.current = true; holdLRef.current = false;
    setRightActive(true); setLeftActive(false);
  }, []);
  const stopArrows = useCallback(() => {
    holdLRef.current = false; holdRRef.current = false;
    setLeftActive(false); setRightActive(false);
  }, []);

  const allItems = [...showcaseItems, ...showcaseItems];

  /* Arrow button component */
  const ArrowBtn = ({ dir }: { dir: 'left' | 'right' }) => {
    const isLeft   = dir === 'left';
    const isActive = isLeft ? leftActive : rightActive;
    return (
      <button
        onMouseDown={isLeft ? startLeft : startRight}
        onMouseUp={stopArrows}
        onMouseLeave={stopArrows}
        onTouchStart={(e) => { e.preventDefault(); isLeft ? startLeft() : startRight(); }}
        onTouchEnd={stopArrows}
        aria-label={isLeft ? 'Scroll left' : 'Scroll right'}
        style={{
          position: 'absolute',
          top: '50%', transform: 'translateY(-50%)',
          [isLeft ? 'left' : 'right']: '16px',
          zIndex: 30,
          width: '48px', height: '48px',
          borderRadius: '50%',
          border: `1px solid rgba(201,169,110,${isActive ? 0.6 : 0.2})`,
          background: isActive
            ? 'rgba(201,169,110,0.15)'
            : 'rgba(8,10,22,0.7)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s ease, background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
          transform: `translateY(-50%) scale(${isActive ? 0.93 : 1})`,
          boxShadow: isActive
            ? '0 0 24px rgba(201,169,110,0.25), inset 0 0 12px rgba(201,169,110,0.08)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {isLeft
            ? <path d="M11 4L6 9L11 14" stroke={`rgba(201,169,110,${isActive ? 1 : 0.6})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M7 4L12 9L7 14"  stroke={`rgba(201,169,110,${isActive ? 1 : 0.6})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
      </button>
    );
  };

  return (
    <section
      ref={sectionRef}
      data-gsap-section="default"
      className="relative overflow-hidden py-28 sm:py-40"
      style={{ background: 'linear-gradient(to bottom, #060810 0%, #080A16 50%, #060810 100%)' }}
    >
      {/* Ambient streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '18%', left: '-8%', w: '55%', rot: '-7deg', color: '201,169,110', delay: '0s' },
          { top: '65%', right: '-8%', w: '45%', rot: '5deg',  color: '74,158,255',  delay: '3s' },
          { top: '42%', left: '20%', w: '30%', rot: '-3deg', color: '139,92,246',  delay: '6s' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: s.top, left: s.left, right: (s as any).right,
            width: s.w, height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(${s.color},0.1), transparent)`,
            transform: `rotate(${s.rot})`,
            animation: 'streak 10s ease-in-out infinite',
            animationDelay: s.delay,
          }} />
        ))}
      </div>

      {/* Header */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 mb-16"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: `translateY(${sectionVisible ? 0 : 28}px)`,
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ height: '1px', width: '28px', background: 'rgba(201,169,110,0.5)' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.55)' }}>
                Selected Work
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1, margin: 0 }}>
              <span style={{ color: 'rgba(237,233,227,0.9)' }}>See What&apos;s </span>
              <span style={{
                background: 'linear-gradient(135deg, #8B6F3E 0%, #F2E4C4 40%, #D4A96A 70%, #C9956E 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>Possible</span>
            </h2>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #C9A96E, #f0d49a)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>48+</span>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.25)' }}>Projects</span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(237,233,227,0.22)', letterSpacing: '0.06em', margin: 0 }}>
              Where beauty meets computation
            </p>
          </div>
        </div>
      </div>

      {/* Hover hint */}
      <div style={{
        textAlign: 'center', marginBottom: '1.5rem',
        opacity: sectionVisible ? (hoveredId ? 0 : 0.4) : 0,
        transition: 'opacity 0.6s ease',
      }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.4)' }}>
          Catelog
        </span>
      </div>

      {/* Track wrapper — arrows sit here so they overlay the track */}
      <div style={{ position: 'relative' }}>
        <ArrowBtn dir="left" />
        <ArrowBtn dir="right" />

        <div style={{
          position: 'relative', width: '100%', overflow: 'hidden',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
          paddingTop: '48px', paddingBottom: '72px',
        }}>
          <div
            ref={trackRef}
            style={{ display: 'flex', gap: '14px', paddingLeft: '24px', willChange: 'transform', alignItems: 'flex-end' }}
          >
            {allItems.map((item, i) => {
              const isH = hoveredId === item.id;
              const isN = hoveredId !== null && !isH;
              return (
                <ShowcaseCard
                  key={`${item.id}-${i}`}
                  item={item}
                  isHovered={isH}
                  isNeighbor={isN}
                  onEnter={() => handleEnter(item.id)}
                  onLeave={handleLeave}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes streak {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}
