import './NavBar.css'

const TABS = [
  { id: 'library',  label: '영양제',     icon: '🌿' },
  { id: 'meds',     label: '복용약',     icon: '💉' },
  { id: 'schedule', label: '내 일정',    icon: '📋' },
  { id: 'settings', label: '설정',       icon: '⚙️' },
]

export default function NavBar({ tab, setTab }) {
  return (
    <nav className="navbar">
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
