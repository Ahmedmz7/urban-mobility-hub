// 1. React imports
// (none needed)

// 2. Third-party imports
import { Link } from 'react-router-dom'
import { MdErrorOutline, MdArrowBack } from 'react-icons/md'

// 3. Styles
import styles from './NotFoundPage.module.css'

/**
 * NotFoundPage — displayed for any route that does not match
 * a registered path. Provides a clear message and link back home.
 */
function NotFoundPage() {
  return (
    <main className={styles.page} aria-labelledby="not-found-title">
      <div className={`container ${styles.content}`}>
        <span className={styles.icon} aria-hidden="true">
          <MdErrorOutline />
        </span>
        <h1 id="not-found-title" className={styles.code}>404</h1>
        <h2 className={styles.heading}>Page not found</h2>
        <p className={styles.message}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className={styles.homeLink}>
          <MdArrowBack aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
