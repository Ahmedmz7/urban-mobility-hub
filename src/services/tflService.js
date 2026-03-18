/** Base URL for TfL Unified API — no API key required for status endpoints */
const TFL_BASE_URL = 'https://api.tfl.gov.uk'

/**
 * Haversine distance between two coordinates in metres.
 * @param {number} lat1 @param {number} lon1 @param {number} lat2 @param {number} lon2
 * @returns {number}
 */
function haversineMetres(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Extracts a value from a TfL additionalProperties array by key.
 * @param {Array} props
 * @param {string} key
 * @returns {string}
 */
export function getBikePointProp(props, key) {
  return props?.find(p => p.key === key)?.value ?? '0'
}

/**
 * Official TfL line brand colours, keyed by TfL line ID.
 * Source: TfL brand guidelines.
 */
export const TFL_LINE_COLOURS = {
  bakerloo:              '#B36305',
  central:               '#E32017',
  circle:                '#FFD300',
  district:              '#00782A',
  'hammersmith-city':    '#F3A9BB',
  jubilee:               '#A0A5A9',
  metropolitan:          '#9B0056',
  northern:              '#000000',
  piccadilly:            '#003688',
  victoria:              '#0098D4',
  'waterloo-city':       '#95CDBA',
  elizabeth:             '#6950A1',
  'london-overground':   '#EE7C0E',
  dlr:                   '#00A4A7',
}

/**
 * Returns a severity category string based on TfL statusSeverity code.
 * @param {number} severity - TfL statusSeverity integer
 * @returns {'good' | 'warning' | 'disrupted'}
 */
export function getSeverityCategory(severity) {
  if (severity === 10 || severity === 20) return 'good'
  if (severity === 9 || severity === 8) return 'warning'
  return 'disrupted'
}

/**
 * Fetches live line status for Underground, Overground, Elizabeth line, and DLR.
 * Uses the TfL Unified API — no API key required for this endpoint.
 * @returns {Promise<Array>} Array of line objects, each with a lineStatuses array
 * @throws {Error} If the network request fails or TfL returns a non-OK status
 */
export async function getLineStatus() {
  const modes = 'tube,overground,elizabeth-line,dlr'
  const url = `${TFL_BASE_URL}/Line/Mode/${modes}/Status`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`TfL API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetches the closest stops/stations to a given coordinate using the TfL StopPoint API.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} [radius=800] - Search radius in metres (max 1500)
 * @returns {Promise<Array>} Array of stopPoint objects sorted by distance
 * @throws {Error} If the request fails
 */
export async function getNearbyStops(lat, lon, radius = 800) {
  const UK_BOUNDS = { latMin: 49.9, latMax: 58.7, lonMin: -11.05, lonMax: 1.78 }
  if (lat < UK_BOUNDS.latMin || lat > UK_BOUNDS.latMax || lon < UK_BOUNDS.lonMin || lon > UK_BOUNDS.lonMax) {
    throw new Error('Your location appears to be outside London. This app covers TfL services in the UK only.')
  }

  const stopTypes = [
    'NaptanMetroStation',
    'NaptanRailStation',
    'NaptanPublicBusCoachTram',
  ].join(',')

  const params = new URLSearchParams({
    lat,
    lon,
    stopTypes,
    radius,
    useStopPointHierarchy: 'false',
    modes: 'tube,overground,elizabeth-line,dlr,national-rail,bus',
  })

  const appKey = import.meta.env.VITE_TFL_APP_KEY
  if (appKey) params.set('app_key', appKey)

  const url = `${TFL_BASE_URL}/StopPoint?${params}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`TfL API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.stopPoints ?? []
}

/**
 * Searches Santander Cycles docking stations by name, with full availability data.
 * The TfL /BikePoint/Search endpoint omits additionalProperties, so we fetch all
 * stations from /BikePoint and filter client-side to get live bike counts.
 * @param {string} query - Station name search term (case-insensitive)
 * @returns {Promise<Array>} Matching BikePoint objects with full additionalProperties
 * @throws {Error} If the request fails
 */
export async function searchBikePoints(query) {
  const params = new URLSearchParams()
  const appKey = import.meta.env.VITE_TFL_APP_KEY
  if (appKey) params.set('app_key', appKey)

  const response = await fetch(`${TFL_BASE_URL}/BikePoint?${params}`)
  if (!response.ok) {
    throw new Error(`TfL API error: ${response.status} ${response.statusText}`)
  }

  const all = await response.json()
  const term = query.toLowerCase()
  return all.filter(station => station.commonName.toLowerCase().includes(term))
}

/**
 * Fetches all Santander Cycles stations and returns those within a given radius,
 * sorted by distance from the supplied coordinates.
 * @param {number} lat
 * @param {number} lon
 * @param {number} [radius=1000] - Search radius in metres
 * @returns {Promise<Array>} Nearby BikePoint objects with a `distance` property added
 * @throws {Error} If the request fails or location is outside UK
 */
export async function getNearbyBikePoints(lat, lon, radius = 1000) {
  const UK_BOUNDS = { latMin: 49.9, latMax: 58.7, lonMin: -11.05, lonMax: 1.78 }
  if (lat < UK_BOUNDS.latMin || lat > UK_BOUNDS.latMax || lon < UK_BOUNDS.lonMin || lon > UK_BOUNDS.lonMax) {
    throw new Error('Your location appears to be outside London. This app covers TfL services in the UK only.')
  }

  const params = new URLSearchParams()
  const appKey = import.meta.env.VITE_TFL_APP_KEY
  if (appKey) params.set('app_key', appKey)

  const response = await fetch(`${TFL_BASE_URL}/BikePoint?${params}`)
  if (!response.ok) {
    throw new Error(`TfL API error: ${response.status} ${response.statusText}`)
  }

  const all = await response.json()
  return all
    .map(station => ({
      ...station,
      distance: haversineMetres(lat, lon, station.lat, station.lon),
    }))
    .filter(station => station.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Plans a journey between two London locations using the TfL Journey Planner API.
 * Accepts station names, postcodes, or "lat,lon" coordinate strings.
 * @param {string} from - Origin location
 * @param {string} to - Destination location
 * @returns {Promise<Array>} Array of journey option objects
 * @throws {Error} If the request fails, location is ambiguous, or no journeys found
 */
export async function planJourney(from, to) {
  const params = new URLSearchParams({ nationalSearch: 'false' })
  const appKey = import.meta.env.VITE_TFL_APP_KEY
  if (appKey) params.set('app_key', appKey)

  const fromEnc = encodeURIComponent(from.trim())
  const toEnc   = encodeURIComponent(to.trim())
  const url = `${TFL_BASE_URL}/Journey/JourneyResults/${fromEnc}/to/${toEnc}?${params}`

  const response = await fetch(url)

  if (response.status === 300) {
    // TfL returns 300 when a location name matches multiple places.
    // Auto-resolve by picking the first suggestion for each ambiguous end,
    // then retry once with the resolved IDs.
    const disambig = await response.json()
    const resolvedFrom = disambig.fromLocationDisambiguation
      ?.disambiguationOptions?.[0]?.parameterValue ?? from
    const resolvedTo = disambig.toLocationDisambiguation
      ?.disambiguationOptions?.[0]?.parameterValue ?? to

    if (resolvedFrom !== from || resolvedTo !== to) {
      return planJourney(resolvedFrom, resolvedTo)
    }
    throw new Error('Location is ambiguous — try a postcode (e.g. SW1A 1AA) or full station name.')
  }
  if (!response.ok) {
    throw new Error(`TfL API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const journeys = data.journeys ?? []

  if (journeys.length === 0) {
    throw new Error('No journeys found between those locations. Try different inputs.')
  }

  return journeys
}
