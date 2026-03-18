// 1. React imports
import { useState, useEffect, useCallback } from 'react'

// 2. Third-party imports
import {
  MdNotifications,
  MdNotificationsActive,
  MdNotificationsOff,
  MdAdd,
  MdDelete,
  MdRefresh,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdCircle,
} from 'react-icons/md'

// 3. Internal imports
import { getLineStatus, TFL_LINE_COLOURS, getSeverityCategory } from '../services/tflService'
import useLocalStorage from '../hooks/useLocalStorage'

// 4. Styles
import styles from './AlertsPage.module.css'

/**
 * All TfL lines available to watch, with display names matching the TfL line IDs
 * returned by getLineStatus().
 */
const ALL_LINES = [
  { id: 'bakerloo',           name: 'Bakerloo' },
  { id: 'central',            name: 'Central' },
  { id: 'circle',             name: 'Circle' },
  { id: 'district',           name: 'District' },
  { id: 'hammersmith-city',   name: 'Hammersmith & City' },
  { id: 'jubilee',            name: 'Jubilee' },
  { id: 'metropolitan',       name: 'Metropolitan' },
  { id: 'northern',           name: 'Northern' },
  { id: 'piccadilly',         name: 'Piccadilly' },
  { id: 'victoria',           name: 'Victoria' },
  { id: 'waterloo-city',      name: 'Waterloo & City' },
  { id: 'elizabeth',          name: 'Elizabeth line' },
  { id: 'london-overground',  name: 'London Overground' },
  { id: 'dlr',                name: 'DLR' },
]

/**
 * Returns status icon for a severity category.
 * @param {'good'|'warning'|'disrupted'} category
 * @param {number} size
 */
function StatusIcon({ category, size = 16 }) {
  if (category === 'good')    return <MdCheckCircle size={size} aria-hidden="true" />
  if (category === 'warning') return <MdWarning     size={size} aria-hidden="true" />
  return <MdError size={size} aria-hidden="true" />
}

/**
 * AlertsPage — custom travel alert system.
 * Users select TfL lines to watch; the page fetches live status and surfaces
 * any disruptions on watched lines as active alerts. Watched lines are
 * persisted in localStorage so preferences survive page reloads.
 */
function AlertsPage() {
  const [watchedLineIds, setWatchedLineIds] = useLocalStorage('umh_watched_lines', [])

  const [lineStatuses, setLineStatuses] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [lastUpdated, setLastUpdated]   = useState(null)
  const [refreshing, setRefreshing]     = useState(false)
  const [showAll, setShowAll]           = useState(false)

  const fetchStatuses = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else           setLoading(true)
    setError(null)

    try {
      const data = await getLineStatus()
      setLineStatuses(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'Failed to load live service status.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchStatuses() }, [fetchStatuses])

  /* ── Helpers ── */
  function getStatusFor(lineId) {
    return lineStatuses.find(l => l.id === lineId) ?? null
  }

  function toggleWatch(lineId) {
    setWatchedLineIds(prev =>
      prev.includes(lineId) ? prev.filter(id => id !== lineId) : [...prev, lineId]
    )
  }

  /* ── Derived data ── */
  // Active alerts: watched lines that are disrupted or have a warning
  const activeAlerts = watchedLineIds
    .map(id => ({ id, status: getStatusFor(id), meta: ALL_LINES.find(l => l.id === id) }))
    .filter(({ status }) => {
      if (!status) return false
      const cat = getSeverityCategory(status.lineStatuses[0]?.statusSeverity)
      return cat !== 'good'
    })

  // Lines not yet watched (for the "add" panel)
  const unwatchedLines = ALL_LINES.filter(l => !watchedLineIds.includes(l.id))
  const displayedUnwatched = showAll ? unwatchedLines : unwatchedLines.slice(0, 6)

  const formatTime = d => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <div className={styles.heroEyebrow}>
                <MdNotifications size={14} aria-hidden="true" />
                Personalised — saved to your browser
              </div>
              <h1 id="page-title" className={styles.heroTitle}>Travel Alerts</h1>
              <p className={styles.heroSubtitle}>
                Watch TfL lines and get instant visibility of disruptions the moment you open the page.
              </p>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{watchedLineIds.length}</span>
                  <span className={styles.heroStatLabel}>lines watched</span>
                </div>
                <div className={styles.heroStat}>
                  <span className={`${styles.heroStatValue} ${activeAlerts.length > 0 ? styles.heroStatAlert : ''}`}>
                    {activeAlerts.length}
                  </span>
                  <span className={styles.heroStatLabel}>active alerts</span>
                </div>
              </div>
              <div className={styles.heroActions}>
                {lastUpdated && (
                  <span className={styles.lastUpdated}>
                    Updated {formatTime(lastUpdated)}
                  </span>
                )}
                <button
                  className={styles.refreshBtn}
                  onClick={() => fetchStatuses(true)}
                  disabled={loading || refreshing}
                  aria-label="Refresh live status"
                >
                  <MdRefresh
                    size={15}
                    aria-hidden="true"
                    className={refreshing ? styles.spinning : ''}
                  />
                  {refreshing ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>
        <div className="container">

          {/* API loading/error */}
          {loading && (
            <div className={styles.loadingBanner} role="status" aria-label="Loading live status">
              <MdCircle size={10} aria-hidden="true" className={styles.loadingDot} />
              Fetching live service status…
            </div>
          )}
          {!loading && error && (
            <div className={styles.errorBanner} role="alert">
              <MdError size={16} aria-hidden="true" />
              {error}
              <button className={styles.retryLink} onClick={() => fetchStatuses()}>Retry</button>
            </div>
          )}

          {/* ── Active Alerts ── */}
          <section aria-labelledby="alerts-heading" className={styles.section}>
            <h2 id="alerts-heading" className={styles.sectionTitle}>
              <MdNotificationsActive size={18} aria-hidden="true" />
              Active Alerts
            </h2>

            {watchedLineIds.length === 0 ? (
              <div className={styles.emptyState}>
                <MdNotificationsOff size={36} className={styles.emptyIcon} aria-hidden="true" />
                <p className={styles.emptyTitle}>No lines watched yet</p>
                <p className={styles.emptyText}>
                  Add lines below to start monitoring for disruptions.
                </p>
              </div>
            ) : activeAlerts.length === 0 ? (
              <div className={styles.allClearBanner} role="status">
                <MdCheckCircle size={20} aria-hidden="true" />
                <span>All your watched lines are running a good service.</span>
              </div>
            ) : (
              <ul className={styles.alertList} role="list">
                {activeAlerts.map(({ id, status, meta }) => {
                  const lineStatus = status.lineStatuses[0]
                  const category   = getSeverityCategory(lineStatus?.statusSeverity)
                  const colour     = TFL_LINE_COLOURS[id] ?? '#64748b'
                  return (
                    <li key={id} className={`${styles.alertCard} ${styles[`alertCard--${category}`]}`}>
                      <span
                        className={styles.alertSwatch}
                        style={{ background: colour }}
                        aria-hidden="true"
                      />
                      <div className={styles.alertBody}>
                        <div className={styles.alertHeader}>
                          <span className={styles.alertLineName}>{meta?.name ?? id}</span>
                          <span className={`${styles.alertBadge} ${styles[`badge--${category}`]}`}>
                            <StatusIcon category={category} size={13} />
                            {lineStatus?.statusSeverityDescription ?? 'Disruption'}
                          </span>
                        </div>
                        {lineStatus?.reason && (
                          <p className={styles.alertReason}>{lineStatus.reason}</p>
                        )}
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => toggleWatch(id)}
                        aria-label={`Remove ${meta?.name ?? id} from watched lines`}
                      >
                        <MdDelete size={16} aria-hidden="true" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <div className={styles.columns}>

            {/* ── Watched Lines ── */}
            <section aria-labelledby="watched-heading" className={styles.section}>
              <h2 id="watched-heading" className={styles.sectionTitle}>
                <MdNotifications size={18} aria-hidden="true" />
                Watched Lines
              </h2>

              {watchedLineIds.length === 0 ? (
                <p className={styles.emptyMsg}>No lines added yet.</p>
              ) : (
                <ul className={styles.watchedList} role="list">
                  {watchedLineIds.map(id => {
                    const status     = getStatusFor(id)
                    const meta       = ALL_LINES.find(l => l.id === id)
                    const colour     = TFL_LINE_COLOURS[id] ?? '#64748b'
                    const lineStatus = status?.lineStatuses?.[0]
                    const category   = lineStatus
                      ? getSeverityCategory(lineStatus.statusSeverity)
                      : null

                    return (
                      <li key={id} className={styles.watchedItem}>
                        <span
                          className={styles.watchedSwatch}
                          style={{ background: colour }}
                          aria-hidden="true"
                        />
                        <div className={styles.watchedBody}>
                          <span className={styles.watchedName}>{meta?.name ?? id}</span>
                          {category && (
                            <span className={`${styles.watchedStatus} ${styles[`watchedStatus--${category}`]}`}>
                              <StatusIcon category={category} size={12} />
                              {lineStatus?.statusSeverityDescription ?? ''}
                            </span>
                          )}
                          {!category && loading && (
                            <span className={styles.watchedLoading}>Loading…</span>
                          )}
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => toggleWatch(id)}
                          aria-label={`Remove ${meta?.name ?? id}`}
                        >
                          <MdDelete size={16} aria-hidden="true" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            {/* ── Add Lines ── */}
            <section aria-labelledby="add-heading" className={styles.section}>
              <h2 id="add-heading" className={styles.sectionTitle}>
                <MdAdd size={18} aria-hidden="true" />
                Add Lines to Watch
              </h2>

              {unwatchedLines.length === 0 ? (
                <p className={styles.emptyMsg}>You are watching all available lines.</p>
              ) : (
                <>
                  <ul className={styles.linePickerList} role="list">
                    {displayedUnwatched.map(line => {
                      const status     = getStatusFor(line.id)
                      const lineStatus = status?.lineStatuses?.[0]
                      const category   = lineStatus
                        ? getSeverityCategory(lineStatus.statusSeverity)
                        : null
                      const colour     = TFL_LINE_COLOURS[line.id] ?? '#64748b'

                      return (
                        <li key={line.id} className={styles.linePickerItem}>
                          <span
                            className={styles.pickerSwatch}
                            style={{ background: colour }}
                            aria-hidden="true"
                          />
                          <div className={styles.pickerBody}>
                            <span className={styles.pickerName}>{line.name}</span>
                            {category && (
                              <span className={`${styles.pickerStatus} ${styles[`pickerStatus--${category}`]}`}>
                                <StatusIcon category={category} size={11} />
                                {lineStatus?.statusSeverityDescription ?? ''}
                              </span>
                            )}
                          </div>
                          <button
                            className={styles.addBtn}
                            onClick={() => toggleWatch(line.id)}
                            aria-label={`Watch ${line.name}`}
                          >
                            <MdAdd size={15} aria-hidden="true" />
                            Watch
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  {unwatchedLines.length > 6 && (
                    <button
                      className={styles.showMoreBtn}
                      onClick={() => setShowAll(v => !v)}
                    >
                      {showAll ? 'Show fewer' : `Show all ${unwatchedLines.length} lines`}
                    </button>
                  )}
                </>
              )}
            </section>

          </div>

          <p className={styles.sourceNote}>
            Live status from the <span className={styles.sourceHighlight}>TfL Unified API</span>.
            Alerts reflect current service status — refresh to update.
          </p>

        </div>
      </div>

    </div>
  )
}

export default AlertsPage
