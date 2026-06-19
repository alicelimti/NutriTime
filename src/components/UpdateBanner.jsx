import './UpdateBanner.css'

export default function UpdateBanner({ reg, onDismiss }) {
  const handleUpdate = () => {
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    onDismiss()
  }

  return (
    <div className="update-banner">
      <span className="update-banner-text">🌿 새 버전이 있습니다</span>
      <div className="update-banner-actions">
        <button className="update-banner-later" onClick={onDismiss}>나중에</button>
        <button className="update-banner-confirm" onClick={handleUpdate}>새로고침</button>
      </div>
    </div>
  )
}
