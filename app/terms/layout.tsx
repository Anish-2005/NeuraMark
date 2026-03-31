import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuramark.vercel.app';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Review NeuraMark terms of service, platform usage conditions, and legal policies for all users.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    url: `${siteUrl}/terms`,
    title: 'Terms of Service | NeuraMark',
    description:
      'Review NeuraMark terms of service, platform usage conditions, and legal policies for all users.',
  },
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
