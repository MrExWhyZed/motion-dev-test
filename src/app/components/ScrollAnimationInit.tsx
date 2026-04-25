'use client';

import { useEffect } from 'react';

export default function ScrollAnimationInit() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let teardown = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'DOMContentLoaded,load,visibilitychange',
      });

      const ctx = gsap.context(() => {
        gsap.fromTo(
          'header',
          { autoAlpha: 0, y: -18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );

        const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
        reveals.forEach((element) => {
          const type = element.dataset.reveal ?? 'up';
          const delay = Number(element.dataset.delay ?? 0) / 1000;
          const fromVars =
            type === 'left'
              ? { autoAlpha: 0, x: -36, y: 0, scale: 1 }
              : type === 'right'
                ? { autoAlpha: 0, x: 36, y: 0, scale: 1 }
                : type === 'scale'
                  ? { autoAlpha: 0, x: 0, y: 18, scale: 0.94 }
                  : { autoAlpha: 0, x: 0, y: 34, scale: 1 };

          gsap.fromTo(
            element,
            {
              ...fromVars,
              filter: 'blur(10px)',
              willChange: 'transform, opacity, filter',
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.15,
              delay,
              ease: 'power3.out',
              clearProps: 'willChange',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });

        const sections = gsap.utils.toArray<HTMLElement>('[data-gsap-section]');
        sections.forEach((section, index) => {
          const mode = section.dataset.gsapSection ?? 'default';
          const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-gsap-card]'));
          const media = Array.from(section.querySelectorAll<HTMLElement>('[data-gsap-media]'));
          const glow = section.querySelector<HTMLElement>('[data-gsap-glow]');

          if (mode !== 'sticky' && mode !== 'hero') {
            gsap.fromTo(
              section,
              { autoAlpha: 0.72, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                clearProps: 'transform',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 82%',
                  once: true,
                },
              }
            );
          }

          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              {
                autoAlpha: 0,
                y: 24,
                scale: 0.985,
                filter: 'blur(8px)',
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 74%',
                  once: true,
                },
              }
            );
          }

          media.forEach((element) => {
            const speed = Number(element.dataset.gsapMedia ?? 10);
            gsap.to(element, {
              yPercent: speed,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            });
          });

          if (glow) {
            gsap.fromTo(
              glow,
              { opacity: 0.45, scale: 0.94 },
              {
                opacity: 1,
                scale: 1.06,
                duration: 2.4,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.08,
              }
            );
          }
        });

        gsap.utils.toArray<HTMLElement>('[data-gsap-button]').forEach((button, index) => {
          gsap.fromTo(
            button,
            { autoAlpha: 0, y: 18, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              delay: index * 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: button,
                start: 'top 92%',
                once: true,
              },
            }
          );
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      teardown = () => {
        ctx.revert();
      };
    })();

    return () => {
      mounted = false;
      teardown();
    };
  }, []);

  return null;
}
