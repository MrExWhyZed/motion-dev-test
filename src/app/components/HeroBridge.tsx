'use client';

import React, { useEffect, useRef } from 'react';

/* ─── Descending particles that bridge hero → next section ─── */
const bridgeParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 9.3 + 3) % 96}%`,
  size: i % 2 === 0 ? 2 : 1.5,
  delay: i * 0.3,
  duration: 6 + (i % 4) * 1.2,
  color: i % 3 === 0
    ? 'rgba(201,169,110,0.6)'
    : i % 3 === 1
    ? 'rgba(74,158,255,0.4)'
    : 'rgba(139,92,246,0.35)',
}));

export default function HeroBridge() {
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bridgeRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted || !bridgeRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const bridge = bridgeRef.current;
      const particles = Array.from(bridge.querySelectorAll<HTMLElement>('[data-bridge-particle]'));

      const ctx = gsap.context(() => {
        gsap.set(bridge, { autoAlpha: 0 });
        gsap.to(bridge, {
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: bridge,
            start: 'top bottom',
            end: 'bottom center',
            scrub: 1,
          },
        });

        particles.forEach((particle, index) => {
          const { duration, delay } = bridgeParticles[index];

          gsap.set(particle, {
            y: -18,
            scale: 1,
            autoAlpha: 0,
          });

          gsap.timeline({
            repeat: -1,
            repeatDelay: 0.18,
            delay,
          })
            .to(particle, {
              autoAlpha: 1,
              duration: duration * 0.14,
              ease: 'sine.out',
            })
            .to(
              particle,
              {
                y: 196,
                scale: 0.38,
                autoAlpha: 0.46,
                duration: duration * 0.68,
                ease: 'power1.in',
              },
              '<'
            )
            .to(particle, {
              autoAlpha: 0,
              duration: duration * 0.18,
              ease: 'power1.out',
            });
        });
      }, bridge);

      cleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={bridgeRef}
      data-gsap-section="bridge"
      className="relative pointer-events-none overflow-hidden"
      style={{
        height: '180px',
        marginTop: '-180px',
        zIndex: 5,
        opacity: 0,
      }}
    >
      {/* Gradient bridge */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(4,4,10,0.6) 40%, rgba(4,4,10,0.95) 100%)',
        }}
      />

      {/* Descending particles */}
      {bridgeParticles.map((p) => (
        <div
          key={p.id}
          data-bridge-particle
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}
