'use client';

import React, { useEffect, useRef, useState } from 'react';

// Build-Forever gradient stops: blue → purple → red → orange
const CARD_ACCENTS = ['#0894ff', '#c959dd', '#ff2e54', '#ff9004'];
const CARD_ACCENT_RGBS = ['8,148,255', '201,89,221', '255,46,84', '255,144,4'];

const steps = [
  {
    number: '01',
    phase: 'Brief',
    title: 'Configure & Customize',
    body: 'Select your package, choose your Virtual Set, define your motion style, and upload label files. No meetings — just clear, creative direction.',
    accent: CARD_ACCENTS[0],
    accentRgb: CARD_ACCENT_RGBS[0],
  },
  {
    number: '02',
    phase: 'Payment',
    title: 'Secure Your Slot',
    body: "Place your 50% deposit to lock in your studio slot — we immediately begin building your product's Digital Twin.",
    accent: CARD_ACCENTS[1],
    accentRgb: CARD_ACCENT_RGBS[1],
  },
  {
    number: '03',
    phase: 'Production',
    title: 'Track & Preview',
    body: 'Log in to your Client Dashboard for real-time progress. Watch previews render live and request revisions with annotations.',
    accent: CARD_ACCENTS[2],
    accentRgb: CARD_ACCENT_RGBS[2],
  },
  {
    number: '04',
    phase: 'Delivery',
    title: 'The Launch Kit',
    body: 'Upon final approval, unlock your complete asset library — 4K video, transparent kits, and AR files in one click.',
    accent: CARD_ACCENTS[3],
    accentRgb: CARD_ACCENT_RGBS[3],
  },
];

/* ── 3-D tilt hook ── */
function useCardTilt(intensity = 7) {
  const ref        = useRef<HTMLDivElement | null>(null);
  const frameRef   = useRef<number>(0);
  const runningRef = useRef(false);
  const targetRef  = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const currentRef = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [live, setLive] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = () => {
    const t = targetRef.current, c = currentRef.current;
    c.rx = lerp(c.rx, t.rx, 0.1); c.ry = lerp(c.ry, t.ry, 0.1);
    c.gx = lerp(c.gx, t.gx, 0.1); c.gy = lerp(c.gy, t.gy, 0.1);
    const active =
      Math.abs(c.rx) > 0.02 || Math.abs(c.ry) > 0.02 ||
      Math.abs(t.rx) > 0.02 || Math.abs(t.ry) > 0.02;
    setLive({ rx: c.rx, ry: c.ry, gx: c.gx, gy: c.gy, active });
    if (active) { frameRef.current = requestAnimationFrame(animate); return; }
    runningRef.current = false; frameRef.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    targetRef.current = {
      rx: (0.5 - y) * intensity,
      ry: (x - 0.5) * intensity,
      gx: x * 100,
      gy: y * 100,
    };
  };
  const onMouseEnter = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    frameRef.current = requestAnimationFrame(animate);
  };
  const onMouseLeave = () => {
    targetRef.current = { rx: 0, ry: 0, gx: 50, gy: 50 };
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    runningRef.current = false;
  }, []);

  return { ref, live, onMouseMove, onMouseEnter, onMouseLeave };
}

/* ── Minimal card ── */
function WorkflowCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const { ref, live, onMouseMove, onMouseEnter, onMouseLeave } = useCardTilt(6);
  const radii = ['20px 0 0 0', '0 20px 0 0', '0 0 0 20px', '0 0 20px 0'];
  const rgb = step.accentRgb;

  return (
    <div
      data-hiw-card
      style={{ perspective: '1400px', width: '100%', height: '100%' }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: radii[index],
          overflow: 'hidden',
          /* solid dark bg — no gradient-as-border trick that causes the fill bug */
          background: 'rgba(10,10,19,0.98)',
          border: `1px solid ${live.active ? `rgba(${rgb},0.28)` : 'rgba(237,233,227,0.06)'}`,
          boxShadow: live.active
            ? `0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(${rgb},0.18), 0 0 60px rgba(${rgb},0.12)`
            : 'none',
          transform: `rotateX(${live.rx}deg) rotateY(${live.ry}deg) translateY(${live.active ? -6 : 0}px)`,
          transition: live.active
            ? 'border-color 200ms ease, box-shadow 200ms ease'
            : 'transform 700ms cubic-bezier(0.16,1,0.3,1), border-color 400ms ease, box-shadow 500ms ease',
          cursor: 'default',
          boxSizing: 'border-box',
        }}
      >
        {/* Mouse-tracking radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 65% 55% at ${live.gx}% ${live.gy}%, rgba(${rgb},0.14) 0%, transparent 70%)`,
          opacity: live.active ? 1 : 0,
          transition: live.active ? 'none' : 'opacity 600ms ease',
        }} />

        {/* Bottom-right corner ambient */}
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '60%', height: '60%',
          background: `radial-gradient(circle, rgba(${rgb},0.08) 0%, transparent 70%)`,
          pointerEvents: 'none', filter: 'blur(32px)',
        }} />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},${live.active ? '0.75' : '0.18'}), transparent)`,
          transition: 'all 400ms ease',
        }} />

        {/* Ghosted number watermark — outline only, no fill */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-0.1em',
            right: '-0.06em',
            fontSize: 'clamp(7rem, 14vw, 11rem)',
            fontWeight: 900,
            letterSpacing: '-0.07em',
            lineHeight: 1,
            /* outline text — safe cross-browser */
            color: 'transparent',
            WebkitTextStroke: `1px rgba(${rgb},${live.active ? 0.2 : 0.08})`,
            userSelect: 'none',
            pointerEvents: 'none',
            transition: 'all 500ms ease',
            /* no background-clip here */
          }}
        >
          {step.number}
        </div>

        {/* Card content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          height: '100%',
          padding: 'clamp(1.6rem, 2.6vw, 2.4rem)',
          boxSizing: 'border-box',
        }}>

          {/* Step number — top, solid accent color + glow on hover */}
          <span
            aria-label={`Step ${step.number}`}
            style={{
              display: 'block',
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.07em',
              lineHeight: 1,
              color: live.active ? '#ffffff' : step.accent,
              opacity: live.active ? 1 : 0.75,
              textShadow: live.active
                ? `0 0 20px rgba(${rgb},0.9), 0 0 40px rgba(${rgb},0.5), 0 0 80px rgba(${rgb},0.25)`
                : 'none',
              transition: 'color 300ms ease, opacity 300ms ease, text-shadow 400ms ease',
              userSelect: 'none',
            }}
          >
            {step.number}
          </span>

          {/* Bottom block */}
          <div>
            {/* Phase label */}
            <div style={{
              fontSize: '8px', fontWeight: 800, letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: live.active ? step.accent : `rgba(${rgb},0.45)`,
              marginBottom: '0.5rem',
              transition: 'color 300ms ease',
            }}>
              {step.phase}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: 'clamp(1rem, 1.9vw, 1.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.15,
              color: live.active ? '#F7F1E2' : 'rgba(237,233,227,0.6)',
              margin: '0 0 0.75rem',
              transition: 'color 300ms ease',
            }}>
              {step.title}
            </h3>

            {/* Animated underline */}
            <div style={{
              height: 1,
              width: live.active ? '50%' : '20%',
              background: `linear-gradient(90deg, rgba(${rgb},0.7), transparent)`,
              marginBottom: '0.75rem',
              transition: 'width 550ms cubic-bezier(0.16,1,0.3,1)',
            }} />

            {/* Body */}
            <p style={{
              fontSize: 'clamp(11px, 0.95vw, 12.5px)',
              lineHeight: 1.7,
              color: live.active ? 'rgba(237,233,227,0.42)' : 'rgba(237,233,227,0.2)',
              margin: 0,
              maxWidth: '30ch',
              transition: 'color 300ms ease',
            }}>
              {step.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const gsapCtx    = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!mounted || !gridRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      gsapCtx.current = gsap.context(() => {
        const cards = gridRef.current?.querySelectorAll('[data-hiw-card]');
        if (!cards || cards.length === 0) return;

        // Ensure cards are fully visible before the ScrollTrigger fires
        // so there's no flash of invisible content on mount.
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });

        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.85, ease: 'power3.out',
            stagger: { each: 0.1, from: 'start' },
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }, sectionRef);
    })();

    return () => {
      mounted = false;
      gsapCtx.current?.revert();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      data-gsap-section="sticky"
      style={{
        background: '#04040A',
        position: 'relative',
        overflow: 'hidden',
        /* fill exactly one viewport height */
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Prevent flicker caused by VideoShowcase's position:fixed pin-spacer
        // injecting into the DOM and triggering a repaint in Chrome/Brave.
        // isolation:isolate creates an explicit stacking context; translateZ(0)
        // promotes this section to its own GPU compositing layer so adjacent
        // pin transitions don't bleed in.
        isolation: 'isolate',
        transform: 'translateZ(0)',
      }}
    >
      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'-15%', left:'-8%', width:700, height:700, background:'radial-gradient(ellipse at center,rgba(201,169,110,0.04) 0%,transparent 65%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-12%', right:'-6%', width:600, height:600, background:'radial-gradient(ellipse at center,rgba(201,169,110,0.03) 0%,transparent 65%)', pointerEvents:'none' }} />

      {/* Fine grid */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.02, pointerEvents:'none' }}>
        <defs>
          <pattern id="hiw-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hiw-grid)" />
      </svg>

      {/* Edge dividers */}
      <div style={{ position:'absolute', top:0, left:'6%', right:'6%', height:1, background:'linear-gradient(90deg,transparent,rgba(201,169,110,0.15),transparent)' }} />
      <div style={{ position:'absolute', bottom:0, left:'6%', right:'6%', height:1, background:'linear-gradient(90deg,transparent,rgba(201,169,110,0.08),transparent)' }} />

      {/* Centered grid — fills the viewport with padding */}
      <div
        ref={gridRef}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          /* take up available space inside the padded container */
          width: 'min(92vw, 1240px)',
          height: 'min(82vh, 800px)',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(237,233,227,0.06)',
        }}
      >
        {steps.map((step, i) => (
          <WorkflowCard key={i} step={step} index={i} />
        ))}

        {/* Center "The Workflow" badge */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20, pointerEvents: 'none', userSelect: 'none',
        }}>
          {/* Crosshair arms */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:110, height:1, background:'linear-gradient(90deg,transparent,rgba(201,169,110,0.2),transparent)' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:1, height:110, background:'linear-gradient(180deg,transparent,rgba(201,169,110,0.2),transparent)' }} />

          <div style={{
            width: 'clamp(84px, 9vw, 120px)',
            height: 'clamp(84px, 9vw, 120px)',
            borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(4,4,10,0.96)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 48px rgba(201,169,110,0.09), 0 0 96px rgba(4,4,10,0.9)',
            position: 'relative',
          }}>
            <div style={{ position:'absolute', inset:7, borderRadius:'50%', border:'1px solid rgba(201,169,110,0.07)' }} />
            <div style={{
              textAlign: 'center', position: 'relative', zIndex: 1,
              fontSize: 'clamp(10px, 1.1vw, 13px)',
              fontWeight: 900, letterSpacing: '-0.01em', lineHeight: 1.2,
              color: '#C9A96E',
            }}>
              The<br />Workflow
            </div>
          </div>
        </div>

        {/* Grid divider lines */}
        <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, background:'rgba(237,233,227,0.05)', zIndex:10 }} />
        <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:'rgba(237,233,227,0.05)', zIndex:10 }} />
      </div>
    </section>
  );
}