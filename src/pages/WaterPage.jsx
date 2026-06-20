import { useState, useEffect } from 'react'
import './WaterPage.css'

const BOTTLE_H = 376
const BOTTLE_W = 140

const BOTTLE_PATH =
  'M 48 0 L 48 30 C 46 50,3 66,3 90 L 3 330 C 3 365,28 376,70 376 C 112 376,137 365,137 330 L 137 90 C 137 66,94 50,92 30 L 92 0 Z'

export default function WaterPage() {
  const [weight, setWeight] = useState(() => localStorage.getItem('waterWeight') || '')
  const [consumed, setConsumed] = useState(() => {
    const today = new Date().toDateString()
    try {
      const saved = JSON.parse(localStorage.getItem('waterConsumed'))
      return saved?.date === today ? saved.amount : 0
    } catch { return 0 }
  })

  const recommended = weight ? Math.round(parseFloat(weight) * 30) : 0
  const sliderMax   = recommended || 3000
  const pct         = recommended > 0 ? Math.min((consumed / recommended) * 100, 100) : 0
  const isComplete  = recommended > 0 && consumed >= recommended

  const waterY = BOTTLE_H - (BOTTLE_H * pct / 100)
  const waterH = BOTTLE_H * pct / 100

  useEffect(() => { localStorage.setItem('waterWeight', weight) }, [weight])
  useEffect(() => {
    const today = new Date().toDateString()
    localStorage.setItem('waterConsumed', JSON.stringify({ date: today, amount: consumed }))
  }, [consumed])

  const ticks = recommended > 0
    ? Array.from({ length: Math.floor(recommended / 100) }, (_, i) => {
        const ml = (i + 1) * 100
        const y  = BOTTLE_H - (BOTTLE_H * ml / recommended)
        return { ml, y }
      }).filter(t => t.y > 2 && t.y < BOTTLE_H - 2)
    : []

  return (
    <div className="water-page">
      <div className="water-header">
        <h1 className="water-title"><span>💧</span> 오늘의 음수량</h1>
        <p className="water-sub">커피도 좋지만 물도 마시자</p>
      </div>

      <div className="water-calc-card">
        <div className="calc-label">💡 권장 음수량 계산 (체중 × 30ml)</div>
        <div className="calc-row">
          <input
            type="number"
            className="weight-input"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="체중"
            min="1"
            max="200"
          />
          <span className="calc-unit">kg</span>
          <span className="calc-op">× 30ml</span>
          <span className="calc-eq">=</span>
          <span className="calc-result">{recommended > 0 ? `${recommended}ml` : '?'}</span>
        </div>
      </div>

      <div className="bottle-section">
        <div className="bottle-top-badge">
          {recommended > 0
            ? <><span className="badge-goal">목표</span><span className="badge-val">{recommended}ml</span></>
            : <span className="badge-hint">체중을 입력하세요</span>
          }
        </div>

        {/* bottle + slider side by side */}
        <div className="bottle-and-slider">
          <svg
            className="bottle-svg"
            viewBox={`0 0 ${BOTTLE_W} ${BOTTLE_H}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="bottle-clip">
                <path d={BOTTLE_PATH} />
              </clipPath>
              <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={isComplete ? '#1565C0' : '#42A5F5'} stopOpacity="0.65" />
                <stop offset="100%" stopColor={isComplete ? '#0D47A1' : '#1976D2'} stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                <stop offset="40%"  stopColor="rgba(255,255,255,0.22)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            <path d={BOTTLE_PATH} fill="rgba(224,242,254,0.09)" stroke="rgba(100,181,246,0.65)" strokeWidth="2.5" />

            {ticks.map(({ ml, y }) => {
              const is500 = ml % 500 === 0
              return (
                <g key={ml} clipPath="url(#bottle-clip)">
                  <line
                    x1={BOTTLE_W - (is500 ? 28 : 18)} y1={y}
                    x2={BOTTLE_W - 4}                  y2={y}
                    stroke="rgba(100,181,246,0.35)"
                    strokeWidth={is500 ? 1.5 : 0.8}
                  />
                  {is500 && (
                    <text x={BOTTLE_W - 30} y={y - 3} fontSize="9" fill="rgba(100,181,246,0.55)" textAnchor="end">
                      {ml >= 1000 ? `${ml / 1000}L` : `${ml}`}
                    </text>
                  )}
                </g>
              )
            })}

            {pct > 0 && (
              <g clipPath="url(#bottle-clip)">
                <rect
                  x="0" y={waterY} width={BOTTLE_W} height={waterH}
                  fill="url(#water-grad)"
                  style={{ transition: 'y 0.25s ease, height 0.25s ease' }}
                />
                <ellipse cx="70" cy={waterY} rx="72" ry="7" fill="rgba(100,181,246,0.35)">
                  <animateTransform attributeName="transform" type="translate"
                    values="0,0; 6,2; 0,0; -6,2; 0,0" dur="3s" repeatCount="indefinite" />
                </ellipse>
                {pct > 18 && (
                  <text
                    x="70" y={waterY + waterH / 2 + 6}
                    fontSize="17" fontWeight="700"
                    fill="rgba(255,255,255,0.9)" textAnchor="middle"
                  >
                    {consumed}ml
                  </text>
                )}
              </g>
            )}

            <rect x="14" y="2" width="14" height={BOTTLE_H - 4} rx="7"
              fill="url(#shine-grad)" clipPath="url(#bottle-clip)"
              style={{ pointerEvents: 'none' }} />

            <path d={BOTTLE_PATH} fill="none" stroke="rgba(100,181,246,0.65)" strokeWidth="2.5" />
          </svg>

          {/* vertical range slider */}
          <div className="slider-col">
            <span className="slider-end top">{recommended > 0 ? `${recommended}ml` : `${sliderMax}ml`}</span>
            <input
              type="range"
              className={`water-slider${isComplete ? ' complete' : ''}`}
              min="0"
              max={sliderMax}
              step="10"
              value={Math.min(consumed, sliderMax)}
              onChange={e => setConsumed(Number(e.target.value))}
              style={{ '--fill-pct': `${pct}%` }}
            />
            <span className="slider-end bot">0</span>
          </div>
        </div>

        {/* progress summary */}
        <div className="water-progress">
          <span className="prog-current">{consumed}ml</span>
          {recommended > 0 && (
            <>
              <span className="prog-sep"> / </span>
              <span className="prog-goal">{recommended}ml</span>
              <span className="prog-pct"> &nbsp;{Math.round(pct)}%</span>
            </>
          )}
        </div>

        {consumed > 0 && (
          <button className="reset-btn" onClick={() => setConsumed(0)}>초기화</button>
        )}

        {isComplete && (
          <div className="water-complete">🎉 오늘 목표를 달성했어요!</div>
        )}
      </div>
    </div>
  )
}
