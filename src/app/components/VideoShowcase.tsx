'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const VIDEO_URL = 'https://res.cloudinary.com/dsst5hzgf/video/upload/v1775637354/Linkedin_final_rfdz0t.mp4';

export default function VideoShowcase() {
  const sectionRef   = useRef<HTMLElement>(null);
  const scrimRef     = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);

  const [ctaVisible, setCtaVisible] = useState(false);

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

      if (!mounted || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const section   = sectionRef.current;
      const scrim     = scrimRef.current;
      const cta       = ctaRef.current;
      const outerRing = outerRingRef.current;
      const innerRing = innerRingRef.current;

      if (!scrim || !cta) return;

      const ctx = gsap.context(() => {

        /* ── Ring rotations ── */
        if (outerRing) gsap.to(outerRing, { rotation: 360,  duration: 38, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        if (innerRing) gsap.to(innerRing, { rotation: -360, duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

        /* ── Scroll: darken scrim → reveal CTA ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            anticipatePin: 0,
            onUpdate: (self) => {
              setCtaVisible(self.progress > 0.5);
            },
          },
        });

        /* Scrim darkens as we scroll */
        tl.fromTo(scrim,
          { opacity: 0 },
          { opacity: 1, ease: 'power1.inOut', duration: 0.5 },
          0
        );

        /* CTA fades up */
        tl.fromTo(cta,
          { opacity: 0, y: 32, filter: 'blur(16px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', ease: 'power3.out', duration: 0.5 },
          0.5
        );

      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="cta"
        data-gsap-section="default"
        style={{ height: '300vh', position: 'relative', background: '#000', isolation: 'isolate', zIndex: 0 }}
      >
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>

          {/* ── Fullscreen autoplay video ── */}
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 0,
            }}
          />

          {/* ── Scroll-driven dark scrim ── */}
          <div
            ref={scrimRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 1,
              opacity: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(2,2,10,0.85) 100%)',
            }}
          />

          {/* Gold aura glow — shows with CTA */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)',
            opacity: ctaVisible ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }} />

          {/* ── Decorative rings ── */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 3,
            opacity: ctaVisible ? 1 : 0,
            transition: 'opacity 1s ease 0.2s',
          }}>
            <div ref={outerRingRef} style={{
              width: 'min(800px, 90vw)', height: 'min(800px, 90vw)',
              borderRadius: '50%',
              border: '1px dashed rgba(201,169,110,0.07)',
            }} />
            <div ref={innerRingRef} style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(560px, 65vw)', height: 'min(560px, 65vw)',
              borderRadius: '50%',
              border: '1px solid rgba(201,169,110,0.04)',
            }} />
          </div>

          {/* ── CTA content ── */}
          <div
            ref={ctaRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
              pointerEvents: ctaVisible ? 'auto' : 'none',
              padding: '0 1.25rem',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '640px', width: '100%' }}>

              <p style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'rgba(201,169,110,0.75)',
                marginBottom: '1.4rem', fontFamily: 'var(--font-sans)',
              }}>
                Ready to Begin
              </p>

              <h2 style={{
                fontSize: 'clamp(2rem, 8vw, 5.2rem)',
                fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.93,
                color: '#EDE9E3', margin: '0 0 1.4rem',
              }}>
                Let&apos;s Build Your{' '}
                <span style={{
                  display: 'block',
                  color: '#ffffff',
                  textShadow: '0 0 30px rgba(201,89,221,0.8), 0 0 60px rgba(8,148,255,0.5), 0 0 100px rgba(255,46,84,0.3)',
                  marginTop: '0.08em',
                }}>
                  Product
                </span>
              </h2>

              <p style={{
                fontSize: 'clamp(0.78rem, 3vw, 1rem)',
                color: 'rgba(237,233,227,0.42)', lineHeight: 1.85, fontWeight: 300,
                maxWidth: '420px', margin: '0 auto 2.6rem', letterSpacing: '0.01em',
                padding: '0 0.5rem',
              }}>
                Create once. Scale infinitely. Your product deserves a visual
                identity as limitless as your ambition.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="https://app.motiongraceco.com/"
                  className="vs-add-project-btn"
                >
                  Add Project
                  <span className="vs-btn-arrow">→</span>
                </Link>

                <button
                  onClick={() => document.querySelector('#showreel')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    padding: '0.9rem 2.4rem', borderRadius: '9999px',
                    background: 'rgba(237,233,227,0.03)',
                    backdropFilter: 'blur(16px) saturate(1.2)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                    border: '1px solid rgba(237,233,227,0.08)',
                    color: 'rgba(237,233,227,0.48)',
                    fontSize: '10px', fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(237,233,227,0.08)'; el.style.borderColor = 'rgba(237,233,227,0.18)'; el.style.color = 'rgba(237,233,227,0.88)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(237,233,227,0.03)'; el.style.borderColor = 'rgba(237,233,227,0.08)'; el.style.color = 'rgba(237,233,227,0.48)'; }}
                >
                  View Our Work
                </button>
              </div>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                {['12,400+ Assets Delivered', '5-Day Turnaround', 'No Shoot Required'].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(201,169,110,0.55)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'clamp(7px, 2vw, 9px)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.32)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Scroll hint ── */}
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: ctaVisible ? 0 : 1, transition: 'opacity 0.5s ease',
            pointerEvents: 'none', zIndex: 20,
          }}>
            <span style={{ fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.3)', fontFamily: 'var(--font-sans)' }}>Scroll</span>
            <div style={{ position: 'relative', width: '1px', height: '44px', background: 'rgba(237,233,227,0.1)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '40%', background: 'rgba(237,233,227,0.5)', animation: 'vsScrollDrop 1.8s ease-in-out infinite' }} />
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes vsScrollDrop {
          0%   { top: 0;   opacity: 1; }
          70%  { top: 60%; opacity: 0.2; }
          100% { top: 0;   opacity: 1; }
        }

        /* ── Add Project button — mirrors get-started-btn ── */
        .vs-add-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.8rem;
          border-radius: 9999px;
          border: 1px solid transparent;
          background: rgba(237, 233, 227, 0.06);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          color: rgba(237,233,227,0.95);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          transform: scale(1.03);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease;
        }
        .vs-add-project-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 9999px;
          padding: 1px;
          background: linear-gradient(to right, #0894ff, #c959dd, #ff2e54, #ff9004);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.9;
        }
        .vs-add-project-btn::after {
          content: '';
          position: absolute;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 75%;
          height: 22px;
          background: linear-gradient(to right, #0894ff44, #c959dd66, #ff2e5444, #ff900433);
          filter: blur(12px);
          border-radius: 50%;
          opacity: 0.7;
          transition: all 0.4s ease;
        }
        .vs-add-project-btn:hover {
          transform: scale(1.07);
          box-shadow:
            0 0 20px rgba(8,148,255,0.35),
            0 0 40px rgba(201,89,221,0.25),
            0 0 60px rgba(255,46,84,0.2);
        }
        .vs-add-project-btn:hover::after {
          opacity: 1;
          filter: blur(20px);
          transform: translateX(-50%) scale(1.15);
        }
        .vs-btn-arrow {
          display: inline-block;
          font-size: 0.75rem;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .vs-add-project-btn:hover .vs-btn-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </>
  );
}