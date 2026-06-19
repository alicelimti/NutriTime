import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import MedicationPage from './pages/MedicationPage'
import SupplementPage from './pages/SupplementPage'
import MyPage from './pages/MyPage'
import WaterPage from './pages/WaterPage'
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

const DEFAULT_MY_MEDICATIONS = {
  wake:      [],
  morning:   [],
  afternoon: [],
  evening:   [],
  bedtime:   [],
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
  const [user, setUser] = useState(undefined) // undefined = 로딩 중, null = 미로그인
  const [tab, setTab] = useState('main')

  const [mySupplements, setMySupplements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mySupplements')) || DEFAULT_MY_SUPPLEMENTS }
    catch { return DEFAULT_MY_SUPPLEMENTS }
  })

  const [myMedications, setMyMedications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myMedications')) || DEFAULT_MY_MEDICATIONS }
    catch { return DEFAULT_MY_MEDICATIONS }
  })

  const [customSupplements, setCustomSupplements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customSupplements')) || [] }
    catch { return [] }
  })

  const [customMedications, setCustomMedications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customMedications')) || [] }
    catch { return [] }
  })

  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS }
    catch { return DEFAULT_SETTINGS }
  })

  const [todayChecked, setTodayChecked] = useState(loadChecked)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    localStorage.setItem('mySupplements', JSON.stringify(mySupplements))
  }, [mySupplements])

  useEffect(() => {
    localStorage.setItem('myMedications', JSON.stringify(myMedications))
  }, [myMedications])

  useEffect(() => {
    localStorage.setItem('customSupplements', JSON.stringify(customSupplements))
  }, [customSupplements])

  useEffect(() => {
    localStorage.setItem('customMedications', JSON.stringify(customMedications))
  }, [customMedications])

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

  const toggleMedication = (groupId, medId) => {
    setMyMedications(prev => {
      const group = prev[groupId] || []
      const updated = group.includes(medId)
        ? group.filter(id => id !== medId)
        : [...group, medId]
      return { ...prev, [groupId]: updated }
    })
  }

  const isInMedSchedule = (medId) =>
    Object.values(myMedications).some(ids => ids.includes(medId))

  const addCustomSupplement = (item) => {
    setCustomSupplements(prev => [...prev, item])
    toggleSupplement(item.defaultGroup, item.id)
  }

  const deleteCustomSupplement = (id) => {
    setCustomSupplements(prev => prev.filter(s => s.id !== id))
    setMySupplements(prev => {
      const next = {}
      for (const [g, ids] of Object.entries(prev)) next[g] = ids.filter(i => i !== id)
      return next
    })
  }

  const addCustomMedication = (item) => {
    setCustomMedications(prev => [...prev, item])
    toggleMedication(item.defaultGroup, item.id)
  }

  const deleteCustomMedication = (id) => {
    setCustomMedications(prev => prev.filter(m => m.id !== id))
    setMyMedications(prev => {
      const next = {}
      for (const [g, ids] of Object.entries(prev)) next[g] = ids.filter(i => i !== id)
      return next
    })
  }

  const toggleCheck = (suppId) => {
    setTodayChecked(prev =>
      prev.includes(suppId) ? prev.filter(id => id !== suppId) : [...prev, suppId]
    )
  }

  const sharedProps = { mySupplements, settings, todayChecked, toggleSupplement, isInSchedule, toggleCheck }

  if (user === undefined) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0ff' }}>
        <span style={{ fontSize: 40 }}>💊</span>
      </div>
    )
  }

  if (user === null) {
    return <LoginPage />
  }

  if (tab === 'main') {
    return <MainPage user={user} setTab={setTab} />
  }

  return (
    <div className="app">
      <div className="page-content">
        {tab === 'meds'     && <MedicationPage user={user} />}
        {tab === 'library'  && <SupplementPage user={user} />}
        {tab === 'schedule' && <MyPage user={user} />}
        {tab === 'water'    && <WaterPage />}
        {tab === 'settings' && <SettingsPage settings={settings} setSettings={setSettings} />}
      </div>
      <NavBar tab={tab} setTab={setTab} goHome={() => setTab('main')} />
    </div>
  )
}
