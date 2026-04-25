'use client';

import React, { useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

export default function CTASection() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!bgRef.current) return;
        const rect = bgRef.current.closest('section')?.getBoundingClientRect();
        if (!rect) return;
        const offset = -rect.top * 0.18;
        bgRef.current.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="cta"
      data-gsap-section="default"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 sm:px-10 py-28 sm:py-40">

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
          className="absolute inset-0 animate-breathe"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)'
          }} />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border border-primary/5 animate-rotate-slow"
          style={{ borderStyle: 'dashed' }} />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] rounded-full border border-primary/3"
          style={{ animation: 'rotate-slow 50s linear infinite reverse' }} />
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
            className="group relative px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground bg-primary hover:opacity-95 transition-all duration-700 animate-pulse-gold overflow-hidden">
            <span className="relative z-10">Add Project</span>
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 left-0 w-1/4 h-full bg-gold-shimmer animate-light-sweep" />
            </div>
          </Link>

          <button
            data-gsap-button="secondary"
            onClick={() => {
              document.querySelector('#showreel')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 border border-foreground/12 hover:border-primary/30 hover:text-foreground hover:bg-white/3 transition-all duration-700">
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
          className="px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground bg-primary shadow-2xl animate-pulse-gold">
          Add Project
        </Link>
      </div>
    </section>
  );
}
