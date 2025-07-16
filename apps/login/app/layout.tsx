import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { BunduiThemeProvider, defaultTheme } from "@vthink/bundui"

// =============================================================================
// LOGIN LAYOUT
// =============================================================================
// 
// Layout de la app login que consume Bundui.
// Implementa el mismo diseño que la demo de Shadcn UI Kit.
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant ready
// - ✅ Bundui integration
// - ✅ Performance optimized
// - ✅ Type-safe
// =============================================================================

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeThink Login",
  description: "Iniciar sesión en VibeThink Orchestrator",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <BunduiThemeProvider theme={defaultTheme}>
          {children}
        </BunduiThemeProvider>
      </body>
    </html>
  )
} 