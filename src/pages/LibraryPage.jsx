import { useState } from 'react'
import { SUPPLEMENTS } from '../data/supplements'
import SupplementModal from '../components/SupplementModal'
import './LibraryPage.css'

export default function LibraryPage({ mySupplements, isInSchedule, toggleSupplement }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = SUPPLEMENTS.filter(s =>
    s.name.includes(search) || s.effect.includes(search)
  )

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
        <div className="library-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="영양제 이름 또는 효능 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="library-count">
        총 {filtered.length}종
      </div>

      <div className="supplement-grid">
        {filtered.map(supp => {
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
      </div>

      {selected && (
        <SupplementModal
          supp={selected}
          mySupplements={mySupplements}
          onToggle={handleToggle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
