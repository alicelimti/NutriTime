import { useState } from 'react'
import { signInWithGoogle } from '../services/authService'
import './LoginPage.css'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-hero">
          <div className="login-icon">💊</div>
          <h1 className="login-title">NutriTime</h1>
          <p className="login-subtitle">당신의 건강한 생활 파트너</p>
        </div>

        <div className="login-features">
          <div className="login-feature">🌿 영양제 복용 관리</div>
          <div className="login-feature">💉 복용약 일정 추적</div>
          <div className="login-feature">💧 음수량 기록</div>
        </div>

        <div className="login-actions">
          <button
            className="login-google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? '로그인 중...' : 'Google로 시작하기'}
          </button>

          {error && <p className="login-error">{error}</p>}
        </div>

        <p className="login-footer">로그인하면 모든 기기에서 데이터가 동기화됩니다</p>
      </div>
    </div>
  )
}
