import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 등록 전에 기존 controller 여부를 저장
    // → 첫 설치 시 claim()으로 인한 controllerchange를 reload로 오인하지 않기 위해
    const hadController = !!navigator.serviceWorker.controller

    navigator.serviceWorker
      .register('/NutriTime/service-worker.js', { scope: '/NutriTime/' })
      .then(reg => {
        // 이미 대기 중인 SW가 있으면 즉시 이벤트 발행
        if (reg.waiting && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent('swUpdateAvailable', { detail: reg }))
        }

        // 새 SW 설치 감지
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent('swUpdateAvailable', { detail: reg }))
            }
          })
        })
      })
      .catch(err => console.warn('SW registration failed:', err))

    // SKIP_WAITING 후 새 SW가 control 하면 페이지 리로드
    // hadController가 false(첫 방문)면 reload 하지 않음
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing && hadController) {
        refreshing = true
        window.location.reload()
      }
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
