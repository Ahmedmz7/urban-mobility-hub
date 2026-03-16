// 1. React imports
// (none needed — static page)

// 2. Third-party imports
import { Link } from 'react-router-dom'
import {
  MdMap,
  MdDirectionsBus,
  MdCalculate,
  MdWarning,
  MdNearMe,
  MdDirectionsBike,
  MdDashboard,
  MdEco,
  MdArrowForward,
} from 'react-icons/md'

// 3. Styles
import styles from './HomePage.module.css'

const TOOLS = [
  {
    to:    '/travel-modes',
    icon:  MdDirectionsBus,
    name:  'Travel Modes',
    desc:  'Compare bus, rail, cycling, and walking — costs, times, environmental impact.',
  },
  {
    to:    '/fare-estimator',
    icon:  MdCalculate,
    name:  'Fare Estimator',
    desc:  'Input distance and mode, get an instant estimated cost range.',
  },
  {
    to:    '/service-updates',
    icon:  MdWarning,
    name:  'Live Service Updates',
    desc:  'Real-time disruption notices and delays across TfL lines.',
  },
  {
    to:    '/journey-planner',
    icon:  MdMap,
    name:  'Journey Planner',
    desc:  'Step-by-step routes between any two locations with live data.',
  },
  {
    to:    '/nearby-stops',
    icon:  MdNearMe,
    name:  'Nearby Stops',
    desc:  'Find the closest stations and stops to your current location.',
  },
  {
    to:    '/shared-mobility',
    icon:  MdDirectionsBike,
    name:  'Bike Hire',
    desc:  'Live Santander Cycles dock availability across the city.',
  },
  {
    to:    '/dashboard',
    icon:  MdDashboard,
    name:  'My Dashboard',
    desc:  'Save favourite journeys and preferred modes for quick access.',
  },
  {
    to:    '/sustainability',
    icon:  MdEco,
    name:  'Sustainability',
    desc:  'Carbon footprint comparison and weekly travel goal tracking.',
  },
]

const TIPS = [
  {
    title: 'Check live updates before you leave',
    text:  'Disruptions change quickly. A 30-second check can save you from a 30-minute delay.',
  },
  {
    title: 'Short trips are often faster on foot or bike',
    text:  'For journeys under 2 miles, walking or cycling is frequently faster door-to-door than waiting for a bus.',
  },
  {
    title: 'Off-peak fares are significantly cheaper',
    text:  'Travelling outside 07:00–09:30 and 16:00–19:00 on weekdays can halve your rail fare.',
  },
  {
    title: 'Contactless caps your daily spend',
    text:  'Pay-as-you-go with Oyster or contactless card applies a daily cap — often less than a day travelcard.',
  },
]

/**
 * HomePage — static landing page with hero, tools list,
 * journey planning guidance, and travel tips.
 */
function HomePage() {
  return (
    <article>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className="container">
          <p className={styles.heroLabel} aria-hidden="true">Urban Mobility Hub</p>
          <h1 id="hero-heading" className={styles.heroHeading}>
            Plan your city journeys with confidence
          </h1>
          <p className={styles.heroDesc}>
            Live service data, fare estimates, journey planning, and
            sustainability tools — all in one place.
          </p>
          <div className={styles.heroActions}>
            <Link to="/journey-planner" className={styles.btnMain}>
              Plan a journey
            </Link>
            <Link to="/travel-modes" className={styles.btnGhost}>
              Compare travel modes
              <MdArrowForward className={styles.heroArrow} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar} role="region" aria-label="Key facts">
        <div className="container" style={{ padding: 0 }}>
          <dl className={styles.statsInner}>
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>Travel modes covered</dt>
              <dd className={styles.statValue}>4</dd>
            </div>
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>TfL lines monitored</dt>
              <dd className={styles.statValue}>13+</dd>
            </div>
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>Bike hire docks tracked</dt>
              <dd className={styles.statValue}>800+</dd>
            </div>
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>Data source</dt>
              <dd className={styles.statValue}>TfL API</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ── Tools ── */}
      <section className={styles.tools} aria-labelledby="tools-heading">
        <div className="container">
          <header className={styles.toolsHeader}>
            <p className={styles.sectionEyebrow}>What's available</p>
            <h2 id="tools-heading" className={styles.sectionTitle}>Everything you need</h2>
          </header>

          <nav aria-label="Application tools">
            <ul className={styles.toolList} role="list">
              {TOOLS.map(({ to, icon: Icon, name, desc }) => (
                <li key={to}>
                  <Link to={to} className={styles.toolItem}>
                    <span className={styles.toolLeft}>
                      <span className={styles.toolIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      <span className={styles.toolText}>
                        <span className={styles.toolName}>{name}</span>
                        <span className={styles.toolDesc}>{desc}</span>
                      </span>
                    </span>
                    <MdArrowForward className={styles.toolArrow} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ── Travel guidance ── */}
      <section className={styles.guidance} aria-labelledby="tips-heading">
        <div className="container">
          <div className={styles.guidanceLayout}>

            <div className={styles.guidanceSide}>
              <h2 id="tips-heading" className={styles.guidanceSideTitle}>
                Tips for smarter urban travel
              </h2>
              <p className={styles.guidanceSideDesc}>
                Simple, practical advice for everyday journeys around the city.
                No jargon — just what actually helps.
              </p>
              <Link to="/travel-modes" className={styles.guidanceSideLink}>
                View all travel modes
                <MdArrowForward aria-hidden="true" />
              </Link>
            </div>

            <ul className={styles.tipGrid} role="list">
              {TIPS.map(({ title, text }, i) => (
                <li key={title} className={styles.tipRow}>
                  <span className={styles.tipNum} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.tipBody}>
                    <span className={styles.tipTitle}>{title}</span>
                    <p className={styles.tipText}>{text}</p>
                  </div>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta} aria-labelledby="cta-heading">
        <div className="container">
          <div className={styles.ctaLayout}>
            <div className={styles.ctaText}>
              <h2 id="cta-heading" className={styles.ctaTitle}>
                Ready to check live service status?
              </h2>
              <p className={styles.ctaSubtext}>
                Updated in real time from TfL Open Data.
              </p>
            </div>
            <Link to="/service-updates" className={styles.ctaBtn}>
              View live updates
              <MdArrowForward aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

    </article>
  )
}

export default HomePage
