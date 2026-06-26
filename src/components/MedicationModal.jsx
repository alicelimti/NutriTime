import { useEffect } from 'react'
import { TIME_GROUPS } from '../data/medications'
import './SupplementModal.css'

const DETAIL_ROWS = [
  { key: 'description', icon: '📋', label: '약물 설명' },
  { key: 'usage',       icon: '💊', label: '복용 방법' },
  { key: 'timing',      icon: '⏰', label: '복용 시간대' },
  { key: 'sideEffects', icon: '⚠️', label: '주요 부작용' },
  { key: 'interaction', icon: '🚫', label: '약물 상호작용' },
  { key: 'ageGroup',    icon: '👤', label: '주요 대상' },
  { key: 'specialNote', icon: '🩷', label: '특이사항' },
]

export default function MedicationModal({ med, myMedications, onToggle, onClose, onDelete }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const currentGroup = Object.entries(myMedications).find(([, ids]) =>
    ids.includes(med.id)
  )?.[0]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-emoji">{med.emoji}</span>
          <div>
            <h2 className="modal-name">{med.name}</h2>
            <span className="modal-effect-tag">{med.effect}</span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {DETAIL_ROWS.map(row => med[row.key] ? (
            <div key={row.key} className="modal-row">
              <div className="modal-row-label">
                <span>{row.icon}</span>
                <span>{row.label}</span>
              </div>
              <p className="modal-row-text">{med[row.key]}</p>
            </div>
          ) : null)}
        </div>

        <div className="modal-footer">
          <p className="modal-group-label">복용 시간대 선택</p>
          <div className="modal-groups">
            {TIME_GROUPS.map(g => {
              const isSelected = currentGroup === g.id
              return (
                <button
                  key={g.id}
                  className={`modal-group-btn${isSelected ? ' selected' : ''}`}
                  onClick={() => onToggle(g.id, med.id, currentGroup)}
                >
                  <span>{g.emoji}</span>
                  <span>{g.label}</span>
                </button>
              )
            })}
          </div>
          {onDelete && (
            <button className="modal-delete-btn" onClick={() => { onDelete(med.id); onClose() }}>
              🗑 목록에서 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
