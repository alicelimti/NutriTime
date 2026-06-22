const CACHE_NAME = 'nutritime-v7'

// ── Install: skipWaiting 제거 → 사용자 확인 후 활성화 ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(() => { /* 사용자 확인 전까지 대기 */ })
  )
})

// ── Activate: 이전 캐시 전체 삭제 ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Message: 앱에서 SKIP_WAITING 요청 수신 시 즉시 활성화 ──
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// ── Fetch ──
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (url.hostname.includes('supabase.co')) return
  if (url.hostname.includes('google.com') || url.hostname.includes('accounts.google')) return

  // HTML 네비게이션: 항상 네트워크 우선
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    )
    return
  }

  // 해시된 정적 자산: 캐시 우선
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
          }
          return response
        })
      })
    )
    return
  }

  // 나머지: 네트워크 우선
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
