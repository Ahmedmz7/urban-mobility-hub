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

/** Navigation item shape used to build both desktop and mobile menus */
const NAV_ITEMS = [
  { to: '/',                 label: 'Home',            icon: MdHome,             tier: null },
  { to: '/travel-modes',     label: 'Travel Modes',    icon: MdDirectionsBus,    tier: null },
  { to: '/fare-estimator',   label: 'Fare Estimator',  icon: MdCalculate,        tier: null },
  { to: '/service-updates',  label: 'Live Updates',    icon: MdWarning,          tier: 'live' },
  { to: '/journey-planner',  label: 'Journey Planner', icon: MdMap,              tier: 'live' },
  { to: '/nearby-stops',     label: 'Nearby Stops',    icon: MdNearMe,           tier: 'live' },
  { to: '/shared-mobility',  label: 'Bike Hire',       icon: MdDirectionsBike,   tier: 'live' },
  { to: '/dashboard',        label: 'Dashboard',       icon: MdDashboard,        tier: null },
  { to: '/alerts',           label: 'Alerts',          icon: MdNotifications,    tier: null },
  { to: '/sustainability',   label: 'Sustainability',  icon: MdEco,              tier: null },
]

/**
 * Navbar — fixed top navigation bar with responsive mobile drawer.
 * Highlights the active route using React Router's NavLink.
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu  = () => setMenuOpen(false)

  return (
    <>
      <header role="banner">
        <nav className={styles.navbar} aria-label="Main navigation">
          <div className={`container ${styles.inner}`}>

            {/* Logo */}
            <Link to="/" className={styles.logo} aria-label="Urban Mobility Hub — home" onClick={closeMenu}>
              <span className={styles.logoIcon} aria-hidden="true">
                <MdDirectionsTransit />
              </span>
              <span className={styles.logoText}>
                <span className={styles.logoName}>Urban Mobility Hub</span>
                <span className={styles.logoSub}>St Mary&apos;s University</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className={styles.navLinks} role="list">
              {NAV_ITEMS.map(({ to, label, icon: Icon, tier }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                    aria-label={label}
                  >
                    {label}
                    {tier === 'live' && (
                      <span className={styles.badge} aria-label="live data">live</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger button */}
            <button
              className={styles.menuButton}
              onClick={toggleMenu}
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
        <nav
          id="mobile-menu"
          className={styles.mobileMenu}
          aria-label="Mobile navigation"
        >
          <ul role="list">
            {NAV_ITEMS.map(({ to, label, icon: Icon, tier }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                  }
                  onClick={closeMenu}
                  aria-label={label}
                >
                  <Icon className={styles.mobileNavLinkIcon} aria-hidden="true" />
                  {label}
                  {tier === 'live' && (
                    <span className={styles.badge} aria-label="live data">live</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}

export default Navbar
