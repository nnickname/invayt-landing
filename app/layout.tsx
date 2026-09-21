import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Invayt — Dejá de perseguir a tus compañeros para cobrar el tercer tiempo',
  description:
    'Invayt es la forma simple de cobrar el tercer tiempo de tu club de rugby. Sin planillas, sin insistir por WhatsApp. Solo pagás 0,5% sobre lo recaudado.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/curved-square-logo.png',
        type: 'image/svg+xml',
      },
    ]
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0b3d2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
