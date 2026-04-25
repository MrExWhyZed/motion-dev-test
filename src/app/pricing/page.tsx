'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pricingPlans, pricingFaqs } from '@/app/pricing/pricingData';

/* ─── tiny hook ─────────────────────────────── */
function useGsapReveal(ref: React.RefObject<HTMLElement | null>, opts?: {
  delay?: number; y?: number; duration?: number; start?: string;
}) {
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cleanup = () => {};
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current!;
      gsap.fromTo(el,
        { autoAlpha: 0, y: opts?.y ?? 32, filter: 'blur(10px)' },
        {
          autoAlpha: 1, y: 0, filter: 'blur(0px)',
          duration: opts?.duration ?? 1.1,
          delay: opts?.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: opts?.start ?? 'top 86%', once: true },
        }
      );
      cleanup = () => ScrollTrigger.getAll().forEach(t => t.kill());
    })();
    return () => cleanup();
  }, []);
}

/* ─── Plan card ─────────────────────────────── */
function PlanCard({ plan, index }: { plan: typeof pricingPlans[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const target = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const current = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [live, setLive] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cleanup2 = () => {};
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(ref.current,
        { autoAlpha: 0, y: 56, rotateX: -10, transformPerspective: 1200, transformOrigin: '50% 100%' },
        {
          autoAlpha: 1, y: 0, rotateX: 0,
          duration: 1.1, delay: index * 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        }
      );
    })();
    return () => cleanup2();
  }, [index]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const animate = () => {
    const t = target.current; const c = current.current;
    c.rx = lerp(c.rx, t.rx, 0.1); c.ry = lerp(c.ry, t.ry, 0.1);
    c.gx = lerp(c.gx, t.gx, 0.1); c.gy = lerp(c.gy, t.gy, 0.1);
    setLive({ ...c, on: t.rx !== 0 || t.ry !== 0 });
    frameRef.current = requestAnimationFrame(animate);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    target.current = { rx: (0.5 - y) * 6, ry: (x - 0.5) * 6, gx: x * 100, gy: y * 100 };
  };
  const onEnter = () => { frameRef.current = requestAnimationFrame(animate); };
  const onLeave = () => {
    target.current = { rx: 0, ry: 0, gx: 50, gy: 50 };
    setTimeout(() => cancelAnimationFrame(frameRef.current), 800);
  };

  const isSignature = !!plan.badge;

  return (
    <div ref={ref} style={{ perspective: '1400px', height: '100%' }}>
      <div
        ref={tiltRef}
        onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={{
          position: 'relative', height: '100%', borderRadius: '26px', overflow: 'hidden',
          border: '1px solid transparent',
          background: `
            linear-gradient(170deg, rgba(12,12,22,0.97) 0%, rgba(6,6,14,0.99) 100%) padding-box,
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, ${plan.accent}${isSignature ? '55' : '30'} 50%, rgba(255,255,255,0.04) 100%) border-box
          `,
          boxShadow: live.on
            ? `0 40px 80px rgba(0,0,0,0.55), 0 0 60px ${plan.accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 20px 50px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)`,
          transform: `rotateX(${live.rx}deg) rotateY(${live.ry}deg) translateY(${live.on ? -6 : 0}px)`,
          transition: live.on ? 'box-shadow 200ms ease' : 'transform 600ms cubic-bezier(0.16,1,0.3,1), box-shadow 400ms ease',
        }}
      >
        {/* Follow glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${live.gx}% ${live.gy}%, ${plan.accent}22 0%, transparent 42%)`,
          opacity: live.on ? 1 : 0, transition: live.on ? 'none' : 'opacity 500ms',
        }} />
        {/* Top shine */}
        <div style={{
          position: 'absolute', top: 0, left: '12%', right: '12%', height: '1px',
          background: `linear-gradient(90deg, transparent, ${plan.accent}90, transparent)`,
        }} />
        {/* Bottom ambient */}
        <div style={{
          position: 'absolute', bottom: '-25%', left: '-10%', width: '60%', height: '60%',
          background: `radial-gradient(circle, ${plan.accent}0e 0%, transparent 70%)`,
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 26px' }}>
          {/* Name + badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.26em', textTransform: 'uppercase', color: `${plan.accent}cc`, fontWeight: 800 }}>
              {plan.name}
            </span>
            {plan.badge && (
              <span style={{
                padding: '4px 9px', borderRadius: '999px',
                background: `${plan.accent}18`, border: `1px solid ${plan.accent}35`,
                color: plan.accent, fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800,
                boxShadow: `0 0 18px ${plan.accent}20`,
              }}>{plan.badge}</span>
            )}
          </div>

          {/* Price */}
          <div style={{ fontSize: 'clamp(2.1rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.055em', color: '#F7F1E2', lineHeight: 0.92, marginBottom: '7px' }}>
            {plan.price}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(237,233,227,0.4)', marginBottom: '20px' }}>{plan.line}</div>

          {/* Divider */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, ${plan.accent}35, transparent 65%)`, marginBottom: '18px' }} />

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plan.metrics.length}, 1fr)`, gap: '8px', marginBottom: '20px' }}>
            {plan.metrics.map(m => (
              <div key={m.label} style={{
                borderRadius: '14px', padding: '11px 8px', textAlign: 'center',
                background: 'rgba(255,255,255,0.025)', border: `1px solid ${plan.accent}14`,
              }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F7F1E2', letterSpacing: '-0.03em' }}>{m.value}</div>
                <div style={{ fontSize: '7.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: `${plan.accent}88`, marginTop: '3px' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Deliverables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {plan.deliverables.map(d => (
              <div key={d} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '999px', flexShrink: 0, marginTop: '5px', background: plan.accent, boxShadow: `0 0 7px ${plan.accent}70` }} />
                <span style={{ fontSize: '11.5px', color: 'rgba(237,233,227,0.65)', lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '9px', color: 'rgba(237,233,227,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>
              {plan.turnaround}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/add-project" style={{
                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '11px 16px', borderRadius: '999px',
                background: plan.accent, color: '#04040a',
                fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 900, textDecoration: 'none',
                boxShadow: `0 8px 28px ${plan.accent}44`,
              }}>Get started</Link>
              <Link href="#compare" onClick={e => { e.preventDefault(); document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '11px 16px', borderRadius: '999px',
                border: `1px solid ${plan.accent}28`, background: 'rgba(255,255,255,0.03)',
                color: 'rgba(237,233,227,0.55)', fontSize: '9px', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none',
              }}>Compare</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Comparison row ─────────────────────────── */
const comparisonRows = [
  { label: 'Timeline', trad: '4 – 6 weeks', ess: '5 days', vir: '7 days' },
  { label: 'Assets', trad: '10 – 20 selects', ess: '20 files', vir: '40+ files' },
  { label: 'Motion', trad: 'Extra crew day', ess: '1 loop', vir: 'Hero film' },
  { label: 'Revisions', trad: 'Reshoots', ess: 'Inside the twin', vir: 'Faster pivots' },
  { label: 'Ownership', trad: 'Final edits only', ess: 'Twin + outputs', vir: 'System + outputs' },
];

/* ─── Page ─────────────────────────────────── */
export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroHeadRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  const plansLabelRef = useRef<HTMLParagraphElement>(null);
  const plansHeadRef = useRef<HTMLHeadingElement>(null);

  const compareRef = useRef<HTMLElement>(null);
  const compareHeadRef = useRef<HTMLHeadingElement>(null);
  const compareTableRef = useRef<HTMLDivElement>(null);

  const faqHeadRef = useRef<HTMLHeadingElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);

  const ctaBannerRef = useRef<HTMLDivElement>(null);

  /* stagger hero on mount */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // hero
        gsap.fromTo([heroHeadRef.current, heroSubRef.current, heroCtaRef.current],
          { autoAlpha: 0, y: 30, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.13, ease: 'power3.out', delay: 0.2 }
        );

        // section labels + heads (reveal on scroll)
        [
          [plansLabelRef.current, 0],
          [plansHeadRef.current, 0.1],
          [compareHeadRef.current, 0],
          [compareTableRef.current, 0.1],
          [faqHeadRef.current, 0],
          [faqListRef.current, 0.1],
          [ctaBannerRef.current, 0],
        ].forEach(([el, delay]) => {
          if (!el) return;
          gsap.fromTo(el,
            { autoAlpha: 0, y: 28, filter: 'blur(8px)' },
            {
              autoAlpha: 1, y: 0, filter: 'blur(0px)',
              duration: 1.0, delay: delay as number, ease: 'power3.out',
              scrollTrigger: { trigger: el as Element, start: 'top 86%', once: true },
            }
          );
        });

        // compare label
        if (plansLabelRef.current) {
          gsap.fromTo(plansLabelRef.current,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: plansLabelRef.current, start: 'top 88%', once: true } }
          );
        }
      });

      return () => ctx.revert();
    })();
  }, []);

  return (
    <main style={{ position: 'relative', background: '#020208', overflowX: 'clip' }}>
      <Header />

      {/* ── HERO ─────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '140px 24px 80px',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,169,110,0.1) 0%, transparent 55%), linear-gradient(180deg, #03030a 0%, #04040c 100%)',
      }}>
        {/* Grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}>
          <defs><pattern id="pg" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)" />
        </svg>

        <div ref={heroRef} style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <div style={{ width: '28px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
            <span style={{ fontSize: '8px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.75)', fontWeight: 800 }}>
              Pricing
            </span>
            <div style={{ width: '28px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
          </div>

          <h1 ref={heroHeadRef} style={{
            fontSize: 'clamp(2.4rem, 7vw, 5.6rem)', fontWeight: 900,
            letterSpacing: '-0.06em', lineHeight: 0.95, color: '#F7F1E2', margin: '0 0 18px',
          }}>
            Own the output.{' '}
            <span style={{
              background: 'linear-gradient(120deg, #F5E5C1 0%, #C9A96E 40%, #68B4FF 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Drop the shoot.</span>
          </h1>

          <p ref={heroSubRef} style={{
            fontSize: 'clamp(13px, 1.6vw, 15px)', lineHeight: 1.7,
            color: 'rgba(237,233,227,0.42)', maxWidth: '36ch', margin: '0 auto 32px',
          }}>
            Two packages. One digital twin. Infinite rollouts.
          </p>

          <div ref={heroCtaRef} style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/add-project" style={{
              padding: '12px 28px', borderRadius: '999px',
              background: 'rgba(201,169,110,1)', color: '#04040a',
              fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
              fontWeight: 900, textDecoration: 'none',
              boxShadow: '0 10px 32px rgba(201,169,110,0.4)',
            }}>Start a project</Link>
            <button onClick={() => document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '12px 28px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
              color: 'rgba(237,233,227,0.6)', fontSize: '9px', letterSpacing: '0.22em',
              textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
            }}>Compare plans</button>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #020208)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ── PLANS ────────────────────────────── */}
      <section data-gsap-section="default" style={{
        position: 'relative', padding: '80px 24px 96px',
        background: 'linear-gradient(180deg, #020208 0%, #030310 100%)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <p ref={plansLabelRef} style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', fontWeight: 800, marginBottom: '12px' }}>
              Public Packages
            </p>
            <h2 ref={plansHeadRef} style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900,
              letterSpacing: '-0.05em', color: '#F7F1E2', margin: 0,
            }}>
              Choose your level of rollout.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '18px', alignItems: 'stretch' }}>
            {pricingPlans.map((plan, i) => <PlanCard key={plan.id} plan={plan} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── COMPARE ──────────────────────────── */}
      <section id="compare" ref={compareRef} data-gsap-section="default" style={{
        position: 'relative', padding: '80px 24px 96px',
        background: 'linear-gradient(180deg, #030310 0%, #020208 100%)',
      }}>
        {/* Side glow */}
        <div style={{
          position: 'absolute', left: 0, top: '20%', width: '40%', height: '60%',
          background: 'radial-gradient(ellipse at 0% 50%, rgba(74,158,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(74,158,255,0.7)', fontWeight: 800, marginBottom: '12px' }}>
              Side by Side
            </p>
            <h2 ref={compareHeadRef} style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900,
              letterSpacing: '-0.05em', color: '#F7F1E2', margin: 0,
            }}>
              Traditional vs. the twin.
            </h2>
          </div>

          <div ref={compareTableRef} style={{
            borderRadius: '24px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(12px)',
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '16px 20px',
            }}>
              {['', 'Traditional', pricingPlans[0].name, pricingPlans[1].name].map((label, i) => (
                <div key={i} style={{
                  fontSize: '8px', letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 800,
                  color: i === 0 ? 'rgba(255,255,255,0.22)'
                    : i === 1 ? 'rgba(255,255,255,0.3)'
                    : i === 2 ? `${pricingPlans[0].accent}bb` : `${pricingPlans[1].accent}bb`,
                }}>{label}</div>
              ))}
            </div>

            {comparisonRows.map((row, i) => (
              <div key={row.label} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                padding: '16px 20px',
                borderBottom: i < comparisonRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(237,233,227,0.8)' }}>{row.label}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)' }}>{row.trad}</div>
                <div style={{ fontSize: '12px', color: 'rgba(237,233,227,0.7)' }}>{row.ess}</div>
                <div style={{ fontSize: '12px', color: 'rgba(237,233,227,0.7)' }}>{row.vir}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section data-gsap-section="default" style={{
        position: 'relative', padding: '80px 24px 96px',
        background: 'linear-gradient(180deg, #020208 0%, #030310 100%)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', fontWeight: 800, marginBottom: '12px' }}>
              FAQ
            </p>
            <h2 ref={faqHeadRef} style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900,
              letterSpacing: '-0.05em', color: '#F7F1E2', margin: 0,
            }}>
              Questions before you start.
            </h2>
          </div>

          <div ref={faqListRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pricingFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{
                  borderRadius: '20px', overflow: 'hidden',
                  border: `1px solid ${isOpen ? 'rgba(201,169,110,0.22)' : 'rgba(255,255,255,0.07)'}`,
                  background: isOpen ? 'rgba(201,169,110,0.04)' : 'rgba(255,255,255,0.025)',
                  transition: 'border-color 300ms, background 300ms',
                }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '16px', padding: '18px 22px', textAlign: 'left', cursor: 'pointer',
                    background: 'none', border: 'none', color: 'inherit',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#F7F1E2', letterSpacing: '-0.02em' }}>
                      {faq.question}
                    </span>
                    <span style={{
                      fontSize: '18px', lineHeight: 1, color: 'rgba(201,169,110,0.8)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1)',
                      flexShrink: 0,
                    }}>+</span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 400ms cubic-bezier(0.16,1,0.3,1), opacity 260ms ease',
                  }}>
                    <div style={{ padding: '0 22px 18px', fontSize: '13px', lineHeight: 1.75, color: 'rgba(237,233,227,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ paddingTop: '14px' }}>{faq.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────── */}
      <section data-gsap-section="default" style={{ padding: '0 24px 100px', background: '#030310' }}>
        <div ref={ctaBannerRef} style={{
          maxWidth: '1100px', margin: '0 auto', borderRadius: '28px', overflow: 'hidden',
          position: 'relative',
          border: '1px solid transparent',
          background: `
            linear-gradient(170deg, rgba(12,12,22,0.97) 0%, rgba(6,6,14,0.99) 100%) padding-box,
            linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(201,169,110,0.35) 50%, rgba(74,158,255,0.2) 100%) border-box
          `,
          padding: '56px 48px',
          textAlign: 'center',
        }}>
          {/* Glows */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '24px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
              <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.75)', fontWeight: 800 }}>
                Ready
              </span>
              <div style={{ width: '24px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900,
              letterSpacing: '-0.055em', lineHeight: 0.97, color: '#F7F1E2', margin: '0 0 14px',
            }}>
              Pick a package.{' '}
              <span style={{
                background: 'linear-gradient(120deg, #F5E5C1 0%, #C9A96E 40%, #68B4FF 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Keep building.</span>
            </h2>

            <p style={{ fontSize: '13px', color: 'rgba(237,233,227,0.38)', marginBottom: '30px', lineHeight: 1.6 }}>
              The twin stays yours. Every future campaign starts faster.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/add-project" style={{
                padding: '13px 32px', borderRadius: '999px',
                background: 'rgba(201,169,110,1)', color: '#04040a',
                fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
                fontWeight: 900, textDecoration: 'none',
                boxShadow: '0 10px 32px rgba(201,169,110,0.44)',
              }}>Add project</Link>
              <button onClick={() => document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '13px 32px', borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                color: 'rgba(237,233,227,0.55)', fontSize: '9px', letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
              }}>Compare plans</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
