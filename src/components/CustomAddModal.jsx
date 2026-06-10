import { useState, useEffect } from 'react'
import { TIME_GROUPS } from '../data/supplements'
import './SupplementModal.css'
import './CustomAddModal.css'

export default function CustomAddModal({ type, onAdd, onClose }) {
  const [name, setName]     = useState('')
  const [effect, setEffect] = useState('')
  const [group, setGroup]   = useState('morning')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const isSupp  = type === 'supplement'
  const title   = isSupp ? '영양제 직접 추가' : '복용약 직접 추가'
  const namePh  = isSupp ? '영양제 이름을 입력하세요' : '약 이름을 입력하세요'
  const emoji   = isSupp ? '🌿' : '💊'
  const prefix  = isSupp ? 'custom_sup_' : 'custom_med_'

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({
      id:           prefix + Date.now(),
      name:         name.trim(),
      emoji,
      effect:       effect.trim() || (isSupp ? '직접 추가한 영양제' : '직접 추가한 복용약'),
      description:  effect.trim() || '',
      defaultGroup: group,
      isCustom:     true,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-emoji" style={{ fontSize: 36 }}>{emoji}</span>
          <div>
            <h2 className="modal-name">{title}</h2>
            <span className="modal-effect-tag">{isSupp ? '영양제' : '처방약'}</span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="custom-form">
          <label className="custom-label">이름 <span className="custom-required">*</span></label>
          <input
            className="custom-input"
            type="text"
            placeholder={namePh}
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            maxLength={30}
          />

          <label className="custom-label" style={{ marginTop: 14 }}>효능 / 메모 <span className="custom-optional">(선택)</span></label>
          <input
            className="custom-input"
            type="text"
            placeholder="효능 또는 메모를 입력하세요"
            value={effect}
            onChange={e => setEffect(e.target.value)}
            maxLength={50}
          />
        </div>

        <div className="modal-footer">
          <p className="modal-group-label">복용 시간대 선택</p>
          <div className="modal-groups">
            {TIME_GROUPS.map(g => (
              <button
                key={g.id}
                className={`modal-group-btn${group === g.id ? ' selected' : ''}`}
                onClick={() => setGroup(g.id)}
              >
                <span>{g.emoji}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>

          <button
            className={`custom-submit${!name.trim() ? ' disabled' : ''}`}
            onClick={handleAdd}
            disabled={!name.trim()}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  )
}
