'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────── data ─────────────── */

const steps = [
  {
    number: '01',
    title: 'Digital Twin',
    subtitle: 'Product Capture',
    description: 'We recreate your product with photoreal precision. Every material, every reflection, every imperfection — faithfully translated into a 3D digital master.',
    detail: 'Accurate to 0.1mm. Indistinguishable from photography.',
    accent: '#C9A96E',
    tag: 'Scan · Model · Verify',
    videoStart: 0,    // fraction of video (0–1) where this step begins
    videoEnd: 0.25,
  },
  {
    number: '02',
    title: 'Virtual Set',
    subtitle: 'World Building',
    description: 'We design dream-like environments tailored to your brand identity. From marble minimalism to otherworldly abstraction — the set exists only in our render engine.',
    detail: 'Unlimited locations. Zero location fees.',
    accent: '#A78BFF',
    tag: 'Concept · Build · Light',
    videoStart: 0.25,
    videoEnd: 0.50,
  },
  {
    number: '03',
    title: 'Action Cuts',
    subtitle: 'Infinite Output',
    description: 'We produce endless variations from a single digital master. New season? New campaign? New market? Change the world in minutes, not months.',
    detail: 'One asset. Every format. Every platform.',
    accent: '#4A9EFF',
    tag: 'Animate · Compose · Export',
    videoStart: 0.50,
    videoEnd: 0.75,
  },
  {
    number: '04',
    title: 'Final Output',
    subtitle: 'Cinematic Delivery',
    description: 'Your brand story, fully rendered and ready to deploy. Cinematic compositions delivered across every format — from social to billboard, from web to broadcast.',
    detail: 'Delivered in every format. Ready to publish.',
    accent: '#C9A96E',
    tag: 'Render · Review · Deliver',
    videoStart: 0.75,
    videoEnd: 1.0,
  },
];

const VIDEO_URL = 'https://res.cloudinary.com/ddgyx80f6/video/upload/v1777040543/process_pvakzd.mp4';

/* ─────────────── component ─────────────── */

export default function ProcessSection() {
  const outerRef    = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);

  const [activeStep,      setActiveStep]      = useState(0);
  const [scrollProgress,  setScrollProgress]  = useState(0);
  const [stepProgress,    setStepProgress]    = useState(0);
  const [videoReady,      setVideoReady]      = useState(false);
  const [sectionVisible,  setSectionVisible]  = useState(false);

  /* Scrub video to correct time on scroll */
  const scrubVideo = useCallback((raw: number) => {
    const vid = videoRef.current;
    if (!vid || !vid.duration || !isFinite(vid.duration)) return;
    const target = raw * vid.duration;
    if (Math.abs(vid.currentTime - target) > 0.05) {
      vid.currentTime = target;
    }
  }, []);

  /* Scroll handler */
  const handleScroll = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const totalScrollable = el.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const scrolled = -rect.top;
    const raw = Math.max(0, Math.min(1, scrolled / totalScrollable));
    setScrollProgress(raw);
    setSectionVisible(rect.top < window.innerHeight * 0.9);

    const stepSize = 1 / steps.length;
    const step = Math.min(steps.length - 1, Math.floor(raw * steps.length));
    const sp = Math.min(1, (raw - step * stepSize) / stepSize);
    setActiveStep(step);
    setStepProgress(sp);

    scrubVideo(raw);
  }, [scrubVideo]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Pause video — we scrub manually */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    vid.addEventListener('play', () => vid.pause());
    vid.addEventListener('loadedmetadata', () => {
      setVideoReady(true);
      vid.currentTime = 0;
    });
  }, []);

  const currentAccent = steps[activeStep].accent;

  /* progress bar width across steps */
  const progressBarWidth = steps.length <= 1
    ? 100
    : (activeStep / (steps.length - 1)) * 100 + stepProgress * (100 / (steps.length - 1));

  return (
    <section id="process" data-gsap-section="sticky" style={{ background: '#050508', position: 'relative', overflowX: 'clip' }}>

      {/* ── Section header ── */}
      <div
        className="pt-32 pb-16 px-6 sm:px-14"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-5 mb-12">
            <div style={{ width: 28, height: 1, background: 'rgba(201,169,110,0.45)' }} />
            <span style={{
              fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.6)', fontWeight: 600,
            }}>The Process</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 style={{
              fontSize: 'clamp(2.4rem,6vw,4.5rem)', fontWeight: 900,
              letterSpacing: '-0.04em', lineHeight: 0.95,
              color: '#F0EDE8',
            }}>
              From Product{' '}
              <span style={{
                background: 'linear-gradient(135deg, #9A7040 0%, #E8D4A0 40%, #C9A96E 70%, #B8935A 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>to Possibility</span>
            </h2>
            <p style={{
              fontSize: 13, lineHeight: 1.85, fontWeight: 300,
              color: 'rgba(237,233,227,0.38)', maxWidth: 320, letterSpacing: '0.01em',
            }}>
              A four-act transformation that turns your product into infinite visual stories.
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: Sticky scroll zone ── */}
      <div ref={outerRef} className="hidden lg:block relative" style={{ height: `${steps.length * 120}vh` }}>
        <div className="sticky top-0 overflow-hidden" style={{ height: '100vh', background: '#050508' }}>

          {/* Ambient colour wash */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 70% at 75% 50%, ${currentAccent}0C, transparent 60%)`,
            transition: 'background 1.4s ease',
          }} />

          {/* Fine grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(201,169,110,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.014) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }} />

          <div className="relative z-10 h-full flex flex-col max-w-[1400px] mx-auto px-14">

            {/* ── Step indicator strip ── */}
            <div className="flex items-center gap-8 pt-7 pb-6 shrink-0">
              {steps.map((s, i) => (
                <button
                  key={s.number}
                  className="flex items-center gap-3 shrink-0"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'default' }}
                >
                  {/* Number */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                    color: activeStep === i ? s.accent : i < activeStep ? 'rgba(237,233,227,0.25)' : 'rgba(237,233,227,0.1)',
                    transition: 'color 600ms ease', fontVariantNumeric: 'tabular-nums',
                  }}>{s.number}</span>
                  {/* Label */}
                  <span style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: activeStep === i ? s.accent : i < activeStep ? 'rgba(237,233,227,0.2)' : 'rgba(237,233,227,0.08)',
                    transition: 'color 600ms ease',
                  }}>{s.subtitle}</span>

                  {/* Progress line between steps */}
                  {i < steps.length - 1 && (
                    <div className="relative shrink-0" style={{ width: 48, height: 1, marginLeft: 8 }}>
                      <div className="absolute inset-0" style={{ background: 'rgba(201,169,110,0.07)' }} />
                      <div className="absolute inset-y-0 left-0" style={{
                        width: i < activeStep ? '100%' : i === activeStep ? `${stepProgress * 100}%` : '0%',
                        background: s.accent,
                        opacity: 0.5,
                        transition: i < activeStep ? 'width 400ms ease' : 'none',
                      }} />
                    </div>
                  )}
                </button>
              ))}

              {/* Step fraction */}
              <div className="ml-auto" style={{
                fontSize: 10, fontWeight: 400, letterSpacing: '0.1em',
                color: 'rgba(201,169,110,0.35)', fontVariantNumeric: 'tabular-nums',
              }}>
                <span style={{ color: currentAccent, fontWeight: 700, transition: 'color 600ms ease' }}>
                  {String(activeStep + 1).padStart(2, '0')}
                </span>
                <span style={{ margin: '0 4px' }}>/</span>
                {String(steps.length).padStart(2, '0')}
              </div>
            </div>

            {/* Hairline */}
            <div style={{ height: 1, background: 'rgba(201,169,110,0.06)', flexShrink: 0 }} />

            {/* ── Main 2-col layout ── */}
            <div className="flex-1 flex items-stretch gap-16 min-h-0 py-10">

              {/* LEFT — step content */}
              <div className="flex flex-col justify-center w-[38%] shrink-0">
                <div className="relative">
                  {steps.map((step, i) => {
                    const isActive = activeStep === i;
                    const isPast   = i < activeStep;
                    return (
                      <div
                        key={step.number}
                        className="absolute inset-x-0"
                        style={{
                          top: 0,
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? 'translateY(0px)'
                            : isPast
                              ? 'translateY(-18px)'
                              : 'translateY(22px)',
                          transition: 'opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)',
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                      >
                        {/* Tag */}
                        <div className="flex items-center gap-3 mb-8">
                          <div style={{ width: 20, height: 1, background: step.accent, opacity: 0.6 }} />
                          <span style={{
                            fontSize: 8, fontWeight: 700, letterSpacing: '0.28em',
                            textTransform: 'uppercase', color: `${step.accent}99`,
                          }}>{step.tag}</span>
                        </div>

                        {/* Large number */}
                        <div style={{
                          fontSize: 'clamp(6rem,11vw,10rem)', fontWeight: 900,
                          letterSpacing: '-0.06em', lineHeight: 0.85,
                          color: `${step.accent}10`,
                          marginBottom: '-0.15em',
                          userSelect: 'none',
                        }}>{step.number}</div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: 'clamp(2.8rem,4.8vw,5.2rem)', fontWeight: 900,
                          letterSpacing: '-0.04em', lineHeight: 0.9,
                          color: '#F0EDE8',
                          marginBottom: '1.6rem',
                          position: 'relative',
                        }}>
                          {step.title}
                          <span style={{
                            display: 'block',
                            fontSize: 'clamp(1rem,1.6vw,1.4rem)',
                            fontWeight: 300, letterSpacing: '0.01em',
                            color: 'rgba(237,233,227,0.35)', marginTop: '0.3em',
                          }}>{step.subtitle}</span>
                        </h3>

                        {/* Divider line that grows */}
                        <div style={{
                          height: 1,
                          width: `${stepProgress * 100}%`,
                          background: `linear-gradient(90deg, ${step.accent}60, transparent)`,
                          marginBottom: '1.8rem',
                          transition: 'none',
                        }} />

                        {/* Description */}
                        <p style={{
                          fontSize: 14, lineHeight: 1.85, fontWeight: 300,
                          color: 'rgba(237,233,227,0.5)', letterSpacing: '0.01em',
                          maxWidth: 400, marginBottom: '2rem',
                        }}>
                          {step.description}
                        </p>

                        {/* Detail pill */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '8px 16px', borderRadius: 999,
                          background: `${step.accent}0A`,
                          border: `1px solid ${step.accent}22`,
                        }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: step.accent, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 500, color: step.accent, letterSpacing: '0.04em' }}>
                            {step.detail}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Spacer to hold layout height */}
                  <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                    <div style={{ marginBottom: '2rem', height: 20 }} />
                    <div style={{ fontSize: 'clamp(6rem,11vw,10rem)', lineHeight: 0.85, marginBottom: '-0.15em' }}>00</div>
                    <div style={{ fontSize: 'clamp(2.8rem,4.8vw,5.2rem)', lineHeight: 0.9, marginBottom: '1.6rem' }}>
                      Digital Twin<span style={{ display: 'block', fontSize: 'clamp(1rem,1.6vw,1.4rem)', marginTop: '0.3em' }}>Product Capture</span>
                    </div>
                    <div style={{ height: 1, marginBottom: '1.8rem' }} />
                    <p style={{ fontSize: 14, lineHeight: 1.85, maxWidth: 400, marginBottom: '2rem' }}>
                      We recreate your product with photoreal precision. Every material, every reflection, every imperfection — faithfully translated into a 3D digital master.
                    </p>
                    <div style={{ height: 34 }} />
                  </div>
                </div>

                {/* Overall progress bar */}
                <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    flex: 1, height: 1, borderRadius: 999, overflow: 'hidden',
                    background: 'rgba(201,169,110,0.07)',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      width: `${progressBarWidth}%`,
                      background: `linear-gradient(90deg, ${steps[0].accent}55, ${currentAccent})`,
                      transition: 'width 100ms linear, background 800ms ease',
                      boxShadow: `0 0 10px ${currentAccent}40`,
                    }} />
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.15em',
                    color: 'rgba(201,169,110,0.3)',
                  }}>{Math.round(progressBarWidth)}%</span>
                </div>
              </div>

              {/* RIGHT — video panel */}
              <div className="flex-1 relative" style={{ minHeight: 0 }}>

                {/* Video container */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ borderRadius: 6 }}
                >
                  {/* Accent corner brackets */}
                  {[
                    'top-0 left-0',
                    'top-0 right-0',
                    'bottom-0 left-0',
                    'bottom-0 right-0',
                  ].map((pos, ci) => (
                    <div
                      key={ci}
                      className={`absolute ${pos} z-20 pointer-events-none`}
                      style={{
                        width: 18, height: 18,
                        borderTop: ci < 2 ? `1px solid ${currentAccent}50` : 'none',
                        borderBottom: ci >= 2 ? `1px solid ${currentAccent}50` : 'none',
                        borderLeft: ci % 2 === 0 ? `1px solid ${currentAccent}50` : 'none',
                        borderRight: ci % 2 === 1 ? `1px solid ${currentAccent}50` : 'none',
                        transition: 'border-color 800ms ease',
                      }}
                    />
                  ))}

                  {/* Video */}
                  <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    muted
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: `saturate(0.78) brightness(0.82)`,
                      transition: 'filter 1.2s ease',
                    }}
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to right, rgba(5,5,8,0.5) 0%, transparent 30%)',
                  }} />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to top, rgba(5,5,8,0.65) 0%, transparent 40%)',
                  }} />
                  {/* Accent tint layer */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `radial-gradient(ellipse 70% 55% at 60% 35%, ${currentAccent}12, transparent 65%)`,
                    mixBlendMode: 'screen',
                    transition: 'background 1.2s ease',
                  }} />

                  {/* Loading state */}
                  {!videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{
                      background: 'rgba(5,5,8,0.8)',
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: '1px solid rgba(201,169,110,0.15)',
                        borderTop: '1px solid rgba(201,169,110,0.6)',
                        animation: 'proc-spin 1s linear infinite',
                      }} />
                    </div>
                  )}

                  {/* Step segment indicator — thin lines at bottom */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 flex gap-1.5 pointer-events-none">
                    {steps.map((s, i) => {
                      const isCurrent = activeStep === i;
                      const isPastSeg = i < activeStep;
                      return (
                        <div key={s.number} className="flex-1 relative overflow-hidden" style={{ height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.08)' }}>
                          <div style={{
                            position: 'absolute', inset: 0,
                            width: isPastSeg ? '100%' : isCurrent ? `${stepProgress * 100}%` : '0%',
                            background: s.accent,
                            opacity: 0.8,
                            borderRadius: 1,
                            transition: isPastSeg ? 'width 300ms ease' : 'none',
                            boxShadow: isCurrent ? `0 0 8px ${s.accent}80` : 'none',
                          }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Current step label over video */}
                  <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-1 pointer-events-none">
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
                      textTransform: 'uppercase', color: `${currentAccent}90`,
                      transition: 'color 600ms ease',
                    }}>{steps[activeStep].subtitle}</span>
                    <span style={{
                      fontSize: 48, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1,
                      color: `${currentAccent}18`,
                      transition: 'color 600ms ease',
                      userSelect: 'none',
                    }}>{steps[activeStep].number}</span>
                  </div>

                  {/* Inset border glow */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    boxShadow: `inset 0 0 0 1px ${currentAccent}18`,
                    borderRadius: 6,
                    transition: 'box-shadow 800ms ease',
                  }} />
                </div>

                {/* Left accent bar */}
                <div style={{
                  position: 'absolute',
                  left: -20, top: '15%', bottom: '15%',
                  width: 1,
                  background: `linear-gradient(to bottom, transparent, ${currentAccent}40, transparent)`,
                  transition: 'background 800ms ease',
                }} />
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none" style={{
            opacity: scrollProgress < 0.03 ? 0.8 : 0,
            transition: 'opacity 600ms ease',
          }}>
            <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.4)', fontWeight: 500 }}>
              scroll to explore
            </span>
            <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)', animation: 'proc-pulse 2.2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="lg:hidden px-5 pb-28 pt-4">
        <div className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <MobileStepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes proc-pulse {
          0%, 100% { opacity: 0.8; }
          50%       { opacity: 0.2; }
        }
        @keyframes proc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────── mobile card ─────────────── */

interface StepData {
  number: string; title: string; subtitle: string; description: string;
  detail: string; accent: string; tag: string;
  videoStart: number; videoEnd: number;
}

function MobileStepCard({ step, index }: { step: StepData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 8,
        background: '#0A0A10',
        border: `1px solid ${step.accent}14`,
        padding: '28px 22px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${index * 90}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${index * 90}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 16, height: 1, background: step.accent, opacity: 0.5 }} />
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `${step.accent}80` }}>
          {step.tag}
        </span>
      </div>

      <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.85, color: `${step.accent}0E`, marginBottom: '-0.1em', userSelect: 'none' }}>
        {step.number}
      </div>

      <h3 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, color: '#F0EDE8', marginBottom: 6 }}>
        {step.title}
      </h3>
      <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(237,233,227,0.4)', letterSpacing: '0.02em', marginBottom: 20 }}>
        {step.subtitle}
      </p>

      <div style={{ height: 1, background: `linear-gradient(90deg, ${step.accent}30, transparent)`, marginBottom: 20 }} />

      <p style={{ fontSize: 13, lineHeight: 1.8, fontWeight: 300, color: 'rgba(237,233,227,0.5)', marginBottom: 20 }}>
        {step.description}
      </p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: `${step.accent}0A`, border: `1px solid ${step.accent}20` }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: step.accent, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 500, color: step.accent, letterSpacing: '0.04em' }}>{step.detail}</span>
      </div>
    </div>
  );
}
