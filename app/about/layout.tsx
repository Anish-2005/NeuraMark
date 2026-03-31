import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuramark.vercel.app';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how NeuraMark helps students track syllabus completion, monitor progress, and study smarter with AI-assisted insights.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    url: `${siteUrl}/about`,
    title: 'About | NeuraMark',
    description:
      'Learn how NeuraMark helps students track syllabus completion, monitor progress, and study smarter with AI-assisted insights.',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
