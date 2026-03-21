import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#10b981',
}

export const metadata: Metadata = {
  title: 'PetCare — Saúde do seu pet',
  description: 'Sistema completo de gestão de saúde e histórico de pets',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PetCare',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
