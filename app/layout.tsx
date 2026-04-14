import { Manrope, Space_Grotesk } from 'next/font/google'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { routing } from '@/i18n/routing'
import { SITE_NAME, SITE_URL, getSiteDescription, getOgImageUrl, buildOrganizationSchema, buildWebSiteSchema } from '@/lib/site'

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const defaultDescription = getSiteDescription(routing.defaultLocale)
const defaultOgImage = getOgImageUrl({ title: SITE_NAME, sub: 'Directorio Global de Capoeira' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: defaultDescription,
  keywords: ['capoeira', 'capoeira classes', 'capoeira groups', 'capoeira training', 'find capoeira', 'capoeira directory', 'mestre capoeira', 'capoeira mundial', 'grupos de capoeira', 'nucleos capoeira'],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: defaultDescription,
    url: '/',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Directorio Global de Capoeira`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: defaultDescription,
    images: [defaultOgImage],
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = requestHeaders.get('X-NEXT-INTL-LOCALE') ?? routing.defaultLocale

  const orgSchema = buildOrganizationSchema(locale)
  const siteSchema = buildWebSiteSchema(locale)

  return (
    <html
      lang={locale}
      className={`${bodyFont.variable} ${displayFont.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content="#081019" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://i.ibb.co" />
      </head>
      <body className="min-h-full antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}
