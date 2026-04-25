'use client';

import { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function HomeRouteTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const previousPathRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;

    try {
      const currentOrigin = String(Math.round(performance.timeOrigin));
      const storedOrigin = sessionStorage.getItem('mg_route_origin');

      if (storedOrigin !== currentOrigin) {
        sessionStorage.setItem('mg_route_origin', currentOrigin);
        sessionStorage.setItem('mg_last_path', pathname);
        previousPathRef.current = pathname;
        return () => {
          mounted = false;
        };
      }
    } catch {
      previousPathRef.current = pathname;
      return () => {
        mounted = false;
      };
    }

    const previousPath = previousPathRef.current ?? sessionStorage.getItem('mg_last_path');
    sessionStorage.setItem('mg_last_path', pathname);
    previousPathRef.current = pathname;

    if (
      pathname !== '/' ||
      !previousPath ||
      previousPath === '/' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return () => {
        mounted = false;
      };
    }

    void (async () => {
      const { gsap } = await import('gsap');
      const overlay = overlayRef.current;
      const topPanel = topPanelRef.current;
      const bottomPanel = bottomPanelRef.current;
      const beam = beamRef.current;
      const shell = document.querySelector<HTMLElement>('[data-page-shell="home"]');

      if (!mounted || !overlay || !topPanel || !bottomPanel) return;

      gsap.killTweensOf([overlay, topPanel, bottomPanel, beam, shell]);

      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set([topPanel, bottomPanel], { yPercent: 0 });
      if (beam) gsap.set(beam, { autoAlpha: 0.9, scaleX: 0.18 });
      if (shell) gsap.set(shell, { autoAlpha: 0, y: 34, filter: 'blur(10px)' });

      gsap.timeline({
        onComplete() {
          if (!mounted) return;
          gsap.set(overlay, { autoAlpha: 0 });
          if (shell) gsap.set(shell, { clearProps: 'opacity,transform,filter' });
        },
      })
        .to(beam, { scaleX: 1, duration: 0.26, ease: 'power2.out' }, 0)
        .to(topPanel, { yPercent: -102, duration: 1.02, ease: 'expo.inOut' }, 0.08)
        .to(bottomPanel, { yPercent: 102, duration: 1.02, ease: 'expo.inOut' }, 0.08)
        .to(shell, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.88, ease: 'power3.out' }, 0.18)
        .to(beam, { autoAlpha: 0, duration: 0.22, ease: 'power2.out' }, 0.68);
    })();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        pointerEvents: 'none',
        opacity: 0,
      }}
    >
      <div
        ref={topPanelRef}
        style={{
          position: 'absolute',
          inset: '0 0 50% 0',
          background:
            'linear-gradient(180deg, rgba(3,3,9,0.98) 0%, rgba(8,8,16,0.96) 72%, rgba(12,10,18,0.98) 100%)',
          borderBottom: '1px solid rgba(201,169,110,0.12)',
        }}
      />
      <div
        ref={bottomPanelRef}
        style={{
          position: 'absolute',
          inset: '50% 0 0 0',
          background:
            'linear-gradient(0deg, rgba(3,3,9,0.98) 0%, rgba(8,8,16,0.96) 72%, rgba(10,12,20,0.98) 100%)',
          borderTop: '1px solid rgba(104,180,255,0.12)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          opacity: 0.22,
        }}
      />
      <div
        ref={beamRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 'min(42vw, 320px)',
          height: 1,
          transform: 'translate(-50%, -50%)',
          transformOrigin: '50% 50%',
          background: 'linear-gradient(90deg, rgba(201,169,110,0), rgba(201,169,110,0.95), rgba(104,180,255,0.9), rgba(104,180,255,0))',
          boxShadow: '0 0 26px rgba(201,169,110,0.28)',
        }}
      />
    </div>
  );
}
