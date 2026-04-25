'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background:
            'radial-gradient(circle at 50% 18%, rgba(201,169,110,0.1) 0%, rgba(201,169,110,0.02) 25%, transparent 55%), linear-gradient(180deg, #04040a 0%, #06060d 45%, #05050a 100%)',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: '#ede9e3',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '760px',
              borderRadius: '28px',
              border: '1px solid rgba(201,169,110,0.16)',
              background: 'rgba(10,10,18,0.84)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
              backdropFilter: 'blur(18px)',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                marginBottom: '16px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(201,169,110,0.75)',
              }}
            >
              Global Error
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.05em',
              }}
            >
              The app ran into an unexpected problem.
            </h1>
            <p
              style={{
                margin: '20px auto 0',
                maxWidth: '560px',
                color: 'rgba(237,233,227,0.62)',
                lineHeight: 1.8,
                fontSize: '15px',
              }}
            >
              This is the fallback for app-level failures. You can retry the render or go back to the homepage.
            </p>

            <div
              style={{
                marginTop: '32px',
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={reset}
                style={{
                  border: 'none',
                  borderRadius: '999px',
                  background: '#c9a96e',
                  color: '#09090f',
                  padding: '14px 22px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(237,233,227,0.8)',
                  padding: '14px 22px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
