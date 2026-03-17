// 1. React imports
// (none needed — pure presentational component)

// 2. Third-party imports
import { MdCheck } from 'react-icons/md'

// 3. Styles
import styles from './TravelModeCard.module.css'

/**
 * TravelModeCard — full-width horizontal panel for a single travel mode.
 * Renders always-visible description, benefits, and limitations.
 * No toggle, no collapse — content is the design.
 *
 * @param {object} props
 * @param {object} props.mode       — travel mode data object
 * @param {number} props.index      — 0-based position (used for 01/02 label)
 */
function TravelModeCard({ mode, index }) {
  const {
    id,
    name,
    Icon,
    color,
    tag,
    description,
    stat,
    statLabel,
    benefits,
    limitations,
  } = mode

  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className={styles.panel}
      style={{ '--mode-color': color }}
      id={`mode-${id}`}
      aria-labelledby={`mode-name-${id}`}
    >
      {/* ── Header row ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.index} aria-hidden="true">{num}</span>
          <div className={styles.iconWrap} aria-hidden="true">
            <Icon size={28} />
          </div>
          <div className={styles.nameBlock}>
            <span className={styles.tag}>{tag}</span>
            <h2 id={`mode-name-${id}`} className={styles.name}>{name}</h2>
          </div>
        </div>

        <div className={styles.statBlock} aria-label={`${statLabel}: ${stat}`}>
          <span className={styles.statNumber}>{stat}</span>
          <span className={styles.statLabel}>{statLabel}</span>
        </div>
      </div>

      {/* ── Description ── */}
      <p className={styles.description}>{description}</p>

      {/* ── Lists ── */}
      <div className={styles.listsRow}>
        <section className={styles.listCol} aria-label={`${name} benefits`}>
          <h3 className={styles.listHeading}>Why use it</h3>
          <ul className={styles.list}>
            {benefits.map((item, i) => (
              <li key={i} className={styles.benefitItem}>
                <MdCheck className={styles.checkIcon} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.listCol} aria-label={`${name} limitations`}>
          <h3 className={styles.listHeading}>Keep in mind</h3>
          <ul className={styles.list}>
            {limitations.map((item, i) => (
              <li key={i} className={styles.limitItem}>
                <span className={styles.dash} aria-hidden="true">—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}

export default TravelModeCard
