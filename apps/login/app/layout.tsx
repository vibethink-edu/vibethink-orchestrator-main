import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeThink - Login',
  description: 'Autenticación de VibeThink Orchestrator',
  keywords: 'VibeThink, Login, autenticación, multi-tenant',
  authors: [{ name: 'VibeThink Team' }],
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="login-root">
          {children}
        </div>
      </body>
    </html>
  )
} 