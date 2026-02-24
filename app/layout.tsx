// app/layout.js
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';
import { ReactNode } from 'react';

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

export const metadata = {
  title: {
    default: 'NeuraMark — AI-Powered Academic Progress Tracking',
    template: '%s | NeuraMark'
  },
  description: 'The next-generation academic tracking platform. Visualize your syllabus progress across CSE, ECE, AIML, DS and more with powerful insights.',
  keywords: ['academic tracker', 'syllabus progress', 'B.Tech', 'student dashboard', 'AI learning'],
  authors: [{ name: 'NeuraMark' }],
  creator: 'NeuraMark',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neuramark.com',
    title: 'NeuraMark — Next-Generation Academic Tracking',
    description: 'Visualize your academic progress, track syllabus completion, and predict academic outcomes with NeuraMark.',
    siteName: 'NeuraMark',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraMark — Next-Generation Academic Tracking',
    description: 'Track your syllabus progress across courses and branches seamlessly.',
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
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className={`font-sans antialiased text-skeu-primary min-h-screen flex flex-col`} style={{ background: 'var(--surface-base)', fontFamily: 'var(--font-outfit), sans-serif' }}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex-grow flex flex-col relative w-full h-full">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
