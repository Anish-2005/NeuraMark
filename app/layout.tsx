import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { ClientProviders } from './client-providers';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuramark.vercel.app';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NeuraMark - AI-Powered Academic Progress Tracking',
    template: '%s | NeuraMark',
  },
  description:
    'The next-generation academic tracking platform. Visualize your syllabus progress across CSE, ECE, AIML, DS and more with powerful insights.',
  keywords: [
    'academic tracker',
    'syllabus progress',
    'B.Tech',
    'student dashboard',
    'AI learning',
  ],
  authors: [{ name: 'NeuraMark' }],
  creator: 'NeuraMark',
  applicationName: 'NeuraMark',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'NeuraMark - Next-Generation Academic Tracking',
    description:
      'Visualize your academic progress, track syllabus completion, and predict academic outcomes with NeuraMark.',
    siteName: 'NeuraMark',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'NeuraMark',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraMark - Next-Generation Academic Tracking',
    description: 'Track your syllabus progress across courses and branches seamlessly.',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f8f7' },
    { media: '(prefers-color-scheme: dark)', color: '#10201d' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body
        className="font-sans antialiased text-skeu-primary min-h-screen flex flex-col bg-skeu-base"
        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] skeu-btn-primary rounded-lg px-3 py-2 text-sm"
        >
          Skip to content
        </a>
        <div id="js-app-root" className="flex-grow flex flex-col relative w-full h-full">
          <ClientProviders>
            <div id="main-content" tabIndex={-1} className="flex-grow flex flex-col relative w-full h-full">
              {children}
            </div>
          </ClientProviders>
        </div>

        <noscript>
          <style>{`
            #js-app-root { display: none !important; }
            .no-js-shell { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); }
            .no-js-wrap { max-width: 960px; margin: 0 auto; padding: 32px 20px 40px; }
            .no-js-card { background: var(--surface-raised); border: 1px solid var(--border-default); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
            .no-js-title { margin: 0 0 8px 0; font-size: 2rem; line-height: 1.2; }
            .no-js-subtitle { margin: 0; color: var(--text-secondary); }
            .no-js-badge { display: inline-block; margin-top: 10px; padding: 4px 10px; border-radius: 999px; background: rgba(13,148,136,0.1); color: var(--accent-primary); font-size: 12px; font-weight: 600; }
            .no-js-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
            .no-js-nav { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
            .no-js-link { display: inline-block; text-decoration: none; border: 1px solid var(--border-default); border-radius: 10px; padding: 8px 12px; color: var(--text-primary); background: var(--surface-raised); }
            .no-js-list { margin: 8px 0 0 0; padding-left: 20px; color: var(--text-secondary); }
            .no-js-list li { margin-bottom: 4px; }
            @media (min-width: 768px) { .no-js-grid { grid-template-columns: 1fr 1fr; } }
          `}</style>
          <main className="no-js-shell">
            <div className="no-js-wrap">
              <section className="no-js-card" aria-labelledby="no-js-heading">
                <h1 id="no-js-heading" className="no-js-title">
                  NeuraMark
                </h1>
                <p className="no-js-subtitle">Academic progress tracking for B.Tech students.</p>
                <span className="no-js-badge">JavaScript is disabled: static mode</span>
                <nav className="no-js-nav" aria-label="No JavaScript navigation">
                  <a className="no-js-link" href="/">
                    Home
                  </a>
                  <a className="no-js-link" href="/about">
                    About
                  </a>
                  <a className="no-js-link" href="/login">
                    Login
                  </a>
                  <a className="no-js-link" href="/signup">
                    Sign Up
                  </a>
                  <a className="no-js-link" href="/privacy">
                    Privacy
                  </a>
                  <a className="no-js-link" href="/terms">
                    Terms
                  </a>
                </nav>
              </section>

              <section className="no-js-grid" aria-label="Static highlights">
                <article className="no-js-card">
                  <h2>What You Can Access</h2>
                  <ul className="no-js-list">
                    <li>Core product and policy pages</li>
                    <li>Authentication pages</li>
                    <li>Readable, low-bandwidth static content</li>
                  </ul>
                </article>
                <article className="no-js-card">
                  <h2>Full App Features</h2>
                  <ul className="no-js-list">
                    <li>Live dashboards and progress updates</li>
                    <li>Theme switching and interactive charts</li>
                    <li>Real-time chat and admin tooling</li>
                  </ul>
                  <p className="no-js-subtitle">Enable JavaScript for the full interactive experience.</p>
                </article>
              </section>
            </div>
          </main>
        </noscript>
      </body>
    </html>
  );
}
