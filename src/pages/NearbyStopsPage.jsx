// 1. React imports
import { useState } from 'react'

// 2. Third-party imports
import {
  MdNearMe,
  MdDirectionsBus,
  MdTrain,
  MdSubway,
  MdLocationOff,
  MdRefresh,
  MdError,
} from 'react-icons/md'

// 3. Internal imports
import { getNearbyStops, TFL_LINE_COLOURS } from '../services/tflService'

// 4. Styles
import styles from './NearbyStopsPage.module.css'

/** Radius options shown in the selector */
const RADIUS_OPTIONS = [
  { value: 500,  label: '500 m' },
  { value: 800,  label: '800 m' },
  { value: 1200, label: '1.2 km' },
]

/** Mode filter options */
const MODE_FILTERS = [
  { id: 'all',  label: 'All' },
  { id: 'tube', label: 'Tube' },
  { id: 'bus',  label: 'Bus' },
  { id: 'rail', label: 'Rail' },
]

/** Maps TfL mode strings to a display label and icon */
const MODE_META = {
  tube:              { label: 'Tube',              Icon: MdSubway,        colour: '#E32017' },
  overground:        { label: 'Overground',        Icon: MdTrain,         colour: '#EE7C0E' },
  'elizabeth-line':  { label: 'Elizabeth line',    Icon: MdTrain,         colour: '#6950A1' },
  dlr:               { label: 'DLR',               Icon: MdSubway,        colour: '#00A4A7' },
  'national-rail':   { label: 'National Rail',     Icon: MdTrain,         colour: '#7c3aed' },
  bus:               { label: 'Bus',               Icon: MdDirectionsBus, colour: '#2563eb' },
}

/**
 * Formats metres as a readable distance string.
 * @param {number} metres
 */
function formatDistance(metres) {
  if (metres < 1000) return `${Math.round(metres)} m`
  return `${(metres / 1000).toFixed(1)} km`
}

/**
 * Returns a primary mode ID for a stopPoint (used for filtering).
 * @param {object} stop - TfL stopPoint object
 */
function getPrimaryMode(stop) {
  const modes = stop.modes ?? []
  if (modes.includes('tube'))             return 'tube'
  if (modes.includes('elizabeth-line'))   return 'tube'
  if (modes.includes('overground'))       return 'rail'
  if (modes.includes('dlr'))              return 'tube'
  if (modes.includes('national-rail'))    return 'rail'
  if (modes.includes('bus'))              return 'bus'
  return 'rail'
}

/**
 * NearbyStopsPage — uses browser Geolocation API to find the user's position,
 * then fetches the closest stops from the TfL StopPoint API. Results are
 * filterable by mode and searchable by radius.
 */
function NearbyStopsPage() {
  const [stops, setStops]         = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [errorType, setErrorType] = useState(null)
  const [radius, setRadius]       = useState(800)
  const [modeFilter, setModeFilter] = useState('all')
  const [userCoords, setUserCoords] = useState(null)

  async function fetchStops(lat, lon, searchRadius) {
    setLoading(true)
    setError(null)
    setErrorType(null)
    try {
      const results = await getNearbyStops(lat, lon, searchRadius)
      setStops(results)
    } catch (err) {
      setError(err.message)
      setErrorType('api')
    } finally {
      setLoading(false)
    }
  }

  function handleTestLocation() {
    // Paddington Station — used for testing outside the UK
    const lat = 51.5154
    const lon = -0.1755
    setUserCoords({ lat, lon })
    fetchStops(lat, lon, radius)
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setErrorType('unsupported')
      return
    }

    setLoading(true)
    setError(null)
    setStops(null)

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        setUserCoords({ lat: latitude, lon: longitude })
        fetchStops(latitude, longitude, radius)
      },
      err => {
        setLoading(false)
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location access was denied. Please allow location access in your browser settings and try again.')
          setErrorType('permission')
        } else if (err.code === err.TIMEOUT) {
          setError('Location request timed out. Please try again.')
          setErrorType('timeout')
        } else {
          setError('Could not determine your location. Please try again.')
          setErrorType('unknown')
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  function handleRadiusChange(newRadius) {
    setRadius(newRadius)
    if (userCoords) {
      fetchStops(userCoords.lat, userCoords.lon, newRadius)
    }
  }

  const filteredStops = (stops ?? []).filter(stop => {
    if (modeFilter === 'all') return true
    return getPrimaryMode(stop) === modeFilter
  })

  const hasResults  = stops !== null && !loading
  const hasLocation = userCoords !== null

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <p className={styles.heroEyebrow}>Browser Geolocation + TfL StopPoint API</p>
          <h1 id="page-title" className={styles.heroTitle}>Nearby Stops</h1>
          <p className={styles.heroSubtitle}>
            Find the closest bus stops, Tube stations, and rail stops to your current location.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>
        <div className="container">

          {/* ── Controls ── */}
          <div className={styles.controls}>
            <button
              className={styles.locateBtn}
              onClick={handleLocate}
              disabled={loading}
              aria-busy={loading}
            >
              <MdNearMe size={18} aria-hidden="true" />
              {loading
                ? 'Locating…'
                : hasLocation
                  ? 'Re-locate me'
                  : 'Find stops near me'}
            </button>

            <button
              className={styles.testBtn}
              onClick={handleTestLocation}
              disabled={loading}
              type="button"
            >
              Use Paddington (test)
            </button>

            {hasLocation && (
              <div className={styles.radiusGroup} role="group" aria-label="Search radius">
                {RADIUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.radiusBtn} ${radius === opt.value ? styles.radiusBtnActive : ''}`}
                    onClick={() => handleRadiusChange(opt.value)}
                    aria-pressed={radius === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className={styles.skeletonList} role="status" aria-label="Finding nearby stops">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow} aria-hidden="true" />
              ))}
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && error && (
            <div className={styles.errorState} role="alert">
              {errorType === 'permission'
                ? <MdLocationOff size={28} className={styles.errorIcon} aria-hidden="true" />
                : <MdError size={28} className={styles.errorIcon} aria-hidden="true" />
              }
              <div>
                <p className={styles.errorTitle}>
                  {errorType === 'permission' ? 'Location access denied' : 'Could not load stops'}
                </p>
                <p className={styles.errorText}>{error}</p>
                {errorType !== 'permission' && (
                  <button className={styles.retryBtn} onClick={handleLocate}>
                    <MdRefresh size={14} aria-hidden="true" />
                    Try again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {hasResults && !error && (
            <div aria-live="polite">

              {/* Mode filter tabs */}
              <div className={styles.modeFilters} role="tablist" aria-label="Filter by transport mode">
                {MODE_FILTERS.map(f => (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={modeFilter === f.id}
                    className={`${styles.modeTab} ${modeFilter === f.id ? styles.modeTabActive : ''}`}
                    onClick={() => setModeFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <p className={styles.resultsCount}>
                {filteredStops.length === 0
                  ? 'No stops found for this filter.'
                  : `${filteredStops.length} stop${filteredStops.length !== 1 ? 's' : ''} within ${formatDistance(radius)}`
                }
              </p>

              {/* Stop list */}
              {filteredStops.length > 0 && (
                <ul className={styles.stopList} role="list">
                  {filteredStops.map(stop => {
                    const modes   = stop.modes ?? []
                    const lines   = stop.lines ?? []
                    const distStr = stop.distance != null ? formatDistance(stop.distance) : null

                    return (
                      <li key={stop.naptanId ?? stop.id} className={styles.stopRow}>
                        <div className={styles.stopMain}>
                          <div className={styles.stopInfo}>
                            <span className={styles.stopName}>{stop.commonName}</span>
                            <div className={styles.modeBadges}>
                              {modes.map(modeId => {
                                const meta = MODE_META[modeId]
                                if (!meta) return null
                                return (
                                  <span
                                    key={modeId}
                                    className={styles.modeBadge}
                                    style={{ '--mode-colour': meta.colour }}
                                  >
                                    <meta.Icon size={11} aria-hidden="true" />
                                    {meta.label}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                          {distStr && (
                            <span className={styles.stopDistance}>{distStr}</span>
                          )}
                        </div>

                        {/* Served lines */}
                        {lines.length > 0 && (
                          <div className={styles.lines} aria-label="Lines served">
                            {lines.slice(0, 12).map(line => {
                              const colour = TFL_LINE_COLOURS[line.id] ?? '#64748b'
                              return (
                                <span
                                  key={line.id}
                                  className={styles.linePip}
                                  style={{ background: colour }}
                                  title={line.name}
                                  aria-label={line.name}
                                />
                              )
                            })}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}

              <p className={styles.sourceNote}>
                Data from the <span className={styles.sourceHighlight}>TfL StopPoint API</span>.
                Location from your device — not stored or transmitted beyond TfL.
              </p>
            </div>
          )}

          {/* ── Initial state ── */}
          {!hasLocation && !loading && !error && (
            <div className={styles.emptyState}>
              <MdNearMe size={40} className={styles.emptyIcon} aria-hidden="true" />
              <p className={styles.emptyTitle}>Ready when you are</p>
              <p className={styles.emptyText}>
                Click the button above to allow location access and find stops near you.
                Your browser will ask for permission first.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default NearbyStopsPage
