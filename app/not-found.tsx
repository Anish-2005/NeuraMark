import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <section className="skeu-card-static max-w-lg w-full rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          404
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="skeu-btn-primary rounded-xl">
          Back to Home
        </Link>
      </section>
    </main>
  );
}
