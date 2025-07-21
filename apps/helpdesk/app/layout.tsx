import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeThink - Helpdesk',
  description: 'Sistema de soporte de VibeThink Orchestrator',
  keywords: 'VibeThink, Helpdesk, soporte, tickets',
  authors: [{ name: 'VibeThink Team' }],
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function HelpdeskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="helpdesk-root">
          {children}
        </div>
      </body>
    </html>
  )
} 