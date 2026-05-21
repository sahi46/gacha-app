const CACHE = 'gacha-v1'
const PRECACHE = ['/', '/create']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const url = e.request.url

  // GAS APIとNext.jsの内部リクエストはスキップ
  if (url.includes('script.google.com') || url.includes('_next/')) return

  // ナビゲーション（ページ移動）はネットワーク優先、失敗時にキャッシュ
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    )
    return
  }

  // 静的ファイルはキャッシュ優先
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  )
})
