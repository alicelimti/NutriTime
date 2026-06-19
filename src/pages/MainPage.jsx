import { signOut } from '../services/authService'
import './MainPage.css'

const CARDS = [
  {
    id: 'meds',
    label: '복용약',
    emoji: '💉',
    sub: '오늘의 약 확인하기',
    bg: 'linear-gradient(135deg, #80C4AF, #A8D5C4, #C8E8DF)',
    color: '#1A3D34',
  },
  {
    id: 'library',
    label: '영양제',
    emoji: '🌿',
    sub: '내 영양제 관리',
    bg: 'linear-gradient(135deg, #EBC776, #F5D99D, #FAE9C0)',
    color: '#6B4800',
  },
  {
    id: 'schedule',
    label: 'My 탭',
    emoji: '📋',
    sub: '오늘 복용 일정',
    bg: 'linear-gradient(135deg, #E4BCD8, #EFD4E5, #F6EAF3)',
    color: '#52173A',
  },
  {
    id: 'settings',
    label: '설정',
    emoji: '⚙️',
    sub: '시간 & 환경 설정',
    bg: 'linear-gradient(135deg, #EAE4D6, #F1EBE0, #F9F7F2)',
    color: '#2E2820',
  },
]

export default function MainPage({ user, setTab }) {
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    '사용자'

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-top">
          <div className="main-logo">
            <span className="main-logo-icon">💊</span>
            <span className="main-logo-text">NutriTime</span>
          </div>
          <button className="main-signout-btn" onClick={handleSignOut}>
            로그아웃
          </button>
        </div>
        <p className="main-greeting">
          안녕하세요, <strong>{displayName}</strong>님 👋
        </p>
        <p className="main-subgreeting">오늘도 건강한 하루 되세요</p>
      </div>

      <div className="main-cards">
        {CARDS.map(card => (
          <button
            key={card.id}
            className="main-card"
            style={{ background: card.bg, color: card.color }}
            onClick={() => setTab(card.id)}
          >
            <span className="main-card-emoji">{card.emoji}</span>
            <span className="main-card-label">{card.label}</span>
            <span className="main-card-sub">{card.sub}</span>
            <span className="main-card-arrow" style={{ color: card.color }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
