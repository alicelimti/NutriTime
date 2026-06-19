import { useState, useEffect } from 'react'
import {
  getSupplements, addSupplement, removeSupplement,
  logSupplementIntake, getSupplementLogs, deleteSupplementLog,
} from '../services/supplementService'
import './SupplementPage.css'

export default function SupplementPage({ user }) {
  const [supplements, setSupplements] = useState([])
  const [todayLogs, setTodayLogs]     = useState({}) // { supplement_id: log_id }
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [newName, setNewName]         = useState('')
  const [submitting, setSubmitting]   = useState(false)

  const today = new Date()

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const [supps, logs] = await Promise.all([
        getSupplements(user.id),
        getSupplementLogs(user.id, today),
      ])
      setSupplements(supps)
      const logMap = {}
      logs.forEach(l => { logMap[l.supplement_id] = l.id })
      setTodayLogs(logMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const supp = {
        id: `custom_${Date.now()}`,
        name: newName.trim(),
        emoji: '🌿',
        defaultGroup: 'morning',
      }
      const created = await addSupplement(user.id, supp)
      setSupplements(prev => [...prev, created])
      setNewName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleLog = async (supplementId) => {
    const existingLogId = todayLogs[supplementId]
    try {
      if (existingLogId) {
        await deleteSupplementLog(existingLogId)
        setTodayLogs(prev => { const n = { ...prev }; delete n[supplementId]; return n })
      } else {
        const log = await logSupplementIntake(user.id, supplementId, today)
        setTodayLogs(prev => ({ ...prev, [supplementId]: log.id }))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (supplementId) => {
    try {
      await removeSupplement(user.id, supplementId)
      setSupplements(prev => prev.filter(s => s.supplement_id !== supplementId))
      setTodayLogs(prev => { const n = { ...prev }; delete n[supplementId]; return n })
    } catch (err) {
      setError(err.message)
    }
  }

  const takenCount = Object.keys(todayLogs).length

  return (
    <div className="supp-page">
      <div className="supp-header">
        <div className="supp-header-deco" />
        <h1 className="supp-title"><span>🌿</span> 영양제</h1>
        <p className="supp-sub">오늘 복용한 영양제를 체크하세요</p>
        {!loading && supplements.length > 0 && (
          <div className="supp-progress-bar">
            <div
              className="supp-progress-fill"
              style={{ width: `${(takenCount / supplements.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="supp-content">
        <form className="page-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="page-add-input"
            placeholder="영양제 이름 입력 (예: 비타민D)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button
            type="submit"
            className="page-add-btn butter"
            disabled={submitting || !newName.trim()}
          >
            {submitting ? '…' : '추가'}
          </button>
        </form>

        {error && <div className="page-error">⚠️ {error}</div>}

        {loading ? (
          <div className="page-loading"><span className="spin">🌿</span> 불러오는 중…</div>
        ) : supplements.length === 0 ? (
          <div className="page-empty">
            <span>🌿</span>
            <p>등록된 영양제가 없어요<br />위에서 추가해보세요</p>
          </div>
        ) : (
          <>
            <p className="page-count">{takenCount} / {supplements.length} 복용 완료</p>
            <div className="page-list">
              {supplements.map(supp => {
                const taken = !!todayLogs[supp.supplement_id]
                return (
                  <div key={supp.id} className={`page-item${taken ? ' taken' : ''}`}>
                    <button
                      className={`page-check${taken ? ' checked butter' : ''}`}
                      onClick={() => handleToggleLog(supp.supplement_id)}
                    >
                      {taken ? '✓' : ''}
                    </button>
                    <span className="page-item-emoji">{supp.emoji || '🌿'}</span>
                    <span className={`page-item-name${taken ? ' striked' : ''}`}>{supp.name}</span>
                    <button
                      className="page-delete-btn"
                      onClick={() => handleDelete(supp.supplement_id)}
                    >✕</button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
