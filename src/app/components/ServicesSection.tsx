'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

const services = [
  {
    id: 1,
    number: '01',
    title: 'Cinematic Commercials',
    description:
      'Luxury product films with full creative control. We craft 30–60 second hero spots that rival broadcast-quality campaigns — rendered entirely in CGI.',
    detail: 'No studio. No shoot day. No reshoot costs.',
    tag: 'Film & Motion',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="14.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    stats: [{ label: 'Avg. Views', value: '2.4M+' }, { label: 'Conversion Lift', value: '3×' }],
  },
  {
    id: 2,
    number: '02',
    title: 'Infinite Asset Kits',
    description:
      'One product. Endless visuals. We build a digital twin of your product and generate unlimited campaign-ready assets — every angle, every mood, every season.',
    detail: 'Deliver 100+ assets in the time a photoshoot produces 20.',
    tag: 'Scale & Volume',
    accent: '#4A9EFF',
    accentRgb: '74,158,255',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: [{ label: 'Assets / Week', value: '100+' }, { label: 'Cost vs. Shoot', value: '−70%' }],
  },
  {
    id: 3,
    number: '03',
    title: 'Interactive 3D & AR',
    description:
      'Let your customers experience products in real time. Web-based 3D viewers and AR try-on experiences that increase conversion by up to 40%.',
    detail: 'Works on any device. No app download required.',
    tag: 'AR Commerce',
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: [{ label: 'Conversion Lift', value: '+40%' }, { label: 'Return Rate Drop', value: '−25%' }],
  },
];

/* ─── Orbit ring ─── */
function OrbitRing({ color, accentRgb, active }: { color: string; accentRgb: string; active: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      opacity: active ? 1 : 0,
      transition: 'opacity 0.9s ease',
    }}>
      {/* Outer dashed */}
      <div className="absolute top-1/2 left-1/2 rounded-full" style={{
        width: '150%', height: '150%',
        marginLeft: '-75%', marginTop: '-75%',
        border: `1px dashed rgba(${accentRgb},0.12)`,
        animation: 'orbit-spin 22s linear infinite',
      }} />
      {/* Mid solid */}
      <div className="absolute top-1/2 left-1/2 rounded-full" style={{
        width: '118%', height: '118%',
        marginLeft: '-59%', marginTop: '-59%',
        border: `1px solid rgba(${accentRgb},0.07)`,
        animation: 'orbit-spin 14s linear infinite reverse',
      }} />
      {/* Orbiting dot */}
      <div className="absolute top-1/2 left-1/2" style={{
        width: '5px', height: '5px',
        marginLeft: '-2.5px', marginTop: '-2.5px',
        animation: 'orbit-dot 8s linear infinite',
      }}>
        <div style={{
          width: '5px', height: '5px',
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 20px rgba(${accentRgb},0.4)`,
          transform: `translateX(calc(${active ? '1' : '0'} * 80px))`,
          transition: 'transform 0.5s ease',
        }} />
      </div>
    </div>
  );
}

/* ─── Background moving gradient mesh ─── */
function BackgroundMesh() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Moving gold gradient following cursor */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 60% 50% at ${mousePos.x}% ${mousePos.y}%, rgba(201,169,110,0.025) 0%, transparent 65%)`,
        transition: 'all 1.2s cubic-bezier(0.25,0.46,0.45,0.94)',
      }} />
      {/* Static ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'mesh-drift-a 18s ease-in-out infinite',
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(74,158,255,0.025) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'mesh-drift-b 22s ease-in-out infinite 3s',
      }} />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.02) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'mesh-drift-c 16s ease-in-out infinite 6s',
      }} />
      {/* Horizontal light streaks */}
      {[15, 40, 65, 85].map((top, i) => (
        <div key={i} className="absolute left-0 right-0 pointer-events-none" style={{
          top: `${top}%`, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.04) 30%, rgba(201,169,110,0.08) 50%, rgba(201,169,110,0.04) 70%, transparent 100%)',
          animation: `streak-drift ${6 + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 1.5}s`,
        }} />
      ))}
      {/* Dot constellation */}
      {Array.from({ length: 20 }, (_, i) => ({
        x: `${(i * 7.3 + 5) % 95}%`,
        y: `${(i * 11.7 + 8) % 88}%`,
        size: i % 5 === 0 ? 2 : 1,
        delay: i * 0.35,
      })).map((d, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: d.x, top: d.y,
          width: d.size, height: d.size,
          background: i % 3 === 0 ? 'rgba(201,169,110,0.25)' : i % 3 === 1 ? 'rgba(74,158,255,0.2)' : 'rgba(107,107,128,0.18)',
          animation: `dot-float ${5 + (i % 4)}s ease-in-out infinite`,
          animationDelay: `${d.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ─── Reveal helper: wraps a child with scroll-triggered fade+slide ─── */
function Reveal({
  children,
  delay = 0,
  revealed,
  from = 'bottom',
  distance = 28,
  duration = 900,
}: {
  children: React.ReactNode;
  delay?: number;
  revealed: boolean;
  from?: 'bottom' | 'left' | 'right' | 'scale';
  distance?: number;
  duration?: number;
}) {
  const hiddenTransform =
    from === 'bottom' ? `translateY(${distance}px)`
    : from === 'left' ? `translateX(-${distance}px)`
    : from === 'right' ? `translateX(${distance}px)`
    : `scale(0.88) translateY(${distance * 0.5}px)`;

  return (
    <div style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0) translateX(0) scale(1)' : hiddenTransform,
      filter: revealed ? 'blur(0px)' : 'blur(4px)',
      transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                   transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                   filter ${duration * 0.8}ms ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── Enhanced Magnetic Card ─── */
function ServiceCard({ service, index, isActive, onHover }: {
  service: typeof services[0];
  index: number;
  isActive: boolean;
  onHover: (id: number | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowXY, setGlowXY] = useState({ x: 50, y: 50 });
  const [entryState, setEntryState] = useState<'hidden' | 'entering' | 'visible'>('hidden');
  // Per-element reveal stages — each fires with its own delay after card enters
  const [revealStage, setRevealStage] = useState(0);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entryState === 'hidden') {
          const cardDelay = index * 220;
          setTimeout(() => setEntryState('entering'), cardDelay);
          setTimeout(() => setEntryState('visible'), cardDelay + 1000);
          // Stage the inner element reveals after the card shell arrives
          const stageBase = cardDelay + 300;
          setTimeout(() => setRevealStage(1), stageBase);          // tag + number
          setTimeout(() => setRevealStage(2), stageBase + 160);    // icon
          setTimeout(() => setRevealStage(3), stageBase + 340);    // title
          setTimeout(() => setRevealStage(4), stageBase + 520);    // description
          setTimeout(() => setRevealStage(5), stageBase + 720);    // stats
          setTimeout(() => setRevealStage(6), stageBase + 920);    // detail + arrow + bar
        }
      },
      { threshold: 0.08 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [index, entryState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setTilt({ x: (dy / rect.height) * 10, y: (dx / rect.width) * -10 });
    setGlowXY({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
    cancelAnimationFrame(animFrame.current);
    const spring = () => {
      setTilt(prev => {
        const nx = prev.x * 0.75;
        const ny = prev.y * 0.75;
        if (Math.abs(nx) < 0.01 && Math.abs(ny) < 0.01) return { x: 0, y: 0 };
        animFrame.current = requestAnimationFrame(spring);
        return { x: nx, y: ny };
      });
    };
    animFrame.current = requestAnimationFrame(spring);
  }, [onHover]);

  const entryTransform = () => {
    if (entryState === 'hidden') return `translateY(80px) scale(0.90)`;
    return `translateY(0px) scale(1)`;
  };

  const r = (stage: number) => revealStage >= stage;

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{
        opacity: entryState === 'hidden' ? 0 : 1,
        filter: entryState === 'hidden' ? 'blur(12px)' : 'blur(0px)',
        transform: entryTransform(),
        transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${index * 220}ms,
                     transform 1.3s cubic-bezier(0.16,1,0.3,1) ${index * 220}ms,
                     filter 1s ease ${index * 220}ms`,
        animation: entryState === 'visible' ? `card-float ${7 + index * 1.3}s ease-in-out infinite` : 'none',
        animationDelay: `${index * 0.9}s`,
      }}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[32px] flex flex-col h-full cursor-default"
        style={{
          background: isActive
            ? `linear-gradient(145deg, rgba(${service.accentRgb},0.08) 0%, rgba(8,8,18,0.97) 45%, rgba(6,6,14,0.99) 100%)`
            : 'rgba(9,9,18,0.93)',
          border: isActive
            ? `1px solid rgba(${service.accentRgb},0.28)`
            : '1px solid rgba(22,22,38,1)',
          boxShadow: isActive
            ? `0 0 0 1px rgba(${service.accentRgb},0.06),
               0 0 60px rgba(${service.accentRgb},0.14),
               0 30px 80px rgba(0,0,0,0.7),
               inset 0 1px 0 rgba(${service.accentRgb},0.14),
               inset 0 -1px 0 rgba(${service.accentRgb},0.05),
               inset 1px 0 0 rgba(${service.accentRgb},0.04)`
            : `0 4px 30px rgba(0,0,0,0.5),
               inset 0 1px 0 rgba(255,255,255,0.025),
               inset 0 -1px 0 rgba(0,0,0,0.3)`,
          transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isActive
            ? 'background 0.9s ease, border-color 0.7s ease, box-shadow 0.9s ease, transform 0.16s ease'
            : 'background 0.7s ease, border-color 0.6s ease, box-shadow 0.7s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Cursor-follow glow */}
        <div className="absolute inset-0 pointer-events-none z-0 rounded-[32px] overflow-hidden">
          <div style={{
            position: 'absolute', inset: 0,
            background: isActive
              ? `radial-gradient(circle 200px at ${glowXY.x}% ${glowXY.y}%, rgba(${service.accentRgb},0.09) 0%, transparent 70%)`
              : 'none',
            transition: 'background 0.12s ease',
          }} />
        </div>

        {/* Orbit rings */}
        <OrbitRing color={service.accent} accentRgb={service.accentRgb} active={isActive} />

        {/* Glass noise */}
        <div className="absolute inset-0 pointer-events-none z-0 rounded-[32px] opacity-20"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }} />

        {/* Top edge highlight */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-10" style={{
          height: '1px',
          background: isActive
            ? `linear-gradient(90deg, transparent 5%, rgba(${service.accentRgb},0.45) 30%, rgba(255,255,255,0.12) 50%, rgba(${service.accentRgb},0.45) 70%, transparent 95%)`
            : 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.04) 50%, transparent 90%)',
          transition: 'all 0.8s ease',
        }} />

        {/* Inner conic gradient */}
        <div className="absolute inset-0 pointer-events-none z-0 rounded-[32px] overflow-hidden">
          <div style={{
            position: 'absolute', inset: '-50%',
            width: '200%', height: '200%',
            background: `conic-gradient(from ${isActive ? '120deg' : '0deg'} at 50% 50%,
              rgba(${service.accentRgb},0.02) 0deg, transparent 60deg,
              rgba(${service.accentRgb},0.015) 120deg, transparent 180deg,
              rgba(${service.accentRgb},0.02) 240deg, transparent 300deg,
              rgba(${service.accentRgb},0.02) 360deg)`,
            animation: isActive ? 'inner-conic-spin 12s linear infinite' : 'none',
            transition: 'all 0.8s ease',
          }} />
        </div>

        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none z-0 rounded-[32px] overflow-hidden">
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(110deg, transparent 25%, rgba(${service.accentRgb},0.05) 45%, rgba(255,255,255,0.03) 50%, rgba(${service.accentRgb},0.05) 55%, transparent 75%)`,
            backgroundSize: '250% 100%',
            animation: isActive ? 'shimmer-sweep 2.8s ease infinite' : 'none',
          }} />
        </div>

        {/* ── Content with per-element reveals ── */}
        <div className="relative z-10 p-8 flex flex-col h-full gap-6">

          {/* Stage 1: Tag + Number */}
          <Reveal revealed={r(1)} delay={0} from="bottom" distance={20} duration={800}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1.5 rounded-full" style={{
                color: service.accent,
                background: `rgba(${service.accentRgb},${isActive ? '0.13' : '0.07'})`,
                border: `1px solid rgba(${service.accentRgb},${isActive ? '0.28' : '0.15'})`,
                boxShadow: isActive ? `0 0 18px rgba(${service.accentRgb},0.2), inset 0 1px 0 rgba(${service.accentRgb},0.15)` : 'none',
                transition: 'all 0.6s ease',
              }}>
                {service.tag}
              </span>
              <span className="text-5xl font-black tracking-tighter tabular-nums" style={{
                color: isActive ? service.accent : 'rgba(107,107,128,0.12)',
                transition: 'color 0.7s ease, text-shadow 0.7s ease',
                lineHeight: 1,
                textShadow: isActive ? `0 0 35px rgba(${service.accentRgb},0.45)` : 'none',
              }}>
                {service.number}
              </span>
            </div>
          </Reveal>

          {/* Stage 2: Icon */}
          <Reveal revealed={r(2)} delay={0} from="scale" distance={16} duration={900}>
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center relative" style={{
              width: '52px', height: '52px',
              background: `rgba(${service.accentRgb},${isActive ? '0.15' : '0.06'})`,
              color: isActive ? service.accent : 'var(--muted-foreground)',
              border: `1px solid rgba(${service.accentRgb},${isActive ? '0.3' : '0.08'})`,
              transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: isActive
                ? `0 0 24px rgba(${service.accentRgb},0.28), 0 0 60px rgba(${service.accentRgb},0.1), inset 0 1px 0 rgba(${service.accentRgb},0.2)`
                : '0 2px 8px rgba(0,0,0,0.3)',
              transform: isActive ? 'scale(1.08) translateY(-1px)' : 'scale(1)',
            }}>
              {service.icon}
            </div>
          </Reveal>

          {/* Stage 3: Title */}
          <Reveal revealed={r(3)} delay={0} from="left" distance={24} duration={950}>
            <h3 className="text-[22px] font-extrabold tracking-tight text-foreground leading-tight">
              {service.title}
            </h3>
          </Reveal>

          {/* Stage 4: Description */}
          <Reveal revealed={r(4)} delay={0} from="bottom" distance={18} duration={1000}>
            <p className="text-sm leading-[1.88] font-light flex-grow" style={{
              color: isActive ? 'rgba(237,233,227,0.75)' : 'var(--muted-foreground)',
              transition: 'color 0.6s ease',
            }}>
              {service.description}
            </p>
          </Reveal>

          {/* Stage 5: Stats */}
          <Reveal revealed={r(5)} delay={0} from="bottom" distance={22} duration={1000}>
            <div className="grid grid-cols-2 gap-3">
              {service.stats.map((stat, si) => (
                <div key={stat.label} className="rounded-2xl px-4 py-3 relative overflow-hidden" style={{
                  background: isActive
                    ? `linear-gradient(135deg, rgba(${service.accentRgb},0.09) 0%, rgba(${service.accentRgb},0.04) 100%)`
                    : `rgba(${service.accentRgb},0.03)`,
                  border: `1px solid rgba(${service.accentRgb},${isActive ? '0.2' : '0.07'})`,
                  boxShadow: isActive ? `inset 0 1px 0 rgba(${service.accentRgb},0.12)` : 'none',
                  transition: 'all 0.6s ease',
                  transitionDelay: `${si * 40}ms`,
                  /* Subtle stagger within stats */
                  opacity: r(5) ? 1 : 0,
                  transform: r(5) ? 'translateY(0)' : 'translateY(14px)',
                }}>
                  <p className="text-lg font-black tracking-tight" style={{
                    color: isActive ? service.accent : 'var(--foreground)',
                    textShadow: isActive ? `0 0 18px rgba(${service.accentRgb},0.4)` : 'none',
                    transition: 'color 0.6s ease, text-shadow 0.6s ease',
                  }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium tracking-wide mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Stage 6: Detail + Arrow */}
          <Reveal revealed={r(6)} delay={0} from="right" distance={20} duration={900}>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-medium tracking-wide" style={{
                color: isActive ? service.accent : 'rgba(107,107,128,0.35)',
                transition: 'color 0.6s ease',
              }}>
                {service.detail}
              </p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                background: isActive
                  ? `linear-gradient(135deg, rgba(${service.accentRgb},0.2), rgba(${service.accentRgb},0.1))`
                  : `rgba(${service.accentRgb},0.04)`,
                border: `1px solid rgba(${service.accentRgb},${isActive ? '0.35' : '0.08'})`,
                color: isActive ? service.accent : 'var(--muted-foreground)',
                transform: isActive ? 'translateX(5px) scale(1.1)' : 'translateX(0) scale(1)',
                boxShadow: isActive ? `0 0 16px rgba(${service.accentRgb},0.25)` : 'none',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Reveal>

          {/* Stage 6: Progress bar — draws in like a line */}
          <div className="h-px rounded-full overflow-hidden" style={{
            background: 'rgba(22,22,38,1)',
            opacity: r(6) ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}>
            <div className="h-full rounded-full" style={{
              width: isActive ? '100%' : r(6) ? '30%' : '0%',
              background: `linear-gradient(90deg, transparent 0%, rgba(${service.accentRgb},0.4) 20%, ${service.accent} 50%, rgba(${service.accentRgb},0.4) 80%, transparent 100%)`,
              boxShadow: isActive ? `0 0 8px rgba(${service.accentRgb},0.5)` : 'none',
              transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s ease',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.15 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" data-gsap-section="default" className="relative py-16 sm:py-24 px-6 sm:px-10 overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #06060E 0%, #080812 30%, #07071040 60%, var(--background) 100%)',
    }}>

      {/* Moving gradient background mesh */}
      <BackgroundMesh />

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(6,6,14,0.5) 0%, transparent 15%, transparent 85%, rgba(6,6,14,0.4) 100%)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div ref={headingRef} className="mb-12">
          <div className="inline-flex items-center gap-2.5 mb-6" style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0) scaleX(1)' : 'translateY(16px) scaleX(0.9)',
            transformOrigin: 'left center',
            transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{
              width: headingVisible ? '24px' : '0px',
              height: '1px',
              background: 'rgba(201,169,110,0.6)',
              transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }} />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(201,169,110,0.8)' }}>
              What We Create
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Title with word-by-word reveal */}
            <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-black tracking-tighter leading-[0.95] max-w-xl overflow-hidden">
              {['Services', 'Built', 'for'].map((word, i) => (
                <span key={word} className="inline-block overflow-hidden mr-[0.22em]">
                  <span style={{
                    display: 'inline-block',
                    color: 'var(--foreground)',
                    opacity: headingVisible ? 1 : 0,
                    transform: headingVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${200 + i * 100}ms,
                                 transform 0.9s cubic-bezier(0.16,1,0.3,1) ${200 + i * 100}ms`,
                  }}>{word}</span>
                </span>
              ))}{' '}
              <span className="inline-block overflow-hidden">
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #B8935A 0%, #E8D4A0 45%, #D4B87A 75%, #C9A96E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  opacity: headingVisible ? 1 : 0,
                  transform: headingVisible ? 'translateY(0)' : 'translateY(100%)',
                  transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) 550ms,
                               transform 1s cubic-bezier(0.16,1,0.3,1) 550ms`,
                  filter: headingVisible ? 'blur(0px)' : 'blur(6px)',
                }}>Modern Beauty</span>
              </span>
            </h2>

            <p className="text-sm text-muted-foreground font-light max-w-xs leading-[1.8] md:text-right" style={{
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s ease 400ms, transform 1s ease 400ms',
            }}>
              Three core disciplines that transform how luxury brands produce and distribute visual content.
            </p>
          </div>
        </div>

        {/* ── Desktop: 3-col cards ── */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              isActive={hovered === service.id}
              onHover={setHovered}
            />
          ))}
        </div>

        {/* ── Mobile: Accordion ── */}
        <div className="md:hidden flex flex-col gap-3">
          {services.map((service, i) => (
            <div key={service.id} className="rounded-[24px] overflow-hidden border transition-all duration-700" style={{
              borderColor: activeAccordion === service.id ? `${service.accent}25` : 'var(--border)',
              background: activeAccordion === service.id
                ? `linear-gradient(145deg, rgba(${service.accentRgb},0.06) 0%, var(--card) 100%)`
                : 'var(--card)',
            }}>
              <button
                onClick={() => setActiveAccordion(activeAccordion === service.id ? null : service.id)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{
                    background: `rgba(${service.accentRgb},0.12)`,
                    color: service.accent,
                    border: `1px solid rgba(${service.accentRgb},0.2)`,
                  }}>
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.22em] uppercase block mb-0.5" style={{ color: service.accent }}>
                      {service.number} · {service.tag}
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">{service.title}</h3>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  background: `rgba(${service.accentRgb},0.08)`,
                  border: `1px solid rgba(${service.accentRgb},0.15)`,
                  color: service.accent,
                  transform: activeAccordion === service.id ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              <div className="overflow-hidden transition-all duration-700 ease-in-out" style={{
                maxHeight: activeAccordion === service.id ? '300px' : '0',
              }}>
                <div className="px-5 pb-5 flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground leading-[1.8] font-light">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl px-3 py-2.5" style={{
                        background: `rgba(${service.accentRgb},0.07)`,
                        border: `1px solid rgba(${service.accentRgb},0.15)`,
                      }}>
                        <p className="text-base font-black" style={{ color: service.accent }}>{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground font-medium tracking-wide">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-medium tracking-wide" style={{ color: service.accent }}>{service.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          30% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
          80% { transform: translateY(-14px); }
        }
        @keyframes orbit-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbit-dot {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(90px); }
          to   { transform: translate(-50%, -50%) rotate(360deg) translateX(90px); }
        }
        @keyframes shimmer-sweep {
          0%   { background-position: 250% 0; }
          100% { background-position: -250% 0; }
        }
        @keyframes inner-conic-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes mesh-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(40px, -30px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes mesh-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%  { transform: translate(-50px, 30px) scale(1.08); }
          70%  { transform: translate(30px, -20px) scale(1.02); }
        }
        @keyframes mesh-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(20px, -40px) scale(1.05); }
        }
        @keyframes streak-drift {
          0%, 100% { transform: translateX(-5%); opacity: 0.5; }
          50%       { transform: translateX(5%); opacity: 1; }
        }
        @keyframes dot-float {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
