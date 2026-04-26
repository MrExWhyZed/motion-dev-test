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

        /* ── Scroll: pin → darken scrim → reveal CTA ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
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
        style={{ height: '100vh', position: 'relative', background: '#000' }}
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
              padding: '0 1.5rem',
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
                fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
                fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.93,
                color: '#EDE9E3', margin: '0 0 1.4rem',
              }}>
                Let&apos;s Build Your{' '}
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #B8935A 0%, #E8D4A0 45%, #D4B87A 75%, #C9A96E 100%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '0.08em',
                }}>
                  Product
                </span>
              </h2>

              <p style={{
                fontSize: 'clamp(0.82rem, 1.5vw, 1rem)',
                color: 'rgba(237,233,227,0.42)', lineHeight: 1.85, fontWeight: 300,
                maxWidth: '420px', margin: '0 auto 2.6rem', letterSpacing: '0.01em',
              }}>
                Create once. Scale infinitely. Your product deserves a visual
                identity as limitless as your ambition.
              </p>

              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="https://app.motiongraceco.com/"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '0.9rem 2.4rem', borderRadius: '9999px',
                    background: 'rgba(237,233,227,0.06)',
                    backdropFilter: 'blur(16px) saturate(1.2)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                    border: '1px solid rgba(237,233,227,0.14)',
                    color: 'rgba(237,233,227,0.88)',
                    fontSize: '10px', fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    textDecoration: 'none', transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(237,233,227,0.12)'; el.style.borderColor = 'rgba(237,233,227,0.28)'; el.style.color = '#fff'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(237,233,227,0.06)'; el.style.borderColor = 'rgba(237,233,227,0.14)'; el.style.color = 'rgba(237,233,227,0.88)'; }}
                >
                  Add Project
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

              {/* Trust signals */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.75rem', justifyContent: 'center', marginTop: '2.8rem' }}>
                {['12,400+ Assets Delivered', '5-Day Turnaround', 'No Shoot Required'].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(201,169,110,0.55)' }} />
                    <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.32)' }}>{s}</span>
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
      `}</style>
    </>
  );
}
