import { signInWithGoogle, signOut } from '../services/authService'
import './MyPage.css'

export default function MyPage({ user }) {
  if (!user) {
    return <LoginPrompt />
  }
  return <Profile user={user} />
}

function LoginPrompt() {
  const handleLogin = async () => {
    try { await signInWithGoogle() } catch (err) { console.error(err) }
  }

  return (
    <div className="my-page">
      <div className="my-header">
        <div className="my-header-deco" />
        <h1 className="my-title"><span>👤</span> My</h1>
        <p className="my-sub">로그인하면 데이터가 클라우드에 저장돼요</p>
      </div>

      <div className="my-content">
        <div className="my-login-card">
          <div className="my-login-icon">💊</div>
          <h2 className="my-login-heading">NutriTime에 로그인</h2>
          <p className="my-login-desc">
            Google 계정으로 로그인하면<br />
            모든 기기에서 데이터가 동기화됩니다
          </p>
          <div className="my-login-features">
            <span>🌿 영양제 기록 클라우드 저장</span>
            <span>💉 복용약 일정 동기화</span>
            <span>💧 음수량 기록 유지</span>
          </div>
          <button className="my-google-btn" onClick={handleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 로그인
          </button>
        </div>
      </div>
    </div>
  )
}

function Profile({ user }) {
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    '사용자'
  const avatarUrl = user?.user_metadata?.avatar_url

  const handleSignOut = async () => {
    try { await signOut() } catch (err) { console.error(err) }
  }

  return (
    <div className="my-page">
      <div className="my-header">
        <div className="my-header-deco" />
        <h1 className="my-title"><span>👤</span> My</h1>
        <p className="my-sub">로그인됨 · 클라우드 동기화 중</p>
      </div>

      <div className="my-content">
        <div className="my-profile-card">
          <div className="my-avatar">
            {avatarUrl
              ? <img src={avatarUrl} alt="프로필" className="my-avatar-img" />
              : <span className="my-avatar-emoji">👤</span>
            }
          </div>
          <div className="my-profile-info">
            <p className="my-profile-name">{displayName}</p>
            <p className="my-profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="my-status-card">
          <span className="my-status-dot" />
          클라우드 동기화 활성화됨
        </div>

        <button className="my-signout-btn" onClick={handleSignOut}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
