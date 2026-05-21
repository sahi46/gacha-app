import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ガチャメーカー',
    short_name: 'ガチャ',
    description: '自分だけのガチャを作ってシェアしよう',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0a1e',
    theme_color: '#7c3aed',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
