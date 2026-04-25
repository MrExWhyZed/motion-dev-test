'use client';

import { useRef, useEffect } from 'react';

interface SuccessStateProps {
  onStartNew: () => void;
}

export default function SuccessState({ onStartNew }: SuccessStateProps) {
  const checkRef = useRef<SVGCircleElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const animate = async () => {
      const { gsap } = await import('gsap');
      if (!isMounted) return;

      // Glow pulse animation
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.3,
          scale: 1.15,
          duration: 1.8,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Check circle draw
      if (checkRef.current) {
        const circumference = 2 * Math.PI * 28;
        checkRef.current.style.strokeDasharray = `${circumference}`;
        checkRef.current.style.strokeDashoffset = `${circumference}`;

        gsap.to(checkRef.current, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'power3.inOut',
          delay: 0.4,
        });
      }
    };

    animate();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleButtonHover = async (entering: boolean) => {
    const { gsap } = await import('gsap');
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      scale: entering ? 1.02 : 1,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Success icon with glow */}
      <div className="relative mb-10">
        {/* Ambient glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(168,85,247,0.6) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
          aria-hidden="true"
        />

        {/* Outer ring */}
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.2)',
          }}
        >
          {/* Inner icon */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            aria-label="Project submitted successfully"
            role="img"
          >
            {/* Check circle */}
            <circle
              ref={checkRef}
              cx="32"
              cy="32"
              r="28"
              stroke="url(#successGrad)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Checkmark */}
            <path
              d="M21 32l8 8 14-16"
              stroke="url(#successGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="successGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h2
        className="text-3xl font-light tracking-tight mb-4"
        style={{ color: '#ffffff' }}
      >
        Brief received
      </h2>

      {/* Accent line */}
      <div
        className="w-12 h-px mb-6"
        style={{
          background: 'linear-gradient(90deg, #a855f7, #ec4899)',
        }}
        aria-hidden="true"
      />

      {/* Message */}
      <p
        className="text-base font-light leading-relaxed tracking-wide max-w-sm mb-2"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Your project brief has been submitted to the Motion Grace studio.
      </p>
      <p
        className="text-sm font-light leading-relaxed tracking-wide max-w-xs mb-12"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        Expect an initial response within 24 hours with next steps and a
        discovery call invitation.
      </p>

      {/* Details grid */}
      <div
        className="w-full max-w-xs grid grid-cols-3 gap-4 mb-12 px-2"
        role="list"
        aria-label="What happens next"
      >
        {[
          { step: '01', label: 'Brief review', sub: 'Within 24h' },
          { step: '02', label: 'Discovery call', sub: 'Day 2–3' },
          { step: '03', label: 'Proposal', sub: 'Day 5–7' },
        ].map((item) => (
          <div
            key={`step-${item.step}`}
            className="flex flex-col items-center gap-2"
            role="listitem"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
              style={{
                background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(168,85,247,0.2)',
                color: 'rgba(168,85,247,0.8)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.step}
            </div>
            <span
              className="text-xs font-medium text-center leading-tight"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {item.label}
            </span>
            <span
              className="text-xs font-light text-center"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {item.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs">
        <button
          ref={buttonRef}
          onClick={onStartNew}
          onMouseEnter={() => handleButtonHover(true)}
          onMouseLeave={() => handleButtonHover(false)}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200"
          style={{
            background: '#ffffff',
            color: '#080808',
            border: 'none',
            cursor: 'pointer',
            willChange: 'transform',
            boxShadow: '0 8px 32px rgba(255,255,255,0.1)',
          }}
          aria-label="Submit another project brief"
        >
          New project
        </button>

        <a
          href="/"
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-light tracking-wide transition-all duration-200"
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              'rgba(255,255,255,0.25)';
            (e.currentTarget as HTMLAnchorElement).style.color =
              'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLAnchorElement).style.color =
              'rgba(255,255,255,0.5)';
          }}
        >
          Back to studio
        </a>
      </div>
    </div>
  );
}