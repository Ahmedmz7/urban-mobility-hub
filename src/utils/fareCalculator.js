/**
 * fareCalculator.js — pure fare estimation logic for all supported travel modes.
 * All figures based on TfL 2024 fares (contactless/Oyster, pay-as-you-go).
 * No API calls — all static rate data.
 */

/** @constant {number} Weekly trips assumption for projections */
const WEEKLY_TRIPS = 10

/** @constant {number} Monthly trips assumption for projections */
const MONTHLY_TRIPS = 44

/**
 * Rail fare lookup by approximate distance.
 * Zones are hard to determine from distance alone — these are conservative
 * ranges based on typical inner/outer London journey distances.
 *
 * @param {number} km
 * @returns {{ low: number, high: number }}
 */
function railFareByDistance(km) {
  if (km <= 2)  return { low: 2.80, high: 3.40 }
  if (km <= 5)  return { low: 3.40, high: 4.20 }
  if (km <= 10) return { low: 3.90, high: 5.25 }
  if (km <= 20) return { low: 4.90, high: 6.70 }
  return              { low: 6.20, high: 9.50 }
}

/**
 * Calculates the estimated fare for a given mode and distance.
 *
 * @param {'walking'|'cycling'|'bus'|'rail'} mode
 * @param {number} distanceKm — journey distance in kilometres
 * @returns {{
 *   low: number,
 *   high: number,
 *   isFree: boolean,
 *   rangeLabel: string,
 *   weekly: { low: number, high: number },
 *   monthly: { low: number, high: number },
 *   notes: string[]
 * }}
 */
export function calculateFare(mode, distanceKm) {
  switch (mode) {
    case 'walking':
      return {
        low: 0,
        high: 0,
        isFree: true,
        rangeLabel: 'Free',
        weekly:  { low: 0, high: 0 },
        monthly: { low: 0, high: 0 },
        notes: [
          'No fares, no Oyster, no contactless required',
          'Practical for most journeys under 2–3 km',
          'Legible London signage covers major junctions across the city',
        ],
      }

    case 'cycling':
      return {
        low: 0,
        high: 3.30,
        isFree: false,
        rangeLabel: 'Free – £3.30',
        weekly:  { low: 0, high: 3.30 * WEEKLY_TRIPS },
        monthly: { low: 0, high: 3.30 * MONTHLY_TRIPS },
        notes: [
          'Free if using your own bicycle',
          'Santander Cycles: £3.30 for unlimited 30-minute rides in a day',
          'Annual Santander membership (£90) lowers the per-trip cost significantly',
          'No contactless or Oyster needed — hire via the Santander app or docking terminal',
        ],
      }

    case 'bus': {
      return {
        low: 1.75,
        high: 1.75,
        isFree: false,
        rangeLabel: '£1.75',
        weekly:  { low: 1.75 * WEEKLY_TRIPS, high: 1.75 * WEEKLY_TRIPS },
        monthly: { low: 1.75 * MONTHLY_TRIPS, high: 1.75 * MONTHLY_TRIPS },
        notes: [
          'Flat fare of £1.75 regardless of distance or zone',
          'Hopper rule: tap on a second bus within 1 hour and pay nothing extra',
          'Daily cap: £5.25 — the fourth trip in a day is effectively free',
          'Weekly cap: £26.25 across all bus and tram journeys',
        ],
      }
    }

    case 'rail': {
      const { low, high } = railFareByDistance(distanceKm)
      return {
        low,
        high,
        isFree: false,
        rangeLabel: `£${low.toFixed(2)} – £${high.toFixed(2)}`,
        weekly:  { low: low * WEEKLY_TRIPS,  high: high * WEEKLY_TRIPS  },
        monthly: { low: low * MONTHLY_TRIPS, high: high * MONTHLY_TRIPS },
        notes: [
          'Fare is zone-based, not distance-based — this is an approximation',
          'Off-peak travel (after 09:30 on weekdays) is 20–40% cheaper',
          'Daily caps apply automatically with Oyster or contactless',
          'Use the TfL Journey Planner for an exact fare between specific stations',
        ],
      }
    }

    default:
      throw new Error(`Unknown mode: ${mode}`)
  }
}

/**
 * Calculates fares for all four modes at the given distance.
 * Used to render the full comparison panel.
 *
 * @param {number} distanceKm
 * @returns {Array<{ mode: string, label: string, result: object }>}
 */
export function calculateAllModes(distanceKm) {
  const modes = [
    { mode: 'walking', label: 'Walking'    },
    { mode: 'cycling', label: 'Cycling'    },
    { mode: 'bus',     label: 'Bus'        },
    { mode: 'rail',    label: 'Rail & Tube'},
  ]
  return modes.map(({ mode, label }) => ({
    mode,
    label,
    result: calculateFare(mode, distanceKm),
  }))
}
