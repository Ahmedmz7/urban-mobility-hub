// 1. React imports
import { useState } from 'react'

// 2. Third-party imports
import { NavLink, Link } from 'react-router-dom'
import {
  MdDirectionsTransit,
  MdMenu,
  MdClose,
  MdHome,
  MdDirectionsBus,
  MdCalculate,
  MdWarning,
  MdMap,
  MdNearMe,
  MdDirectionsBike,
  MdDashboard,
  MdNotifications,
  MdEco,
} from 'react-icons/md'

// 3. Styles
import styles from './Navbar.module.css'

/**
 * NAV_ITEMS — grouped so we can render a visual divider
 * between the core pages and the live-data pages in mobile.
 */
const NAV_ITEMS = [
  { to: '/',                label: 'Home',           icon: MdHome,           live: false },
  { to: '/travel-modes',    label: 'Travel Modes',   icon: MdDirectionsBus,  live: false },
  { to: '/fare-estimator',  label: 'Fare Estimator', icon: MdCalculate,      live: false },
  { to: '/service-updates', label: 'Live Updates',   icon: MdWarning,        live: true  },
  { to: '/journey-planner', label: 'Journey Planner',icon: MdMap,            live: true  },
  { to: '/nearby-stops',    label: 'Nearby Stops',   icon: MdNearMe,         live: true  },
  { to: '/shared-mobility', label: 'Bike Hire',      icon: MdDirectionsBike, live: true  },
  { to: '/dashboard',       label: 'Dashboard',      icon: MdDashboard,      live: false },
  { to: '/alerts',          label: 'Alerts',         icon: MdNotifications,  live: false },
  { to: '/sustainability',  label: 'Sustainability', icon: MdEco,            live: false },
]

/**
 * Navbar — fixed top navigation.
 * Orange accent on active links; orange logo mark.
 * Collapses to a hamburger drawer below 768 px.
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header role="banner">
        <nav className={styles.navbar} aria-label="Main navigation">
          <div className={`container ${styles.inner}`}>

            {/* Logo */}
            <Link
              to="/"
              className={styles.logo}
              aria-label="Urban Mobility Hub — home"
              onClick={closeMenu}
            >
              <span className={styles.logoMark} aria-hidden="true">
                <MdDirectionsTransit />
              </span>
              <span className={styles.logoText}>
                <span className={styles.logoName}>Urban Mobility Hub</span>
                <span className={styles.logoSub}>St Mary&apos;s University</span>
              </span>
            </Link>

            {/* Desktop links */}
            <ul className={styles.navLinks} role="list">
              {NAV_ITEMS.map(({ to, label, live }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                  >
                    {label}
                    {live && <span className={styles.live} aria-label="live data" />}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Hamburger */}
            <button
              className={styles.menuButton}
              onClick={() => setMenuOpen((p) => !p)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <MdClose /> : <MdMenu />}
            </button>

          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav id="mobile-menu" className={styles.mobileMenu} aria-label="Mobile navigation">
          <ul role="list">
            {NAV_ITEMS.map(({ to, label, icon: Icon, live }, idx) => {
              const prevItem = NAV_ITEMS[idx - 1]
              const showDivider = idx > 0 && live !== prevItem?.live
              return (
                <li key={to}>
                  {showDivider && <div className={styles.mobileDivider} role="separator" />}
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                    }
                    onClick={closeMenu}
                  >
                    <Icon className={styles.mobileLinkIcon} aria-hidden="true" />
                    {label}
                    {live && <span className={styles.live} aria-label="live data" />}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </>
  )
}

export default Navbar
