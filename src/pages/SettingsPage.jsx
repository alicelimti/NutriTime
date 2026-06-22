import { signInWithGoogle, signOut } from '../services/authService'
import './SettingsPage.css'

const TIME_SETTINGS = [
  { key: 'wakeTime',      label: '기상 시간',   emoji: '🌅' },
  { key: 'breakfastTime', label: '아침 식사',   emoji: '🍳' },
  { key: 'lunchTime',     label: '점심 식사',   emoji: '🍱' },
  { key: 'dinnerTime',    label: '저녁 식사',   emoji: '🌆' },
  { key: 'bedtimeTime',   label: '취침 시간',   emoji: '🌙' },
]

export default function SettingsPage({ settings, setSettings, user }) {
  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleLogin  = async () => { try { await signInWithGoogle() } catch (e) { console.error(e) } }
  const handleLogout = async () => { try { await signOut() }          catch (e) { console.error(e) } }

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || ''
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="settings-title"><span>⚙️</span> 설정</h1>
        <p className="settings-sub">나의 생활 패턴에 맞춰 복용 시간을 설정하세요</p>
      </div>

      {/* 하루 일정 */}
      <div className="settings-section">
        <div className="settings-section-title"><span>⏰</span> 나의 하루 일정</div>
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

      {/* 영양제 구매 링크 */}
      <div className="settings-section">
        <div className="settings-section-title"><span>🛍️</span> 영양제 구매 링크</div>
        <a
          href="https://brand.naver.com/iherb?NaPm=ct%3Dmqotd7sd%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3D05d9d5b71955a92cf4a5fb6a1041c4336ba8b5dc"
          target="_blank"
          rel="noopener noreferrer"
          className="settings-google-btn"
        >
          <span style={{ fontSize: '18px' }}>🌿</span>
          iHerb 바로가기
        </a>
      </div>

      {/* 계정 */}
      <div className="settings-section">
        <div className="settings-section-title"><span>👤</span> 계정</div>
        {user ? (
          <>
            <div className="settings-profile-row">
              <div className="settings-avatar">
                {avatarUrl
                  ? <img src={avatarUrl} alt="프로필" className="settings-avatar-img" />
                  : <span>👤</span>
                }
              </div>
              <div className="settings-profile-info">
                <div className="settings-profile-name">{displayName}</div>
                <div className="settings-row-desc">{user.email}</div>
              </div>
              <div className="settings-sync-badge">동기화 ✓</div>
            </div>
            <button className="settings-signout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="settings-google-btn" onClick={handleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google로 로그인
            </button>
          </>
        )}
      </div>

      {/* 앱 정보 */}
      <div className="settings-section">
        <div className="settings-section-title"><span>ℹ️</span> 앱 정보</div>
        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-row-emoji">💊</span>
            <div>
              <div>NutriTime</div>
              <div className="settings-row-desc">v1.0 · 영양제 복용 도우미</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
