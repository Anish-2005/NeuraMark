'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <section className="skeu-card-static max-w-xl w-full rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          The page failed to render. You can retry or go back to the homepage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" className="skeu-btn-primary rounded-xl" onClick={() => reset()}>
            Retry
          </button>
          <Link href="/" className="skeu-btn-secondary rounded-xl">
            Go Home
          </Link>
        </div>
        {process.env.NODE_ENV !== 'production' && error?.message ? (
          <p className="mt-6 text-xs text-left break-words" style={{ color: 'var(--text-muted)' }}>
            {error.message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
