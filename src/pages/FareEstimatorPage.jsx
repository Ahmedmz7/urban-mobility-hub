// 1. React imports
import { useState } from 'react'

// 2. Third-party imports
import {
  MdDirectionsBus,
  MdTrain,
  MdDirectionsBike,
  MdDirectionsWalk,
  MdInfo,
  MdArrowForward,
} from 'react-icons/md'
import { Link } from 'react-router-dom'

// 3. Internal imports
import { calculateFare, calculateAllModes } from '../utils/fareCalculator'

// 4. Styles
import styles from './FareEstimatorPage.module.css'

/** Mode options shown in the selector */
const MODES = [
  { id: 'walking', label: 'Walking',     Icon: MdDirectionsWalk, color: '#f97316' },
  { id: 'cycling', label: 'Cycling',     Icon: MdDirectionsBike, color: '#16a34a' },
  { id: 'bus',     label: 'Bus',         Icon: MdDirectionsBus,  color: '#2563eb' },
  { id: 'rail',    label: 'Rail & Tube', Icon: MdTrain,          color: '#7c3aed' },
]

/** Format a number as £X.XX, or return 'Free' if 0 */
function formatGBP(value) {
  if (value === 0) return 'Free'
  return `£${value.toFixed(2)}`
}

/**
 * FareEstimatorPage — lets users input a journey distance and travel mode
 * to receive an estimated cost range, weekly/monthly projections, and
 * a full cross-mode comparison for the same distance.
 */
function FareEstimatorPage() {
  const [distance, setDistance]     = useState('')
  const [unit, setUnit]             = useState('km')      // 'km' | 'miles'
  const [selectedMode, setMode]     = useState('bus')
  const [result, setResult]         = useState(null)
  const [allModes, setAllModes]     = useState(null)
  const [error, setError]           = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const raw = parseFloat(distance)
    if (!distance || isNaN(raw) || raw <= 0) {
      setError('Please enter a valid distance greater than 0.')
      return
    }
    if (raw > 500) {
      setError('Distance seems too large. Please enter a realistic journey length.')
      return
    }

    const distanceKm = unit === 'miles' ? raw * 1.60934 : raw
    setResult(calculateFare(selectedMode, distanceKm))
    setAllModes(calculateAllModes(distanceKm))
  }

  const activeModeData = MODES.find(m => m.id === selectedMode)

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <h1 id="page-title" className={styles.heroTitle}>Fare Estimator</h1>
          <p className={styles.heroSubtitle}>
            Enter a distance and travel mode to see an estimated cost — plus weekly
            and monthly projections.
          </p>
        </div>
      </section>

      {/* ── Main layout ── */}
      <div className={styles.layout}>
        <div className="container">
          <div className={styles.layoutGrid}>

            {/* ── Form panel ── */}
            <section className={styles.formPanel} aria-label="Journey inputs">
              <form onSubmit={handleSubmit} noValidate>

                {/* Distance input */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="distance" className={styles.fieldLabel}>
                    Journey distance
                  </label>
                  <div className={styles.distanceRow}>
                    <input
                      id="distance"
                      type="number"
                      className={styles.distanceInput}
                      value={distance}
                      onChange={e => setDistance(e.target.value)}
                      placeholder="0"
                      min="0.1"
                      step="0.1"
                      aria-describedby={error ? 'distance-error' : undefined}
                    />
                    <div className={styles.unitToggle} role="group" aria-label="Distance unit">
                      <button
                        type="button"
                        className={`${styles.unitBtn} ${unit === 'km' ? styles.unitBtnActive : ''}`}
                        onClick={() => setUnit('km')}
                        aria-pressed={unit === 'km'}
                      >
                        km
                      </button>
                      <button
                        type="button"
                        className={`${styles.unitBtn} ${unit === 'miles' ? styles.unitBtnActive : ''}`}
                        onClick={() => setUnit('miles')}
                        aria-pressed={unit === 'miles'}
                      >
                        miles
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p id="distance-error" className={styles.errorMsg} role="alert">
                      {error}
                    </p>
                  )}
                </div>

                {/* Mode selector */}
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel} id="mode-label">
                    Travel mode
                  </span>
                  <div
                    className={styles.modeGrid}
                    role="group"
                    aria-labelledby="mode-label"
                  >
                    {MODES.map(({ id, label, Icon, color }) => (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.modeBtn} ${selectedMode === id ? styles.modeBtnActive : ''}`}
                        style={{ '--mode-color': color }}
                        onClick={() => setMode(id)}
                        aria-pressed={selectedMode === id}
                      >
                        <Icon size={22} aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Estimate fare
                  <MdArrowForward aria-hidden="true" />
                </button>

              </form>
            </section>

            {/* ── Results panel ── */}
            <section className={styles.resultsPanel} aria-label="Fare estimate results" aria-live="polite">
              {!result ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    Enter a distance and select a mode to see your estimate.
                  </p>
                </div>
              ) : (
                <>
                  {/* Primary result */}
                  <div
                    className={styles.primaryResult}
                    style={{ '--mode-color': activeModeData.color }}
                  >
                    <div className={styles.resultHeader}>
                      <activeModeData.Icon size={20} aria-hidden="true" />
                      <span className={styles.resultMode}>{activeModeData.label}</span>
                    </div>

                    <div className={styles.resultCost} aria-label={`Estimated fare: ${result.rangeLabel}`}>
                      {result.rangeLabel}
                    </div>
                    <p className={styles.resultCostLabel}>per trip</p>

                    {/* Projections */}
                    {!result.isFree && (
                      <div className={styles.projections}>
                        <div className={styles.projItem}>
                          <span className={styles.projLabel}>Weekly est.</span>
                          <span className={styles.projValue}>
                            {formatGBP(result.weekly.low)}
                            {result.weekly.low !== result.weekly.high && (
                              <> – {formatGBP(result.weekly.high)}</>
                            )}
                          </span>
                        </div>
                        <div className={styles.projDivider} aria-hidden="true" />
                        <div className={styles.projItem}>
                          <span className={styles.projLabel}>Monthly est.</span>
                          <span className={styles.projValue}>
                            {formatGBP(result.monthly.low)}
                            {result.monthly.low !== result.monthly.high && (
                              <> – {formatGBP(result.monthly.high)}</>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    <p className={styles.projNote}>
                      Based on {result.isFree ? 'zero cost' : '10 trips/week, 44 trips/month'}
                    </p>
                  </div>

                  {/* Notes */}
                  {result.notes.length > 0 && (
                    <div className={styles.notes}>
                      <div className={styles.notesHeader}>
                        <MdInfo size={16} aria-hidden="true" />
                        <span>Fare details</span>
                      </div>
                      <ul className={styles.notesList}>
                        {result.notes.map((note, i) => (
                          <li key={i} className={styles.noteItem}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </section>

          </div>

          {/* ── All-mode comparison ── */}
          {allModes && (
            <section className={styles.comparison} aria-labelledby="compare-heading">
              <h2 id="compare-heading" className={styles.compareTitle}>
                All modes for this distance
              </h2>
              <div className={styles.compareGrid}>
                {allModes.map(({ mode, label, result: r }) => {
                  const modeData = MODES.find(m => m.id === mode)
                  const isSelected = mode === selectedMode
                  return (
                    <button
                      key={mode}
                      type="button"
                      className={`${styles.compareCard} ${isSelected ? styles.compareCardActive : ''}`}
                      style={{ '--mode-color': modeData.color }}
                      onClick={() => {
                        setMode(mode)
                        const raw = parseFloat(distance)
                        const distanceKm = unit === 'miles' ? raw * 1.60934 : raw
                        setResult(calculateFare(mode, distanceKm))
                      }}
                      aria-pressed={isSelected}
                    >
                      <modeData.Icon size={20} aria-hidden="true" className={styles.compareIcon} />
                      <span className={styles.compareMode}>{label}</span>
                      <span className={styles.compareCost}>{r.rangeLabel}</span>
                      <span className={styles.compareUnit}>per trip</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* ── Footer nudge ── */}
      <div className={styles.nudge}>
        <div className="container">
          <p className={styles.nudgeText}>
            Need an exact fare between two stations?
          </p>
          <Link to="/journey-planner" className={styles.nudgeLink}>
            Use the Journey Planner
            <MdArrowForward aria-hidden="true" />
          </Link>
        </div>
      </div>

    </div>
  )
}

export default FareEstimatorPage
