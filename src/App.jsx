import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import LibraryPage from './pages/LibraryPage'
import MedicationPage from './pages/MedicationPage'
import WaterPage from './pages/WaterPage'
import SchedulePage from './pages/SchedulePage'
import SettingsPage from './pages/SettingsPage'
import NavBar from './components/NavBar'
import UpdateBanner from './components/UpdateBanner'
import './App.css'

const DEFAULT_MY_SUPPLEMENTS = {
  wake:      ['vitd', 'probiotics'],
  morning:   ['omega3', 'vitc'],
  afternoon: ['vitb', 'propolis'],
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

function dedupGroups(groupObj) {
  const seen = new Set()
  const result = {}
  for (const [g, ids] of Object.entries(groupObj)) {
    result[g] = ids.filter(id => { if (seen.has(id)) return false; seen.add(id); return true })
  }
  return result
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
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('library')
  const [swReg, setSwReg] = useState(null)

  const [mySupplements, setMySupplements] = useState(() => {
    try { return dedupGroups(JSON.parse(localStorage.getItem('mySupplements')) || DEFAULT_MY_SUPPLEMENTS) }
    catch { return DEFAULT_MY_SUPPLEMENTS }
  })

  const [myMedications, setMyMedications] = useState(() => {
    try { return dedupGroups(JSON.parse(localStorage.getItem('myMedications')) || DEFAULT_MY_MEDICATIONS) }
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

  const cloudLoadedRef = useRef(false)

  const syncToCloud = async (userId, data) => {
    try {
      await supabase.from('user_data').upsert({
        user_id: userId,
        my_supplements:    data.mySupplements,
        my_medications:    data.myMedications,
        custom_supplements: data.customSupplements,
        custom_medications: data.customMedications,
        settings:          data.settings,
        updated_at:        new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } catch (e) {
      console.error('[NutriTime] sync failed:', e)
    }
  }

  const loadFromCloud = async (userId, localData) => {
    if (cloudLoadedRef.current) return
    cloudLoadedRef.current = true
    try {
      const { data, error } = await supabase
        .from('user_data').select('*').eq('user_id', userId).single()
      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        if (data.my_supplements)     setMySupplements(dedupGroups(data.my_supplements))
        if (data.my_medications)     setMyMedications(dedupGroups(data.my_medications))
        if (data.custom_supplements) setCustomSupplements(data.custom_supplements)
        if (data.custom_medications) setCustomMedications(data.custom_medications)
        if (data.settings)           setSettings(data.settings)
      } else {
        // 클라우드에 데이터 없음 → 현재 로컬 데이터를 저장
        await syncToCloud(userId, localData)
      }
    } catch (e) {
      console.error('[NutriTime] load failed:', e)
      cloudLoadedRef.current = false
    }
  }

  useEffect(() => {
    const handler = e => setSwReg(e.detail)
    window.addEventListener('swUpdateAvailable', handler)
    return () => window.removeEventListener('swUpdateAvailable', handler)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadFromCloud(u.id, { mySupplements, myMedications, customSupplements, customMedications, settings })
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (event === 'SIGNED_IN') {
        cloudLoadedRef.current = false
        loadFromCloud(u.id, { mySupplements, myMedications, customSupplements, customMedications, settings })
      }
      if (event === 'SIGNED_OUT') {
        cloudLoadedRef.current = false
      }
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

  // 로그인 상태일 때 데이터 변경 2초 후 클라우드에 자동 저장
  useEffect(() => {
    if (!user) return
    const timer = setTimeout(() => {
      syncToCloud(user.id, { mySupplements, myMedications, customSupplements, customMedications, settings })
    }, 2000)
    return () => clearTimeout(timer)
  }, [user, mySupplements, myMedications, customSupplements, customMedications, settings])

  const toggleSupplement = (groupId, suppId) => {
    setMySupplements(prev => {
      const inTarget = (prev[groupId] || []).includes(suppId)
      if (inTarget) {
        return { ...prev, [groupId]: prev[groupId].filter(id => id !== suppId) }
      }
      const inOther = Object.values(prev).some(ids => ids.includes(suppId))
      if (inOther) {
        // Already in a different group — remove from all (✓ tap on library)
        const next = {}
        for (const [g, ids] of Object.entries(prev)) next[g] = ids.filter(id => id !== suppId)
        return next
      }
      return { ...prev, [groupId]: [...(prev[groupId] || []), suppId] }
    })
  }

  const isInSchedule = (suppId) =>
    Object.values(mySupplements).some(ids => ids.includes(suppId))

  const toggleMedication = (groupId, medId) => {
    setMyMedications(prev => {
      const inTarget = (prev[groupId] || []).includes(medId)
      if (inTarget) {
        return { ...prev, [groupId]: prev[groupId].filter(id => id !== medId) }
      }
      const inOther = Object.values(prev).some(ids => ids.includes(medId))
      if (inOther) {
        const next = {}
        for (const [g, ids] of Object.entries(prev)) next[g] = ids.filter(id => id !== medId)
        return next
      }
      return { ...prev, [groupId]: [...(prev[groupId] || []), medId] }
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

  return (
    <div className="app">
      {swReg && <UpdateBanner reg={swReg} onDismiss={() => setSwReg(null)} />}
      <div className="page-content">
        {tab === 'library'  && <LibraryPage  {...sharedProps} customSupplements={customSupplements} addCustomSupplement={addCustomSupplement} deleteCustomSupplement={deleteCustomSupplement} />}
        {tab === 'meds'     && <MedicationPage myMedications={myMedications} isInMedSchedule={isInMedSchedule} toggleMedication={toggleMedication} customMedications={customMedications} addCustomMedication={addCustomMedication} deleteCustomMedication={deleteCustomMedication} />}
        {tab === 'water'    && <WaterPage />}
        {tab === 'schedule' && <SchedulePage {...sharedProps} myMedications={myMedications} toggleMedication={toggleMedication} customSupplements={customSupplements} customMedications={customMedications} setSettings={setSettings} />}
        {tab === 'settings' && <SettingsPage settings={settings} setSettings={setSettings} user={user} />}
      </div>
      <NavBar tab={tab} setTab={setTab} />
    </div>
  )
}
