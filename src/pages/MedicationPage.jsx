import { useState, useEffect } from 'react'
import {
  getMedications, addMedication, removeMedication,
  logMedicationIntake, getMedicationLogs, deleteMedicationLog,
} from '../services/medicationService'
import './MedicationPage.css'

export default function MedicationPage({ user }) {
  const [medications, setMedications] = useState([])
  const [todayLogs, setTodayLogs] = useState({}) // { medication_id: log_id }
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [newName, setNewName]     = useState('')
  const [submitting, setSubmitting] = useState(false)

  const today = new Date()

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const [meds, logs] = await Promise.all([
        getMedications(user.id),
        getMedicationLogs(user.id, today),
      ])
      setMedications(meds)
      const logMap = {}
      logs.forEach(l => { logMap[l.medication_id] = l.id })
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
      const med = {
        id: `custom_${Date.now()}`,
        name: newName.trim(),
        emoji: '💊',
        defaultGroup: 'morning',
      }
      const created = await addMedication(user.id, med)
      setMedications(prev => [...prev, created])
      setNewName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleLog = async (medicationId) => {
    const existingLogId = todayLogs[medicationId]
    try {
      if (existingLogId) {
        await deleteMedicationLog(existingLogId)
        setTodayLogs(prev => { const n = { ...prev }; delete n[medicationId]; return n })
      } else {
        const log = await logMedicationIntake(user.id, medicationId, today)
        setTodayLogs(prev => ({ ...prev, [medicationId]: log.id }))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (medicationId) => {
    try {
      await removeMedication(user.id, medicationId)
      setMedications(prev => prev.filter(m => m.medication_id !== medicationId))
      setTodayLogs(prev => { const n = { ...prev }; delete n[medicationId]; return n })
    } catch (err) {
      setError(err.message)
    }
  }

  const takenCount = Object.keys(todayLogs).length

  return (
    <div className="med-page">
      <div className="med-header">
        <div className="med-header-deco" />
        <h1 className="med-title"><span>💉</span> 복용약</h1>
        <p className="med-sub">오늘 복용한 약을 체크하세요</p>
        {!loading && medications.length > 0 && (
          <div className="med-progress-bar">
            <div
              className="med-progress-fill"
              style={{ width: `${(takenCount / medications.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="med-content">
        <form className="page-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="page-add-input"
            placeholder="약 이름 입력 (예: 아스피린)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button
            type="submit"
            className="page-add-btn mint"
            disabled={submitting || !newName.trim()}
          >
            {submitting ? '…' : '추가'}
          </button>
        </form>

        {error && <div className="page-error">⚠️ {error}</div>}

        {loading ? (
          <div className="page-loading"><span className="spin">💊</span> 불러오는 중…</div>
        ) : medications.length === 0 ? (
          <div className="page-empty">
            <span>💉</span>
            <p>등록된 복용약이 없어요<br />위에서 추가해보세요</p>
          </div>
        ) : (
          <>
            <p className="page-count">{takenCount} / {medications.length} 복용 완료</p>
            <div className="page-list">
              {medications.map(med => {
                const taken = !!todayLogs[med.medication_id]
                return (
                  <div key={med.id} className={`page-item${taken ? ' taken' : ''}`}>
                    <button
                      className={`page-check${taken ? ' checked mint' : ''}`}
                      onClick={() => handleToggleLog(med.medication_id)}
                    >
                      {taken ? '✓' : ''}
                    </button>
                    <span className="page-item-emoji">{med.emoji || '💊'}</span>
                    <span className={`page-item-name${taken ? ' striked' : ''}`}>{med.name}</span>
                    <button
                      className="page-delete-btn"
                      onClick={() => handleDelete(med.medication_id)}
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
