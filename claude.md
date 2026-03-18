# CLAUDE.md — St Mary's Urban Mobility Hub
# CPS4006 Web Design and Development — Assessment 1

This file defines the rules, constraints, and conventions Claude must follow
throughout this project. These are derived directly from the official assessment
brief and must not be deviated from under any circumstances.

---

## Project Identity

- **Project name:** St Mary's Urban Mobility Hub
- **Module:** CPS4006 — Web Design and Development
- **Assessment weight:** 60%
- **Submission deadline:** 8 May 2026
- **Target grade:** Distinction (70–100)
- **Submission format:** Zip of React project + separate PDF report via Moodle

---

## Absolute Constraints

These rules are non-negotiable and override any other preference:

1. **Framework:** React only (latest version). No Next.js, no Remix, no other framework.
2. **Language:** JavaScript only. No TypeScript. The brief does not mention TypeScript.
3. **Build tool:** Vite (already initialised).
4. **Routing:** React Router (react-router-dom) for all client-side navigation. No other routing solution.
5. **Styling:** Plain CSS modules or styled-components or Emotion. No Tailwind CSS (not listed in the brief).
6. **No backend:** This is a front-end only application. No Node.js server, no Express, no database. All data persistence uses localStorage only.
7. **No TypeScript config files:** No tsconfig.json, no .ts or .tsx files anywhere.
8. **Report is separate:** The 3000-word report is a PDF submitted separately. Do not create report content inside the codebase. Do not mix report writing with coding tasks.

---

## Approved Libraries Only

Only use libraries explicitly listed in the assessment brief. If a library is not
listed below, do NOT use it without flagging it first.

**Approved libraries:**
- `react-router-dom` — routing and navigation
- `axios` — HTTP requests to external APIs (or native fetch, both are fine)
- `recharts` OR `chart.js` OR `d3` — data visualisation and charts
- `react-bootstrap` OR `@mui/material` — UI component library
- `formik` OR `react-hook-form` — form handling and validation
- `react-icons` — icons (Font Awesome, Material Icons, etc.)
- `react-toastify` OR `react-notifications` — toast notifications and alerts
- `@testing-library/react` OR `jest` — unit and integration testing
- `socket.io-client` OR `pusher-js` — real-time updates (only if needed)
- `styled-components` OR `@emotion/react` — CSS-in-JS styling

**Do not use:** Tailwind CSS, Redux, Zustand, Firebase, Supabase, NextAuth, or any
library not in the list above without explicit approval.

---

## Project Folder Structure

Maintain this exact folder structure at all times. Never deviate from it:

```
urban-mobility-hub/
├── public/
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, Card, etc.)
│   ├── pages/             # One file per route/page
│   ├── hooks/             # Custom React hooks (useFetch, useLocalStorage, etc.)
│   ├── services/          # All API call functions — Axios/fetch wrappers only
│   ├── context/           # React Context providers (DashboardContext, AlertContext)
│   ├── utils/             # Pure helper functions (fareCalc, carbonCalc, etc.)
│   ├── styles/            # Global CSS, CSS variables, theme definitions
│   ├── App.jsx            # Root component with React Router setup
│   └── main.jsx           # Vite entry point
├── CLAUDE.md
├── .gitignore
├── package.json
└── README.md
```

Never create files at the root of `src/` other than `App.jsx` and `main.jsx`.
Never put API calls directly inside page or component files — they belong in `src/services/`.
Never put business logic inside components — it belongs in `src/utils/` or `src/hooks/`.

---

## Feature Build Order

Build features strictly one at a time in this order. Never combine features.
Never skip ahead. Always complete and confirm each feature before the next.

### Pass Tier (50–59) — Foundation

| # | Feature | Route |
|---|---------|-------|
| 1 | Project setup: global theme, Navbar, Footer, React Router scaffold | all routes |
| 2 | Homepage with urban travel guidance and journey planning info (static) | `/` |
| 3 | Travel Modes page — bus, rail, cycling, walking with descriptions, benefits, limitations | `/travel-modes` |
| 4 | Fare/Cost Estimator — user inputs distance + travel mode, receives estimated cost range | `/fare-estimator` |
| 5 | Responsive design audit — ensure all pages work on mobile, tablet, desktop | all routes |

### Merit Tier (60–69) — API Integration

| # | Feature | Route |
|---|---------|-------|
| 6 | Live Service Updates feed from a public API (delays, closures, disruptions) | `/service-updates` |
| 7 | Journey Planner — API-driven, start + end location → route options | `/journey-planner` |
| 8 | Nearby Stops — browser geolocation + API → closest stations/stops | `/nearby-stops` |
| 9 | Shared Mobility — bike hire availability or live capacity from API | `/shared-mobility` |

### Distinction Tier (70–100) — Advanced Features

| # | Feature | Route |
|---|---------|-------|
| 10 | Personalised Dashboard — save favourite journeys, preferred modes, travel times (localStorage) | `/dashboard` |
| 11 | Travel Alert System — set custom alerts for selected routes or service lines | `/alerts` |
| 12 | Sustainability Section — carbon footprint comparison + weekly goal tracking | `/sustainability` |
| 13 | UI polish pass — accessibility audit, animations, usability improvements | all routes |

---

## After Every Feature

After completing each feature, provide a Git commit message in this exact format:

```
feat(<scope>): <short description in present tense>

- <bullet: what was added>
- <bullet: what was added>
- <bullet: what was added>

Tier: <Pass | Merit | Distinction>
Branch: <feature/feature-name>
```

**Examples of good commit messages:**
```
feat(travel-modes): add travel modes page with bus, rail, cycling, walking

- Created TravelModes.jsx page component
- Added TravelModeCard reusable component in components/
- Included description, benefits, and limitations for each mode
- Registered /travel-modes route in App.jsx

Tier: Pass
Branch: feature/travel-modes
```

```
feat(service-updates): integrate TfL line status API for live disruption feed

- Created tflService.js in services/ for API calls
- Built ServiceUpdates.jsx page with live data fetching
- Added loading and error states with user-friendly messaging
- Used useEffect and useState for data lifecycle management

Tier: Merit
Branch: feature/service-updates
```

---

## Git Branching Strategy

For distinction-level marks, follow this branching strategy:

- `main` — stable, production-ready code only. Never commit directly to main during development.
- `develop` — integration branch. Merge feature branches here first.
- `feature/<feature-name>` — one branch per feature (e.g. `feature/fare-estimator`, `feature/journey-planner`)

**Workflow for each feature:**
1. Create branch: `git checkout -b feature/<feature-name>`
2. Build the feature with regular commits as you go
3. Merge into develop: `git checkout develop && git merge feature/<feature-name>`
4. Delete the feature branch after merging: `git branch -d feature/<feature-name>`
5. Periodically merge develop into main when a tier is fully complete

---

## Code Conventions

Follow these conventions in every file without exception:

### Naming
- Components: PascalCase (e.g. `TravelModeCard.jsx`, `ServiceUpdates.jsx`)
- Hooks: camelCase prefixed with `use` (e.g. `useFetch.js`, `useLocalStorage.js`)
- Services: camelCase suffixed with `Service` (e.g. `tflService.js`, `journeyService.js`)
- Utils: camelCase, descriptive (e.g. `fareCalculator.js`, `carbonCalculator.js`)
- CSS files: same name as the component they style (e.g. `Navbar.module.css`)
- Constants: UPPER_SNAKE_CASE (e.g. `FARE_RATES`, `CARBON_FACTORS`)

### Component structure (every component file in this order)
```jsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { FaBus } from 'react-icons/fa'

// 3. Internal imports (services, hooks, utils, components)
import { getTflLineStatus } from '../services/tflService'

// 4. Styles
import styles from './ComponentName.module.css'

// 5. Component definition with JSDoc comment
/**
 * ComponentName — brief description of what it does
 * @param {object} props
 * @param {string} props.exampleProp — description
 */
function ComponentName({ exampleProp }) {
  // state declarations first
  // then effects
  // then derived values / handlers
  // then return JSX
}

// 6. Default export last
export default ComponentName
```

### General rules
- Use functional components only. No class components.
- Use named exports for utilities and services. Use default exports for components and pages.
- Every component must have a JSDoc comment describing its purpose.
- Every service function must have a JSDoc comment describing parameters and return value.
- No inline styles in JSX. All styles go in CSS module files or styled-components.
- No hardcoded colours in JSX or JS files. All colours defined as CSS variables in `styles/variables.css`.
- No `console.log` statements left in committed code.
- All API keys stored in `.env` file using `VITE_` prefix. Never hardcode API keys.
- `.env` must be in `.gitignore`. Never commit API keys to GitHub.
- Handle all loading and error states for every API call. Never leave the UI blank on failure.

---

## Approved Public APIs

All API calls go inside `src/services/`. Use these free public APIs:

| API | Used for | Docs |
|-----|----------|------|
| TfL Unified API (`api.tfl.gov.uk`) | Line status, journey planner, stop points, bike hire | https://api.tfl.gov.uk |
| OpenRouteService (`api.openrouteservice.org`) | Route options (free tier, needs free API key) | https://openrouteservice.org |
| Browser Geolocation API | Nearby stops (built into the browser, no key needed) | MDN Web Docs |

If TfL is not suitable for a feature, flag an alternative before implementing.
Never use a paid API. Never hardcode mock data as if it were real API data — label mock/fallback data clearly.

---

## Pages and Routing Reference

Every route must be registered in `App.jsx`. The Navbar must highlight the active route.

| Page component | Route path | Tier |
|----------------|-----------|------|
| `HomePage.jsx` | `/` | Pass |
| `TravelModesPage.jsx` | `/travel-modes` | Pass |
| `FareEstimatorPage.jsx` | `/fare-estimator` | Pass |
| `ServiceUpdatesPage.jsx` | `/service-updates` | Merit |
| `JourneyPlannerPage.jsx` | `/journey-planner` | Merit |
| `NearbyStopsPage.jsx` | `/nearby-stops` | Merit |
| `SharedMobilityPage.jsx` | `/shared-mobility` | Merit |
| `DashboardPage.jsx` | `/dashboard` | Distinction |
| `AlertsPage.jsx` | `/alerts` | Distinction |
| `SustainabilityPage.jsx` | `/sustainability` | Distinction |
| `NotFoundPage.jsx` | `*` | All tiers |

---

## Design Requirements

- **Responsive:** Mobile-first. All pages must work on 320px (mobile), 768px (tablet), 1280px (desktop).
- **Accessible:** Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`). All images need `alt` attributes. All form inputs need `<label>` elements.
- **Consistent:** All pages share the same Navbar, Footer, colour scheme, and typography.
- **Colour system:** Define all colours as CSS custom properties in `src/styles/variables.css`. Minimum required variables:
  ```css
  :root {
    --color-primary: /* transit blue */;
    --color-secondary: /* sustainability green */;
    --color-accent: /* highlight/CTA colour */;
    --color-background: /* page background */;
    --color-surface: /* card/panel background */;
    --color-text-primary: /* main text */;
    --color-text-secondary: /* muted text */;
    --color-border: /* borders and dividers */;
    --color-error: /* error states */;
    --color-success: /* success states */;
  }
  ```
- **Typography:** Choose one distinctive heading font and one readable body font. Import from Google Fonts. Define in `variables.css`.
- **No generic look:** The UI must feel purpose-built for urban transport, not like a template.

---

## What NOT to Do

- Do not use Tailwind CSS
- Do not use TypeScript or any `.ts`/`.tsx` files
- Do not build a backend or API server
- Do not use Redux or any state management library other than React Context + useState
- Do not put API calls inside component files
- Do not hardcode API keys in source files
- Do not commit `.env` files to GitHub
- Do not use class components
- Do not use inline styles in JSX
- Do not leave `console.log` in committed code
- Do not skip the Git commit message after each feature
- Do not combine multiple features into one commit
- Do not commit directly to `main` during development

---

## Report Notes (separate document)

The 3000-word report is submitted as a PDF separately from the zip. It must cover:
1. Introduction — purpose of the application
2. Design decisions — UI/UX, component architecture, routing strategy
3. Implementation — key technical decisions and challenges
4. API integration — which APIs, why chosen, how integrated
5. Testing — tests written and manual testing approach
6. Evaluation — strengths, weaknesses, what could be improved
7. Conclusion — reflection on learning outcomes
8. References — Harvard or APA citations for libraries, APIs, and sources

Do not put report text inside the codebase. Do not generate the report during coding sessions.