'use client';

import { useEffect, useRef, useState } from 'react';

export const PRELOADER_DONE_EVENT  = 'motionGracePreloaderDone';
export const HERO_READY_EVENT      = 'motionGraceHeroReady';
export const HERO_VIDEO_READY_EVENT = 'motionGraceHeroVideoReady';

export default function Preloader() {
  const rootRef     = useRef<HTMLDivElement>(null);
  const whiteRef    = useRef<HTMLDivElement>(null);
  const pillRef     = useRef<HTMLDivElement>(null);
  const darkRef     = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoImgRef  = useRef<HTMLImageElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);

  // Always false on SSR; corrected client-side in useEffect to avoid hydration mismatch.
  const [skip, setSkip] = useState<boolean>(false);

  useEffect(() => {
    // Determine skip client-side only (sessionStorage not available on server).
    try {
      const storedOrigin  = sessionStorage.getItem('mg_origin');
      const currentOrigin = String(Math.round(performance.timeOrigin));

      if (storedOrigin !== currentOrigin) {
        // Real page load — update origin, show preloader
        sessionStorage.setItem('mg_origin', currentOrigin);
        sessionStorage.removeItem('mg_preloader_done');
        // skip stays false, fall through to main preloader effect
      } else {
        // SPA navigation — skip the cinematic boot sequence and let
        // route-level transitions handle the page change instead.
        setSkip(true);
        return;
      }
    } catch { /* show preloader */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skip) {
      window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
      return;
    }

    let mounted = true;

    void (async () => {
      const [{ gsap }, { CustomEase }] = await Promise.all([
        import('gsap'),
        import('gsap/CustomEase'),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(CustomEase);
      CustomEase.create('openEase', 'M0,0 C0.1,0 0.1,1 1,1');

      // ── Get pill center as % of viewport ─────────────────────────
      const getPillOrigin = (): string => {
        const pill = pillRef.current;
        if (!pill) return '50% 50%';
        const rect = pill.getBoundingClientRect();
        const cx = ((rect.left + rect.width  / 2) / window.innerWidth  * 100).toFixed(2);
        const cy = ((rect.top  + rect.height / 2) / window.innerHeight * 100).toFixed(2);
        return `${cx}% ${cy}%`;
      };

      // ── Initial states ────────────────────────────────────────────
      // Dark layer: clipped to 0 at pill center (will expand outward)
      gsap.set(darkRef.current,     { visibility: 'visible', clipPath: 'circle(0% at 50% 50%)', WebkitClipPath: 'circle(0% at 50% 50%)' });
      gsap.set(logoWrapRef.current, { autoAlpha: 0 });
      gsap.set(logoImgRef.current,  { autoAlpha: 0, scale: 0.75 });
      gsap.set(logoTextRef.current, { autoAlpha: 0, y: 10 });

      // ── Timeline ──────────────────────────────────────────────────
      const tl = gsap.timeline();

      tl
        // 1. Pill pops in
        .fromTo(pillRef.current,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.48, ease: 'back.out(1.8)' },
          0.1
        )

        // 2. Hold
        .addLabel('burst', 0.9)

        // 3. Pill pulses and fades
        .to(pillRef.current, {
          scale: 1.15, autoAlpha: 0,
          duration: 0.28, ease: 'power2.in',
        }, 'burst')

        // 4. Snap the dark layer's clip origin to the pill center
        .call(() => {
          const origin = getPillOrigin();
          gsap.set(darkRef.current, {
            clipPath: `circle(0% at ${origin})`,
            WebkitClipPath: `circle(0% at ${origin})`,
          });
        }, [], 'burst+=0.05')

        // 5. Dark circle OPENS outward from pill center
        .to(darkRef.current, {
          clipPath: 'circle(150% at 50% 50%)',
          WebkitClipPath: 'circle(150% at 50% 50%)',
          duration: 0.75,
          ease: 'openEase',
        }, 'burst+=0.07')

        // 6. White layer fades out once dark has mostly covered it
        .to(whiteRef.current, {
          autoAlpha: 0, duration: 0.2, ease: 'none',
        }, 'burst+=0.55')

        // 7. Logo reveals
        .set(logoWrapRef.current, { autoAlpha: 1 }, 'burst+=0.3')

        .to(logoImgRef.current, {
          autoAlpha: 1, scale: 1,
          duration: 0.5, ease: 'power3.out',
        }, 'burst+=0.32')

        .to(logoTextRef.current, {
          autoAlpha: 1, y: 0,
          duration: 0.4, ease: 'power2.out',
        }, 'burst+=0.46')

        // 8. Pause — wait for both animation hold AND page load before exiting
        .addLabel('readyToExit')
        .call(() => {
          let animDone  = false;
          let pageDone  = false;
          let heroReady = false;
          let videoReady = false;

          const tryExit = () => {
            if (!animDone || !pageDone || !heroReady || !videoReady) return;
            gsap.to(logoWrapRef.current, {
              autoAlpha: 0, duration: 0.5, ease: 'power2.inOut',
              onComplete: () => {
                // Mark as shown so SPA back-navigation skips it
                sessionStorage.setItem('mg_preloader_done', '1');
                sessionStorage.setItem('mg_preloader_shown', '1');
                // Fire DONE *before* the dark overlay starts fading so the
                // hero entrance animation begins while the overlay is still
                // covering the screen — zero blank-frame gap.
                window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
                gsap.to(darkRef.current, {
                  autoAlpha: 0, duration: 0.55, ease: 'power2.inOut',
                  // Small delay so hero has one frame to set its initial GSAP
                  // states before the overlay uncovers it
                  delay: 0.08,
                  onComplete: () => {
                    if (rootRef.current) {
                      rootRef.current.style.display = 'none';
                      rootRef.current.style.pointerEvents = 'none';
                    }
                  },
                });
              },
            });
          };

          // Minimum 0.6s hold after logo is visible
          gsap.delayedCall(0.6, () => { animDone = true; tryExit(); });

          // pageDone: don't gate on window.load — external scripts (analytics,
          // etc.) can delay or never fire it. We only need our own JS ready.
          // Mark done immediately; the animDone delay (0.6s) is the real hold.
          pageDone = true;
          tryExit();

          // Wait for hero section to signal it's mounted & ready to animate
          // Safety timeout: if hero never fires, exit after 1.5s anyway
          const heroReadyHandler = () => { heroReady = true; tryExit(); };
          window.addEventListener(HERO_READY_EVENT, heroReadyHandler, { once: true });
          gsap.delayedCall(1.5, () => { heroReady = true; tryExit(); });

          // Wait for the hero background video/iframe to load so we never
          // exit the preloader with a blank background behind the hero.
          // Safety timeout: 3s max — slow connections shouldn't hang forever.
          const videoReadyHandler = () => { videoReady = true; tryExit(); };
          window.addEventListener(HERO_VIDEO_READY_EVENT, videoReadyHandler, { once: true });
          gsap.delayedCall(3, () => { videoReady = true; tryExit(); });
        }, [], 'readyToExit');
    })();

    return () => { mounted = false; };
  }, [skip]);

  if (skip) return null;

  return (
    <div
      ref={rootRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden', pointerEvents: 'all' }}
    >

      {/* White phase — base layer, always visible initially */}
      <div
        ref={whiteRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Pill — opacity:0 in JSX prevents flash before GSAP runs */}
        <div
          ref={pillRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            borderRadius: '999px',
            padding: '14px 36px',
            opacity: 0,
          }}
        >
          <span style={{
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#FFFFFF',
            fontFamily: 'var(--font-inter), var(--font-sans), sans-serif',
            userSelect: 'none', whiteSpace: 'nowrap',
          }}>
            MotionGrace
          </span>
        </div>
      </div>

      {/* Dark phase — sits on top, starts clipped to 0, expands from pill */}
      <div
        ref={darkRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: '#000000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          visibility: 'hidden', // hidden until GSAP sets it visible + clip origin
        }}
      >
        <div
          ref={logoWrapRef}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoImgRef}
            src="/motion_grace_logo.png"
            alt="MotionGrace"
            style={{
              width: '110px', height: 'auto', objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              userSelect: 'none', pointerEvents: 'none',
            }}
          />
          <div
            ref={logoTextRef}
            style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: '#FFFFFF',
              fontFamily: 'var(--font-inter), var(--font-sans), sans-serif',
              userSelect: 'none', whiteSpace: 'nowrap',
            }}
          >
            MotionGrace
          </div>
          <div style={{
            width: '90px', height: '1px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '1px', overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
              animation: 'pl-shimmer 1.6s ease-in-out 0.5s forwards',
              transform: 'translateX(-120%)',
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pl-shimmer {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%);  }
        }
      `}</style>
    </div>
  );
}
