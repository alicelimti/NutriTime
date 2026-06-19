const CACHE_NAME = 'nutritime-v2'

const PRECACHE_URLS = [
  '/NutriTime/',
  '/NutriTime/index.html',
]

// ── Install: 핵심 자산 선 캐싱 ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: 이전 캐시 정리 ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch: 캐시 우선, 실패 시 네트워크 ──
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // GET 요청만 캐싱
  if (request.method !== 'GET') return

  // Supabase API 요청은 캐싱하지 않음 (항상 네트워크 사용)
  if (url.hostname.includes('supabase.co')) return

  // Google OAuth 요청도 패스
  if (url.hostname.includes('google.com') || url.hostname.includes('accounts.google')) return

  event.respondWith(
    caches.match(request).then(cached => {
      // 캐시 히트: 반환하면서 백그라운드에서 갱신 (Stale-While-Revalidate)
      const networkFetch = fetch(request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
        }
        return response
      }).catch(() => null)

      return cached || networkFetch
    })
  )
})
