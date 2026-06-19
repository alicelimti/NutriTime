import { useState, useEffect } from 'react'
import { getMedications, getMedicationLogs } from '../services/medicationService'
import { getSupplements, getSupplementLogs } from '../services/supplementService'
import { signOut } from '../services/authService'
import './MyPage.css'

export default function MyPage({ user }) {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const today = new Date()
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    '사용자'
  const avatarUrl = user?.user_metadata?.avatar_url

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [meds, medLogs, supps, suppLogs] = await Promise.all([
          getMedications(user.id),
          getMedicationLogs(user.id, today),
          getSupplements(user.id),
          getSupplementLogs(user.id, today),
        ])
        setStats({
          medTotal: meds.length,
          medTaken: medLogs.length,
          suppTotal: supps.length,
          suppTaken: suppLogs.length,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSignOut = async () => {
    try { await signOut() } catch (err) { setError(err.message) }
  }

  const pct = (taken, total) => total === 0 ? 0 : Math.round((taken / total) * 100)

  return (
    <div className="my-page">
      <div className="my-header">
        <div className="my-header-deco" />
        <h1 className="my-title"><span>📋</span> My 탭</h1>
        <p className="my-sub">오늘의 건강 현황</p>
      </div>

      <div className="my-content">
        {/* Profile */}
        <div className="my-profile-card">
          <div className="my-avatar">
            {avatarUrl
              ? <img src={avatarUrl} alt="프로필" className="my-avatar-img" />
              : <span className="my-avatar-emoji">👤</span>
            }
          </div>
          <div className="my-profile-info">
            <p className="my-profile-name">{displayName}</p>
            <p className="my-profile-email">{user?.email}</p>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="my-section-title">오늘의 복용 현황</div>

        {error && <div className="page-error">⚠️ {error}</div>}

        {loading ? (
          <div className="page-loading"><span className="spin">📋</span> 불러오는 중…</div>
        ) : stats ? (
          <div className="my-stats">
            <div className="my-stat-card mint">
              <div className="my-stat-header">
                <span>💉</span>
                <span className="my-stat-label">복용약</span>
              </div>
              <div className="my-stat-numbers">
                <span className="my-stat-taken">{stats.medTaken}</span>
                <span className="my-stat-total"> / {stats.medTotal}</span>
              </div>
              <div className="my-stat-bar">
                <div
                  className="my-stat-fill mint-fill"
                  style={{ width: `${pct(stats.medTaken, stats.medTotal)}%` }}
                />
              </div>
              <span className="my-stat-pct">{pct(stats.medTaken, stats.medTotal)}%</span>
            </div>

            <div className="my-stat-card butter">
              <div className="my-stat-header">
                <span>🌿</span>
                <span className="my-stat-label">영양제</span>
              </div>
              <div className="my-stat-numbers">
                <span className="my-stat-taken">{stats.suppTaken}</span>
                <span className="my-stat-total"> / {stats.suppTotal}</span>
              </div>
              <div className="my-stat-bar">
                <div
                  className="my-stat-fill butter-fill"
                  style={{ width: `${pct(stats.suppTaken, stats.suppTotal)}%` }}
                />
              </div>
              <span className="my-stat-pct">{pct(stats.suppTaken, stats.suppTotal)}%</span>
            </div>
          </div>
        ) : null}

        {/* Sign Out */}
        <button className="my-signout-btn" onClick={handleSignOut}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
