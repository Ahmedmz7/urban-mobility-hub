// 1. React imports
// (none needed — static component)

// 2. Third-party imports
import { Link } from 'react-router-dom'
import { MdDirectionsTransit } from 'react-icons/md'

// 3. Styles
import styles from './Footer.module.css'

/**
 * Footer — site-wide footer with navigation links, branding,
 * and module/academic attribution.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.grid}>

          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLogo} aria-label="Urban Mobility Hub — home">
              <span className={styles.brandIcon} aria-hidden="true">
                <MdDirectionsTransit />
              </span>
              <span className={styles.brandName}>Urban Mobility Hub</span>
            </Link>
            <p className={styles.brandDesc}>
              A travel information platform helping you plan journeys, compare
              travel modes, and make sustainable choices across the city.
            </p>
            <p className={styles.moduleInfo}>
              CPS4006 — Web Design and Development<br />
              St Mary&apos;s University, Twickenham
            </p>
          </div>

          {/* Travel column */}
          <nav aria-label="Footer travel navigation">
            <div className={styles.column}>
              <p className={styles.columnTitle}>Travel</p>
              <ul className={styles.columnLinks} role="list">
                <li><Link to="/" className={styles.columnLink}>Home</Link></li>
                <li><Link to="/travel-modes" className={styles.columnLink}>Travel Modes</Link></li>
                <li><Link to="/fare-estimator" className={styles.columnLink}>Fare Estimator</Link></li>
                <li><Link to="/journey-planner" className={styles.columnLink}>Journey Planner</Link></li>
                <li><Link to="/nearby-stops" className={styles.columnLink}>Nearby Stops</Link></li>
              </ul>
            </div>
          </nav>

          {/* Tools column */}
          <nav aria-label="Footer tools navigation">
            <div className={styles.column}>
              <p className={styles.columnTitle}>Tools</p>
              <ul className={styles.columnLinks} role="list">
                <li><Link to="/service-updates" className={styles.columnLink}>Live Updates</Link></li>
                <li><Link to="/shared-mobility" className={styles.columnLink}>Bike Hire</Link></li>
                <li><Link to="/dashboard" className={styles.columnLink}>Dashboard</Link></li>
                <li><Link to="/alerts" className={styles.columnLink}>Alerts</Link></li>
                <li><Link to="/sustainability" className={styles.columnLink}>Sustainability</Link></li>
              </ul>
            </div>
          </nav>

        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Urban Mobility Hub — Academic project.
          </p>
          <p className={styles.disclaimer}>
            Travel data sourced from TfL Open Data. Not for commercial use.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
