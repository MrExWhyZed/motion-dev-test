'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { pricingPlans, type PricingPlan } from '@/app/pricing/pricingData';

type UpgradeStat = {
  label: string; before: string; after: string; accent: string; kicker: string; icon: string;
};

const upgradeStats: UpgradeStat[] = [
  { label: 'Timeline', before: '6 weeks', after: '5 days',  accent: '#C9A96E', kicker: '12× faster', icon: '◷' },
  { label: 'Cost',     before: '$80k',    after: '$8k',     accent: '#4A9EFF', kicker: '90% leaner', icon: '◈' },
  { label: 'Assets',   before: '20',      after: '100+',    accent: '#A78BFA', kicker: '5× output',  icon: '◫' },
  { label: 'Revisions',before: 'Reshoots',after: 'Instant', accent: '#34D399', kicker: 'Zero drag',  icon: '◎' },
];

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

function useCardTilt(intensity = 3.25) {
  const ref      = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number>(0);
  const runningRef = useRef(false);
  const targetRef  = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const currentRef = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [live, setLive] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = () => {
    const t = targetRef.current, c = currentRef.current;
    c.rx = lerp(c.rx, t.rx, 0.1); c.ry = lerp(c.ry, t.ry, 0.1);
    c.gx = lerp(c.gx, t.gx, 0.1); c.gy = lerp(c.gy, t.gy, 0.1);
    const active = Math.abs(c.rx) > 0.02 || Math.abs(c.ry) > 0.02 || Math.abs(t.rx) > 0.02 || Math.abs(t.ry) > 0.02;
    setLive({ rx: c.rx, ry: c.ry, gx: c.gx, gy: c.gy, active });
    if (active) { frameRef.current = requestAnimationFrame(animate); return; }
    runningRef.current = false; frameRef.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    targetRef.current = { rx: (0.5 - y) * intensity, ry: (x - 0.5) * intensity, gx: x * 100, gy: y * 100 };
  };
  const onMouseEnter = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    frameRef.current = requestAnimationFrame(animate);
  };
  const onMouseLeave = () => { targetRef.current = { rx: 0, ry: 0, gx: 50, gy: 50 }; };

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); runningRef.current = false; }, []);
  return { ref, live, onMouseMove, onMouseEnter, onMouseLeave };
}

const PricingCard = React.memo(function PricingCard({ plan }: { plan: PricingPlan }) {
  const { ref, live, onMouseMove, onMouseEnter, onMouseLeave } = useCardTilt();
  const isSignature = !!plan.badge;

  return (
    <div data-gsap-card="pricing" style={{ height: '100%', perspective: '1400px' }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        style={{
          position: 'relative', height: '100%', borderRadius: '26px', overflow: 'hidden',
          border: '1px solid transparent',
          background: `
            linear-gradient(170deg, rgba(12,12,22,0.97) 0%, rgba(6,6,14,0.99) 100%) padding-box,
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, ${plan.accent}${isSignature ? '55' : '30'} 50%, rgba(255,255,255,0.04) 100%) border-box
          `,
          boxShadow: live.active
            ? `0 34px 68px rgba(0,0,0,0.52), 0 0 42px ${plan.accent}14, inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 20px 50px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)`,
          transform: `rotateX(${live.rx}deg) rotateY(${live.ry}deg) translateY(${live.active ? -3 : 0}px)`,
          transition: live.active
            ? 'box-shadow 180ms ease'
            : 'transform 600ms cubic-bezier(0.16,1,0.3,1), box-shadow 400ms ease',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${live.gx}% ${live.gy}%, ${plan.accent}20 0%, transparent 42%)`,
          transition: live.active ? 'none' : 'opacity 600ms ease',
          opacity: live.active ? 1 : 0,
        }} />
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

const UpgradeCard = React.memo(function UpgradeCard({ stat }: { stat: UpgradeStat }) {
  return (
    <div data-gsap-card="upgrade" style={{
      position: 'relative', borderRadius: '22px', overflow: 'hidden',
      border: '1px solid transparent',
      background: `
        linear-gradient(160deg, rgba(10,10,20,0.97) 0%, rgba(5,5,12,0.99) 100%) padding-box,
        linear-gradient(145deg, rgba(255,255,255,0.07) 0%, ${stat.accent}28 100%) border-box
      `,
      padding: '22px 20px', willChange: 'opacity, transform, filter', transformStyle: 'preserve-3d',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', background: `radial-gradient(ellipse at 30% 0%, ${stat.accent}16 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '13px', color: `${stat.accent}cc` }}>{stat.icon}</span>
            <span style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: `${stat.accent}aa`, fontWeight: 800 }}>{stat.label}</span>
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '999px', background: `${stat.accent}14`, border: `1px solid ${stat.accent}24`, color: stat.accent, fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>
            {stat.kicker}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '5px' }}>Before</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'rgba(255,255,255,0.22)', textDecoration: 'line-through', textDecorationColor: 'rgba(255,80,80,0.3)', letterSpacing: '-0.02em' }}>{stat.before}</div>
          </div>
          <div style={{ width: '28px', height: '28px', borderRadius: '999px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${stat.accent}18`, border: `1px solid ${stat.accent}28`, color: stat.accent, fontSize: '11px' }}>→</div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', color: `${stat.accent}88`, marginBottom: '5px' }}>After</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#F7F1E2' }}>{stat.after}</div>
          </div>
        </div>
        <div style={{ marginTop: '16px', height: '2px', borderRadius: '999px', background: `linear-gradient(90deg, ${stat.accent}60, ${stat.accent}18)` }} />
      </div>
    </div>
  );
});

export default function TransformationSection() {
  const sectionRef       = useRef<HTMLElement | null>(null);
  const revealShellRef   = useRef<HTMLDivElement | null>(null);
  const revealCurtainRef = useRef<HTMLDivElement | null>(null);
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

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted || !sectionRef.current || !pricingSceneRef.current || !upgradeSceneRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const pricingScene = pricingSceneRef.current!;
      const upgradeScene = upgradeSceneRef.current!;
      const pricingCards = Array.from(pricingScene.querySelectorAll<HTMLElement>('[data-gsap-card="pricing"]'));
      const upgradeCards = Array.from(upgradeScene.querySelectorAll<HTMLElement>('[data-gsap-card="upgrade"]'));
      const pricingCopy  = pricingHeaderRef.current ? Array.from(pricingHeaderRef.current.children) as HTMLElement[] : [];
      const upgradeCopy  = upgradeHeaderRef.current ? Array.from(upgradeHeaderRef.current.children) as HTMLElement[] : [];
      const chips        = chipRowRef.current ? Array.from(chipRowRef.current.children) as HTMLElement[] : [];

      const ctx = gsap.context(() => {

        // ── INITIAL STATES ────────────────────────────────────────────────
        if (revealShellRef.current) {
          gsap.set(revealShellRef.current, {
            autoAlpha: 0,
            y: compact ? 48 : 64,
            scale: compact ? 0.99 : 0.975,
            clipPath: compact
              ? 'inset(20% 8% 18% 8% round 16px)'
              : 'inset(26% 10% 22% 10% round 24px)',
            transformOrigin: '50% 60%',
          });
        }
        if (revealCurtainRef.current) gsap.set(revealCurtainRef.current, { autoAlpha: 1 });

        gsap.set(pricingScene, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', transformOrigin: '50% 48%' });
        gsap.set(upgradeScene, { autoAlpha: 0, y: 28, scale: 0.995, transformOrigin: '50% 52%' });
        gsap.set(pricingCopy,  { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
        gsap.set(upgradeCopy,  { autoAlpha: 0, y: 16 });
        gsap.set(pricingCards, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', transformOrigin: '50% 100%', transformPerspective: 1000 });
        gsap.set(upgradeCards, { autoAlpha: 0, y: 24, scale: 0.988, transformOrigin: '50% 100%', transformPerspective: 1000 });
        gsap.set(chips, { autoAlpha: 0, y: 10, scale: 0.97 });
        if (pricingGlowRef.current) gsap.set(pricingGlowRef.current, { opacity: 0.65 });
        if (upgradeGlowRef.current) gsap.set(upgradeGlowRef.current, { opacity: 0 });
        if (progressFillRef.current) gsap.set(progressFillRef.current, { scaleX: 0, transformOrigin: 'left center' });

        // ── SCROLL-REVEAL: section rises into view from below Process ─────
        // Higher scrub = more responsive, less laggy; feels tighter at section boundary
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',   // start revealing as soon as Process exits
            end:   'top 15%',
            scrub: 0.5,         // tighter than before — eliminates the "stuck" feeling
            invalidateOnRefresh: true,
          },
        })
          .to(revealShellRef.current, {
            autoAlpha: 1, y: 0, scale: 1,
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'power2.out', duration: 1,
          }, 0)
          .to(revealCurtainRef.current, {
            autoAlpha: 0, ease: 'power2.inOut', duration: 0.6,
          }, 0.15);

        // ── PINNED SCENE-SWAP ─────────────────────────────────────────────
        // scrub: 1 instead of 0.6 — eliminates the rubbery inconsistency;
        // 1 = exactly 1 second of visual lag behind scroll, which feels
        // deliberate and weighty rather than glitchy/stuck.
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: compact ? '+=280%' : '+=260%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // PHASE 1: Breathe on pricing (0 → 0.55)
        tl.addLabel('hold', 0)
          .to(progressFillRef.current, { scaleX: 0.38, duration: 0.55, ease: 'power1.inOut' }, 'hold')
          .to(pricingGlowRef.current,  { opacity: 0.38, duration: 0.45, ease: 'power1.in' },  'hold+=0.08')
          .to(pricingScene,            { scale: 0.998,  duration: 0.55, ease: 'power1.inOut' },'hold')

        // PHASE 2: Exit pricing (0.55 → 0.78) — cards fall away like a curtain
          .addLabel('exitPricing', 0.55)
          .to(pricingCards, {
            autoAlpha: 0, y: -24, scale: 0.992,
            duration: 0.24, stagger: { each: 0.035, from: 'start' }, ease: 'power2.in',
          }, 'exitPricing')
          .to(pricingCopy, {
            autoAlpha: 0, y: -12, filter: 'blur(4px)',
            duration: 0.2, stagger: 0.025, ease: 'power2.in',
          }, 'exitPricing+=0.04')
          .to(pricingScene, {
            autoAlpha: 0, y: -10, scale: 0.993,
            duration: 0.18, ease: 'power2.in',
          }, 'exitPricing+=0.16')
          .to(pricingGlowRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 'exitPricing+=0.06')

        // PHASE 3: Enter upgrade (0.72 → 1.55) — rises like the next chapter
          .addLabel('enterUpgrade', 0.72)
          .to(upgradeGlowRef.current, { opacity: 0.6, duration: 0.4,  ease: 'power2.out' }, 'enterUpgrade')
          .to(upgradeScene, {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.42, ease: 'power2.out',
          }, 'enterUpgrade+=0.05')
          .to(upgradeCopy, {
            autoAlpha: 1, y: 0,
            duration: 0.34, stagger: 0.055, ease: 'power2.out',
          }, 'enterUpgrade+=0.14')
          .to(upgradeCards, {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.42, stagger: { each: 0.06, from: 'start' }, ease: 'power2.out',
          }, 'enterUpgrade+=0.20')
          .to(chips, {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.3, stagger: 0.05, ease: 'power2.out',
          }, 'enterUpgrade+=0.36')
          .to(progressFillRef.current, { scaleX: 1, duration: 0.5, ease: 'power1.out' }, 'enterUpgrade+=0.08')

        // PHASE 4: Hold on upgrade (1.55 → 2.1)
          .addLabel('holdUpgrade', 1.55)
          .to({}, { duration: 0.55 }, 'holdUpgrade')

        // PHASE 5: Story bridge EXIT → Testimonials (2.1 → 2.8)
        // Cards drift upward sequentially like scrolling past a page
          .addLabel('exitAll', 2.1)
          .to(upgradeCards, {
            autoAlpha: 0, y: 20, scale: 0.994,
            duration: 0.32, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in',
          }, 'exitAll')
          .to(chips, {
            autoAlpha: 0, y: 10, scale: 0.97,
            duration: 0.22, stagger: 0.04, ease: 'power2.in',
          }, 'exitAll')
          .to(upgradeCopy, {
            autoAlpha: 0, y: 12, filter: 'blur(3px)',
            duration: 0.28, stagger: 0.04, ease: 'power2.in',
          }, 'exitAll+=0.06')
          .to(upgradeGlowRef.current, { opacity: 0, duration: 0.3,  ease: 'power2.in' }, 'exitAll+=0.08')
          .to(upgradeScene, {
            autoAlpha: 0, y: 10, scale: 0.995,
            duration: 0.3, ease: 'power2.in',
          }, 'exitAll+=0.20')
          // Shell fades UP and dissolves — sets up Testimonials' entrance perfectly
          .to(revealShellRef.current, {
            autoAlpha: 0, y: -20, scale: 0.984,
            duration: 0.4, ease: 'power2.in',
          }, 'exitAll+=0.26');

      }, sectionRef);

      cleanup = () => ctx.revert();
    })();

    return () => { mounted = false; cleanup(); };
  }, [compact]);

  return (
    <section
      ref={sectionRef}
      data-gsap-section="sticky"
      style={{
        position: 'relative', height: '100vh', overflow: 'hidden',
        background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)',
      }}
    >
      <div ref={revealShellRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', willChange: 'transform, clip-path, opacity' }}>

        {/* Noise overlay */}
        <div className="noise-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

        {/* Fine grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.028, pointerEvents: 'none' }}>
          <defs>
            <pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tgrid)" />
        </svg>

        {/* Scene glows */}
        <div ref={pricingGlowRef} style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,169,110,0.1) 0%, transparent 60%)',
          filter: 'blur(20px)', willChange: 'opacity',
        }} />
        <div ref={upgradeGlowRef} style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,158,255,0.12) 0%, transparent 60%)',
          filter: 'blur(20px)', willChange: 'opacity',
        }} />

        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 10 }}>
          <div ref={progressFillRef} style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(201,169,110,0.9) 0%, rgba(74,158,255,0.9) 100%)',
            borderRadius: '999px', boxShadow: '0 0 12px rgba(201,169,110,0.4)', willChange: 'transform',
          }} />
        </div>

        {/* Side labels */}
        {!compact && (
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            {[{ label: 'Packages', color: 'rgba(201,169,110,0.42)' }, { label: 'Upgrade', color: 'rgba(74,158,255,0.32)' }].map(({ label, color }) => (
              <div key={label} style={{ fontSize: '7px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 800, color, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{label}</div>
            ))}
          </div>
        )}

        {/* ── PRICING SCENE ── */}
        <div ref={pricingSceneRef} style={{
          position: 'absolute',
          inset: compact ? '12px 14px' : '14px 20px',
          paddingRight: compact ? 0 : '44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: compact ? '14px' : '18px', zIndex: 2,
          willChange: 'transform, opacity, filter',
        }}>
          <div ref={pricingHeaderRef} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
              <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.75)', fontWeight: 800 }}>Owned Production</span>
              <div style={{ width: '28px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
            </div>
            <h2 style={{ fontSize: compact ? 'clamp(1.4rem, 6vw, 1.9rem)' : 'clamp(1.9rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1.0, color: '#F7F1E2', margin: '0 0 10px' }}>
              Pricing{' '}
              <span style={{ background: 'linear-gradient(120deg, #F5E5C1 0%, #C9A96E 40%, #68B4FF 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.</span>
            </h2>
            <p style={{ fontSize: compact ? '11px' : '12.5px', lineHeight: 1.65, color: 'rgba(237,233,227,0.38)', maxWidth: '36ch', margin: '0 auto' }}>
              Luxury motion, cleaner scale, one owned production system.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: compact ? '12px' : '18px', maxWidth: '1160px', width: '100%', margin: '0 auto', alignItems: 'stretch' }}>
            {pricingPlans.map((plan) => <PricingCard key={plan.id} plan={plan} />)}
          </div>
        </div>

        {/* ── UPGRADE SCENE ── */}
        <div ref={upgradeSceneRef} style={{
          position: 'absolute',
          inset: compact ? '14px 16px' : '18px 24px',
          paddingRight: compact ? 0 : '44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: compact ? '16px' : '22px', zIndex: 2,
          willChange: 'transform, opacity, filter',
        }}>
          <div ref={upgradeHeaderRef} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
             
            </div>
            <h2 style={{ fontSize: compact ? 'clamp(1.4rem, 6vw, 1.9rem)' : 'clamp(1.9rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1.0, color: '#F7F1E2', margin: '0 0 10px' }}>
              The{' '}
              <span style={{ background: 'linear-gradient(120deg, #F5E5C1 0%, #C9A96E 25%, #68B4FF 65%, #A78BFA 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Upgrade.</span>
            </h2>
            <p style={{ fontSize: compact ? '11px' : '12.5px', lineHeight: 1.65, color: 'rgba(237,233,227,0.38)', maxWidth: '32ch', margin: '0 auto' }}>
              Less friction. More output. Every campaign lives inside the same premium world.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: compact ? '10px' : '14px', maxWidth: '1060px', width: '100%', margin: '0 auto' }}>
            {upgradeStats.map((stat) => <UpgradeCard key={stat.label} stat={stat} />)}
          </div>

          <div ref={chipRowRef} style={{ display: 'flex', justifyContent: 'center', gap: compact ? '8px' : '10px', flexWrap: 'wrap' }}>
            {[
              { label: '1 digital twin', accent: '#C9A96E' },
              { label: 'Every campaign', accent: '#4A9EFF' },
              { label: 'Forever reusable', accent: '#A78BFA' },
            ].map(({ label, accent }) => (
              <div key={label} style={{ padding: '7px 14px', borderRadius: '999px', border: `1px solid ${accent}22`, background: `${accent}0d`, color: 'rgba(237,233,227,0.65)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800 }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reveal curtain */}
      <div ref={revealCurtainRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20,
        background: 'radial-gradient(ellipse 70% 42% at 50% 58%, rgba(201,169,110,0.12), transparent 58%), linear-gradient(180deg, rgba(2,2,8,1) 0%, rgba(2,2,8,0.98) 58%, rgba(2,2,8,0.94) 100%)',
      }} />
    </section>
  );
}