import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuramark.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicRoutes = [
    '',
    '/about',
    '/privacy',
    '/terms',
  ];

  return publicRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
