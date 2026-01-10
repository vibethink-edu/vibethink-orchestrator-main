import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextThemeProvider } from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViTo Admin | Control Plane",
  description: "Internal Operations Console for VibeThink Staff",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextThemeProvider>
          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>
        </NextThemeProvider>
      </body>
    </html>
  );
}