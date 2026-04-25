'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isMounted = true;

    const animate = async () => {
      const { gsap } = await import('gsap');
      if (!isMounted || !headerRef.current) return;

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
    };

    animate();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-6 sm:px-10 py-6 opacity-0"
      style={{
        background:
          'linear-gradient(to bottom, rgba(8,8,8,0.8) 0%, transparent 100%)',
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-xs font-light tracking-widest uppercase transition-colors duration-200"
        style={{ color: 'rgba(255,255,255,0.35)' }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color =
            'rgba(255,255,255,0.75)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color =
            'rgba(255,255,255,0.35)')
        }
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Home
      </Link>
    </header>
  );
}