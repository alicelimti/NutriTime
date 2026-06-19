import './NavBar.css'

function IconLeaf() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21C12 21 4.5 15.5 4.5 10C4.5 7 7.8 5 12 5C16.2 5 19.5 7 19.5 10C19.5 15.5 12 21 12 21Z"/>
      <line x1="12" y1="5" x2="12" y2="21"/>
    </svg>
  )
}

function IconPill() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="7.5" rx="3.75"/>
      <line x1="12" y1="9" x2="12" y2="16.5"/>
    </svg>
  )
}

function IconDrop() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L6 12C6 15.9 8.7 19.5 12 19.5C15.3 19.5 18 15.9 18 12L12 3Z"/>
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="17" rx="2"/>
      <line x1="3" y1="10.5" x2="21" y2="10.5"/>
      <line x1="8" y1="3" x2="8" y2="7"/>
      <line x1="16" y1="3" x2="16" y2="7"/>
    </svg>
  )
}

function IconGear() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

const TABS = [
  { id: 'library',  label: '영양제',  Icon: IconLeaf },
  { id: 'meds',     label: '복용약',  Icon: IconPill },
  { id: 'water',    label: '음수량',  Icon: IconDrop },
  { id: 'schedule', label: '내 일정', Icon: IconCalendar },
  { id: 'settings', label: '설정',    Icon: IconGear },
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
          <span className="navbar-icon"><t.Icon /></span>
          <span className="navbar-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
