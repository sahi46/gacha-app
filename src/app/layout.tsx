import type { Metadata, Viewport } from 'next'
import './globals.css'
import PwaSetup from '@/components/PwaSetup'

export const metadata: Metadata = {
  title: 'ガチャメーカー',
  description: '自分だけのガチャを作ってシェアしよう',
  appleWebApp: {
    capable: true,
    title: 'ガチャメーカー',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">
        <PwaSetup />
        {children}
      </body>
    </html>
  )
}
