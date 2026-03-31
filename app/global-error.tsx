'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f2f8f7', color: '#10221f' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
          <section
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#ffffff',
              border: '1px solid #cfe3de',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h1 style={{ marginTop: 0 }}>Application Error</h1>
            <p>An unexpected error occurred. Please retry.</p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#0d9488',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Reload
            </button>
            {process.env.NODE_ENV !== 'production' && error?.message ? (
              <pre
                style={{
                  marginTop: '16px',
                  background: '#e8f3f1',
                  padding: '12px',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {error.message}
              </pre>
            ) : null}
          </section>
        </main>
      </body>
    </html>
  );
}
