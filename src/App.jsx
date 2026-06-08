import { useState, useEffect } from 'react'
import LibraryPage from './pages/LibraryPage'
import SchedulePage from './pages/SchedulePage'
import SettingsPage from './pages/SettingsPage'
import NavBar from './components/NavBar'
import './App.css'

const DEFAULT_MY_SUPPLEMENTS = {
  wake:      ['vitd', 'probiotics'],
  morning:   ['omega3', 'vitc'],
  afternoon: ['vitb', 'coq10'],
  evening:   ['calcium', 'vite'],
  bedtime:   ['magnesium', 'melatonin'],
}

const DEFAULT_SETTINGS = {
  wakeTime:      '06:30',
  breakfastTime: '08:00',
  lunchTime:     '12:30',
  dinnerTime:    '19:00',
  bedtimeTime:   '22:30',
}

function loadChecked() {
  const today = new Date().toDateString()
  try {
    const saved = JSON.parse(localStorage.getItem('todayChecked'))
    return saved?.date === today ? saved.checked : []
  } catch {
    return []
  }
}

export default function App() {
  const [tab, setTab] = useState('library')

  const [mySupplements, setMySupplements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mySupplements')) || DEFAULT_MY_SUPPLEMENTS }
    catch { return DEFAULT_MY_SUPPLEMENTS }
  })

  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS }
    catch { return DEFAULT_SETTINGS }
  })

  const [todayChecked, setTodayChecked] = useState(loadChecked)

  useEffect(() => {
    localStorage.setItem('mySupplements', JSON.stringify(mySupplements))
  }, [mySupplements])

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const today = new Date().toDateString()
    localStorage.setItem('todayChecked', JSON.stringify({ date: today, checked: todayChecked }))
  }, [todayChecked])

  const toggleSupplement = (groupId, suppId) => {
    setMySupplements(prev => {
      const group = prev[groupId] || []
      const updated = group.includes(suppId)
        ? group.filter(id => id !== suppId)
        : [...group, suppId]
      return { ...prev, [groupId]: updated }
    })
  }

  const isInSchedule = (suppId) =>
    Object.values(mySupplements).some(ids => ids.includes(suppId))

  const toggleCheck = (suppId) => {
    setTodayChecked(prev =>
      prev.includes(suppId) ? prev.filter(id => id !== suppId) : [...prev, suppId]
    )
  }

  const sharedProps = { mySupplements, settings, todayChecked, toggleSupplement, isInSchedule, toggleCheck }

  return (
    <div className="app">
      <div className="page-content">
        {tab === 'library'  && <LibraryPage  {...sharedProps} />}
        {tab === 'schedule' && <SchedulePage {...sharedProps} setSettings={setSettings} />}
        {tab === 'settings' && <SettingsPage settings={settings} setSettings={setSettings} />}
      </div>
      <NavBar tab={tab} setTab={setTab} />
    </div>
  )
}
