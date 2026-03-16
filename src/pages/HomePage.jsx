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
  MdDirectionsWalk,
  MdTrain,
  MdDirectionsCar,
  MdSchedule,
  MdPhoneAndroid,
  MdCompareArrows,
  MdLocationOn,
  MdTrendingUp,
} from 'react-icons/md'

// 3. Styles
import styles from './HomePage.module.css'

/** Quick-access links shown directly below the hero */
const QUICK_LINKS = [
  { to: '/journey-planner', label: 'Plan a journey',   icon: MdMap           },
  { to: '/service-updates', label: 'Live updates',     icon: MdWarning       },
  { to: '/nearby-stops',    label: 'Nearby stops',     icon: MdNearMe        },
  { to: '/fare-estimator',  label: 'Fare estimator',   icon: MdCalculate     },
]

/** Feature cards for the "What can you do here?" section */
const FEATURES = [
  {
    to:    '/travel-modes',
    icon:  MdDirectionsBus,
    color: 'var(--color-primary-light)',
    iconColor: 'var(--color-primary)',
    title: 'Compare Travel Modes',
    desc:  'Side-by-side breakdown of bus, rail, cycling, and walking — costs, journey times, and environmental impact.',
  },
  {
    to:    '/fare-estimator',
    icon:  MdCalculate,
    color: 'var(--color-secondary-light)',
    iconColor: 'var(--color-secondary)',
    title: 'Fare & Cost Estimator',
    desc:  'Enter your distance and travel mode to get an instant estimated cost range based on current fare structures.',
  },
  {
    to:    '/service-updates',
    icon:  MdWarning,
    color: 'var(--color-accent-light)',
    iconColor: 'var(--color-accent)',
    title: 'Live Service Updates',
    desc:  'Real-time disruption notices, delays, and closures sourced directly from TfL for all major lines.',
  },
  {
    to:    '/journey-planner',
    icon:  MdMap,
    color: 'var(--color-primary-light)',
    iconColor: 'var(--color-primary)',
    title: 'Journey Planner',
    desc:  'Get step-by-step route options between any two locations, with travel times and interchange guidance.',
  },
  {
    to:    '/dashboard',
    icon:  MdDashboard,
    color: 'var(--color-secondary-light)',
    iconColor: 'var(--color-secondary)',
    title: 'Personal Dashboard',
    desc:  'Save favourite journeys and preferred travel modes so your most-used routes are always one tap away.',
  },
  {
    to:    '/sustainability',
    icon:  MdEco,
    color: 'var(--color-secondary-light)',
    iconColor: 'var(--color-secondary)',
    title: 'Sustainability Tracker',
    desc:  'Compare the carbon footprint of your journeys and track weekly cycling or walking goals.',
  },
]

/** Travel modes preview */
const MODES = [
  { to: '/travel-modes', icon: '🚌', name: 'Bus',     meta: 'Frequent, affordable'  },
  { to: '/travel-modes', icon: '🚆', name: 'Rail',    meta: 'Fast, long-distance'   },
  { to: '/travel-modes', icon: '🚲', name: 'Cycling', meta: 'Zero-emission, flexible' },
  { to: '/travel-modes', icon: '🚶', name: 'Walking', meta: 'Free, healthy'          },
]

/** Journey planning tips */
const TIPS = [
  {
    title: 'Check live updates before you leave',
    text:  'Service disruptions change quickly. Checking the Live Updates page before your journey saves time and stress.',
  },
  {
    title: 'Compare modes for short trips',
    text:  'For journeys under 2 miles, cycling or walking is often faster door-to-door than waiting for public transport.',
  },
  {
    title: 'Off-peak travel saves money',
    text:  'Rail fares can be significantly cheaper outside of 07:00–09:30 and 16:00–19:00 on weekdays.',
  },
  {
    title: 'Use Oyster or contactless',
    text:  'Pay-as-you-go with Oyster or a contactless card caps your daily spending — often cheaper than a day travelcard.',
  },
  {
    title: 'Plan interchanges in advance',
    text:  'London\'s busiest interchanges (King\'s Cross, Waterloo) can add 5–10 minutes. Build this into your journey time.',
  },
  {
    title: 'Cycle hire for the last mile',
    text:  'Santander Cycles are ideal for short connections where buses are infrequent. Check availability via the Bike Hire page.',
  },
]

/**
 * HomePage — static landing page providing urban travel guidance,
 * quick access to key tools, and journey planning information.
 */
function HomePage() {
  return (
    <article aria-label="Urban Mobility Hub home">

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className="container">
          <div className={styles.heroInner}>
            <span className={styles.heroPill} aria-hidden="true">
              <span className={styles.heroPillDot} />
              London &amp; surrounding areas
            </span>
            <h1 id="hero-heading" className={styles.heroHeading}>
              Plan smarter journeys{' '}
              <span className={styles.heroHeadingAccent}>across the city</span>
            </h1>
            <p className={styles.heroDesc}>
              Urban Mobility Hub brings together live service data, fare
              estimates, journey planning, and sustainability tools in one
              place — helping you travel with confidence every day.
            </p>
            <div className={styles.heroActions}>
              <Link to="/journey-planner" className={styles.btnPrimary}>
                <MdMap aria-hidden="true" />
                Plan a journey
              </Link>
              <Link to="/travel-modes" className={styles.btnOutline}>
                Compare travel modes
                <MdArrowForward aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick access strip ── */}
      <section aria-label="Quick access tools">
        <div className={styles.quickAccess}>
          <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <nav aria-label="Quick access navigation">
              <ul className={styles.quickGrid} role="list">
                {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link to={to} className={styles.quickItem}>
                      <span className={styles.quickItemIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      <span className={styles.quickItemLabel}>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.section} aria-labelledby="features-heading">
        <div className="container">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>What you can do</span>
            <h2 id="features-heading" className={styles.sectionTitle}>
              Everything you need in one place
            </h2>
            <p className={styles.sectionDesc}>
              From checking whether your train is running to tracking your
              weekly cycling distance — Urban Mobility Hub covers every part
              of your daily travel routine.
            </p>
          </header>

          <ul className={styles.featureGrid} role="list">
            {FEATURES.map(({ to, icon: Icon, color, iconColor, title, desc }) => (
              <li key={to}>
                <Link to={to} className={styles.featureCard}>
                  <span
                    className={styles.featureCardIcon}
                    style={{ backgroundColor: color, color: iconColor }}
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                  <div className={styles.featureCardBody}>
                    <span className={styles.featureCardTitle}>{title}</span>
                    <p className={styles.featureCardDesc}>{desc}</p>
                  </div>
                  <MdArrowForward className={styles.featureCardArrow} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Travel modes preview ── */}
      <section className={styles.sectionAlt} aria-labelledby="modes-heading">
        <div className="container">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Travel modes</span>
            <h2 id="modes-heading" className={styles.sectionTitle}>
              Choose how you move
            </h2>
            <p className={styles.sectionDesc}>
              Each travel mode has different trade-offs. Explore descriptions,
              benefits, and limitations to find what suits your journey.
            </p>
          </header>

          <ul className={styles.modeGrid} role="list">
            {MODES.map(({ to, icon, name, meta }) => (
              <li key={name}>
                <Link to={to} className={styles.modeCard} aria-label={`Learn about ${name}`}>
                  <span className={styles.modeIcon} role="img" aria-label={name}>{icon}</span>
                  <span className={styles.modeName}>{name}</span>
                  <span className={styles.modeMeta}>{meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Journey planning tips ── */}
      <section className={styles.section} aria-labelledby="tips-heading">
        <div className="container">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Travel guidance</span>
            <h2 id="tips-heading" className={styles.sectionTitle}>
              Tips for smarter urban travel
            </h2>
            <p className={styles.sectionDesc}>
              Simple, practical advice to help you save time and money on
              your everyday journeys around the city.
            </p>
          </header>

          <ul className={styles.tipsList} role="list">
            {TIPS.map(({ title, text }, index) => (
              <li key={title} className={styles.tipItem}>
                <span className={styles.tipNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.tipBody}>
                  <span className={styles.tipTitle}>{title}</span>
                  <p className={styles.tipText}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className={styles.ctaBanner} aria-labelledby="cta-heading">
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h2 id="cta-heading" className={styles.ctaTitle}>
                Ready to plan your next journey?
              </h2>
              <p className={styles.ctaDesc}>
                Use the journey planner or check live service updates now.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link to="/journey-planner" className={styles.btnPrimary}>
                <MdMap aria-hidden="true" />
                Journey planner
              </Link>
              <Link to="/service-updates" className={styles.btnOutline}>
                Live updates
              </Link>
            </div>
          </div>
        </div>
      </section>

    </article>
  )
}

export default HomePage
