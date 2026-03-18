// 1. React imports
import { useState, useMemo } from 'react'

// 2. Third-party imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import {
  MdEco,
  MdDirectionsWalk,
  MdDirectionsBike,
  MdDirectionsBus,
  MdTrain,
  MdDirectionsCar,
  MdAdd,
  MdDelete,
  MdFlag,
  MdTrendingDown,
} from 'react-icons/md'

// 3. Internal imports
import {
  compareAllModes,
  co2SavedVsCar,
  formatCO2,
  calcTripCO2,
  MODE_COLOURS,
  MODE_LABELS,
} from '../utils/carbonCalculator'
import useLocalStorage from '../hooks/useLocalStorage'

// 4. Styles
import styles from './SustainabilityPage.module.css'

/** Travel mode options available for logging trips */
const LOG_MODES = [
  { id: 'walking',  label: 'Walking',    Icon: MdDirectionsWalk  },
  { id: 'cycling',  label: 'Cycling',    Icon: MdDirectionsBike  },
  { id: 'bus',      label: 'Bus',        Icon: MdDirectionsBus   },
  { id: 'rail',     label: 'Rail/Tube',  Icon: MdTrain           },
  { id: 'car',      label: 'Car',        Icon: MdDirectionsCar   },
]

/**
 * Generates a simple unique ID.
 * @returns {string}
 */
function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Formats an ISO date string as a short locale date.
 * @param {string} iso
 */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/**
 * Returns the ISO date string for the start of the current week (Monday).
 * @returns {string}
 */
function startOfThisWeek() {
  const d = new Date()
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

/**
 * Custom Recharts tooltip for the CO₂ bar chart.
 */
function CO2Tooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { label, grams } = payload[0].payload
  return (
    <div className={styles.chartTooltip}>
      <span className={styles.chartTooltipLabel}>{label}</span>
      <span className={styles.chartTooltipValue}>{formatCO2(grams)}</span>
    </div>
  )
}

/**
 * SustainabilityPage — carbon footprint comparison tool and weekly goal tracker.
 * Users enter a distance to see CO₂ emissions across travel modes, then log
 * trips to track their weekly carbon footprint against a personal goal.
 * Trip log and goal are persisted in localStorage.
 */
function SustainabilityPage() {

  /* ── Calculator state ── */
  const [distance,     setDistance]     = useState('5')
  const [calcError,    setCalcError]    = useState('')

  /* ── Goal tracker state (localStorage) ── */
  const [weeklyGoalG,  setWeeklyGoalG]  = useLocalStorage('umh_carbon_goal_g', 2000)
  const [tripLog,      setTripLog]      = useLocalStorage('umh_trip_log', [])
  const [goalInput,    setGoalInput]    = useState('')
  const [editingGoal,  setEditingGoal]  = useState(false)

  /* ── Log trip form state ── */
  const [logMode,      setLogMode]      = useState('bus')
  const [logDist,      setLogDist]      = useState('')
  const [logError,     setLogError]     = useState('')

  /* ── Derived: comparison chart data ── */
  const chartData = useMemo(() => {
    const km = parseFloat(distance)
    if (!km || km <= 0) return []
    return compareAllModes(km)
  }, [distance])

  const distanceKm   = parseFloat(distance) || 0
  const maxGrams     = chartData.length ? Math.max(...chartData.map(d => d.grams)) : 0

  /* ── Derived: this week's trips ── */
  const weekStart = startOfThisWeek()
  const thisWeeksTrips = tripLog.filter(t => t.loggedAt >= weekStart)
  const weeklyTotalG   = thisWeeksTrips.reduce((sum, t) => sum + t.co2g, 0)
  const goalProgress   = weeklyGoalG > 0 ? Math.min(100, (weeklyTotalG / weeklyGoalG) * 100) : 0
  const overGoal       = weeklyTotalG > weeklyGoalG

  /* ── Handlers ── */
  function handleDistanceChange(e) {
    setCalcError('')
    setDistance(e.target.value)
  }

  function handleDistanceBlur() {
    const km = parseFloat(distance)
    if (!km || km <= 0 || km > 500) {
      setCalcError('Enter a distance between 0.1 and 500 km.')
    }
  }

  function saveGoal(e) {
    e.preventDefault()
    const g = parseFloat(goalInput)
    if (!g || g <= 0) return
    setWeeklyGoalG(Math.round(g * 1000))
    setGoalInput('')
    setEditingGoal(false)
  }

  function logTrip(e) {
    e.preventDefault()
    const km = parseFloat(logDist)
    if (!km || km <= 0) { setLogError('Enter a valid distance.'); return }
    if (km > 500)       { setLogError('Distance must be under 500 km.'); return }
    setLogError('')
    const co2g = calcTripCO2(logMode, km)
    setTripLog(prev => [
      { id: makeId(), mode: logMode, km, co2g, loggedAt: new Date().toISOString() },
      ...prev,
    ])
    setLogDist('')
  }

  function removeTrip(id) {
    setTripLog(prev => prev.filter(t => t.id !== id))
  }

  const recentTrips = tripLog.slice(0, 10)

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <div className={styles.heroEyebrow}>
                <MdEco size={14} aria-hidden="true" />
                Carbon footprint — DfT 2023 emission factors
              </div>
              <h1 id="page-title" className={styles.heroTitle}>Sustainability</h1>
              <p className={styles.heroSubtitle}>
                Compare the carbon footprint of different travel modes and track your weekly CO₂ against a personal goal.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{formatCO2(weeklyTotalG)}</span>
                <span className={styles.heroStatLabel}>this week</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{thisWeeksTrips.length}</span>
                <span className={styles.heroStatLabel}>trips logged</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>
        <div className="container">
          <div className={styles.grid}>

            {/* ══ LEFT — Carbon Calculator ══ */}
            <div className={styles.col}>

              <section className={styles.card} aria-labelledby="calc-heading">
                <h2 id="calc-heading" className={styles.cardTitle}>
                  <MdTrendingDown size={18} aria-hidden="true" />
                  CO₂ Comparison
                </h2>
                <p className={styles.cardDesc}>
                  Enter a journey distance to compare emissions across travel modes.
                </p>

                <div className={styles.calcRow}>
                  <label htmlFor="calc-distance" className={styles.fieldLabel}>
                    Journey distance (km)
                  </label>
                  <div className={styles.distanceInput}>
                    <input
                      id="calc-distance"
                      type="number"
                      className={styles.input}
                      value={distance}
                      onChange={handleDistanceChange}
                      onBlur={handleDistanceBlur}
                      min="0.1"
                      max="500"
                      step="0.5"
                      aria-describedby={calcError ? 'calc-error' : undefined}
                    />
                    <span className={styles.inputUnit}>km</span>
                  </div>
                  {calcError && <p id="calc-error" className={styles.fieldError}>{calcError}</p>}
                </div>

                {/* Bar chart */}
                {chartData.length > 0 && (
                  <div className={styles.chartWrap} aria-label="CO₂ emissions by transport mode">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11, fill: '#5c6b7a' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#5c6b7a' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={v => v === 0 ? '0' : v >= 1000 ? `${(v/1000).toFixed(1)}kg` : `${v}g`}
                        />
                        <Tooltip content={<CO2Tooltip />} cursor={{ fill: 'rgb(249 115 22 / 0.06)' }} />
                        <Bar dataKey="grams" radius={[4, 4, 0, 0]}>
                          {chartData.map(entry => (
                            <Cell key={entry.mode} fill={entry.colour} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Mode breakdown rows */}
                {distanceKm > 0 && (
                  <ul className={styles.modeBreakdown} role="list">
                    {chartData.map(({ mode, label, grams, colour }) => {
                      const pct     = maxGrams > 0 ? (grams / maxGrams) * 100 : 0
                      const saved   = co2SavedVsCar(mode, distanceKm)
                      const isBest  = grams === 0
                      return (
                        <li key={mode} className={styles.modeRow}>
                          <div className={styles.modeRowHeader}>
                            <span className={styles.modeLabel} style={{ color: colour }}>
                              {label}
                            </span>
                            <span className={styles.modeGrams}>{formatCO2(grams)}</span>
                            {isBest && (
                              <span className={styles.bestBadge}>zero emissions</span>
                            )}
                            {!isBest && saved > 0 && mode !== 'car' && (
                              <span className={styles.savedBadge}>
                                saves {formatCO2(saved)} vs car
                              </span>
                            )}
                          </div>
                          <div
                            className={styles.modeBar}
                            role="meter"
                            aria-valuenow={grams}
                            aria-valuemin={0}
                            aria-valuemax={maxGrams}
                            aria-label={`${label}: ${formatCO2(grams)}`}
                          >
                            <div
                              className={styles.modeBarFill}
                              style={{ width: `${pct}%`, background: colour }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}

                <p className={styles.sourceNote}>
                  Figures from{' '}
                  <span className={styles.sourceHighlight}>UK DfT 2023 greenhouse gas conversion factors</span>{' '}
                  and TfL Travel in London report.
                </p>
              </section>

            </div>

            {/* ══ RIGHT — Goal Tracker ══ */}
            <div className={styles.col}>

              {/* Weekly Goal */}
              <section className={styles.card} aria-labelledby="goal-heading">
                <h2 id="goal-heading" className={styles.cardTitle}>
                  <MdFlag size={18} aria-hidden="true" />
                  Weekly CO₂ Goal
                </h2>
                <p className={styles.cardDesc}>
                  Set a weekly carbon budget and track your progress.
                </p>

                {/* Goal display / edit */}
                {!editingGoal ? (
                  <div className={styles.goalDisplay}>
                    <div className={styles.goalNumbers}>
                      <span className={`${styles.goalUsed} ${overGoal ? styles.goalOver : ''}`}>
                        {formatCO2(weeklyTotalG)}
                      </span>
                      <span className={styles.goalSep}>/</span>
                      <span className={styles.goalTarget}>{formatCO2(weeklyGoalG)} goal</span>
                    </div>

                    <div
                      className={styles.progressTrack}
                      role="meter"
                      aria-valuenow={weeklyTotalG}
                      aria-valuemin={0}
                      aria-valuemax={weeklyGoalG}
                      aria-label={`${formatCO2(weeklyTotalG)} of ${formatCO2(weeklyGoalG)} weekly goal`}
                    >
                      <div
                        className={`${styles.progressFill} ${overGoal ? styles.progressOver : ''}`}
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>

                    <div className={styles.goalMeta}>
                      <span className={styles.goalPct}>
                        {overGoal
                          ? `${formatCO2(weeklyTotalG - weeklyGoalG)} over goal`
                          : `${formatCO2(weeklyGoalG - weeklyTotalG)} remaining`
                        }
                      </span>
                      <button
                        className={styles.editGoalBtn}
                        onClick={() => { setGoalInput((weeklyGoalG / 1000).toFixed(1)); setEditingGoal(true) }}
                      >
                        Change goal
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className={styles.goalForm} onSubmit={saveGoal} noValidate>
                    <label htmlFor="goal-input" className={styles.fieldLabel}>
                      Weekly goal (kg CO₂)
                    </label>
                    <div className={styles.goalInputRow}>
                      <input
                        id="goal-input"
                        type="number"
                        className={styles.input}
                        value={goalInput}
                        onChange={e => setGoalInput(e.target.value)}
                        placeholder="e.g. 2.0"
                        min="0.1"
                        step="0.1"
                        autoFocus
                      />
                      <span className={styles.inputUnit}>kg</span>
                      <button type="submit" className={styles.saveGoalBtn}>Save</button>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => setEditingGoal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>

              {/* Log a trip */}
              <section className={styles.card} aria-labelledby="log-heading">
                <h2 id="log-heading" className={styles.cardTitle}>
                  <MdAdd size={18} aria-hidden="true" />
                  Log a Trip
                </h2>
                <p className={styles.cardDesc}>Record your journeys to track weekly CO₂.</p>

                <form className={styles.logForm} onSubmit={logTrip} noValidate>
                  <div className={styles.modeSelect} role="group" aria-label="Select travel mode">
                    {LOG_MODES.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.modeSelectBtn} ${logMode === id ? styles.modeSelectActive : ''}`}
                        style={{ '--mode-col': MODE_COLOURS[id] }}
                        onClick={() => setLogMode(id)}
                        aria-pressed={logMode === id}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  <div className={styles.logRow}>
                    <label htmlFor="log-dist" className={styles.fieldLabel}>Distance (km)</label>
                    <div className={styles.distanceInput}>
                      <input
                        id="log-dist"
                        type="number"
                        className={styles.input}
                        value={logDist}
                        onChange={e => { setLogError(''); setLogDist(e.target.value) }}
                        placeholder="e.g. 8.5"
                        min="0.1"
                        max="500"
                        step="0.5"
                        required
                      />
                      <span className={styles.inputUnit}>km</span>
                    </div>
                    {logError && <p className={styles.fieldError} role="alert">{logError}</p>}
                  </div>

                  {logDist && parseFloat(logDist) > 0 && (
                    <p className={styles.co2Preview}>
                      ≈ <strong>{formatCO2(calcTripCO2(logMode, parseFloat(logDist)))}</strong> CO₂ for this trip
                    </p>
                  )}

                  <button type="submit" className={styles.logBtn}>
                    <MdAdd size={16} aria-hidden="true" />
                    Log trip
                  </button>
                </form>
              </section>

              {/* Trip log */}
              <section className={styles.card} aria-labelledby="history-heading">
                <h2 id="history-heading" className={styles.cardTitle}>Recent Trips</h2>

                {tripLog.length === 0 ? (
                  <p className={styles.emptyMsg}>No trips logged yet.</p>
                ) : (
                  <ul className={styles.tripList} role="list">
                    {recentTrips.map(trip => {
                      const colour  = MODE_COLOURS[trip.mode] ?? '#64748b'
                      const label   = LOG_MODES.find(m => m.id === trip.mode)?.label ?? trip.mode
                      const isThisWeek = trip.loggedAt >= weekStart
                      return (
                        <li key={trip.id} className={styles.tripItem}>
                          <span
                            className={styles.tripDot}
                            style={{ background: colour }}
                            aria-hidden="true"
                          />
                          <div className={styles.tripBody}>
                            <span className={styles.tripLabel}>{label} · {trip.km} km</span>
                            <span className={styles.tripMeta}>
                              {formatDate(trip.loggedAt)}
                              {isThisWeek && <span className={styles.thisWeekBadge}>this week</span>}
                            </span>
                          </div>
                          <span className={styles.tripCO2}>{formatCO2(trip.co2g)}</span>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => removeTrip(trip.id)}
                            aria-label={`Remove trip: ${label} ${trip.km}km`}
                          >
                            <MdDelete size={15} aria-hidden="true" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {tripLog.length > 10 && (
                  <p className={styles.moreTripNote}>
                    Showing 10 most recent. {tripLog.length - 10} older trips not shown.
                  </p>
                )}
              </section>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SustainabilityPage
