/** Base URL for TfL Unified API — no API key required for status endpoints */
const TFL_BASE_URL = 'https://api.tfl.gov.uk'

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
