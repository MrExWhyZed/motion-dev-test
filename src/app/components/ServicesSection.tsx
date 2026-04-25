'use client';

import React, { useEffect, useRef, useState } from 'react';

const services = [
  {
    id: 1,
    number: '01',
    title: 'Cinematic Commercials',
    description:
      'Luxury product films with full creative control. We craft 30–60 second hero spots that rival broadcast-quality campaigns — rendered entirely in CGI.',
    detail: 'No studio. No shoot day. No reshoot costs.',
    tag: 'Film & Motion',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="14.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    stats: [{ label: 'Avg. Views', value: '2.4M+' }, { label: 'Conversion Lift', value: '3x' }],
  },
  {
    id: 2,
    number: '02',
    title: 'Infinite Asset Kits',
    description:
      'One product. Endless visuals. We build a digital twin of your product and generate unlimited campaign-ready assets — every angle, every mood, every season.',
    detail: 'Deliver 100+ assets in the time a photoshoot produces 20.',
    tag: 'Scale & Volume',
    accent: '#4A9EFF',
    accentRgb: '74,158,255',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: [{ label: 'Assets / Week', value: '100+' }, { label: 'Cost vs. Shoot', value: '-70%' }],
  },
  {
    id: 3,
    number: '03',
    title: 'Interactive 3D & AR',
    description:
      'Let your customers experience products in real time. Web-based 3D viewers and AR try-on experiences that increase conversion by up to 40%.',
    detail: 'Works on any device. No app download required.',
    tag: 'AR Commerce',
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: [{ label: 'Conversion Lift', value: '+40%' }, { label: 'Return Rate Drop', value: '-25%' }],
  },
];

type Service = (typeof services)[number];

function BackgroundMesh() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerGlowRef = useRef<HTMLDivElement>(null);
  const ambientRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!hostRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const { gsap } = await import('gsap');
      if (!mounted || !hostRef.current) return;

      const host = hostRef.current;
      const pointerGlow = pointerGlowRef.current;
      const ambients = ambientRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!pointerGlow) return;

      const ctx = gsap.context(() => {
        gsap.set(pointerGlow, {
          xPercent: -50,
          yPercent: -50,
          x: host.clientWidth * 0.5,
          y: host.clientHeight * 0.5,
          autoAlpha: 0.38,
        });

        const xTo = gsap.quickTo(pointerGlow, 'x', { duration: 0.45, ease: 'power3.out' });
        const yTo = gsap.quickTo(pointerGlow, 'y', { duration: 0.45, ease: 'power3.out' });

        const handleMove = (event: MouseEvent) => {
          const rect = host.getBoundingClientRect();
          xTo(event.clientX - rect.left);
          yTo(event.clientY - rect.top);
        };

        host.addEventListener('mousemove', handleMove, { passive: true });

        ambients.forEach((ambient, index) => {
          gsap.to(ambient, {
            x: index === 0 ? 48 : index === 1 ? -54 : 34,
            y: index === 0 ? -36 : index === 1 ? 26 : -44,
            scale: index === 1 ? 1.12 : 1.08,
            duration: 6 + index * 1.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });

        cleanup = () => {
          host.removeEventListener('mousemove', handleMove);
        };
      }, host);

      const previousCleanup = cleanup;
      cleanup = () => {
        previousCleanup();
        ctx.revert();
      };
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        ref={pointerGlowRef}
        className="absolute h-[28rem] w-[28rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 35%, transparent 70%)',
          filter: 'blur(34px)',
        }}
      />

      {[
        {
          className: 'top-[10%] left-[8%] h-80 w-80',
          background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 72%)',
        },
        {
          className: 'bottom-[10%] right-[10%] h-72 w-72',
          background: 'radial-gradient(circle, rgba(74,158,255,0.045) 0%, transparent 72%)',
        },
        {
          className: 'top-[55%] left-[48%] h-60 w-60 -translate-x-1/2',
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 72%)',
        },
      ].map((ambient, index) => (
        <div
          key={index}
          ref={(element) => {
            ambientRefs.current[index] = element;
          }}
          className={`absolute rounded-full ${ambient.className}`}
          style={{
            background: ambient.background,
            filter: 'blur(40px)',
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(6,6,14,0.5) 0%, transparent 16%, transparent 84%, rgba(6,6,14,0.42) 100%)',
        }}
      />
    </div>
  );
}

function ServiceCard({
  service,
  isActive,
  onHover,
  setRef,
}: {
  service: Service;
  isActive: boolean;
  onHover: (id: number | null) => void;
  setRef: (element: HTMLDivElement | null) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<typeof import('gsap').gsap | null>(null);
  const rotateXToRef = useRef<((value: number) => unknown) | null>(null);
  const rotateYToRef = useRef<((value: number) => unknown) | null>(null);
  const glowXToRef = useRef<((value: number) => unknown) | null>(null);
  const glowYToRef = useRef<((value: number) => unknown) | null>(null);

  useEffect(() => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const { gsap } = await import('gsap');
      if (!mounted || !cardRef.current) return;

      gsapRef.current = gsap;

      const card = cardRef.current;
      const glow = glowRef.current;

      if (!glow) return;

      const ctx = gsap.context(() => {
        gsap.set(card, { transformPerspective: 1200, transformOrigin: '50% 50%' });
        gsap.set(glow, {
          xPercent: -50,
          yPercent: -50,
          x: card.clientWidth * 0.5,
          y: card.clientHeight * 0.5,
          autoAlpha: 0.48,
        });

        if (ringsRef.current) {
          gsap.to(ringsRef.current.children[0], {
            rotation: 360,
            transformOrigin: '50% 50%',
            ease: 'none',
            repeat: -1,
            duration: 22,
          });

          gsap.to(ringsRef.current.children[1], {
            rotation: -360,
            transformOrigin: '50% 50%',
            ease: 'none',
            repeat: -1,
            duration: 16,
          });
        }

        if (orbitRef.current) {
          gsap.to(orbitRef.current, {
            rotation: 360,
            transformOrigin: '50% 50%',
            ease: 'none',
            repeat: -1,
            duration: 8,
          });
        }

        rotateXToRef.current = gsap.quickTo(card, 'rotationX', {
          duration: 0.36,
          ease: 'power3.out',
        });
        rotateYToRef.current = gsap.quickTo(card, 'rotationY', {
          duration: 0.36,
          ease: 'power3.out',
        });
        glowXToRef.current = gsap.quickTo(glow, 'x', {
          duration: 0.28,
          ease: 'power3.out',
        });
        glowYToRef.current = gsap.quickTo(glow, 'y', {
          duration: 0.28,
          ease: 'power3.out',
        });
      }, card);

      cleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    const gsap = gsapRef.current;
    if (!gsap || !cardRef.current) return;

    gsap.to(cardRef.current, {
      y: isActive ? -14 : 0,
      scale: isActive ? 1.02 : 1,
      duration: 0.42,
      ease: 'power3.out',
    });

    if (ringsRef.current) {
      gsap.to(ringsRef.current, {
        autoAlpha: isActive ? 1 : 0.22,
        scale: isActive ? 1 : 0.96,
        duration: 0.42,
        ease: 'power3.out',
      });
    }
  }, [isActive]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    onHover(service.id);

    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = x / rect.width - 0.5;
    const percentY = y / rect.height - 0.5;

    rotateXToRef.current?.(-percentY * 10);
    rotateYToRef.current?.(percentX * 12);
    glowXToRef.current?.(x);
    glowYToRef.current?.(y);
  };

  const handleLeave = () => {
    onHover(null);
    rotateXToRef.current?.(0);
    rotateYToRef.current?.(0);
    if (cardRef.current) {
      glowXToRef.current?.(cardRef.current.clientWidth * 0.5);
      glowYToRef.current?.(cardRef.current.clientHeight * 0.5);
    }
  };

  return (
    <div
      ref={(element) => {
        wrapperRef.current = element;
        setRef(element);
      }}
      className="relative"
      onMouseEnter={() => onHover(service.id)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        ref={cardRef}
        className="relative h-full overflow-hidden rounded-[32px] p-8"
        style={{
          background: isActive
            ? `linear-gradient(145deg, rgba(${service.accentRgb},0.1) 0%, rgba(8,8,18,0.98) 44%, rgba(6,6,14,0.99) 100%)`
            : 'rgba(9,9,18,0.93)',
          border: isActive
            ? `1px solid rgba(${service.accentRgb},0.28)`
            : '1px solid rgba(22,22,38,1)',
          boxShadow: isActive
            ? `0 28px 80px rgba(0,0,0,0.72), 0 0 0 1px rgba(${service.accentRgb},0.08), inset 0 1px 0 rgba(${service.accentRgb},0.16)`
            : '0 12px 42px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.025)',
          willChange: 'transform',
        }}
      >
        <div ref={ringsRef} className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: '150%',
              height: '150%',
              marginLeft: '-75%',
              marginTop: '-75%',
              border: `1px dashed rgba(${service.accentRgb},0.14)`,
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: '118%',
              height: '118%',
              marginLeft: '-59%',
              marginTop: '-59%',
              border: `1px solid rgba(${service.accentRgb},0.08)`,
            }}
          />
          <div ref={orbitRef} className="absolute inset-0">
            <div
              className="absolute left-1/2 top-[11%] h-[6px] w-[6px] -translate-x-1/2 rounded-full"
              style={{
                background: service.accent,
                boxShadow: `0 0 12px ${service.accent}, 0 0 26px rgba(${service.accentRgb},0.35)`,
              }}
            />
          </div>
        </div>

        <div
          ref={glowRef}
          className="pointer-events-none absolute h-48 w-48 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${service.accentRgb},0.18) 0%, rgba(${service.accentRgb},0.04) 38%, transparent 74%)`,
            filter: 'blur(14px)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-[32px]"
          style={{
            background:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            opacity: 0.18,
          }}
        />

        <div className="relative z-10 flex h-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{
                color: service.accent,
                background: `rgba(${service.accentRgb},${isActive ? '0.13' : '0.07'})`,
                border: `1px solid rgba(${service.accentRgb},${isActive ? '0.28' : '0.14'})`,
              }}
            >
              {service.tag}
            </span>
            <span
              className="text-5xl font-black tracking-tighter"
              style={{
                color: isActive ? service.accent : 'rgba(107,107,128,0.14)',
                lineHeight: 1,
              }}
            >
              {service.number}
            </span>
          </div>

          <div
            className="flex h-13 w-13 items-center justify-center rounded-2xl"
            style={{
              width: '52px',
              height: '52px',
              background: `rgba(${service.accentRgb},${isActive ? '0.15' : '0.06'})`,
              color: isActive ? service.accent : 'var(--muted-foreground)',
              border: `1px solid rgba(${service.accentRgb},${isActive ? '0.3' : '0.08'})`,
              boxShadow: isActive ? `0 0 20px rgba(${service.accentRgb},0.18)` : 'none',
            }}
          >
            {service.icon}
          </div>

          <h3 className="text-[22px] font-extrabold tracking-tight text-foreground leading-tight">{service.title}</h3>

          <p
            className="flex-grow text-sm font-light leading-[1.88]"
            style={{
              color: isActive ? 'rgba(237,233,227,0.78)' : 'var(--muted-foreground)',
            }}
          >
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {service.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl px-4 py-3"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, rgba(${service.accentRgb},0.1) 0%, rgba(${service.accentRgb},0.04) 100%)`
                    : `rgba(${service.accentRgb},0.03)`,
                  border: `1px solid rgba(${service.accentRgb},${isActive ? '0.2' : '0.08'})`,
                }}
              >
                <p className="text-lg font-black tracking-tight" style={{ color: isActive ? service.accent : 'var(--foreground)' }}>
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p
              className="text-xs font-medium tracking-wide"
              style={{
                color: isActive ? service.accent : 'rgba(107,107,128,0.35)',
              }}
            >
              {service.detail}
            </p>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, rgba(${service.accentRgb},0.22), rgba(${service.accentRgb},0.1))`
                  : `rgba(${service.accentRgb},0.04)`,
                border: `1px solid rgba(${service.accentRgb},${isActive ? '0.34' : '0.08'})`,
                color: isActive ? service.accent : 'var(--muted-foreground)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="h-px overflow-hidden rounded-full" style={{ background: 'rgba(22,22,38,1)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: isActive ? '100%' : '36%',
                background: `linear-gradient(90deg, transparent 0%, rgba(${service.accentRgb},0.4) 20%, ${service.accent} 50%, rgba(${service.accentRgb},0.4) 80%, transparent 100%)`,
                boxShadow: isActive ? `0 0 8px rgba(${service.accentRgb},0.45)` : 'none',
                transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

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
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      const ctx = gsap.context(() => {
        if (headerRef.current) {
          gsap.fromTo(
            Array.from(headerRef.current.children),
            {
              autoAlpha: 0,
              y: 26,
              filter: 'blur(10px)',
            },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }

        gsap.fromTo(
          cards,
          {
            autoAlpha: 0,
            y: 52,
            scale: 0.96,
            filter: 'blur(12px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.05,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 68%',
              once: true,
            },
          }
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
    <section
      ref={sectionRef}
      id="services"
      data-gsap-section="default"
      className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-24"
      style={{
        background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)',
      }}
    >
      <BackgroundMesh />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-12">
          <div className="mb-6 inline-flex items-center gap-2.5">
            <div style={{ width: '24px', height: '1px', background: 'rgba(201,169,110,0.6)' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'rgba(201,169,110,0.8)' }}>
              What We Create
            </span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl text-[clamp(1.5rem,5vw,3rem)] font-black leading-[0.95] tracking-tighter">
              <span style={{ color: 'var(--foreground)' }}>Our  </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #B8935A 0%, #E8D4A0 45%, #D4B87A 75%, #C9A96E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Services.
              </span>
            </h2>

            <p className="max-w-xs text-sm font-light leading-[1.8] text-muted-foreground md:text-right">
              Three core disciplines that transform how luxury brands produce and distribute visual content.
            </p>
          </div>
        </div>

        <div className="hidden grid-cols-3 gap-6 md:grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              isActive={hovered === service.id}
              onHover={setHovered}
              setRef={(element) => {
                cardRefs.current[index] = element;
              }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 md:hidden">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-[24px] border transition-all duration-700"
              style={{
                borderColor: activeAccordion === service.id ? `${service.accent}25` : 'var(--border)',
                background:
                  activeAccordion === service.id
                    ? `linear-gradient(145deg, rgba(${service.accentRgb},0.06) 0%, var(--card) 100%)`
                    : 'var(--card)',
              }}
            >
              <button
                onClick={() => setActiveAccordion(activeAccordion === service.id ? null : service.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: `rgba(${service.accentRgb},0.12)`,
                      color: service.accent,
                      border: `1px solid rgba(${service.accentRgb},0.2)`,
                    }}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: service.accent }}>
                      {service.number} · {service.tag}
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">{service.title}</h3>
                  </div>
                </div>
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `rgba(${service.accentRgb},0.08)`,
                    border: `1px solid rgba(${service.accentRgb},0.15)`,
                    color: service.accent,
                    transform: activeAccordion === service.id ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-700 ease-in-out"
                style={{
                  maxHeight: activeAccordion === service.id ? '320px' : '0',
                }}
              >
                <div className="flex flex-col gap-4 px-5 pb-5">
                  <p className="text-sm font-light leading-[1.8] text-muted-foreground">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl px-3 py-2.5"
                        style={{
                          background: `rgba(${service.accentRgb},0.07)`,
                          border: `1px solid rgba(${service.accentRgb},0.15)`,
                        }}
                      >
                        <p className="text-base font-black" style={{ color: service.accent }}>
                          {stat.value}
                        </p>
                        <p className="text-[10px] font-medium tracking-wide text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-medium tracking-wide" style={{ color: service.accent }}>
                    {service.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
