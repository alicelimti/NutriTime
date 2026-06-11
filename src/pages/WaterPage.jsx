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
  const pct = recommended > 0 ? Math.min((consumed / recommended) * 100, 100) : 0
  const isComplete = recommended > 0 && consumed >= recommended

  const waterY = BOTTLE_H - (BOTTLE_H * pct / 100)
  const waterH = BOTTLE_H * pct / 100

  useEffect(() => { localStorage.setItem('waterWeight', weight) }, [weight])
  useEffect(() => {
    const today = new Date().toDateString()
    localStorage.setItem('waterConsumed', JSON.stringify({ date: today, amount: consumed }))
  }, [consumed])

  const add = () => setConsumed(p => p + 100)
  const sub = () => setConsumed(p => Math.max(0, p - 100))
  const reset = () => setConsumed(0)

  const ticks = recommended > 0
    ? Array.from({ length: Math.floor(recommended / 100) }, (_, i) => {
        const ml = (i + 1) * 100
        const y = BOTTLE_H - (BOTTLE_H * ml / recommended)
        return { ml, y }
      }).filter(t => t.y > 2 && t.y < BOTTLE_H - 2)
    : []

  return (
    <div className="water-page">
      <div className="water-header">
        <h1 className="water-title"><span>💧</span> 오늘의 음수량</h1>
        <p className="water-sub">권장 음수량을 추적하세요</p>
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
        <div className="bottle-wrap">
          <div className="bottle-top-badge">
            {recommended > 0
              ? <><span className="badge-goal">목표</span><span className="badge-val">{recommended}ml</span></>
              : <span className="badge-hint">체중을 입력하세요</span>
            }
          </div>

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
                <stop offset="0%" stopColor={isComplete ? '#1565C0' : '#42A5F5'} stopOpacity="0.65" />
                <stop offset="100%" stopColor={isComplete ? '#0D47A1' : '#1976D2'} stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* bottle background */}
            <path
              d={BOTTLE_PATH}
              fill="rgba(224,242,254,0.09)"
              stroke="rgba(100,181,246,0.65)"
              strokeWidth="2.5"
            />

            {/* tick marks */}
            {ticks.map(({ ml, y }) => {
              const is500 = ml % 500 === 0
              return (
                <g key={ml} clipPath="url(#bottle-clip)">
                  <line
                    x1={BOTTLE_W - (is500 ? 28 : 18)}
                    y1={y}
                    x2={BOTTLE_W - 4}
                    y2={y}
                    stroke="rgba(100,181,246,0.35)"
                    strokeWidth={is500 ? 1.5 : 0.8}
                  />
                  {is500 && (
                    <text
                      x={BOTTLE_W - 30}
                      y={y - 3}
                      fontSize="9"
                      fill="rgba(100,181,246,0.55)"
                      textAnchor="end"
                    >
                      {ml >= 1000 ? `${ml / 1000}L` : `${ml}`}
                    </text>
                  )}
                </g>
              )
            })}

            {/* water fill */}
            {pct > 0 && (
              <g clipPath="url(#bottle-clip)">
                <rect
                  x="0"
                  y={waterY}
                  width={BOTTLE_W}
                  height={waterH}
                  fill="url(#water-grad)"
                  style={{ transition: 'y 0.55s cubic-bezier(.34,1.56,.64,1), height 0.55s cubic-bezier(.34,1.56,.64,1)' }}
                />
                {/* wave */}
                <ellipse cx="70" cy={waterY} rx="72" ry="7" fill="rgba(100,181,246,0.35)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 6,2; 0,0; -6,2; 0,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </ellipse>
                {/* current amount text inside fill */}
                {pct > 18 && (
                  <text
                    x="70"
                    y={waterY + waterH / 2 + 6}
                    fontSize="18"
                    fontWeight="700"
                    fill="rgba(255,255,255,0.9)"
                    textAnchor="middle"
                  >
                    {consumed}ml
                  </text>
                )}
              </g>
            )}

            {/* glass shine */}
            <rect
              x="14"
              y="2"
              width="14"
              height={BOTTLE_H - 4}
              rx="7"
              fill="url(#shine-grad)"
              clipPath="url(#bottle-clip)"
              style={{ pointerEvents: 'none' }}
            />

            {/* bottle outline on top */}
            <path
              d={BOTTLE_PATH}
              fill="none"
              stroke="rgba(100,181,246,0.65)"
              strokeWidth="2.5"
            />
          </svg>

          {/* amount display when fill too small */}
          {pct <= 18 && (
            <div className="bottle-amount-outside">{consumed}ml</div>
          )}

          <div className="bottle-progress-text">
            <span className="prog-current">{consumed}ml</span>
            <span className="prog-sep"> / </span>
            <span className="prog-goal">{recommended > 0 ? `${recommended}ml` : '?'}</span>
            {recommended > 0 && (
              <span className="prog-pct"> ({Math.round(pct)}%)</span>
            )}
          </div>
        </div>

        <div className="water-controls">
          <button className="water-btn minus" onClick={sub} disabled={consumed === 0}>
            <span className="btn-icon">−</span>
            <span className="btn-label">100ml</span>
          </button>

          <div className="water-pct-ring">
            <svg viewBox="0 0 64 64" width="64" height="64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#BBDEFB" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke={isComplete ? '#1565C0' : '#1976D2'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                transform="rotate(-90 32 32)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="32" y="37" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1565C0">
                {Math.round(pct)}%
              </text>
            </svg>
          </div>

          <button className="water-btn plus" onClick={add}>
            <span className="btn-icon">+</span>
            <span className="btn-label">100ml</span>
          </button>
        </div>

        {consumed > 0 && (
          <button className="reset-btn" onClick={reset}>초기화</button>
        )}

        {isComplete && (
          <div className="water-complete">🎉 오늘 목표를 달성했어요!</div>
        )}
      </div>
    </div>
  )
}
