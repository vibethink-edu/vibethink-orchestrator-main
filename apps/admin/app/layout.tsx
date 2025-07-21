import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeThink - Admin Panel',
  description: 'Panel de administración de VibeThink Orchestrator',
  keywords: 'VibeThink, Admin, gestión empresarial, multi-tenant',
  authors: [{ name: 'VibeThink Team' }],
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="admin-root">
          {children}
        </div>
      </body>
    </html>
  )
} 