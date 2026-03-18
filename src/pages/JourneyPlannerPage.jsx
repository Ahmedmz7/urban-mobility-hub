// 1. React imports
import { useState } from 'react'

// 2. Third-party imports
import {
  MdDirectionsBus,
  MdTrain,
  MdDirectionsBike,
  MdDirectionsWalk,
  MdSubway,
  MdArrowForward,
  MdSwapVert,
  MdAccessTime,
  MdAttachMoney,
  MdError,
} from 'react-icons/md'

// 3. Internal imports
import { planJourney, TFL_LINE_COLOURS } from '../services/tflService'

// 4. Styles
import styles from './JourneyPlannerPage.module.css'

/**
 * Maps TfL mode IDs to an icon component and a fallback colour.
 */
const MODE_META = {
  walking:          { Icon: MdDirectionsWalk, colour: '#f97316' },
  cycling:          { Icon: MdDirectionsBike, colour: '#16a34a' },
  bus:              { Icon: MdDirectionsBus,  colour: '#2563eb' },
  'national-rail':  { Icon: MdTrain,          colour: '#7c3aed' },
  dlr:              { Icon: MdSubway,         colour: '#00A4A7' },
  overground:       { Icon: MdTrain,          colour: '#EE7C0E' },
  'elizabeth-line': { Icon: MdTrain,          colour: '#6950A1' },
  tube:             { Icon: MdSubway,         colour: '#E32017' },
}

/**
 * Returns an icon + colour for a given TfL mode and optional line ID.
 * @param {string} modeId
 * @param {string|null} lineId
 */
function getModeStyle(modeId, lineId) {
  const lineColour = lineId ? TFL_LINE_COLOURS[lineId] : null
  const meta = MODE_META[modeId] ?? { Icon: MdTrain, colour: '#64748b' }
  return { Icon: meta.Icon, colour: lineColour ?? meta.colour }
}

/**
 * Formats a duration in minutes as "Xh Ym" or "Ym".
 * @param {number} minutes
 */
function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/**
 * Formats an ISO datetime string as "HH:MM".
 * @param {string} iso
 */
function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Formats a fare in pence as "£X.XX". Returns null if cost is 0 or missing.
 * @param {number|undefined} pence
 */
function formatFare(pence) {
  if (!pence || pence === 0) return null
  return `£${(pence / 100).toFixed(2)}`
}

/**
 * JourneyPlannerPage — API-driven journey planner using the TfL Unified API.
 * Users enter a from/to location; results show up to 3 journey options with
 * legs, durations, fares, and departure/arrival times.
 */
function JourneyPlannerPage() {
  const [from, setFrom]         = useState('')
  const [to, setTo]             = useState('')
  const [journeys, setJourneys] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  function swapLocations() {
    setFrom(to)
    setTo(from)
    setJourneys(null)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!from.trim() || !to.trim()) return

    setLoading(true)
    setError(null)
    setJourneys(null)

    try {
      const results = await planJourney(from, to)
      setJourneys(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {/* ── Hero + Form ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <p className={styles.heroEyebrow}>Live data — TfL Journey Planner API</p>
          <h1 id="page-title" className={styles.heroTitle}>Journey Planner</h1>
          <p className={styles.heroSubtitle}>
            Enter a start and end location — station name, postcode, or street — to get live route options.
          </p>

          {/* Search form */}
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputsWrapper}>

              <div className={styles.inputGroup}>
                <label htmlFor="from-input" className={styles.inputLabel}>From</label>
                <input
                  id="from-input"
                  type="text"
                  className={styles.input}
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  placeholder="e.g. Paddington or SW1A 1AA"
                  autoComplete="off"
                  required
                />
              </div>

              <button
                type="button"
                className={styles.swapBtn}
                onClick={swapLocations}
                aria-label="Swap from and to locations"
              >
                <MdSwapVert size={20} aria-hidden="true" />
              </button>

              <div className={styles.inputGroup}>
                <label htmlFor="to-input" className={styles.inputLabel}>To</label>
                <input
                  id="to-input"
                  type="text"
                  className={styles.input}
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="e.g. London Bridge or EC1A 1BB"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !from.trim() || !to.trim()}
            >
              {loading ? 'Finding routes…' : 'Find routes'}
              {!loading && <MdArrowForward aria-hidden="true" />}
            </button>
          </form>
        </div>
      </section>

      {/* ── Results ── */}
      <div className={styles.results}>
        <div className="container">

          {/* Loading */}
          {loading && (
            <div className={styles.skeletonList} role="status" aria-label="Finding journeys">
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonCard} aria-hidden="true" />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className={styles.errorState} role="alert">
              <MdError size={28} className={styles.errorIcon} aria-hidden="true" />
              <div>
                <p className={styles.errorTitle}>Could not find journeys</p>
                <p className={styles.errorText}>{error}</p>
              </div>
            </div>
          )}

          {/* Journey options */}
          {!loading && journeys && (
            <div aria-live="polite">
              <p className={styles.resultsHeading}>
                {journeys.length} route{journeys.length !== 1 ? 's' : ''} found
              </p>

              <ol className={styles.journeyList}>
                {journeys.map((journey, idx) => {
                  const fare = formatFare(journey.fare?.totalCost)
                  const firstDep = formatTime(journey.legs?.[0]?.departureTime)
                  const lastArr  = formatTime(journey.legs?.[journey.legs.length - 1]?.arrivalTime)

                  return (
                    <li key={idx} className={styles.journeyCard}>

                      {/* Card header */}
                      <div className={styles.cardHeader}>
                        <div className={styles.cardMeta}>
                          <span className={styles.duration}>
                            <MdAccessTime size={14} aria-hidden="true" />
                            {formatDuration(journey.duration)}
                          </span>
                          {(firstDep && lastArr) && (
                            <span className={styles.times}>{firstDep} → {lastArr}</span>
                          )}
                        </div>
                        {fare && (
                          <span className={styles.fare}>
                            <MdAttachMoney size={14} aria-hidden="true" />
                            {fare}
                          </span>
                        )}
                      </div>

                      {/* Legs timeline */}
                      <ol className={styles.legs} aria-label="Journey steps">
                        {journey.legs.map((leg, legIdx) => {
                          const modeId  = leg.mode?.id ?? 'walking'
                          const lineId  = leg.routeOptions?.[0]?.lineIdentifier?.id ?? null
                          const { Icon, colour } = getModeStyle(modeId, lineId)
                          const lineName = leg.routeOptions?.[0]?.name ?? leg.mode?.name ?? modeId
                          const isLast   = legIdx === journey.legs.length - 1

                          return (
                            <li key={legIdx} className={styles.leg}>
                              <div className={styles.legTimeline}>
                                <span
                                  className={styles.legDot}
                                  style={{ background: colour }}
                                  aria-hidden="true"
                                />
                                {!isLast && (
                                  <span
                                    className={styles.legLine}
                                    style={{ background: colour }}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              <div className={styles.legBody}>
                                <div className={styles.legHeader}>
                                  <span
                                    className={styles.legMode}
                                    style={{ '--leg-colour': colour }}
                                  >
                                    <Icon size={13} aria-hidden="true" />
                                    {lineName}
                                  </span>
                                  <span className={styles.legDuration}>
                                    {formatDuration(leg.duration)}
                                  </span>
                                </div>
                                <p className={styles.legInstruction}>
                                  {leg.instruction?.summary ?? ''}
                                </p>
                                {leg.departurePoint?.commonName && (
                                  <p className={styles.legStops}>
                                    {leg.departurePoint.commonName}
                                    {leg.arrivalPoint?.commonName && (
                                      <> → {leg.arrivalPoint.commonName}</>
                                    )}
                                  </p>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ol>

                    </li>
                  )
                })}
              </ol>

              <p className={styles.sourceNote}>
                Routes from the <span className={styles.sourceHighlight}>TfL Journey Planner API</span>.
                Fares and times are estimates — check before travel.
              </p>
            </div>
          )}

          {/* Initial empty state */}
          {!loading && !error && !journeys && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                Enter a start and end location above to see live route options.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default JourneyPlannerPage
