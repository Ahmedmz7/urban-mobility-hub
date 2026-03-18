// 1. React imports
import { useState, useRef } from 'react'

// 2. Third-party imports
import {
  MdDirectionsBike,
  MdNearMe,
  MdSearch,
  MdError,
  MdLocationOff,
} from 'react-icons/md'

// 3. Internal imports
import { searchBikePoints, getNearbyBikePoints, getBikePointProp } from '../services/tflService'

// 4. Styles
import styles from './SharedMobilityPage.module.css'

/** Radius options for the "near me" search */
const RADIUS_OPTIONS = [
  { value: 500,  label: '500 m' },
  { value: 1000, label: '1 km' },
  { value: 1500, label: '1.5 km' },
]

/**
 * Parses the additionalProperties of a BikePoint into a plain availability object.
 * @param {object} station - TfL BikePoint object
 * @returns {{ bikes: number, emptyDocks: number, totalDocks: number, pct: number }}
 */
function parseAvailability(station) {
  const props       = station.additionalProperties ?? []
  const bikes       = parseInt(getBikePointProp(props, 'NbBikes'), 10)      || 0
  const emptyDocks  = parseInt(getBikePointProp(props, 'NbEmptyDocks'), 10) || 0
  const totalDocks  = parseInt(getBikePointProp(props, 'NbDocks'), 10)      || 0
  const pct         = totalDocks > 0 ? Math.round((bikes / totalDocks) * 100) : 0
  return { bikes, emptyDocks, totalDocks, pct }
}

/**
 * Returns a CSS colour token based on bike availability percentage.
 * @param {number} pct
 */
function availColour(pct) {
  if (pct >= 50) return 'var(--color-success)'
  if (pct >= 20) return 'var(--color-warning)'
  return 'var(--color-error)'
}

/**
 * Formats metres as a readable distance string.
 * @param {number} metres
 */
function formatDistance(metres) {
  if (metres == null) return null
  if (metres < 1000) return `${Math.round(metres)} m`
  return `${(metres / 1000).toFixed(1)} km`
}

/**
 * SharedMobilityPage — displays live Santander Cycles dock availability via the
 * TfL BikePoint API. Users can search stations by name or find the closest docks
 * using their device location.
 */
function SharedMobilityPage() {
  const [stations, setStations]     = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [errorType, setErrorType]   = useState(null)
  const [query, setQuery]           = useState('')
  const [mode, setMode]             = useState(null)   // 'search' | 'nearby'
  const [radius, setRadius]         = useState(1000)
  const [userCoords, setUserCoords] = useState(null)
  const inputRef = useRef(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setErrorType(null)
    setMode('search')
    try {
      const results = await searchBikePoints(query.trim())
      setStations(results)
    } catch (err) {
      setError(err.message)
      setErrorType('api')
    } finally {
      setLoading(false)
    }
  }

  async function fetchNearby(lat, lon, searchRadius) {
    setLoading(true)
    setError(null)
    setErrorType(null)
    try {
      const results = await getNearbyBikePoints(lat, lon, searchRadius)
      setStations(results)
    } catch (err) {
      setError(err.message)
      setErrorType('api')
    } finally {
      setLoading(false)
    }
  }

  function handleNearMe() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setErrorType('unsupported')
      return
    }
    setLoading(true)
    setError(null)
    setStations(null)
    setMode('nearby')

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        setUserCoords({ lat, lon })
        fetchNearby(lat, lon, radius)
      },
      err => {
        setLoading(false)
        setErrorType(err.code === err.PERMISSION_DENIED ? 'permission' : 'geo')
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access denied. Please allow location access and try again.'
            : 'Could not determine your location. Please try again.'
        )
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  function handleTestLocation() {
    // Paddington Station — for testing outside the UK
    const lat = 51.5154
    const lon = -0.1755
    setUserCoords({ lat, lon })
    setMode('nearby')
    fetchNearby(lat, lon, radius)
  }

  function handleRadiusChange(newRadius) {
    setRadius(newRadius)
    if (userCoords) fetchNearby(userCoords.lat, userCoords.lon, newRadius)
  }

  const hasResults = stations !== null && !loading

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <p className={styles.heroEyebrow}>Live data — TfL BikePoint API</p>
          <h1 id="page-title" className={styles.heroTitle}>Santander Cycles</h1>
          <p className={styles.heroSubtitle}>
            Live bike and dock availability at every Santander Cycles station across London.
          </p>

          {/* Controls */}
          <div className={styles.controls}>
            {/* Search form */}
            <form className={styles.searchForm} onSubmit={handleSearch} role="search">
              <label htmlFor="bike-search" className={styles.srOnly}>Search docking stations</label>
              <input
                id="bike-search"
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by station name…"
                autoComplete="off"
              />
              <button
                type="submit"
                className={styles.searchBtn}
                disabled={loading || !query.trim()}
                aria-label="Search stations"
              >
                <MdSearch size={18} aria-hidden="true" />
              </button>
            </form>

            <span className={styles.divider} aria-hidden="true">or</span>

            {/* Near me */}
            <button className={styles.nearBtn} onClick={handleNearMe} disabled={loading}>
              <MdNearMe size={16} aria-hidden="true" />
              Near me
            </button>

            <button className={styles.testBtn} onClick={handleTestLocation} disabled={loading} type="button">
              Use Paddington (test)
            </button>
          </div>

          {/* Radius selector — only shown after a "nearby" search */}
          {mode === 'nearby' && userCoords && (
            <div className={styles.radiusGroup} role="group" aria-label="Search radius">
              {RADIUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.radiusBtn} ${radius === opt.value ? styles.radiusBtnActive : ''}`}
                  onClick={() => handleRadiusChange(opt.value)}
                  aria-pressed={radius === opt.value}
                  disabled={loading}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>
        <div className="container">

          {/* Loading skeleton */}
          {loading && (
            <div className={styles.skeletonList} role="status" aria-label="Loading stations">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} aria-hidden="true" />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className={styles.errorState} role="alert">
              {errorType === 'permission'
                ? <MdLocationOff size={28} className={styles.errorIcon} aria-hidden="true" />
                : <MdError size={28} className={styles.errorIcon} aria-hidden="true" />
              }
              <div>
                <p className={styles.errorTitle}>Could not load stations</p>
                <p className={styles.errorText}>{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {hasResults && !error && (
            <div aria-live="polite">
              <p className={styles.resultsCount}>
                {stations.length === 0
                  ? 'No stations found.'
                  : `${stations.length} station${stations.length !== 1 ? 's' : ''} found`
                }
              </p>

              {stations.length > 0 && (
                <ul className={styles.stationList} role="list">
                  {stations.map(station => {
                    const { bikes, emptyDocks, totalDocks, pct } = parseAvailability(station)
                    const colour  = availColour(pct)
                    const distStr = formatDistance(station.distance)

                    return (
                      <li key={station.id} className={styles.stationCard}>
                        <div className={styles.cardTop}>
                          <div className={styles.stationInfo}>
                            <MdDirectionsBike size={16} className={styles.bikeIcon} aria-hidden="true" />
                            <span className={styles.stationName}>{station.commonName}</span>
                          </div>
                          {distStr && <span className={styles.distance}>{distStr}</span>}
                        </div>

                        {/* Availability bar */}
                        <div className={styles.availRow}>
                          <div
                            className={styles.availBar}
                            role="meter"
                            aria-label={`${pct}% bikes available`}
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className={styles.availFill}
                              style={{ width: `${pct}%`, background: colour }}
                            />
                          </div>
                          <span className={styles.availPct} style={{ color: colour }}>{pct}%</span>
                        </div>

                        {/* Stats */}
                        <div className={styles.stats}>
                          <div className={styles.stat}>
                            <span className={styles.statValue} style={{ color: colour }}>{bikes}</span>
                            <span className={styles.statLabel}>bikes</span>
                          </div>
                          <div className={styles.statDivider} aria-hidden="true" />
                          <div className={styles.stat}>
                            <span className={styles.statValue}>{emptyDocks}</span>
                            <span className={styles.statLabel}>empty docks</span>
                          </div>
                          <div className={styles.statDivider} aria-hidden="true" />
                          <div className={styles.stat}>
                            <span className={styles.statValue}>{totalDocks}</span>
                            <span className={styles.statLabel}>total</span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              <p className={styles.sourceNote}>
                Live data from the <span className={styles.sourceHighlight}>TfL BikePoint API</span>.
                Availability updates every few minutes.
              </p>
            </div>
          )}

          {/* Initial empty state */}
          {!loading && !error && stations === null && (
            <div className={styles.emptyState}>
              <MdDirectionsBike size={40} className={styles.emptyIcon} aria-hidden="true" />
              <p className={styles.emptyTitle}>Find a Santander Cycles dock</p>
              <p className={styles.emptyText}>
                Search by station name or use your location to find the nearest available bikes.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default SharedMobilityPage
