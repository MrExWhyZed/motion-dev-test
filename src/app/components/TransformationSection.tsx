'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { pricingPlans, type PricingPlan } from '@/app/pricing/pricingData';

// ─── Build-Forever palette (mirrors HowItWorks) ───────────────────────────────
const BF = ['#0894ff', '#c959dd', '#ff2e54', '#ff9004'] as const;
const BF_RGB = ['8,148,255', '201,89,221', '255,46,84', '255,144,4'] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type UpgradeStat = {
  label: string; before: string; after: string; accent: string; accentRgb: string; kicker: string; icon: string;
};

const upgradeStats: UpgradeStat[] = [
  { label: 'Timeline',  before: '6 weeks',  after: '5 days',  accent: BF[0], accentRgb: BF_RGB[0], kicker: '12× faster', icon: '◷' },
  { label: 'Cost',      before: '$80k',     after: '$8k',     accent: BF[1], accentRgb: BF_RGB[1], kicker: '90% leaner', icon: '◈' },
  { label: 'Assets',    before: '20',       after: '100+',    accent: BF[2], accentRgb: BF_RGB[2], kicker: '5× output',  icon: '◫' },
  { label: 'Revisions', before: 'Reshoots', after: 'Instant', accent: BF[3], accentRgb: BF_RGB[3], kicker: 'Zero drag',  icon: '◎' },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCompactLayout(breakpoint = 920) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const update = () => setCompact(window.innerWidth < breakpoint);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return compact;
}

/**
 * Card tilt — GSAP-safe version.
 * All transforms are applied only to refs, never via CSS transition
 * on the same properties GSAP will touch. We keep the tilt state
 * purely in a ref-driven rAF loop and write directly to element.style
 * so GSAP's own transforms on the parent wrapper never conflict.
 */
function useCardTilt(intensity = 3.25) {
  const ref       = useRef<HTMLDivElement | null>(null);
  const glowRef   = useRef<HTMLDivElement | null>(null);
  const frameRef  = useRef<number>(0);
  const running   = useRef(false);
  const target    = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const current   = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = () => {
    const t = target.current;
    const c = current.current;
    c.rx = lerp(c.rx, t.rx, 0.1);
    c.ry = lerp(c.ry, t.ry, 0.1);
    c.gx = lerp(c.gx, t.gx, 0.1);
    c.gy = lerp(c.gy, t.gy, 0.1);

    const stillMoving =
      Math.abs(c.rx - t.rx) > 0.01 ||
      Math.abs(c.ry - t.ry) > 0.01 ||
      Math.abs(t.rx) > 0.01 ||
      Math.abs(t.ry) > 0.01;

    // Write directly to DOM — no React state, no CSS transition collision
    if (ref.current) {
      const lift = t.active ? -3 : 0;
      ref.current.style.transform =
        `rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateY(${lift}px)`;
      ref.current.style.boxShadow = t.active
        ? `0 34px 68px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.06)`
        : `0 20px 50px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)`;
    }
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${c.gx}% ${c.gy}%, var(--card-accent,#C9A96E)20 0%, transparent 42%)`;
      glowRef.current.style.opacity = t.active ? '1' : '0';
    }

    if (stillMoving) {
      frameRef.current = requestAnimationFrame(tick);
    } else {
      running.current = false;
      frameRef.current = 0;
    }
  };

  const startLoop = () => {
    if (running.current) return;
    running.current = true;
    frameRef.current = requestAnimationFrame(tick);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    target.current.rx = (0.5 - y) * intensity;
    target.current.ry = (x - 0.5) * intensity;
    target.current.gx = x * 100;
    target.current.gy = y * 100;
    startLoop();
  };

  const onMouseEnter = () => {
    target.current.active = true;
    startLoop();
  };

  const onMouseLeave = () => {
    target.current = { rx: 0, ry: 0, gx: 50, gy: 50, active: false };
    startLoop();
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    running.current = false;
  }, []);

  return { ref, glowRef, onMouseMove, onMouseEnter, onMouseLeave };
}

// ─── PricingCard ──────────────────────────────────────────────────────────────
const PricingCard = React.memo(function PricingCard({
  plan,
}: {
  plan: PricingPlan;
}) {
  const { ref, glowRef, onMouseMove, onMouseEnter, onMouseLeave } = useCardTilt();
  const isSignature = !!plan.badge;

  return (
    <div data-ts-card="pricing" style={{ height: '100%', perspective: '1400px' }}>
      {/*
        IMPORTANT: No CSS `transition` on transform/boxShadow here.
        Tilt is written directly to style by the rAF loop.
        GSAP controls opacity / y on the wrapper (data-gsap-card),
        never on this inner div — so there's zero conflict.
      */}
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'relative',
          height: '100%',
          borderRadius: '26px',
          overflow: 'hidden',
          border: '1px solid transparent',
          background: `
            linear-gradient(170deg, rgba(10,10,19,0.98) 0%, rgba(4,4,10,0.99) 100%) padding-box,
            linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${plan.accent}${isSignature ? '44' : '22'} 50%, rgba(255,255,255,0.03) 100%) border-box
          `,
          // No transition here — tilt loop writes transforms directly
          willChange: 'transform',
          // CSS var so glowRef can read the plan accent without prop drilling
          ['--card-accent' as string]: plan.accent,
        }}
      >
        {/* Glow layer — written by tilt loop */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0,
            // No transition — tilt loop controls opacity directly
          }}
        />

        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: `linear-gradient(90deg, transparent, ${plan.accent}90, transparent)` }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${plan.accent}10 0%, transparent 70%)`, pointerEvents: 'none', filter: 'blur(30px)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '9px', letterSpacing: '0.26em', textTransform: 'uppercase', color: `${plan.accent}cc`, fontWeight: 800, marginBottom: '12px' }}>{plan.name}</div>
              <div style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.05em', color: '#F7F1E2', lineHeight: 0.95 }}>{plan.price}</div>
              <div style={{ fontSize: '11px', color: 'rgba(237,233,227,0.45)', marginTop: '7px' }}>{plan.line}</div>
            </div>
            {plan.badge && (
              <div style={{ padding: '5px 10px', borderRadius: '999px', background: `${plan.accent}18`, border: `1px solid ${plan.accent}35`, color: plan.accent, fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800, boxShadow: `0 0 20px ${plan.accent}20` }}>
                {plan.badge}
              </div>
            )}
          </div>

          <div style={{ height: '1px', background: `linear-gradient(90deg, ${plan.accent}30, transparent 70%)`, marginBottom: '18px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plan.metrics.length}, 1fr)`, gap: '8px', marginBottom: '20px' }}>
            {plan.metrics.map((m) => (
              <div key={m.label} style={{ borderRadius: '14px', padding: '12px 10px', textAlign: 'center', background: 'rgba(255,255,255,0.025)', border: `1px solid ${plan.accent}14` }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F7F1E2', letterSpacing: '-0.03em' }}>{m.value}</div>
                <div style={{ fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: `${plan.accent}88`, marginTop: '3px' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
            {plan.features.map((f) => (
              <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '999px', flexShrink: 0, marginTop: '5px', background: plan.accent, boxShadow: `0 0 8px ${plan.accent}70` }} />
                <span style={{ fontSize: '11.5px', color: 'rgba(237,233,227,0.68)', lineHeight: 1.55 }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '9px', color: 'rgba(237,233,227,0.28)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>{plan.turnaround}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/add-project" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', borderRadius: '999px', background: plan.accent, color: '#04040a', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 900, textDecoration: 'none', flex: 1, boxShadow: `0 8px 28px ${plan.accent}40` }}>
                Get started
              </Link>
              <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', borderRadius: '999px', border: `1px solid ${plan.accent}28`, background: 'rgba(255,255,255,0.03)', color: 'rgba(237,233,227,0.6)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none' }}>
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─── UpgradeCard ──────────────────────────────────────────────────────────────
const UpgradeCard = React.memo(function UpgradeCard({ stat }: { stat: UpgradeStat }) {
  return (
    <div
      data-ts-card="upgrade"
      style={{
        position: 'relative', borderRadius: '22px', overflow: 'hidden',
        border: `1px solid rgba(${stat.accentRgb},0.15)`,
        background: 'rgba(10,10,19,0.98)',
        padding: '22px 20px',
        willChange: 'opacity, transform',
        boxShadow: `0 0 40px rgba(${stat.accentRgb},0.05)`,
      }}
    >
      {/* Top accent line — mirrors HowItWorks */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg, transparent, rgba(${stat.accentRgb},0.5), transparent)` }} />
      {/* Corner ambient glow */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, rgba(${stat.accentRgb},0.08) 0%, transparent 70%)`, pointerEvents: 'none', filter: 'blur(28px)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '13px', color: stat.accent }}>{stat.icon}</span>
            <span style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(${stat.accentRgb},0.7)`, fontWeight: 800 }}>{stat.label}</span>
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '999px', background: `rgba(${stat.accentRgb},0.1)`, border: `1px solid rgba(${stat.accentRgb},0.22)`, color: stat.accent, fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>
            {stat.kicker}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '5px' }}>Before</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'rgba(255,255,255,0.22)', textDecoration: 'line-through', textDecorationColor: 'rgba(255,80,80,0.3)', letterSpacing: '-0.02em' }}>{stat.before}</div>
          </div>
          <div style={{ width: '28px', height: '28px', borderRadius: '999px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${stat.accentRgb},0.12)`, border: `1px solid rgba(${stat.accentRgb},0.25)`, color: stat.accent, fontSize: '11px' }}>→</div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(${stat.accentRgb},0.7)`, marginBottom: '5px' }}>After</div>
            {/* Solid color + text-shadow glow — safe inside overflow:hidden */}
            <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', textShadow: `0 0 16px rgba(${stat.accentRgb},0.8), 0 0 32px rgba(${stat.accentRgb},0.4)` }}>{stat.after}</div>
          </div>
        </div>
        <div style={{ marginTop: '16px', height: '2px', borderRadius: '999px', background: `linear-gradient(90deg, rgba(${stat.accentRgb},0.6), rgba(${stat.accentRgb},0.1))` }} />
      </div>
    </div>
  );
});

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function TransformationSection() {
  const sectionRef       = useRef<HTMLElement | null>(null);
  const shellRef         = useRef<HTMLDivElement | null>(null);
  const curtainRef       = useRef<HTMLDivElement | null>(null);
  const pricingSceneRef  = useRef<HTMLDivElement | null>(null);
  const upgradeSceneRef  = useRef<HTMLDivElement | null>(null);
  const pricingGlowRef   = useRef<HTMLDivElement | null>(null);
  const upgradeGlowRef   = useRef<HTMLDivElement | null>(null);
  const pricingHeaderRef = useRef<HTMLDivElement | null>(null);
  const upgradeHeaderRef = useRef<HTMLDivElement | null>(null);
  const chipRowRef       = useRef<HTMLDivElement | null>(null);
  const progressFillRef  = useRef<HTMLDivElement | null>(null);

  const compact = useCompactLayout();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // On mobile (compact) skip the sticky GSAP animation entirely —
    // content renders as normal scroll flow via the mobile JSX branch below.
    if (compact) return;

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      // ── Dynamic imports (GSAP) ────────────────────────────────────────────
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      // Use GSAP lag smoothing for a clean ticker — no Lenis proxy needed.
      // A scrollerProxy on document.body would break every other ScrollTrigger
      // in the app and cause position errors when this section unmounts.
      gsap.ticker.lagSmoothing(500, 33);

      const pricingScene = pricingSceneRef.current!;
      const upgradeScene = upgradeSceneRef.current!;
      const shell        = shellRef.current!;
      const curtain      = curtainRef.current!;

      const pricingCards = Array.from(
        pricingScene.querySelectorAll<HTMLElement>('[data-ts-card="pricing"]')
      );
      const upgradeCards = Array.from(
        upgradeScene.querySelectorAll<HTMLElement>('[data-ts-card="upgrade"]')
      );
      const pricingCopy = pricingHeaderRef.current
        ? (Array.from(pricingHeaderRef.current.children) as HTMLElement[])
        : [];
      const upgradeCopy = upgradeHeaderRef.current
        ? (Array.from(upgradeHeaderRef.current.children) as HTMLElement[])
        : [];
      const chips = chipRowRef.current
        ? (Array.from(chipRowRef.current.children) as HTMLElement[])
        : [];

      let rafId = 0;
      const ctx = gsap.context(() => {

        // ── INITIAL STATES ─────────────────────────────────────────────────
        // Shell: revealed by the entry timeline — starts hidden below
        gsap.set(shell, {
          autoAlpha: 0,
          y: compact ? 60 : 80,
          scale: compact ? 0.97 : 0.96,
          clipPath: compact
            ? 'inset(18% 6% 16% 6% round 16px)'
            : 'inset(22% 8% 20% 8% round 24px)',
          transformOrigin: '50% 60%',
        });
        gsap.set(curtain, { autoAlpha: 1 });

        // Pricing scene: starts slightly offset — Phase 0 settles it to rest
        gsap.set(pricingScene, { autoAlpha: 1, transformOrigin: '50% 48%' });
        gsap.set(pricingCopy,  { autoAlpha: 1 });
        gsap.set(pricingCards, { autoAlpha: 1, transformOrigin: '50% 100%', transformPerspective: 1000 });
        if (pricingGlowRef.current) gsap.set(pricingGlowRef.current, { opacity: 0 });

        // Upgrade scene: hidden — enters during scene-swap
        gsap.set(upgradeScene, { autoAlpha: 0, y: 36, scale: 0.994, transformOrigin: '50% 52%' });
        gsap.set(upgradeCopy,  { autoAlpha: 0, y: 20 });
        gsap.set(upgradeCards, { autoAlpha: 0, y: 30, scale: 0.985, transformOrigin: '50% 100%', transformPerspective: 1000 });
        gsap.set(chips,        { autoAlpha: 0, y: 12, scale: 0.96 });
        if (upgradeGlowRef.current) gsap.set(upgradeGlowRef.current, { opacity: 0 });

        // Progress bar
        if (progressFillRef.current) gsap.set(progressFillRef.current, { scaleX: 0, transformOrigin: 'left center' });

        // ── 1. ENTRY REVEAL ────────────────────────────────────────────────
        // Single ScrollTrigger, scrub 0.6 — tight enough to feel responsive,
        // loose enough not to snap. Triggers as the previous section scrolls away.
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            end:   'top 8%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(shell, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'power3.out',
            duration: 1,
          }, 0)
          .to(curtain, {
            autoAlpha: 0,
            ease: 'power2.inOut',
            duration: 0.55,
          }, 0.2);

        // ── 2. STICKY SCENE-SWAP ───────────────────────────────────────────
        // scrub: false + manual lerp playhead = true momentum deceleration.
        //
        // How it works:
        //   - ScrollTrigger gives us a raw `progress` (0→1) from scroll position.
        //   - We lerp a `smoothProgress` toward that target every rAF tick.
        //   - `tl.progress(smoothProgress)` drives the timeline from that lerped value.
        //   - When the user stops scrolling, rawProgress is fixed but smoothProgress
        //     is still behind it — it glides the remaining distance with expo-out feel.
        //   - lerpFactor 0.072 ≈ ~14 frames to close 99% of the gap at 60fps,
        //     giving a natural deceleration without feeling sluggish mid-scroll.

        const pinEnd = compact ? '+=280%' : '+=260%';

        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, paused: true });

        let rawProgress    = 0;
        let smoothProgress = 0;
        const LERP = 0.085;
        const EPS  = 0.0003; // stop RAF when delta is imperceptible
        let rafRunning = false;

        const driveTl = () => {
          const delta = rawProgress - smoothProgress;
          smoothProgress += delta * LERP;
          tl.progress(Math.min(1, Math.max(0, smoothProgress)));

          if (Math.abs(delta) > EPS) {
            rafId = requestAnimationFrame(driveTl);
          } else {
            // Snap to exact target and stop — no wasted frames at rest
            smoothProgress = rawProgress;
            tl.progress(Math.min(1, Math.max(0, smoothProgress)));
            rafRunning = false;
            rafId = 0;
          }
        };

        const startDrive = () => {
          if (!rafRunning) {
            rafRunning = true;
            rafId = requestAnimationFrame(driveTl);
          }
        };

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end:   pinEnd,
          pin:   true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            rawProgress = self.progress;
            startDrive();
          },
          onKill: () => { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; rafRunning = false; } },
        });

        // ── Phase 0: Settle on Pricing (0 → 0.5) ──────────────────────────
        // The scene arrives with a little kinetic energy and decelerates to rest.
        // Starting slightly below + scaled-down, then easing to neutral — this
        // makes the scroll-stop feel like momentum bleeding off, not a hard cut.
        gsap.set(pricingScene,  { y: compact ? 18 : 24, scale: 0.985 });
        gsap.set(pricingCards,  { y: compact ? 12 : 16, scale: 0.992 });
        gsap.set(pricingCopy,   { y: compact ?  8 : 10 });

        tl.addLabel('holdPricing', 0)
          // Scene settles: slides up and scales to neutral with a deceleration curve
          .to(pricingScene, {
            y: 0, scale: 1,
            duration: 0.46, ease: 'power3.out',
          }, 'holdPricing')
          // Cards follow with a micro-stagger so they land individually, not as one block
          .to(pricingCards, {
            y: 0, scale: 1,
            duration: 0.38, stagger: { each: 0.04, from: 'start' }, ease: 'power3.out',
          }, 'holdPricing+=0.04')
          // Header copy floats up last — lightest element, settles last
          .to(pricingCopy, {
            y: 0,
            duration: 0.32, stagger: 0.03, ease: 'power2.out',
          }, 'holdPricing+=0.08')
          // Progress and glow ease in alongside the settle
          .to(progressFillRef.current, { scaleX: 0.4, duration: 0.5, ease: 'power2.out' }, 'holdPricing')
          .to(pricingGlowRef.current,  { opacity: 0.35, duration: 0.46, ease: 'power2.out' }, 'holdPricing');

        // ── Phase 1: Exit Pricing (0.5 → 0.76) ────────────────────────────
        // Cards peel upward sequentially — no blur (GPU-safe on scrub)
        tl.addLabel('exitPricing', 0.5)
          .to(pricingCards, {
            autoAlpha: 0,
            y: -32,
            scale: 0.99,
            duration: 0.22,
            stagger: { each: 0.04, from: 'start' },
            ease: 'power2.in',
          }, 'exitPricing')
          .to(pricingCopy, {
            autoAlpha: 0,
            y: -16,
            duration: 0.18,
            stagger: 0.03,
            ease: 'power2.in',
          }, 'exitPricing+=0.04')
          .to(pricingGlowRef.current, { opacity: 0, duration: 0.18 }, 'exitPricing+=0.06')
          // Scene wrapper exits last — the cards have already gone
          .to(pricingScene, {
            autoAlpha: 0,
            y: -14,
            scale: 0.992,
            duration: 0.16,
            ease: 'power2.in',
          }, 'exitPricing+=0.18');

        // ── Phase 2: Enter Upgrade (0.64 → 1.5) ───────────────────────────
        // Overlap with Phase 1 so there's never a fully blank frame
        tl.addLabel('enterUpgrade', 0.64)
          .to(upgradeGlowRef.current, { opacity: 0.55, duration: 0.38, ease: 'power2.out' }, 'enterUpgrade')
          .to(upgradeScene, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: 'power2.out',
          }, 'enterUpgrade+=0.04')
          .to(upgradeCopy, {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.055,
            ease: 'power3.out',
          }, 'enterUpgrade+=0.12')
          .to(upgradeCards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: { each: 0.07, from: 'start' },
            ease: 'power3.out',
          }, 'enterUpgrade+=0.18')
          .to(chips, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.28,
            stagger: 0.055,
            ease: 'power2.out',
          }, 'enterUpgrade+=0.36')
          .to(progressFillRef.current, { scaleX: 1, duration: 0.48, ease: 'power1.out' }, 'enterUpgrade+=0.06');

        // ── Phase 3: Rest on Upgrade (1.5 → 2.1) ─────────────────────────
        tl.addLabel('holdUpgrade', 1.5)
          .to({}, { duration: 0.6 }, 'holdUpgrade');

        // ── Phase 4: Exit All + Shell dissolve (2.1 → 2.75) ───────────────
        // Exit flows bottom-up (reverse of entry) for a page-turn feeling
        tl.addLabel('exitAll', 2.1)
          .to(upgradeCards, {
            autoAlpha: 0,
            y: 28,
            scale: 0.992,
            duration: 0.28,
            stagger: { each: 0.045, from: 'end' },
            ease: 'power2.in',
          }, 'exitAll')
          .to(chips, {
            autoAlpha: 0,
            y: 14,
            scale: 0.96,
            duration: 0.2,
            stagger: 0.045,
            ease: 'power2.in',
          }, 'exitAll+=0.04')
          .to(upgradeCopy, {
            autoAlpha: 0,
            y: 16,
            duration: 0.24,
            stagger: 0.04,
            ease: 'power2.in',
          }, 'exitAll+=0.08')
          .to(upgradeGlowRef.current, { opacity: 0, duration: 0.28 }, 'exitAll+=0.1')
          .to(upgradeScene, {
            autoAlpha: 0,
            y: 14,
            scale: 0.993,
            duration: 0.26,
            ease: 'power2.in',
          }, 'exitAll+=0.22')
          // Shell rises and fades — sets up the next section's entrance
          .to(shell, {
            autoAlpha: 0,
            y: -28,
            scale: 0.982,
            clipPath: 'inset(10% 5% 10% 5% round 16px)',
            duration: 0.38,
            ease: 'power2.in',
          }, 'exitAll+=0.28');

      }, sectionRef);

      // Refresh after all triggers are created so positions account for
      // any pin-spacers that other sections already inserted into the DOM.
      ScrollTrigger.refresh();

      cleanup = () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        ctx.revert();
      };
    })();

    return () => { mounted = false; cleanup(); };
  }, [compact]);

  // ─── Mobile Layout (no GSAP pin) ──────────────────────────────────────────
  if (compact) {
    return (
      <section style={{ background: '#04040A', padding: '0 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="noise-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

        {/* Chromatic top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #0894ff 0%, #c959dd 34%, #ff2e54 68%, #ff9004 100%)', zIndex: 2 }} />

        {/* Ambient background orbs */}
        <div style={{ position: 'absolute', top: '5%', left: '-30%', width: '80vw', height: '80vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(8,148,255,0.07) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', right: '-25%', width: '70vw', height: '70vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,89,221,0.06) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>

          {/* ── PRICING SECTION ── */}
          <div style={{ paddingTop: '3.5rem' }}>
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(8,148,255,0.3))' }} />
              <span style={{ fontSize: '7.5px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(8,148,255,0.7)', fontWeight: 800, whiteSpace: 'nowrap' }}>Owned Production</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(8,148,255,0.3))' }} />
            </div>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 9vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, color: '#F7F1E2', margin: '0 0 12px' }}>
                Pricing
                <span style={{ color: '#0894ff', textShadow: '0 0 24px rgba(8,148,255,0.9), 0 0 48px rgba(8,148,255,0.4)' }}>.</span>
              </h2>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(237,233,227,0.4)', margin: 0, maxWidth: '32ch' }}>
                Luxury motion, cleaner scale, one owned production system.
              </p>
            </div>

            {/* Pricing cards — horizontal scroll snap */}
            <div style={{ marginLeft: '-16px', marginRight: '-16px', paddingLeft: '16px', paddingRight: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex', gap: '12px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
              {pricingPlans.map((plan) => (
                <div key={plan.id} style={{ flexShrink: 0, width: 'calc(85vw - 32px)', maxWidth: '340px', scrollSnapAlign: 'start' }}>
                  <PricingCard plan={plan} />
                </div>
              ))}
            </div>

            {/* Scroll indicator dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              {pricingPlans.map((_, i) => (
                <div key={i} style={{ width: i === 0 ? '16px' : '5px', height: '5px', borderRadius: '999px', background: i === 0 ? '#0894ff' : 'rgba(255,255,255,0.12)', transition: 'all 0.3s ease' }} />
              ))}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ margin: '3rem 0', position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,89,221,0.25))' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(201,89,221,0.5)', boxShadow: '0 0 10px rgba(201,89,221,0.6)' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(201,89,221,0.25))' }} />
          </div>

          {/* ── UPGRADE SECTION ── */}
          <div>
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,89,221,0.3))' }} />
              <span style={{ fontSize: '7.5px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,89,221,0.7)', fontWeight: 800, whiteSpace: 'nowrap' }}>The Upgrade</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(201,89,221,0.3))' }} />
            </div>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 9vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, color: '#F7F1E2', margin: '0 0 12px' }}>
                The{' '}
                <span style={{ color: '#c959dd', textShadow: '0 0 24px rgba(201,89,221,0.9), 0 0 48px rgba(201,89,221,0.4)' }}>Upgrade.</span>
              </h2>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(237,233,227,0.4)', margin: 0, maxWidth: '30ch' }}>
                Less friction. More output. Every campaign lives in the same premium world.
              </p>
            </div>

            {/* Upgrade cards — 2×2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {upgradeStats.map((stat) => <UpgradeCard key={stat.label} stat={stat} />)}
            </div>

            {/* Chip row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              {[
                { label: '1 digital twin',   accent: BF[0], accentRgb: BF_RGB[0] },
                { label: 'Every campaign',   accent: BF[1], accentRgb: BF_RGB[1] },
                { label: 'Forever reusable', accent: BF[2], accentRgb: BF_RGB[2] },
              ].map(({ label, accent, accentRgb }) => (
                <div key={label} style={{ padding: '7px 14px', borderRadius: '999px', border: `1px solid rgba(${accentRgb},0.25)`, background: `rgba(${accentRgb},0.09)`, color: accent, fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800, boxShadow: `0 0 16px rgba(${accentRgb},0.08)` }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll-snap hide scrollbar */}
        <style>{`
          .ts-mobile-scroll::-webkit-scrollbar { display: none; }
          .ts-mobile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </section>
    );
  }

  // ─── Desktop Layout (GSAP sticky) ─────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      data-gsap-section="sticky"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: '#04040A',
        // Prevent flicker caused by VideoShowcase's position:fixed pin-spacer
        // injecting into the DOM and triggering a repaint in Chrome/Brave.
        isolation: 'isolate',
        transform: 'translateZ(0)',
      }}
    >
      {/* ── Shell (the entire visible frame) ── */}
      <div
        ref={shellRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          willChange: 'transform, clip-path, opacity',
        }}
      >
        {/* Noise overlay */}
        <div
          className="noise-overlay"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
        />

        {/* Fine grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.028, pointerEvents: 'none' }}>
          <defs>
            <pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tgrid)" />
        </svg>

        {/* Scene glows — GSAP only touches opacity on these */}
        <div
          ref={pricingGlowRef}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(8,148,255,0.08) 0%, transparent 60%)',
            filter: 'blur(20px)',
            willChange: 'opacity',
          }}
        />
        <div
          ref={upgradeGlowRef}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,89,221,0.1) 0%, transparent 60%)',
            filter: 'blur(20px)',
            willChange: 'opacity',
          }}
        />

        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 10 }}>
          <div
            ref={progressFillRef}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #0894ff 0%, #c959dd 34%, #ff2e54 68%, #ff9004 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 12px rgba(201,89,221,0.5)',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Side labels */}
        {!compact && (
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            {[
              { label: 'Packages', color: 'rgba(8,148,255,0.45)'   },
              { label: 'Upgrade',  color: 'rgba(201,89,221,0.35)' },
            ].map(({ label, color }) => (
              <div key={label} style={{ fontSize: '7px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 800, color, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {label}
              </div>
            ))}
          </div>
        )}

        {/* ── PRICING SCENE ── */}
        <div
          ref={pricingSceneRef}
          style={{
            position: 'absolute',
            inset: compact ? '12px 14px' : '14px 20px',
            paddingRight: compact ? 0 : '44px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: compact ? '14px' : '18px',
            zIndex: 2,
            willChange: 'transform, opacity',
            // NO filter here — GSAP must not animate filter on scrubbed elements
          }}
        >
          <div ref={pricingHeaderRef} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '1px', background: 'rgba(8,148,255,0.5)' }} />
              <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(8,148,255,0.75)', fontWeight: 800 }}>Owned Production</span>
              <div style={{ width: '28px', height: '1px', background: 'rgba(8,148,255,0.5)' }} />
            </div>
            <h2 style={{ fontSize: compact ? 'clamp(1.4rem, 6vw, 1.9rem)' : 'clamp(1.9rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1.0, color: '#F7F1E2', margin: '0 0 10px' }}>
              Pricing{' '}
              <span style={{ color: '#0894ff', textShadow: '0 0 20px rgba(8,148,255,0.7), 0 0 40px rgba(8,148,255,0.3)' }}>.</span>
            </h2>
            <p style={{ fontSize: compact ? '11px' : '12.5px', lineHeight: 1.65, color: 'rgba(237,233,227,0.38)', maxWidth: '36ch', margin: '0 auto' }}>
              Luxury motion, cleaner scale, one owned production system.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: compact ? '12px' : '18px', maxWidth: '1160px', width: '100%', margin: '0 auto', alignItems: 'stretch' }}>
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* ── UPGRADE SCENE ── */}
        <div
          ref={upgradeSceneRef}
          style={{
            position: 'absolute',
            inset: compact ? '14px 16px' : '18px 24px',
            paddingRight: compact ? 0 : '44px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: compact ? '16px' : '22px',
            zIndex: 2,
            willChange: 'transform, opacity',
          }}
        >
          <div ref={upgradeHeaderRef} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '1px', background: 'rgba(201,89,221,0.5)' }} />
              <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,89,221,0.75)', fontWeight: 800 }}>The Upgrade</span>
              <div style={{ width: '28px', height: '1px', background: 'rgba(201,89,221,0.5)' }} />
            </div>
            <h2 style={{ fontSize: compact ? 'clamp(1.4rem, 6vw, 1.9rem)' : 'clamp(1.9rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1.0, color: '#F7F1E2', margin: '0 0 10px' }}>
              The{' '}
              <span style={{ color: '#c959dd', textShadow: '0 0 20px rgba(201,89,221,0.7), 0 0 40px rgba(201,89,221,0.3)' }}>Upgrade.</span>
            </h2>
            <p style={{ fontSize: compact ? '11px' : '12.5px', lineHeight: 1.65, color: 'rgba(237,233,227,0.38)', maxWidth: '32ch', margin: '0 auto' }}>
              Less friction. More output. Every campaign lives inside the same premium world.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: compact ? '10px' : '14px', maxWidth: '1060px', width: '100%', margin: '0 auto' }}>
            {upgradeStats.map((stat) => (
              <UpgradeCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div
            ref={chipRowRef}
            style={{ display: 'flex', justifyContent: 'center', gap: compact ? '8px' : '10px', flexWrap: 'wrap' }}
          >
            {[
              { label: '1 digital twin',   accent: BF[0], accentRgb: BF_RGB[0] },
              { label: 'Every campaign',   accent: BF[1], accentRgb: BF_RGB[1] },
              { label: 'Forever reusable', accent: BF[2], accentRgb: BF_RGB[2] },
            ].map(({ label, accent, accentRgb }) => (
              <div
                key={label}
                style={{ padding: '7px 14px', borderRadius: '999px', border: `1px solid rgba(${accentRgb},0.2)`, background: `rgba(${accentRgb},0.08)`, color: accent, fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800 }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reveal curtain — fades out during entry, never touched by the pin TL */}
      <div
        ref={curtainRef}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20,
          background: 'radial-gradient(ellipse 70% 42% at 50% 58%, rgba(8,148,255,0.06), transparent 58%), linear-gradient(180deg, rgba(4,4,10,1) 0%, rgba(4,4,10,0.98) 58%, rgba(4,4,10,0.94) 100%)',
        }}
      />
    </section>
  );
}