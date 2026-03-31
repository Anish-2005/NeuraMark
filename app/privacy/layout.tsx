import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuramark.vercel.app';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read NeuraMark privacy policy to understand how academic progress data is collected, used, and protected.',
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    url: `${siteUrl}/privacy`,
    title: 'Privacy Policy | NeuraMark',
    description:
      'Read NeuraMark privacy policy to understand how academic progress data is collected, used, and protected.',
  },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
