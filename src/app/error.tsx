'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function AppError({
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
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{
        background:
          'radial-gradient(circle at 50% 18%, rgba(201,169,110,0.1) 0%, rgba(201,169,110,0.02) 25%, transparent 55%), linear-gradient(180deg, #04040a 0%, #06060d 45%, #05050a 100%)',
      }}
    >
      <div
        className="w-full max-w-xl rounded-[28px] border p-8 text-center sm:p-10"
        style={{
          borderColor: 'rgba(201,169,110,0.16)',
          background: 'rgba(10,10,18,0.82)',
          boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-primary/75">Something Broke</div>
        <h1 className="text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">
          The page hit an unexpected error.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-foreground/62 sm:text-base">
          The route did not finish rendering cleanly. You can retry the same page or jump back to the home page.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-full bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/78"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
