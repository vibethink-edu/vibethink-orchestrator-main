import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViTo Admin | Control Plane",
  description: "Internal Operations Console for VibeThink Staff",
  robots: "noindex, nofollow",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default to Spanish for internal staff
  const locale = 'es';
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}