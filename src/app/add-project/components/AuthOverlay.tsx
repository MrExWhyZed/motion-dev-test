'use client';

import { useRef, useEffect } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { FormValues } from './AddProjectClient';

interface AuthOverlayProps {
  isLoading: boolean;
  onGoogleSignIn: () => void;
  formRef: React.RefObject<HTMLDivElement | null>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  handleInputFocus: (el: HTMLElement | null) => void;
  handleInputBlur: (el: HTMLElement | null) => void;
}

export default function AuthOverlay({
  isLoading,
  onGoogleSignIn,
  handleInputFocus,
  handleInputBlur,
}: AuthOverlayProps) {
  const overlayPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let isMounted = true;

    const animate = async () => {
      const { gsap } = await import('gsap');
      if (!isMounted) return;

      if (overlayPanelRef.current) {
        gsap.fromTo(
          overlayPanelRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.5 }
        );
      }

      if (contentRef.current) {
        const children = contentRef.current.querySelectorAll('[data-overlay-item]');
        gsap.fromTo(
          children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.7,
          }
        );
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
    <div className="relative">
      {/* Blurred/locked form preview underneath */}
      <div
        className="select-none"
        style={{
          opacity: 0.15,
          pointerEvents: 'none',
          filter: 'blur(3px)',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        {/* Preview form fields — decorative only */}
        <div className="space-y-8">
          {(['Your full name', 'Your email address', 'Project type', 'Describe your project vision...', 'Budget range'] as const).map(
            (placeholder, idx) => (
              <div key={`preview-field-${idx}`} className="space-y-2">
                <div
                  className="h-3 w-24 rounded-sm"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                />
                <div
                  className="w-full pb-3"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <div
                    className="h-4 rounded-sm"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      width: idx === 3 ? '100%' : `${55 + idx * 8}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}

          {/* Preview button */}
          <div
            className="w-full h-12 rounded-full mt-4"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
        </div>
      </div>

      {/* Auth overlay panel — centered absolutely over the form preview */}
      <div
        ref={overlayPanelRef}
        className="absolute inset-0 flex items-center justify-center opacity-0"
        style={{ zIndex: 10 }}
      >
        <div
          ref={contentRef}
          className="w-full max-w-sm mx-auto text-center px-6 py-10 rounded-[20px]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow:
              '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
          }}
          onMouseEnter={(e) => {
            handleInputFocus(e.currentTarget as HTMLElement);
          }}
          onMouseLeave={(e) => {
            handleInputBlur(e.currentTarget as HTMLElement);
          }}
        >
          {/* Lock icon */}
          <div data-overlay-item className="flex justify-center mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(168,85,247,0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div data-overlay-item className="mb-2">
            <h2
              className="text-xl font-light tracking-wide"
              style={{ color: '#ffffff' }}
            >
              Start your project
            </h2>
          </div>

          {/* Subtitle */}
          <div data-overlay-item className="mb-8">
            <p
              className="text-sm font-light leading-relaxed tracking-wide"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {isLoading
                ? 'Checking your session...' :'Login to unlock the creative experience'}
            </p>
          </div>

          {/* Divider */}
          <div data-overlay-item className="mb-8">
            <div
              className="h-px w-16 mx-auto"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)',
              }}
            />
          </div>

          {/* Google Sign In Button */}
          <div data-overlay-item>
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-3">
                <LoadingDots />
              </div>
            ) : (
              <button
                ref={buttonRef}
                onClick={onGoogleSignIn}
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full font-medium text-sm tracking-wide transition-all duration-200"
                style={{
                  background: '#ffffff',
                  color: '#080808',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  willChange: 'transform',
                }}
                aria-label="Continue with Google"
              >
                {/* Google icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            )}
          </div>

          {/* Privacy note */}
          <div data-overlay-item className="mt-6">
            <p
              className="text-xs font-light tracking-wide"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Secure login — we never store your Google password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={`dot-${i}`}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.4)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}