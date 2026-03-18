// 1. React imports
import { useState, useEffect, useCallback } from 'react'

// 2. Third-party imports
import { MdRefresh, MdCheckCircle, MdWarning, MdError, MdCircle } from 'react-icons/md'

// 3. Internal imports
import { getLineStatus, TFL_LINE_COLOURS, getSeverityCategory } from '../services/tflService'

// 4. Styles
import styles from './ServiceUpdatesPage.module.css'

/** Filter tab options */
const FILTERS = [
  { id: 'all',        label: 'All lines' },
  { id: 'disrupted',  label: 'Disruptions' },
  { id: 'good',       label: 'Good service' },
]

/**
 * Returns the display icon component for a given severity category.
 * @param {'good'|'warning'|'disrupted'} category
 */
function StatusIcon({ category, size = 16 }) {
  if (category === 'good')      return <MdCheckCircle size={size} aria-hidden="true" />
  if (category === 'warning')   return <MdWarning size={size} aria-hidden="true" />
  return <MdError size={size} aria-hidden="true" />
}

/**
 * Formats a Date object as "HH:MM" in local time.
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

/**
 * ServiceUpdatesPage — fetches live TfL line status from the TfL Unified API
 * and displays disruptions, delays, and good service indicators across all
 * Underground, Overground, Elizabeth line, and DLR lines.
 */
function ServiceUpdatesPage() {
  const [lines, setLines]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [filter, setFilter]         = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const data = await getLineStatus()
      setLines(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'Failed to load service updates. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Derive stats from loaded data
  const totalLines      = lines.length
  const disruptedLines  = lines.filter(l => getSeverityCategory(l.lineStatuses[0]?.statusSeverity) !== 'good').length
  const goodLines       = totalLines - disruptedLines

  // Apply active filter
  const filteredLines = lines.filter(line => {
    const severity = line.lineStatuses[0]?.statusSeverity
    const category = getSeverityCategory(severity)
    if (filter === 'disrupted') return category !== 'good'
    if (filter === 'good')      return category === 'good'
    return true
  })

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <div className={styles.heroContent}>
            <div>
              <p className={styles.heroEyebrow}>Live data — TfL Unified API</p>
              <h1 id="page-title" className={styles.heroTitle}>Service Updates</h1>
              <p className={styles.heroSubtitle}>
                Real-time status across the London Underground, Overground,
                Elizabeth line, and DLR.
              </p>
            </div>
            <div className={styles.heroMeta}>
              {lastUpdated && (
                <p className={styles.lastUpdated} aria-live="polite">
                  Updated {formatTime(lastUpdated)}
                </p>
              )}
              <button
                className={styles.refreshBtn}
                onClick={() => fetchData(true)}
                disabled={loading || refreshing}
                aria-label="Refresh service updates"
              >
                <MdRefresh
                  size={16}
                  aria-hidden="true"
                  className={refreshing ? styles.spinning : ''}
                />
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content area ── */}
      <div className={styles.content}>
        <div className="container">

          {/* ── Loading state ── */}
          {loading && (
            <div className={styles.loadingState} role="status" aria-label="Loading service updates">
              <div className={styles.skeletonList}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonRow} aria-hidden="true" />
                ))}
              </div>
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && error && (
            <div className={styles.errorState} role="alert">
              <MdError size={32} aria-hidden="true" className={styles.errorIcon} />
              <h2 className={styles.errorTitle}>Could not load service updates</h2>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryBtn} onClick={() => fetchData()}>
                Try again
              </button>
            </div>
          )}

          {/* ── Loaded state ── */}
          {!loading && !error && (
            <>
              {/* Summary bar */}
              <div className={styles.summary} role="region" aria-label="Service summary">
                <div className={`${styles.summaryItem} ${styles.summaryGood}`}>
                  <span className={styles.summaryCount}>{goodLines}</span>
                  <span className={styles.summaryLabel}>Good service</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryDisrupted}`}>
                  <span className={styles.summaryCount}>{disruptedLines}</span>
                  <span className={styles.summaryLabel}>Disrupted</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryCount}>{totalLines}</span>
                  <span className={styles.summaryLabel}>Lines total</span>
                </div>
              </div>

              {/* Filter tabs */}
              <div className={styles.filters} role="tablist" aria-label="Filter service updates">
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={filter === f.id}
                    className={`${styles.filterTab} ${filter === f.id ? styles.filterTabActive : ''}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                    {f.id === 'disrupted' && disruptedLines > 0 && (
                      <span className={styles.filterBadge}>{disruptedLines}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Line list */}
              {filteredLines.length === 0 ? (
                <p className={styles.emptyMsg}>No lines match this filter.</p>
              ) : (
                <ul className={styles.lineList} role="list">
                  {filteredLines.map(line => {
                    const status   = line.lineStatuses[0]
                    const severity = status?.statusSeverity
                    const category = getSeverityCategory(severity)
                    const colour   = TFL_LINE_COLOURS[line.id] ?? '#64748b'
                    const reason   = status?.reason ?? null

                    return (
                      <li
                        key={line.id}
                        className={`${styles.lineRow} ${styles[`lineRow--${category}`]}`}
                      >
                        {/* Line colour swatch */}
                        <span
                          className={styles.lineSwatch}
                          style={{ background: colour }}
                          aria-hidden="true"
                        />

                        {/* Line name */}
                        <span className={styles.lineName}>{line.name}</span>

                        {/* Status */}
                        <span className={`${styles.statusBadge} ${styles[`badge--${category}`]}`}>
                          <StatusIcon category={category} />
                          {status?.statusSeverityDescription ?? 'Unknown'}
                        </span>

                        {/* Disruption reason (collapsed by default on mobile) */}
                        {reason && (
                          <p className={styles.lineReason}>{reason}</p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Data source note */}
              <p className={styles.sourceNote}>
                Data sourced from the{' '}
                <span className={styles.sourceHighlight}>TfL Unified API</span>{' '}
                — updated in real time.
              </p>
            </>
          )}

        </div>
      </div>

    </div>
  )
}

export default ServiceUpdatesPage
