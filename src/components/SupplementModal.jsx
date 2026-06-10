import { useEffect } from 'react'
import { TIME_GROUPS } from '../data/supplements'
import './SupplementModal.css'

const DETAIL_ROWS = [
  { key: 'description', icon: '📋', label: '상세 설명' },
  { key: 'combination', icon: '💛', label: '좋은 조합' },
  { key: 'ageGroup',    icon: '👤', label: '추천 연령대' },
  { key: 'timing',      icon: '⏰', label: '복용 시간대' },
  { key: 'caution',     icon: '⚠️', label: '주의사항' },
]

export default function SupplementModal({ supp, mySupplements, onToggle, onClose, onDelete }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const currentGroup = Object.entries(mySupplements).find(([, ids]) =>
    ids.includes(supp.id)
  )?.[0]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-emoji">{supp.emoji}</span>
          <div>
            <h2 className="modal-name">{supp.name}</h2>
            <span className="modal-effect-tag">{supp.effect}</span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {DETAIL_ROWS.map(row => supp[row.key] ? (
            <div key={row.key} className="modal-row">
              <div className="modal-row-label">
                <span>{row.icon}</span>
                <span>{row.label}</span>
              </div>
              <p className="modal-row-text">{supp[row.key]}</p>
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
                  onClick={() => onToggle(g.id, supp.id, currentGroup)}
                >
                  <span>{g.emoji}</span>
                  <span>{g.label}</span>
                </button>
              )
            })}
          </div>
          {onDelete && (
            <button className="modal-delete-btn" onClick={() => { onDelete(supp.id); onClose() }}>
              🗑 목록에서 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
