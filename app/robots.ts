import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/es/admin/', '/pt/admin/', '/en/admin/', '/fr/admin/', '/de/admin/', '/it/admin/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/es/admin/', '/pt/admin/', '/en/admin/', '/fr/admin/', '/de/admin/', '/it/admin/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/es/admin/', '/pt/admin/', '/en/admin/', '/fr/admin/', '/de/admin/', '/it/admin/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/es/admin/', '/pt/admin/', '/en/admin/', '/fr/admin/', '/de/admin/', '/it/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/es/admin/', '/pt/admin/', '/en/admin/', '/fr/admin/', '/de/admin/', '/it/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
