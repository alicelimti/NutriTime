import { useState } from 'react'
import { SUPPLEMENTS } from '../data/supplements'
import SupplementModal from '../components/SupplementModal'
import CustomAddModal from '../components/CustomAddModal'
import './LibraryPage.css'

const CUSTOM_CARD = { id: '__add__', name: '직접 추가', emoji: '✏️', effect: '나만의 영양제를 추가하세요' }

export default function LibraryPage({
  mySupplements, isInSchedule, toggleSupplement,
  customSupplements, addCustomSupplement, deleteCustomSupplement,
}) {
  const [selected, setSelected]   = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const allSupplements = [...SUPPLEMENTS, ...customSupplements]

  const handleToggle = (groupId, suppId, currentGroup) => {
    if (currentGroup === groupId) {
      toggleSupplement(currentGroup, suppId)
    } else {
      if (currentGroup) toggleSupplement(currentGroup, suppId)
      toggleSupplement(groupId, suppId)
    }
  }

  return (
    <div className="library">
      <div className="library-header">
        <h1 className="library-title">
          <span>🌿</span> 영양제 라이브러리
        </h1>
        <p className="library-sub">영양제를 탭하면 상세 정보를 확인할 수 있어요</p>
      </div>

      <div className="library-count">
        총 {allSupplements.length}종
      </div>

      <div className="supplement-grid">
        {allSupplements.map(supp => {
          const added = isInSchedule(supp.id)
          return (
            <div
              key={supp.id}
              className={`supp-card${added ? ' added' : ''}`}
              onClick={() => setSelected(supp)}
            >
              <div className="supp-emoji">{supp.emoji}</div>
              <div className="supp-name">{supp.name}</div>
              <div className="supp-effect">{supp.effect}</div>
              <button
                className={`supp-add-btn${added ? ' added' : ''}`}
                onClick={e => {
                  e.stopPropagation()
                  if (added) {
                    const group = Object.entries(mySupplements).find(([, ids]) =>
                      ids.includes(supp.id)
                    )?.[0]
                    if (group) toggleSupplement(group, supp.id)
                  } else {
                    toggleSupplement(supp.defaultGroup, supp.id)
                  }
                }}
              >
                {added ? '✓' : '+'}
              </button>
            </div>
          )
        })}

        {/* 직접 추가 카드 */}
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
        <SupplementModal
          supp={selected}
          mySupplements={mySupplements}
          onToggle={handleToggle}
          onClose={() => setSelected(null)}
          onDelete={selected.isCustom ? (id) => { deleteCustomSupplement(id) } : undefined}
        />
      )}

      {showAddForm && (
        <CustomAddModal
          type="supplement"
          onAdd={addCustomSupplement}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
