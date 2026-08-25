import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/language-provider';

export const metadata: Metadata = {
  title: 'Lucre Creators — Transforme influência em negócios',
  description: 'A rede que conecta criadores selecionados, marcas e oportunidades para transformar influência em crescimento mensurável.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <body>
        <LanguageProvider><ThemeProvider>{children}<Toaster /></ThemeProvider></LanguageProvider>
      </body>
    </html>
  );
}
