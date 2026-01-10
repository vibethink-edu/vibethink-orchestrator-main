import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Asumiendo font disponible, sino usar sistema
import { Toaster } from "@/components/ui/toaster"; // Asumiendo shadcn compartido

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViTo Nexus | Global Control Plane",
  description: "Internal Operations Console for VibeThink Staff",
  robots: "noindex, nofollow", // CRITICAL: Ocultar de Google
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
        {/* <Toaster /> Comentado hasta verificar path de componentes */}
      </body>
    </html>
  );
}