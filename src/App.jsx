// 1. React imports
// (none needed at root level)

// 2. Third-party imports
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 3. Internal imports — layout components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// 4. Page imports
import HomePage           from './pages/HomePage'
import TravelModesPage    from './pages/TravelModesPage'
import FareEstimatorPage  from './pages/FareEstimatorPage'
import ServiceUpdatesPage from './pages/ServiceUpdatesPage'
import JourneyPlannerPage from './pages/JourneyPlannerPage'
import NearbyStopsPage    from './pages/NearbyStopsPage'
import SharedMobilityPage from './pages/SharedMobilityPage'
import DashboardPage      from './pages/DashboardPage'
import AlertsPage         from './pages/AlertsPage'
import SustainabilityPage from './pages/SustainabilityPage'
import NotFoundPage       from './pages/NotFoundPage'

/**
 * App — root component. Sets up the React Router provider,
 * global layout (Navbar + Footer), and all application routes.
 *
 * Route structure:
 *   /                  → HomePage           (Pass)
 *   /travel-modes      → TravelModesPage    (Pass)
 *   /fare-estimator    → FareEstimatorPage  (Pass)
 *   /service-updates   → ServiceUpdatesPage (Merit)
 *   /journey-planner   → JourneyPlannerPage (Merit)
 *   /nearby-stops      → NearbyStopsPage    (Merit)
 *   /shared-mobility   → SharedMobilityPage (Merit)
 *   /dashboard         → DashboardPage      (Distinction)
 *   /alerts            → AlertsPage         (Distinction)
 *   /sustainability    → SustainabilityPage (Distinction)
 *   *                  → NotFoundPage
 */
function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/"                element={<HomePage />}           />
            <Route path="/travel-modes"    element={<TravelModesPage />}    />
            <Route path="/fare-estimator"  element={<FareEstimatorPage />}  />
            <Route path="/service-updates" element={<ServiceUpdatesPage />} />
            <Route path="/journey-planner" element={<JourneyPlannerPage />} />
            <Route path="/nearby-stops"    element={<NearbyStopsPage />}    />
            <Route path="/shared-mobility" element={<SharedMobilityPage />} />
            <Route path="/dashboard"       element={<DashboardPage />}      />
            <Route path="/alerts"          element={<AlertsPage />}         />
            <Route path="/sustainability"  element={<SustainabilityPage />} />
            <Route path="*"               element={<NotFoundPage />}       />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
