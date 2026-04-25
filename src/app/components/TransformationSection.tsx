'use client';

import React, { useEffect, useRef, useState } from 'react';

type Plan = {
  id: string;
  name: string;
  price: string;
  accent: string;
  badge: string | null;
  line: string;
  metrics: { value: string; label: string }[];
  features: string[];
};

type UpgradeStat = {
  label: string;
  before: string;
  after: string;
  accent: string;
  kicker: string;
};

const plans: Plan[] = [
  {
    id: 'essentials',
    name: 'The Essentials',
    price: '₹34,999',
    accent: '#C9A96E',
    badge: null,
    line: 'Fast premium launch assets.',
    metrics: [
      { value: '20', label: 'PNGs' },
      { value: '1', label: 'Loop' },
    ],
    features: ['Digital twin included', 'Studio or virtual set', 'Commerce-ready output'],
  },
  {
    id: 'viral',
    name: 'The Viral Impact',
    price: '₹74,999',
    accent: '#4A9EFF',
    badge: 'Signature',
    line: 'Hero motion plus launch depth.',
    metrics: [
      { value: '40', label: 'Stills' },
      { value: '1', label: 'AR Asset' },
    ],
    features: ['High-energy campaign film', 'Action still pack', 'Digital twin included'],
  },
];

const upgradeStats: UpgradeStat[] = [
  { label: 'Timeline', before: '6 weeks', after: '5 days', accent: '#C9A96E', kicker: '12x faster' },
  { label: 'Spend', before: '$80k', after: '$8k', accent: '#4A9EFF', kicker: '90% leaner' },
  { label: 'Volume', before: '20', after: '100+', accent: '#8B5CF6', kicker: '5x output' },
  { label: 'Changes', before: 'Reshoots', after: 'Instant', accent: '#34D399', kicker: 'No drag' },
];

const sceneParticles = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${(index * 6.7 + 8) % 100}%`,
  top: `${(index * 11.4 + 6) % 100}%`,
  size: index % 4 === 0 ? 3 : index % 3 === 0 ? 2 : 1.4,
  duration: 8 + (index % 5) * 1.4,
  delay: index * 0.42,
  color:
    index % 3 === 0
      ? 'rgba(201,169,110,0.5)'
      : index % 3 === 1
        ? 'rgba(74,158,255,0.42)'
        : 'rgba(237,233,227,0.18)',
}));

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

function useCardTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    active: false,
  });

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setState({
      rotateX: (0.5 - y) * intensity,
      rotateY: (x - 0.5) * intensity,
      glowX: x * 100,
      glowY: y * 100,
      active: true,
    });
  };

  const onMouseLeave = () => {
    setState({
      rotateX: 0,
      rotateY: 0,
      glowX: 50,
      glowY: 50,
      active: false,
    });
  };

  return { ref, state, onMouseMove, onMouseLeave };
}

const PricingCard = React.memo(function PricingCard({ plan }: { plan: Plan }) {
  const { ref, state, onMouseMove, onMouseLeave } = useCardTilt();

  return (
    <div data-gsap-card="pricing" style={{ height: '100%' }}>
      <div style={{ perspective: '1600px', height: '100%' }}>
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid transparent',
            background: `
              linear-gradient(180deg, rgba(10,10,18,0.94), rgba(4,4,10,0.98)) padding-box,
              linear-gradient(145deg, rgba(255,255,255,0.08), ${plan.accent}${plan.badge ? '55' : '26'}, rgba(255,255,255,0.03)) border-box
            `,
            boxShadow: state.active
              ? `0 30px 62px rgba(0,0,0,0.44), 0 18px 42px ${plan.accent}18`
              : `0 22px 48px rgba(0,0,0,0.34)`,
            transform: `perspective(1600px) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) translateY(${state.active ? -5 : 0}px)`,
            transition: state.active
              ? 'transform 140ms ease, box-shadow 220ms ease'
              : 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms ease',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at ${state.glowX}% ${state.glowY}%, ${plan.accent}18 0%, transparent 35%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-18%',
                left: '-12%',
                width: '42%',
                height: '138%',
                background: `linear-gradient(90deg, transparent 0%, ${plan.accent}${plan.badge ? '18' : '12'} 48%, transparent 100%)`,
                filter: 'blur(10px)',
                animation: `light-sweep ${plan.badge ? '5.6s' : '7.2s'} ease-in-out infinite`,
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${plan.accent}88 50%, transparent)`,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start' }}>
              <div>
                <div
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: `${plan.accent}aa`,
                    fontWeight: 800,
                    marginBottom: '9px',
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(1.65rem, 2.6vw, 2.55rem)',
                    fontWeight: 900,
                    lineHeight: 0.94,
                    letterSpacing: '-0.05em',
                    color: '#F7F1E2',
                    marginBottom: '6px',
                  }}
                >
                  {plan.price}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(237,233,227,0.54)', lineHeight: 1.55 }}>
                  {plan.line}
                </div>
              </div>

              {plan.badge ? (
                <span
                  style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    background: `${plan.accent}16`,
                    border: `1px solid ${plan.accent}2e`,
                    color: plan.accent,
                    fontSize: '8px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    boxShadow: `0 0 22px ${plan.accent}14`,
                  }}
                >
                  {plan.badge}
                </span>
              ) : null}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px',
              }}
            >
              {plan.metrics.map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    borderRadius: '16px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${plan.accent}16`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F7F1E2', marginBottom: '2px' }}>
                    {metric.value}
                  </div>
                  <div
                    style={{
                      fontSize: '8px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: `${plan.accent}88`,
                    }}
                  >
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingTop: '4px',
              }}
            >
              {plan.features.map((feature) => (
                <div key={feature} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '999px',
                      background: plan.accent,
                      boxShadow: `0 0 14px ${plan.accent}55`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'rgba(237,233,227,0.72)', lineHeight: 1.45 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.3)' }}>
                Twin setup included
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '999px',
                  border: `1px solid ${plan.accent}24`,
                  background: `${plan.accent}10`,
                  color: plan.accent,
                  fontSize: '8px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  boxShadow: `0 0 18px ${plan.accent}12`,
                }}
              >
                Get started
                <span style={{ fontSize: '10px', lineHeight: 1 }}>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const UpgradeCard = React.memo(function UpgradeCard({ stat }: { stat: UpgradeStat }) {
  return (
    <div data-gsap-card="upgrade">
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: '1px solid transparent',
          background: `
            linear-gradient(180deg, rgba(9,9,15,0.95), rgba(5,5,10,0.98)) padding-box,
            linear-gradient(145deg, rgba(255,255,255,0.08), ${stat.accent}26, rgba(255,255,255,0.03)) border-box
          `,
          padding: '16px',
          boxShadow: '0 18px 36px rgba(0,0,0,0.26)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 18% 12%, ${stat.accent}16 0%, transparent 48%)`,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                fontSize: '8px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: `${stat.accent}aa`,
                fontWeight: 800,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                padding: '5px 7px',
                borderRadius: '999px',
                border: `1px solid ${stat.accent}28`,
                background: `${stat.accent}12`,
                color: stat.accent,
                fontSize: '8px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 800,
              }}
            >
              {stat.kicker}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', gap: '10px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '4px' }}>
                Before
              </div>
              <div
                style={{
                  fontSize: '0.98rem',
                  color: 'rgba(255,255,255,0.34)',
                  textDecoration: 'line-through',
                  textDecorationColor: 'rgba(255,90,90,0.34)',
                }}
              >
                {stat.before}
              </div>
            </div>

            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${stat.accent}16`,
                border: `1px solid ${stat.accent}2b`,
                color: stat.accent,
                boxShadow: `0 0 18px ${stat.accent}16`,
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              →
            </div>

            <div>
              <div style={{ fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: `${stat.accent}88`, marginBottom: '4px' }}>
                After
              </div>
              <div style={{ fontSize: '1.12rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#F7F1E2' }}>
                {stat.after}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '14px',
              height: '1px',
              background: `linear-gradient(90deg, ${stat.accent}40, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default function TransformationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pricingSceneRef = useRef<HTMLDivElement | null>(null);
  const upgradeSceneRef = useRef<HTMLDivElement | null>(null);
  const pricingGlowRef = useRef<HTMLDivElement | null>(null);
  const upgradeGlowRef = useRef<HTMLDivElement | null>(null);
  const ringsRef = useRef<HTMLDivElement | null>(null);
  const pricingHeaderRef = useRef<HTMLDivElement | null>(null);
  const upgradeHeaderRef = useRef<HTMLDivElement | null>(null);
  const chipRowRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const progressDotRef = useRef<HTMLDivElement | null>(null);
  const compact = useCompactLayout();

  useEffect(() => {
    if (!sectionRef.current || !pricingSceneRef.current || !upgradeSceneRef.current) return;
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

      const pricingScene = pricingSceneRef.current;
      const upgradeScene = upgradeSceneRef.current;
      const pricingCards = Array.from(pricingScene.querySelectorAll<HTMLElement>('[data-gsap-card="pricing"]'));
      const upgradeCards = Array.from(upgradeScene.querySelectorAll<HTMLElement>('[data-gsap-card="upgrade"]'));
      const pricingCopy = pricingHeaderRef.current ? Array.from(pricingHeaderRef.current.children) as HTMLElement[] : [];
      const upgradeCopy = upgradeHeaderRef.current ? Array.from(upgradeHeaderRef.current.children) as HTMLElement[] : [];
      const chips = chipRowRef.current ? Array.from(chipRowRef.current.children) as HTMLElement[] : [];
      const progressFill = progressFillRef.current;
      const progressDot = progressDotRef.current;

      const ctx = gsap.context(() => {
        gsap.set(pricingScene, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(upgradeScene, { autoAlpha: 0, y: 92, scale: 0.955 });
        gsap.set(pricingCopy, { autoAlpha: 0, y: 24, filter: 'blur(10px)' });
        gsap.set(upgradeCopy, { autoAlpha: 0, y: 26, filter: 'blur(10px)' });
        gsap.set(pricingCards, { y: 64, autoAlpha: 0, rotateX: -10, transformOrigin: '50% 100%' });
        gsap.set(upgradeCards, { y: 56, autoAlpha: 0, scale: 0.94, rotateX: -8, transformOrigin: '50% 100%' });
        gsap.set(chips, { autoAlpha: 0, y: 20, filter: 'blur(10px)' });
        if (pricingGlowRef.current) gsap.set(pricingGlowRef.current, { opacity: 0.74, scale: 1 });
        if (upgradeGlowRef.current) gsap.set(upgradeGlowRef.current, { opacity: 0.1, scale: 0.92 });
        if (progressFill) gsap.set(progressFill, { scaleY: 0.12, transformOrigin: '50% 100%' });
        if (progressDot) gsap.set(progressDot, { yPercent: 0 });

        if (ringsRef.current) {
          gsap.to(ringsRef.current, {
            rotation: 360,
            duration: 44,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
          });
        }

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: compact ? '+=190%' : '+=175%',
            scrub: 1.45,
            pin: true,
            anticipatePin: 1.2,
          },
        });

        tl.to(pricingCopy, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.42,
          stagger: 0.08,
        }, 0.02)
          .to(pricingCards, {
          y: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.56,
          stagger: 0.12,
        }, 0.08)
          .to(pricingScene, {
            y: -30,
            scale: 0.968,
            autoAlpha: 0.16,
            filter: 'blur(3px)',
            duration: 0.38,
            ease: 'power2.inOut',
          }, 0.62)
          .to(pricingCopy, {
            y: -30,
            autoAlpha: 0,
            filter: 'blur(12px)',
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.in',
          }, 0.64)
          .to(pricingCards, {
            y: -34,
            autoAlpha: 0,
            rotateX: 10,
            stagger: 0.06,
            duration: 0.3,
            ease: 'power2.in',
          }, 0.68)
          .to(upgradeScene, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
          }, 0.74)
          .to(upgradeCopy, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.4,
            stagger: 0.07,
          }, 0.8)
          .to(upgradeCards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            stagger: 0.08,
            duration: 0.46,
          }, 0.84)
          .to(chips, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.28,
            stagger: 0.06,
          }, 0.84);

        if (progressFill) {
          tl.to(progressFill, {
            scaleY: 0.46,
            duration: 0.5,
            ease: 'power2.out',
          }, 0.14)
            .to(progressFill, {
              scaleY: 1,
              duration: 0.46,
              ease: 'power2.out',
            }, 0.84);
        }

        if (progressDot) {
          tl.to(progressDot, {
            yPercent: compact ? 56 : 68,
            duration: 0.44,
            ease: 'power2.out',
          }, 0.84);
        }

        if (pricingGlowRef.current && upgradeGlowRef.current) {
          tl.to(pricingGlowRef.current, {
            opacity: 0.08,
            scale: 1.18,
            duration: 0.4,
            ease: 'power2.inOut',
          }, 0.62)
            .to(upgradeGlowRef.current, {
              opacity: 0.88,
              scale: 1.06,
              duration: 0.48,
              ease: 'power2.out',
            }, 0.78);
        }
      }, sectionRef);

      cleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [compact]);

  return (
    <section
      ref={sectionRef}
      data-gsap-section="sticky"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #030308 0%, #05050b 42%, #04040a 100%)',
      }}
    >
      <div
        className="noise-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        ref={ringsRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.18,
        }}
      >
        <div
          style={{
            width: compact ? '74vw' : '56vw',
            height: compact ? '74vw' : '56vw',
            maxWidth: '860px',
            maxHeight: '860px',
            borderRadius: '999px',
            border: '1px solid rgba(201,169,110,0.08)',
            borderStyle: 'dashed',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: compact ? '54vw' : '40vw',
            height: compact ? '54vw' : '40vw',
            maxWidth: '620px',
            maxHeight: '620px',
            borderRadius: '999px',
            border: '1px solid rgba(74,158,255,0.08)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {sceneParticles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '999px',
              background: particle.color,
              boxShadow: particle.color.includes('201,169,110')
                ? '0 0 8px rgba(201,169,110,0.48)'
                : particle.color.includes('74,158,255')
                  ? '0 0 7px rgba(74,158,255,0.4)'
                  : 'none',
              animation: `float-gentle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      <div
        ref={pricingGlowRef}
        style={{
          position: 'absolute',
          inset: '-12%',
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 52% at 50% 34%, rgba(201,169,110,0.1) 0%, transparent 58%)',
          filter: 'blur(24px)',
        }}
      />
      <div
        ref={upgradeGlowRef}
        style={{
          position: 'absolute',
          inset: '-12%',
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 56% at 50% 52%, rgba(74,158,255,0.1) 0%, transparent 58%)',
          filter: 'blur(24px)',
        }}
      />

      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.035,
          pointerEvents: 'none',
        }}
      >
        {[14, 26, 38, 50, 62, 74, 86].map((y) => (
          <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="white" strokeWidth="1" />
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: compact ? '20px 18px' : '26px 32px',
          left: 0,
          right: 0,
        }}
      >
        {!compact ? (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '7px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.28)', fontWeight: 800 }}>
                Pricing
              </span>
              <span style={{ fontSize: '7px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.28)', fontWeight: 800 }}>
                Upgrade
              </span>
            </div>
            <div
              style={{
                position: 'relative',
                width: '2px',
                height: '116px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                ref={progressFillRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: '50% 100%',
                  background: 'linear-gradient(180deg, rgba(201,169,110,0.95), rgba(74,158,255,0.95))',
                }}
              />
              <div
                ref={progressDotRef}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#F7F1E2',
                  boxShadow: '0 0 16px rgba(255,255,255,0.45)',
                  transform: 'translate(-50%, 0)',
                }}
              />
            </div>
          </div>
        ) : null}

        <div
          ref={pricingSceneRef}
          style={{
            position: 'absolute',
            inset: compact ? '20px 18px' : '26px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: compact ? '18px' : '22px',
          }}
        >
          <div ref={pricingHeaderRef} style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div style={{ width: '32px', height: '1px', background: 'rgba(201,169,110,0.4)' }} />
              <span style={{ fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.74)', fontWeight: 800 }}>
                Own the twin
              </span>
              <div style={{ width: '32px', height: '1px', background: 'rgba(201,169,110,0.4)' }} />
            </div>
            <h2
              style={{
                fontSize: compact ? 'clamp(1.55rem, 7vw, 2.05rem)' : 'clamp(2rem, 4.8vw, 3.4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.05em',
                fontWeight: 900,
                color: '#F7F1E2',
                margin: '0 0 10px',
              }}
            >
              Premium packages,
              <span
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #F5E5C1 0%, #C9A96E 34%, #68B4FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                built like the rest of the story.
              </span>
            </h2>
            <p
              style={{
                fontSize: compact ? '11px' : '12px',
                lineHeight: 1.6,
                color: 'rgba(237,233,227,0.42)',
                maxWidth: '34ch',
                margin: '0 auto',
              }}
            >
              Luxury motion, cleaner scale, one owned production system.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: compact ? '1fr' : 'repeat(2, minmax(0, 1fr))',
              gap: compact ? '12px' : '18px',
              alignItems: 'stretch',
              maxWidth: '1080px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        <div
          ref={upgradeSceneRef}
          style={{
            position: 'absolute',
            inset: compact ? '20px 18px' : '26px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: compact ? '18px' : '22px',
          }}
        >
          <div ref={upgradeHeaderRef} style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div style={{ width: '32px', height: '1px', background: 'rgba(74,158,255,0.42)' }} />
              <span style={{ fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(74,158,255,0.74)', fontWeight: 800 }}>
                The upgrade
              </span>
              <div style={{ width: '32px', height: '1px', background: 'rgba(74,158,255,0.42)' }} />
            </div>
            <h2
              style={{
                fontSize: compact ? 'clamp(1.55rem, 7vw, 2.05rem)' : 'clamp(2rem, 4.8vw, 3.4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.05em',
                fontWeight: 900,
                color: '#F7F1E2',
                margin: '0 0 10px',
              }}
            >
              From production drag
              <span
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #F5E5C1 0%, #C9A96E 24%, #68B4FF 72%, #9A7BFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                to owned velocity.
              </span>
            </h2>
            <p
              style={{
                fontSize: compact ? '11px' : '12px',
                lineHeight: 1.6,
                color: 'rgba(237,233,227,0.42)',
                maxWidth: '32ch',
                margin: '0 auto',
              }}
            >
              Less friction. More output. Every campaign stays in the same premium world.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: compact ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
              gap: compact ? '10px' : '12px',
              maxWidth: '1080px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {upgradeStats.map((stat) => (
              <UpgradeCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div
            ref={chipRowRef}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: compact ? '8px' : '12px',
              flexWrap: 'wrap',
            }}
          >
            {['1 twin', 'Every campaign', 'Forever reusable'].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: '8px 12px',
                  borderRadius: '999px',
                  border: index === 1 ? '1px solid rgba(74,158,255,0.24)' : '1px solid rgba(201,169,110,0.2)',
                  background: index === 1 ? 'rgba(74,158,255,0.08)' : 'rgba(201,169,110,0.08)',
                  color: 'rgba(237,233,227,0.72)',
                  fontSize: '8px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
