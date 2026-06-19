import { signOut } from '../services/authService'
import './SettingsPage.css'

const TIME_SETTINGS = [
  { key: 'wakeTime',      label: '기상 시간',   emoji: '🌅' },
  { key: 'breakfastTime', label: '아침 식사',   emoji: '🍳' },
  { key: 'lunchTime',     label: '점심 식사',   emoji: '🍱' },
  { key: 'dinnerTime',    label: '저녁 식사',   emoji: '🌆' },
  { key: 'bedtimeTime',   label: '취침 시간',   emoji: '🌙' },
]

export default function SettingsPage({ settings, setSettings }) {
  const handleSignOut = async () => {
    try { await signOut() } catch (err) { console.error(err) }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="settings-title"><span>⚙️</span> 설정</h1>
        <p className="settings-sub">나의 생활 패턴에 맞춰 복용 시간을 설정하세요</p>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">
          <span>⏰</span> 나의 하루 일정
        </div>
        {TIME_SETTINGS.map(item => (
          <div key={item.key} className="settings-row">
            <div className="settings-row-label">
              <span className="settings-row-emoji">{item.emoji}</span>
              <span>{item.label}</span>
            </div>
            <input
              type="time"
              className="settings-time-input"
              value={settings[item.key] || ''}
              onChange={e => handleChange(item.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="settings-section">
        <div className="settings-section-title">
          <span>🔔</span> 알림 설정
        </div>
        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-row-emoji">📱</span>
            <div>
              <div>푸시 알림</div>
              <div className="settings-row-desc">복용 시간에 알림을 받습니다</div>
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-row-emoji">💬</span>
            <div>
              <div>카카오톡 알림</div>
              <div className="settings-row-desc">카카오 플러스친구 연동 (준비 중)</div>
            </div>
          </div>
          <label className="toggle disabled">
            <input type="checkbox" disabled />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">
          <span>🛍️</span> 제휴 파트너
        </div>
        <div className="partner-grid">
          {['iHerb', '쿠팡', '올리브영', 'GNC Korea'].map(name => (
            <div key={name} className="partner-chip">
              <span>🛒</span> {name}
            </div>
          ))}
        </div>
        <p className="settings-partner-note">
          제휴 기능은 서비스 출시 후 순차적으로 연동될 예정입니다
        </p>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">
          <span>ℹ️</span> 앱 정보
        </div>
        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-row-emoji">💊</span>
            <div>
              <div>NutriTime</div>
              <div className="settings-row-desc">v1.0 · 영양제 복용 도우미</div>
            </div>
          </div>
        </div>
        <button className="settings-signout-btn" onClick={handleSignOut}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
