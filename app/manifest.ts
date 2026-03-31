import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NeuraMark',
    short_name: 'NeuraMark',
    description:
      'AI-powered academic progress tracking platform for B.Tech students.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f8f7',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        src: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '48x48',
      },
    ],
  };
}
