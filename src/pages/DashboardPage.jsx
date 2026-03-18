// 1. React imports
import { useState } from 'react'

// 2. Third-party imports
import { Link } from 'react-router-dom'
import {
  MdDirectionsBus,
  MdTrain,
  MdDirectionsBike,
  MdDirectionsWalk,
  MdAdd,
  MdDelete,
  MdMap,
  MdArrowForward,
  MdDashboard,
} from 'react-icons/md'

// 3. Internal imports
import useLocalStorage from '../hooks/useLocalStorage'

// 4. Styles
import styles from './DashboardPage.module.css'

/** Travel mode options the user can mark as preferred */
const ALL_MODES = [
  { id: 'bus',     label: 'Bus',     Icon: MdDirectionsBus,  colour: '#2563eb' },
  { id: 'rail',    label: 'Rail',    Icon: MdTrain,          colour: '#7c3aed' },
  { id: 'cycling', label: 'Cycling', Icon: MdDirectionsBike, colour: '#16a34a' },
  { id: 'walking', label: 'Walking', Icon: MdDirectionsWalk, colour: '#f97316' },
]

/**
 * Generates a simple unique ID from the current timestamp + random suffix.
 * @returns {string}
 */
function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Formats an ISO date string as a short locale date.
 * @param {string} iso
 */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * DashboardPage — personalised travel dashboard using localStorage.
 * Users can save favourite journeys (from/to), preferred travel modes,
 * and typical travel times for their regular routes.
 */
function DashboardPage() {
  const [favourites,      setFavourites]      = useLocalStorage('umh_favourite_journeys', [])
  const [preferredModes,  setPreferredModes]  = useLocalStorage('umh_preferred_modes', [])
  const [travelTimes,     setTravelTimes]     = useLocalStorage('umh_travel_times', [])

  // Add-journey form state
  const [fromVal,    setFromVal]    = useState('')
  const [toVal,      setToVal]      = useState('')
  const [labelVal,   setLabelVal]   = useState('')
  const [formError,  setFormError]  = useState('')

  // Add travel time form state
  const [ttFrom,     setTtFrom]     = useState('')
  const [ttTo,       setTtTo]       = useState('')
  const [ttLabel,    setTtLabel]    = useState('')
  const [ttMinutes,  setTtMinutes]  = useState('')
  const [ttError,    setTtError]    = useState('')

  /* ── Favourite journeys ── */
  function addFavourite(e) {
    e.preventDefault()
    if (!fromVal.trim() || !toVal.trim()) {
      setFormError('Both From and To are required.')
      return
    }
    setFormError('')
    setFavourites(prev => [
      ...prev,
      { id: makeId(), from: fromVal.trim(), to: toVal.trim(), label: labelVal.trim(), savedAt: new Date().toISOString() },
    ])
    setFromVal('')
    setToVal('')
    setLabelVal('')
  }

  function removeFavourite(id) {
    setFavourites(prev => prev.filter(j => j.id !== id))
  }

  /* ── Preferred modes ── */
  function toggleMode(modeId) {
    setPreferredModes(prev =>
      prev.includes(modeId) ? prev.filter(m => m !== modeId) : [...prev, modeId]
    )
  }

  /* ── Travel times ── */
  function addTravelTime(e) {
    e.preventDefault()
    const mins = parseInt(ttMinutes, 10)
    if (!ttFrom.trim() || !ttTo.trim()) { setTtError('From and To are required.'); return }
    if (!mins || mins <= 0)             { setTtError('Enter a valid number of minutes.'); return }
    setTtError('')
    setTravelTimes(prev => [
      ...prev,
      { id: makeId(), from: ttFrom.trim(), to: ttTo.trim(), label: ttLabel.trim(), minutes: mins, savedAt: new Date().toISOString() },
    ])
    setTtFrom('')
    setTtTo('')
    setTtLabel('')
    setTtMinutes('')
  }

  function removeTravelTime(id) {
    setTravelTimes(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <div className={styles.heroEyebrow}>
                <MdDashboard size={14} aria-hidden="true" />
                Personalised — saved to your browser
              </div>
              <h1 id="page-title" className={styles.heroTitle}>My Dashboard</h1>
              <p className={styles.heroSubtitle}>
                Save your regular journeys, preferred travel modes, and typical travel times for quick access.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{favourites.length}</span>
                <span className={styles.heroStatLabel}>saved journeys</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{preferredModes.length}</span>
                <span className={styles.heroStatLabel}>preferred modes</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{travelTimes.length}</span>
                <span className={styles.heroStatLabel}>travel times</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>
        <div className="container">
          <div className={styles.grid}>

            {/* ══ LEFT COLUMN ══ */}
            <div className={styles.col}>

              {/* ── Favourite Journeys ── */}
              <section className={styles.card} aria-labelledby="fav-heading">
                <h2 id="fav-heading" className={styles.cardTitle}>Favourite Journeys</h2>
                <p className={styles.cardDesc}>Save regular from/to pairs for quick access to the Journey Planner.</p>

                {/* Add form */}
                <form className={styles.addForm} onSubmit={addFavourite} noValidate>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="fav-label" className={styles.fieldLabel}>Label (optional)</label>
                      <input
                        id="fav-label"
                        type="text"
                        className={styles.input}
                        value={labelVal}
                        onChange={e => setLabelVal(e.target.value)}
                        placeholder="e.g. Morning commute"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow2}>
                    <div className={styles.formField}>
                      <label htmlFor="fav-from" className={styles.fieldLabel}>From</label>
                      <input
                        id="fav-from"
                        type="text"
                        className={styles.input}
                        value={fromVal}
                        onChange={e => setFromVal(e.target.value)}
                        placeholder="Paddington"
                        required
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="fav-to" className={styles.fieldLabel}>To</label>
                      <input
                        id="fav-to"
                        type="text"
                        className={styles.input}
                        value={toVal}
                        onChange={e => setToVal(e.target.value)}
                        placeholder="London Bridge"
                        required
                      />
                    </div>
                  </div>
                  {formError && <p className={styles.fieldError} role="alert">{formError}</p>}
                  <button type="submit" className={styles.addBtn}>
                    <MdAdd size={16} aria-hidden="true" />
                    Save journey
                  </button>
                </form>

                {/* Saved list */}
                {favourites.length === 0 ? (
                  <p className={styles.emptyMsg}>No journeys saved yet.</p>
                ) : (
                  <ul className={styles.itemList} role="list">
                    {favourites.map(j => (
                      <li key={j.id} className={styles.journeyItem}>
                        <div className={styles.journeyBody}>
                          {j.label && <span className={styles.journeyLabel}>{j.label}</span>}
                          <span className={styles.journeyRoute}>
                            {j.from} <MdArrowForward size={12} aria-hidden="true" /> {j.to}
                          </span>
                          <span className={styles.savedDate}>{formatDate(j.savedAt)}</span>
                        </div>
                        <div className={styles.journeyActions}>
                          <Link
                            to={`/journey-planner?from=${encodeURIComponent(j.from)}&to=${encodeURIComponent(j.to)}`}
                            className={styles.planBtn}
                            aria-label={`Plan journey from ${j.from} to ${j.to}`}
                          >
                            <MdMap size={14} aria-hidden="true" />
                            Plan
                          </Link>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => removeFavourite(j.id)}
                            aria-label={`Remove journey from ${j.from} to ${j.to}`}
                          >
                            <MdDelete size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* ── Preferred Modes ── */}
              <section className={styles.card} aria-labelledby="modes-heading">
                <h2 id="modes-heading" className={styles.cardTitle}>Preferred Travel Modes</h2>
                <p className={styles.cardDesc}>Select the modes you typically use. Saved automatically.</p>

                <div className={styles.modesGrid} role="group" aria-label="Travel mode preferences">
                  {ALL_MODES.map(({ id, label, Icon, colour }) => {
                    const active = preferredModes.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.modeBtn} ${active ? styles.modeBtnActive : ''}`}
                        style={{ '--mode-colour': colour }}
                        onClick={() => toggleMode(id)}
                        aria-pressed={active}
                      >
                        <Icon size={22} aria-hidden="true" />
                        <span>{label}</span>
                        {active && <span className={styles.modeCheck} aria-hidden="true">✓</span>}
                      </button>
                    )
                  })}
                </div>

                {preferredModes.length > 0 && (
                  <p className={styles.preferredNote}>
                    Preferred: {preferredModes.map(m => ALL_MODES.find(x => x.id === m)?.label).join(', ')}
                  </p>
                )}
              </section>

            </div>

            {/* ══ RIGHT COLUMN ══ */}
            <div className={styles.col}>

              {/* ── Travel Times ── */}
              <section className={styles.card} aria-labelledby="times-heading">
                <h2 id="times-heading" className={styles.cardTitle}>Typical Travel Times</h2>
                <p className={styles.cardDesc}>Record how long your regular routes actually take.</p>

                <form className={styles.addForm} onSubmit={addTravelTime} noValidate>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="tt-label" className={styles.fieldLabel}>Label (optional)</label>
                      <input
                        id="tt-label"
                        type="text"
                        className={styles.input}
                        value={ttLabel}
                        onChange={e => setTtLabel(e.target.value)}
                        placeholder="e.g. Evening commute"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow2}>
                    <div className={styles.formField}>
                      <label htmlFor="tt-from" className={styles.fieldLabel}>From</label>
                      <input
                        id="tt-from"
                        type="text"
                        className={styles.input}
                        value={ttFrom}
                        onChange={e => setTtFrom(e.target.value)}
                        placeholder="Paddington"
                        required
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="tt-to" className={styles.fieldLabel}>To</label>
                      <input
                        id="tt-to"
                        type="text"
                        className={styles.input}
                        value={ttTo}
                        onChange={e => setTtTo(e.target.value)}
                        placeholder="London Bridge"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="tt-minutes" className={styles.fieldLabel}>Typical duration (minutes)</label>
                      <input
                        id="tt-minutes"
                        type="number"
                        className={styles.input}
                        value={ttMinutes}
                        onChange={e => setTtMinutes(e.target.value)}
                        placeholder="45"
                        min="1"
                        max="480"
                        required
                      />
                    </div>
                  </div>
                  {ttError && <p className={styles.fieldError} role="alert">{ttError}</p>}
                  <button type="submit" className={styles.addBtn}>
                    <MdAdd size={16} aria-hidden="true" />
                    Save time
                  </button>
                </form>

                {travelTimes.length === 0 ? (
                  <p className={styles.emptyMsg}>No travel times saved yet.</p>
                ) : (
                  <ul className={styles.itemList} role="list">
                    {travelTimes.map(t => (
                      <li key={t.id} className={styles.timeItem}>
                        <div className={styles.timeBody}>
                          {t.label && <span className={styles.journeyLabel}>{t.label}</span>}
                          <span className={styles.journeyRoute}>
                            {t.from} <MdArrowForward size={12} aria-hidden="true" /> {t.to}
                          </span>
                          <span className={styles.savedDate}>{formatDate(t.savedAt)}</span>
                        </div>
                        <div className={styles.timeRight}>
                          <span className={styles.timeBadge}>{t.minutes} min</span>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => removeTravelTime(t.id)}
                            aria-label={`Remove travel time for ${t.from} to ${t.to}`}
                          >
                            <MdDelete size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* ── Quick links ── */}
              <section className={styles.card} aria-labelledby="links-heading">
                <h2 id="links-heading" className={styles.cardTitle}>Quick Links</h2>
                <nav aria-label="Dashboard quick links">
                  <ul className={styles.quickLinks} role="list">
                    {[
                      { to: '/journey-planner', Icon: MdMap,            label: 'Journey Planner',   desc: 'Plan a new route' },
                      { to: '/service-updates', Icon: MdDirectionsBus,  label: 'Service Updates',   desc: 'Check live disruptions' },
                      { to: '/fare-estimator',  Icon: MdArrowForward,   label: 'Fare Estimator',    desc: 'Estimate journey cost' },
                    ].map(({ to, Icon, label, desc }) => (
                      <li key={to}>
                        <Link to={to} className={styles.quickLink}>
                          <span className={styles.quickLinkIcon}><Icon size={16} aria-hidden="true" /></span>
                          <span className={styles.quickLinkText}>
                            <span className={styles.quickLinkLabel}>{label}</span>
                            <span className={styles.quickLinkDesc}>{desc}</span>
                          </span>
                          <MdArrowForward size={14} className={styles.quickLinkArrow} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardPage
