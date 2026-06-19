import { TIME_GROUPS, SUPPLEMENTS } from '../data/supplements'
import { MEDICATIONS } from '../data/medications'
import './SchedulePage.css'

export default function SchedulePage({
  mySupplements, myMedications, settings, todayChecked,
  toggleCheck, toggleSupplement, toggleMedication, setSettings,
  customSupplements, customMedications,
}) {
  const groupTime = {
    wake:      settings.wakeTime,
    morning:   settings.breakfastTime,
    afternoon: settings.lunchTime,
    evening:   settings.dinnerTime,
    bedtime:   settings.bedtimeTime,
  }

  const suppTotal = Object.values(mySupplements).reduce((s, ids) => s + ids.length, 0)
  const medTotal  = Object.values(myMedications).reduce((s, ids) => s + ids.length, 0)
  const totalCount   = suppTotal + medTotal
  const checkedCount = todayChecked.length

  const getSupp = id => SUPPLEMENTS.find(s => s.id === id) || (customSupplements || []).find(s => s.id === id)
  const getMed  = id => MEDICATIONS.find(m => m.id === id) || (customMedications  || []).find(m => m.id === id)

  return (
    <div className="schedule">
      <div className="schedule-header">
        <h1 className="schedule-title"><span>📋</span> 오늘의 복용 일정</h1>
        <p className="schedule-sub">영양제와 약을 꾸준히 복용하세요</p>
      </div>

      <div className="schedule-progress-card">
        <div className="schedule-progress-bar">
          <div
            className="schedule-progress-fill"
            style={{ width: totalCount ? `${(checkedCount / totalCount) * 100}%` : '0%' }}
          />
        </div>
        <p className="schedule-progress-text">
          {checkedCount} / {totalCount}개 복용 완료
        </p>
      </div>

      {totalCount === 0 && (
        <div className="schedule-empty">
          <p>💊</p>
          <p>아직 추가한 영양제·복용약이 없어요</p>
          <p>라이브러리 또는 복용약 탭에서 추가해보세요!</p>
        </div>
      )}

      <div className="time-groups">
        {TIME_GROUPS.map(group => {
          const suppIds = mySupplements[group.id] || []
          const medIds  = myMedications[group.id]  || []
          if (suppIds.length === 0 && medIds.length === 0) return null

          return (
            <div key={group.id} className="time-group">
              <div className="time-group-header">
                <div className="time-group-info">
                  <span className="time-group-emoji">{group.emoji}</span>
                  <div>
                    <div className="time-group-label">{group.label}</div>
                    <div className="time-group-sub">{group.sub}</div>
                  </div>
                </div>
                <div className="time-group-time">
                  ⏰ {groupTime[group.id]}
                </div>
              </div>

              <div className="time-group-supplements">
                {suppIds.map(id => {
                  const supp = getSupp(id)
                  if (!supp) return null
                  const checked = todayChecked.includes(id)
                  return (
                    <div key={id} className={`schedule-supp${checked ? ' checked' : ''}`}>
                      <button
                        className={`check-btn${checked ? ' checked' : ''}`}
                        onClick={() => toggleCheck(id)}
                      >
                        {checked ? '✓' : ''}
                      </button>
                      <span className="schedule-supp-emoji">{supp.emoji}</span>
                      <span className="schedule-supp-name">{supp.name}</span>
                      <button
                        className="schedule-remove-btn"
                        onClick={() => toggleSupplement(group.id, id)}
                        title="제거"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}

                {medIds.map(id => {
                  const med = getMed(id)
                  if (!med) return null
                  const checked = todayChecked.includes(id)
                  return (
                    <div key={id} className={`schedule-supp med-item${checked ? ' checked' : ''}`}>
                      <button
                        className={`check-btn${checked ? ' checked' : ''}`}
                        onClick={() => toggleCheck(id)}
                      >
                        {checked ? '✓' : ''}
                      </button>
                      <span className="schedule-supp-emoji">{med.emoji}</span>
                      <span className="schedule-supp-name">
                        {med.name}
                        <span className="med-badge">처방약</span>
                      </span>
                      <button
                        className="schedule-remove-btn"
                        onClick={() => toggleMedication(group.id, id)}
                        title="제거"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
