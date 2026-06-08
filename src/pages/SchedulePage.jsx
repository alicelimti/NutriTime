import { TIME_GROUPS, SUPPLEMENTS } from '../data/supplements'
import './SchedulePage.css'

export default function SchedulePage({ mySupplements, settings, todayChecked, toggleCheck, toggleSupplement }) {
  const groupTime = {
    wake:      settings.wakeTime,
    morning:   settings.breakfastTime,
    afternoon: settings.lunchTime,
    evening:   settings.dinnerTime,
    bedtime:   settings.bedtimeTime,
  }

  const totalCount = Object.values(mySupplements).reduce((sum, ids) => sum + ids.length, 0)
  const checkedCount = todayChecked.length

  const getSupp = id => SUPPLEMENTS.find(s => s.id === id)

  return (
    <div className="schedule">
      <div className="schedule-header">
        <h1 className="schedule-title"><span>📋</span> 오늘의 복용 일정</h1>
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
          <p>아직 추가한 영양제가 없어요</p>
          <p>라이브러리에서 영양제를 추가해보세요!</p>
        </div>
      )}

      <div className="time-groups">
        {TIME_GROUPS.map(group => {
          const ids = mySupplements[group.id] || []
          if (ids.length === 0) return null

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
                {ids.map(id => {
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
