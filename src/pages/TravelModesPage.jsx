// 1. React imports
// (none needed — static page, no state)

// 2. Third-party imports
import {
  MdDirectionsBus,
  MdTrain,
  MdDirectionsBike,
  MdDirectionsWalk,
} from 'react-icons/md'

// 3. Internal imports
import TravelModeCard from '../components/TravelModeCard'

// 4. Styles
import styles from './TravelModesPage.module.css'

/**
 * Static travel mode dataset.
 * Each entry drives both the TravelModeCard panel and the comparison matrix.
 */
const TRAVEL_MODES = [
  {
    id: 'bus',
    name: 'Bus',
    Icon: MdDirectionsBus,
    color: '#2563eb',
    tag: 'Public Transport',
    description:
      "London's bus network is the largest in the world, covering over 700 routes and running 24 hours on key corridors. Buses connect every borough — from the dense inner city to suburban edges that rail never reaches — making them the true backbone of surface travel.",
    stat: '700+',
    statLabel: 'routes across all 32 boroughs',
    benefits: [
      'Flat £1.75 fare with the Hopper rule (two journeys, one charge)',
      'Only mode with 24-hour service across the network',
      'Covers every area of London, including places rail misses',
      'Growing fleet of zero-emission electric buses',
      'Accessible boarding, audio announcements, priority seating',
    ],
    limitations: [
      'Speed depends on road conditions — congestion causes delays',
      'Journey time is often unpredictable at peak hours',
      'Crowding on popular routes can mean standing-only travel',
      'Dedicated bus lanes are still incomplete on many routes',
    ],
    cost: '£1.75 flat',
    speed: 'Medium',
    carbon: 'Low',
    bestFor: '1–8 km, any zone',
  },
  {
    id: 'rail',
    name: 'Rail & Tube',
    Icon: MdTrain,
    color: '#7c3aed',
    tag: 'Heavy Rail',
    description:
      "The Underground, Overground, Elizabeth line, DLR, and National Rail form one of the world's most complex urban rail systems. When speed and reliability matter above all else — for commuters, airport trips, or cross-city connections — rail is still the default answer.",
    stat: '5m+',
    statLabel: 'Underground journeys per day',
    benefits: [
      'Fastest option for medium to long city journeys',
      'Segregated from road traffic — far more reliable than buses',
      'Services every 2–5 minutes on core lines at peak times',
      'Daily fare capping with Oyster or contactless bank card',
      'Elizabeth line links east and west London in under 45 minutes',
    ],
    limitations: [
      'Peak fares are significantly higher than bus',
      'Severe overcrowding on Central, Jubilee, and Northern lines',
      'Many outer London areas have no direct rail connection',
      'Signal failures and engineering works cause regular disruption',
    ],
    cost: '£2.80–£6.70',
    speed: 'Very fast',
    carbon: 'Low–Medium',
    bestFor: '3–25 km, commuter routes',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    Icon: MdDirectionsBike,
    color: '#16a34a',
    tag: 'Active Travel',
    description:
      "For short to medium urban distances, cycling is often the fastest mode door-to-door — no waiting for a bus, no platform change. The Santander Cycles network and expanding protected lane infrastructure are gradually making cycling viable beyond the confident few.",
    stat: '150g',
    statLabel: 'CO₂ saved per km vs car',
    benefits: [
      'Frequently fastest option for journeys under 5 km in central London',
      'Zero emissions — the highest-impact sustainable choice',
      'No fares — significant cost advantage over months and years',
      'Santander Cycles: 800+ docking stations, no annual subscription required',
      'Consistent health benefits with regular use',
    ],
    limitations: [
      'Exposure to traffic, pollution, and weather on unprotected roads',
      'Not practical for journeys over 10 km or with heavy bags',
      'Protected lane network is still patchy in south and east London',
      'Secure parking at the destination needs to be planned in advance',
    ],
    cost: '~Free / £3.30 hire',
    speed: 'Fast (under 5 km)',
    carbon: 'Zero',
    bestFor: 'Under 8 km, inner London',
  },
  {
    id: 'walking',
    name: 'Walking',
    Icon: MdDirectionsWalk,
    color: '#f97316',
    tag: 'Active Travel',
    description:
      "Walking is systematically underestimated. The Tube map distorts distances — many station pairs that look far apart are under 15 minutes on foot, and that is before factoring in platform waits, interchanges, and exits. For short trips, walking often wins.",
    stat: '15 min',
    statLabel: 'often faster than the Tube door-to-door',
    benefits: [
      'Completely free — no fares, no contactless, no top-up',
      'Zero emissions with zero infrastructure dependency',
      'No timetable — leave when you want, arrive without waiting',
      'Legible London signage makes navigation simple at junctions',
      'Cumulative health benefits significant with 30+ minutes daily',
    ],
    limitations: [
      'Practical limit is roughly 2–3 km before time cost outweighs benefit',
      'Poor weather — heavy rain, ice, and heat — significantly reduces comfort',
      'Some routes feel unsafe or poorly lit at night',
      'Not always accessible for people with mobility impairments',
    ],
    cost: 'Free',
    speed: 'Slow (4–5 km/h)',
    carbon: 'Zero',
    bestFor: 'Under 2 km, any area',
  },
]

/** Data for the comparison matrix at the bottom of the page */
const MATRIX_ROWS = [
  { label: 'Typical cost', key: 'cost' },
  { label: 'Speed',        key: 'speed' },
  { label: 'Carbon',       key: 'carbon' },
  { label: 'Best for',     key: 'bestFor' },
]

/**
 * TravelModesPage — editorial layout with full-width mode panels
 * and a visual comparison matrix. All content is static (Pass Tier).
 */
function TravelModesPage() {
  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <div className={styles.heroLayout}>
            <div className={styles.heroLeft}>
              <h1 id="page-title" className={styles.heroTitle}>
                How do you<br />want to travel?
              </h1>
            </div>
            <div className={styles.heroRight}>
              <p className={styles.heroDesc}>
                Four modes. Different trade-offs. No single right answer — only
                the one that fits your journey, your budget, and your day.
              </p>
              <nav className={styles.modeJumps} aria-label="Jump to mode">
                {TRAVEL_MODES.map(m => (
                  <a
                    key={m.id}
                    href={`#mode-${m.id}`}
                    className={styles.modeJumpLink}
                    style={{ '--mode-color': m.color }}
                  >
                    <m.Icon aria-hidden="true" size={16} />
                    {m.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mode panels ── */}
      <section className={styles.panels} aria-label="Travel modes">
        <div className={styles.panelsInner}>
          {TRAVEL_MODES.map((mode, i) => (
            <TravelModeCard key={mode.id} mode={mode} index={i} />
          ))}
        </div>
      </section>

      {/* ── Comparison matrix ── */}
      <section className={styles.matrix} aria-labelledby="compare-title">
        <div className="container">
          <h2 id="compare-title" className={styles.matrixTitle}>
            Compare at a glance
          </h2>
          <p className={styles.matrixSubtitle}>
            Based on TfL 2024 fares and published emissions data.
          </p>

          <div className={styles.matrixScroll} role="region" aria-label="Mode comparison" tabIndex={0}>
            <div className={styles.matrixGrid}>
              {/* Column headers */}
              {TRAVEL_MODES.map(m => (
                <div
                  key={m.id}
                  className={styles.matrixCol}
                  style={{ '--mode-color': m.color }}
                >
                  <div className={styles.matrixColHeader}>
                    <m.Icon size={20} aria-hidden="true" />
                    <span>{m.name}</span>
                  </div>
                  {MATRIX_ROWS.map(row => (
                    <div key={row.key} className={styles.matrixCell}>
                      <span className={styles.matrixCellLabel}>{row.label}</span>
                      <span className={styles.matrixCellValue}>{m[row.key]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className={styles.matrixNote}>
            Speed and cost are indicative for a typical inner-city journey.
            Carbon figures are per-passenger averages.
          </p>
        </div>
      </section>

    </div>
  )
}

export default TravelModesPage
