/**
 * carbonCalculator.js — CO₂ emission factors for different travel modes.
 * Figures sourced from the UK Department for Transport (DfT) 2023 greenhouse
 * gas conversion factors and TfL Travel in London data.
 * All values in grams of CO₂-equivalent per passenger-kilometre (gCO₂e/km).
 */

/**
 * Emission factors in gCO₂e per passenger-kilometre.
 * @constant
 */
export const CARBON_FACTORS = {
  walking:  0,      // Zero direct emissions
  cycling:  0,      // Zero direct emissions (own bike)
  bus:      82,     // TfL bus average (2023): ~82 gCO₂e/pkm
  rail:     35,     // London Underground + Overground average: ~35 gCO₂e/pkm
  car:      168,    // Average UK petrol car: 168 gCO₂e/pkm (DfT 2023)
}

/**
 * Human-readable labels for each mode.
 * @constant
 */
export const MODE_LABELS = {
  walking:  'Walking',
  cycling:  'Cycling',
  bus:      'Bus',
  rail:     'Rail / Tube',
  car:      'Car (avg)',
}

/**
 * Brand colours for each mode in the chart.
 * @constant
 */
export const MODE_COLOURS = {
  walking:  '#16a34a',
  cycling:  '#15803d',
  bus:      '#2563eb',
  rail:     '#6950a1',
  car:      '#dc2626',
}

/**
 * Calculates CO₂ emissions in grams for a single trip.
 * @param {'walking'|'cycling'|'bus'|'rail'|'car'} mode
 * @param {number} distanceKm
 * @returns {number} CO₂ in grams
 */
export function calcTripCO2(mode, distanceKm) {
  const factor = CARBON_FACTORS[mode] ?? 0
  return factor * distanceKm
}

/**
 * Builds a comparison array across all modes for a given distance.
 * Used to populate the bar chart.
 * @param {number} distanceKm
 * @returns {Array<{ mode: string, label: string, grams: number, colour: string }>}
 */
export function compareAllModes(distanceKm) {
  return Object.keys(CARBON_FACTORS).map(mode => ({
    mode,
    label:  MODE_LABELS[mode],
    grams:  calcTripCO2(mode, distanceKm),
    colour: MODE_COLOURS[mode],
  }))
}

/**
 * Formats grams as a readable string.
 * Below 1000 g → "Xg"; 1000 g or more → "X.Xkg".
 * @param {number} grams
 * @returns {string}
 */
export function formatCO2(grams) {
  if (grams === 0)      return '0g'
  if (grams < 1000)     return `${Math.round(grams)}g`
  return `${(grams / 1000).toFixed(2)}kg`
}

/**
 * Returns the CO₂ saved compared to driving the same distance.
 * @param {'walking'|'cycling'|'bus'|'rail'} mode
 * @param {number} distanceKm
 * @returns {number} grams saved vs car
 */
export function co2SavedVsCar(mode, distanceKm) {
  const carEmissions  = calcTripCO2('car', distanceKm)
  const modeEmissions = calcTripCO2(mode, distanceKm)
  return Math.max(0, carEmissions - modeEmissions)
}
