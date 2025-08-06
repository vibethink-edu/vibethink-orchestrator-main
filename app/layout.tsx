import type { Metadata } from 'next';
import '../src/index.css';
import { VThinkThemeProvider } from '@/shared/components/bundui-premium/components/theme-customizer/ThemeProvider';

export const metadata: Metadata = {
  title: 'VibeThink Dashboard',
  description: 'Dashboard template with theme customizer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <VThinkThemeProvider>
          {children}
        </VThinkThemeProvider>
      </body>
    </html>
  );
}
