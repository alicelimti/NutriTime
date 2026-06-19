import { useState } from 'react'
import { MEDICATIONS } from '../data/medications'
import MedicationModal from '../components/MedicationModal'
import CustomAddModal from '../components/CustomAddModal'
import './MedicationPage.css'

const CUSTOM_CARD = { id: '__add__', name: '직접 추가', emoji: '✏️', effect: '나만의 복용약을 추가하세요' }

export default function MedicationPage({
  myMedications, isInMedSchedule, toggleMedication,
  customMedications, addCustomMedication, deleteCustomMedication,
}) {
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const allMedications = [...MEDICATIONS, ...customMedications]
  const filtered = allMedications.filter(m =>
    m.name.includes(search) || m.effect.includes(search)
  )

  const handleToggle = (groupId, medId, currentGroup) => {
    if (currentGroup === groupId) {
      toggleMedication(currentGroup, medId)
    } else {
      if (currentGroup) toggleMedication(currentGroup, medId)
      toggleMedication(groupId, medId)
    }
  }

  return (
    <div className="medication">
      <div className="medication-header">
        <h1 className="medication-title">
          <span>💉</span> 복용약 라이브러리
        </h1>
        <p className="medication-sub">약을 탭하면 복용법과 주의사항을 확인할 수 있어요</p>
        <div className="medication-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="약 이름 또는 효능 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="medication-count">
        총 {filtered.length}종
      </div>

      <div className="supplement-grid">
        {filtered.map(med => {
          const added = isInMedSchedule(med.id)
          return (
            <div
              key={med.id}
              className={`supp-card${added ? ' added' : ''}`}
              onClick={() => setSelected(med)}
            >
              <div className="supp-emoji">{med.emoji}</div>
              <div className="supp-name">{med.name}</div>
              <div className="supp-effect">{med.effect}</div>
              <button
                className={`supp-add-btn${added ? ' added' : ''}`}
                onClick={e => {
                  e.stopPropagation()
                  if (added) {
                    const group = Object.entries(myMedications).find(([, ids]) =>
                      ids.includes(med.id)
                    )?.[0]
                    if (group) toggleMedication(group, med.id)
                  } else {
                    toggleMedication(med.defaultGroup, med.id)
                  }
                }}
              >
                {added ? '✓' : '+'}
              </button>
            </div>
          )
        })}

        <div
          className="supp-card add-custom-card"
          onClick={() => setShowAddForm(true)}
        >
          <div className="supp-emoji">{CUSTOM_CARD.emoji}</div>
          <div className="supp-name">{CUSTOM_CARD.name}</div>
          <div className="supp-effect">{CUSTOM_CARD.effect}</div>
          <button
            className="supp-add-btn"
            onClick={e => { e.stopPropagation(); setShowAddForm(true) }}
          >
            +
          </button>
        </div>
      </div>

      {selected && (
        <MedicationModal
          med={selected}
          myMedications={myMedications}
          onToggle={handleToggle}
          onClose={() => setSelected(null)}
          onDelete={selected.isCustom ? (id) => { deleteCustomMedication(id) } : undefined}
        />
      )}

      {showAddForm && (
        <CustomAddModal
          type="medication"
          onAdd={addCustomMedication}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
