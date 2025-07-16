import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeThink Orchestrator',
  description: 'Plataforma SaaS multi-tenant para gestión empresarial con metodología VThink 1.0',
  keywords: 'SaaS, multi-tenant, gestión empresarial, VThink 1.0, CMMI-ML3',
  authors: [{ name: 'VibeThink Team' }],
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 