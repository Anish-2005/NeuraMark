export default function Loading() {
  return (
    <main className="min-h-[60vh] w-full flex items-center justify-center px-4 py-10">
      <section className="skeu-card-static rounded-2xl p-6 text-center max-w-sm w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)] mx-auto mb-3" />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Loading...
        </p>
      </section>
    </main>
  );
}
