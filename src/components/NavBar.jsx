import './NavBar.css'

const TABS = [
  { id: 'library',  label: '영양제',  icon: '🌿' },
  { id: 'meds',     label: '복용약',  icon: '💉' },
  { id: 'water',    label: '음수량',  icon: '💧' },
  { id: 'schedule', label: '내 일정', icon: '📋' },
  { id: 'settings', label: '설정',    icon: '⚙️' },
]

export default function NavBar({ tab, setTab, goHome }) {
  return (
    <nav className="navbar">
      <button className="navbar-item navbar-home" onClick={goHome}>
        <span className="navbar-icon">🏠</span>
        <span className="navbar-label">홈</span>
      </button>
      {TABS.map(t => (
        <button
          key={t.id}
          className={`navbar-item${tab === t.id ? ' active' : ''}`}
          onClick={() => setTab(t.id)}
        >
          <span className="navbar-icon">{t.icon}</span>
          <span className="navbar-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
