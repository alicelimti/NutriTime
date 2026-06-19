const CACHE_NAME = 'nutritime-v3'

// ── Install: 캐시 초기화만 (index.html은 캐시하지 않음) ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(() => self.skipWaiting())
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

// ── Fetch ──
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  // 외부 API는 SW 통과
  if (url.hostname.includes('supabase.co')) return
  if (url.hostname.includes('google.com') || url.hostname.includes('accounts.google')) return

  // HTML 네비게이션 요청(index.html): 항상 네트워크 우선
  // → 새 배포 후에도 최신 index.html을 받아 새 asset 해시를 참조하게 함
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    )
    return
  }

  // 해시된 정적 자산(JS/CSS): 캐시 우선 (URL 해시가 바뀌면 새 파일로 인식)
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
