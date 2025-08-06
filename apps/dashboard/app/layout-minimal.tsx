import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "VibeThink Dashboard",
  description: "Dashboard principal de VibeThink Orchestrator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}