'use client';

import React, { useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;

      const ctx = gsap.context(() => {
        if (bgRef.current) {
          gsap.set(bgRef.current, { yPercent: -4, scale: 1.06 });
          gsap.to(bgRef.current, {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }

        if (auraRef.current) {
          gsap.to(auraRef.current, {
            scale: 1.08,
            opacity: 0.85,
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        if (outerRingRef.current) {
          gsap.to(outerRingRef.current, {
            rotation: 360,
            duration: 38,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
          });
        }

        if (innerRingRef.current) {
          gsap.to(innerRingRef.current, {
            rotation: -360,
            duration: 30,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
          });
        }
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      data-gsap-section="default"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 sm:px-10 py-28 sm:py-40"
      style={{ background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)' }}>

      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ top: '-10%', height: '120%' }}>
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_141bf2330-1772144151607.png"
          alt="Cinematic product campaign background, dark atmospheric perfume photography, deep shadows, minimal light"
          fill
          className="object-cover object-center opacity-15"
          sizes="100vw" />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
        <div
          ref={auraRef}
          className="absolute inset-0"
          style={{
            opacity: 0.58,
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)'
          }} />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          ref={outerRingRef}
          className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border border-primary/5"
          style={{ borderStyle: 'dashed' }} />
        <div
          ref={innerRingRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] rounded-full border border-primary/3"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p
          data-reveal="up"
          className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80 mb-6">
          Ready to Begin
        </p>
        <h2
          data-reveal="up"
          data-delay="150"
          className="text-display-lg font-extrabold tracking-tighter text-foreground mb-7 leading-none">
          Let&apos;s Build Your{' '}
          <span className="text-gradient-gold block mt-1">Product</span>
        </h2>
        <p
          data-reveal="up"
          data-delay="300"
          className="text-base text-muted-foreground font-light leading-[1.9] mb-12 max-w-md mx-auto tracking-wide">
          Create once. Scale infinitely. Your product deserves a visual identity
          as limitless as your ambition.
        </p>

        <div
          data-reveal="up"
          data-delay="450"
          className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/add-project"
            data-gsap-button="primary"
            data-cursor="button"
            data-cursor-label="Start"
            className="group relative px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] overflow-hidden transition-all duration-300"
            style={{
              background: 'rgba(237, 233, 227, 0.06)',
              backdropFilter: 'blur(16px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
              border: '1px solid rgba(237, 233, 227, 0.2)',
              color: 'rgba(237,233,227,0.9)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(237,233,227,0.12)';
              el.style.borderColor = 'rgba(237,233,227,0.35)';
              el.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(237,233,227,0.06)';
              el.style.borderColor = 'rgba(237,233,227,0.2)';
              el.style.color = 'rgba(237,233,227,0.9)';
            }}>
            <span className="relative z-10">Add Project</span>
          </Link>

          <button
            data-gsap-button="secondary"
            data-cursor="button"
            data-cursor-label="Watch"
            onClick={() => {
              document.querySelector('#showreel')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300"
            style={{
              background: 'rgba(237, 233, 227, 0.03)',
              backdropFilter: 'blur(16px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
              border: '1px solid rgba(237, 233, 227, 0.1)',
              color: 'rgba(237,233,227,0.55)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'rgba(237,233,227,0.07)';
              el.style.borderColor = 'rgba(237,233,227,0.22)';
              el.style.color = 'rgba(237,233,227,0.9)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'rgba(237,233,227,0.03)';
              el.style.borderColor = 'rgba(237,233,227,0.1)';
              el.style.color = 'rgba(237,233,227,0.55)';
            }}>
            View Our Work
          </button>
        </div>

        {/* Trust signals */}
        <div
          data-reveal="up"
          data-delay="600"
          className="flex flex-wrap items-center justify-center gap-8 mt-14">
          {['12,400+ Assets Delivered', '5-Day Turnaround', 'No Shoot Required'].map((signal) => (
            <div key={signal} className="flex items-center gap-2.5">
              <div className="w-1 h-1 rounded-full bg-primary/60" />
              <span className="text-[10px] font-medium text-muted-foreground tracking-[0.15em] uppercase">{signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="sticky-cta-mobile sm:hidden">
        <Link
          href="/add-project"
          className="px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground bg-primary shadow-2xl">
          Add Project
        </Link>
      </div>
    </section>
  );
}
