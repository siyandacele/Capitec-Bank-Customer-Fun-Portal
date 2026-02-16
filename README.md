# Capitec Bank | Customer Fun Portal

A production-grade, responsive banking portal built with React and TypeScript. This project covers three distinct frontend briefs a **Customer Spending Insights Dashboard**, a **Loan Eligibility Simulator**, and a **Branch Locator Map** presented as a unified single-page application with consistent design, shared infrastructure, and a single Docker deployment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)

## Features

### 1. Customer Spending Insights Dashboard

- Real-time spending summary with period filtering (7 days, 30 days, 90 days, custom range)
- Spending breakdown by category with interactive charts (Recharts)
- Monthly spending trends over configurable time ranges
- Savings goals tracking with progress indicators
- Paginated transaction history with search, category filtering, and sorting
- Customer profile display

### 2. Loan Eligibility Simulator

- Multi-step eligibility form with per-step Zod validation
- Three-step wizard: Personal Info, Financial Info, Loan Details
- Full eligibility assessment with approval likelihood, risk category, and affordability analysis
- Payment calculator with amortisation schedule
- Loan product catalogue served from the mock API
- Results displayed on a dedicated route with detailed breakdown

### 3. Branch Locator Map

- Interactive Leaflet map with OpenStreetMap tiles, centred on South Africa
- 204 branches and ATMs across 11 cities (Cape Town, Johannesburg, Pretoria, Durban, Port Elizabeth, Bloemfontein, East London, Nelspruit, Polokwane, Kimberley, and others)
- Search by branch name or address
- Filter tabs: All / Branches / ATMs
- Branch detail panel with contact information, services, and popular times bar chart
- Branch/ATM type badges with colour coding

### Cross-Cutting

- Capitec corporate design system (colours, typography, button styles)
- "Responsive (with quotes)" layout using Bootstrap grid with SCSS theme stylesheets
- Dynamic hero sections with per-route titles driven by Redux
- Consistent navigation with active state indicators on main nav and sub-nav
- Custom 404 error page
- MSW (Mock Service Worker) for all API endpoints no external backend required
- Dockerised production build served via Nginx

## Tech Stack

| Layer             | Technology                                 |
| ----------------- | ------------------------------------------ |
| Framework         | React 18, TypeScript                       |
| Build             | Vite 7                                     |
| Routing           | TanStack Router (file-based, type-safe)    |
| Server State      | TanStack Query (React Query)               |
| Client State      | Redux Toolkit                              |
| Form Validation   | Zod, Formik                                |
| UI Primitives     | Radix UI (shadcn/ui)                       |
| Styling           | SCSS (BEM) + Bootstrap Grid + Tailwind CSS |
| Charts            | Recharts                                   |
| Maps              | Leaflet + React Leaflet + OpenStreetMap    |
| Icons             | Lucide React                               |
| API Mocking       | MSW (Mock Service Worker)                  |
| Testing           | Vitest                                     |
| Production Server | Nginx (Alpine)                             |
| Containerisation  | Docker, Docker Compose                     |

## Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose (for containerised deployment)

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production build

```bash
npm run build
```

This type-checks all TypeScript files, compiles SCSS, and bundles the application into the `dist` directory.

### Preview the production build locally

```bash
npm run preview
```

## Docker Deployment

### Using Docker Compose (recommended)

**Build and run:**

```bash
docker compose up --build -d
```

The application will be available at `http://localhost:3000`.

**Stop:**

```bash
docker compose down
```

**Development mode with hot-reload:**

```bash
docker compose --profile dev up
```

### Using Docker directly

```bash
docker build -t loan-app .
docker run -p 3000:80 loan-app
```

## Project Structure

```
src/
├── api/                            # API service layer and mock data providers
│   ├── branchApi.ts                #   Branch locator fake API (reads from JSON)
│   ├── fakeApi.ts                  #   Dashboard fake API (spending, transactions, etc.)
│   ├── loanApi.ts                  #   Loan eligibility and rate calculator fake API
│   └── services.ts                 #   Shared API utilities
│
├── components/                     # Shared components
│   ├── ui/                         #   Radix-based UI primitives (Card, Input, Select, Dialog, etc.)
│   ├── shared/                     #   Skeleton loaders, SummaryCard
│   ├── PageHeader.tsx              #   Main navigation with sub-nav
│   ├── PageFooter.tsx              #   Site footer
│   └── NotFound.tsx                #   404 error page
│
├── hooks/                          # Custom React hooks
│   ├── useQueries.ts               #   Shared TanStack Query hooks (branches, dashboard, etc.)
│   ├── useLoanEligibility.ts       #   Loan eligibility check mutation
│   ├── useLoanRateCalculator.ts    #   Rate calculator mutation
│   ├── useLoanProducts.ts          #   Loan products query
│   ├── useTransactions.ts          #   Paginated transactions query
│   ├── useSpendingSummary.ts       #   Spending summary query
│   ├── useSpendingByCategory.ts    #   Category breakdown query
│   ├── useMonthlyTrends.ts         #   Monthly trends query
│   ├── useSpendingGoals.ts         #   Savings goals query
│   ├── useCustomerProfile.ts       #   Customer profile query
│   └── useAvailableFilters.ts      #   Filter options query
│
├── mocks/                          # MSW setup and static data
│   ├── browser.ts                  #   MSW browser worker setup
│   ├── handlers.ts                 #   All API route handlers
│   └── data/
│       ├── branches.json           #   204 branch/ATM locations across South Africa
│       └── popular-times.json      #   Hourly busyness patterns
│
├── pages/                          # Page-level components
│   ├── Dashboard/
│   │   ├── index.tsx               #   Dashboard page layout
│   │   └── components/             #   CustomerProfile, SpendingSummary, SpendingByCategory,
│   │                               #   MonthlySpendingTrends, SpendingGoals, TransactionsList
│   ├── LoanEligibilitySimulator/
│   │   ├── index.tsx               #   Loan simulator page (legacy entry)
│   │   ├── schemas.ts              #   Zod validation schemas
│   │   └── components/             #   EligibilityForm, EligibilityResult,
│   │                               #   PaymentCalculator, LoanProducts
│   └── BranchLocator/
│       └── index.tsx               #   Branch locator with map, search, and popular times
│
├── routes/                         # TanStack Router file-based routes
│   ├── __root.tsx                  #   Root layout (header, footer, query devtools)
│   ├── index.tsx                   #   / to Dashboard
│   ├── branch-locator.tsx          #   /branch-locator to Branch Locator (hero + page)
│   └── loan-simulator/
│       ├── route.tsx               #   /loan-simulator layout (hero + sidebar)
│       ├── index.tsx               #   /loan-simulator to Check Your Eligibility
│       ├── payment-calculator.tsx  #   /loan-simulator/payment-calculator
│       └── results.tsx             #   /loan-simulator/results
│
├── store/                          # Redux Toolkit
│   ├── index.ts                    #   Store configuration
│   └── slices/
│       ├── filtersSlice.ts         #   Dashboard filter state
│       ├── profileSlice.ts         #   User profile state
│       ├── loanPageSlice.ts        #   Loan page context (title, subtitle, result)
│       └── branchPageSlice.ts      #   Branch page context (title, subtitle)
│
├── styles/                         # SCSS stylesheets
│   ├── index.scss                  #   Main entry (imports, base styles)
│   ├── variables.scss              #   Spacing, shadows, breakpoints
│   ├── utils/                      #   Colours, fonts, global helpers
│   └── theme/                      #   Per-feature BEM stylesheets
│       ├── navigation.scss
│       ├── navigation-sub.scss
│       ├── hero.scss
│       ├── buttons.scss
│       ├── cards.scss
│       ├── typography.scss
│       ├── skeleton.scss
│       ├── customer-profile.scss
│       ├── spending-summary.scss
│       ├── spending-by-category.scss
│       ├── monthly-trends.scss
│       ├── spending-goals.scss
│       ├── transactions-list.scss
│       ├── loan-eligibility.scss
│       ├── branch-locator.scss
│       ├── not-found.scss
│       └── footer.scss
│
├── types/                          # TypeScript type definitions
│   ├── index.ts                    #   Branch, Dashboard, shared types
│   ├── loan.ts                     #   Eligibility, products, rate calculator types
│   └── api.ts                      #   API request/response types
│
├── App.tsx                         # App shell with providers
├── main.tsx                        # Entry point (MSW init, React root)
└── vite-env.d.ts                   # Vite type declarations
```

## Architecture

### Data Flow

All data is served through **MSW (Mock Service Worker)**, which intercepts `fetch` requests in the browser and returns mock responses. This means the application works identically to a real API integration components use standard `fetch` calls via TanStack Query hooks, and the MSW handlers respond with realistic data.

```
Component to Hook (useQuery/useMutation) to fetch('/api/...') to MSW Handler to Fake API to JSON/Generated Data
```

### Routing

Routes are defined using TanStack Router's file-based convention. The `/loan-simulator` section uses a **layout route** (`route.tsx`) that renders a shared hero section, sidebar with loan products, and an `<Outlet />` for child routes.

### State Management

- **Server state**: TanStack Query handles caching, refetching, and loading states for all API data.
- **Client state**: Redux Toolkit manages UI-specific state dashboard filters, page context (dynamic hero titles), and eligibility results passed between routes.

### Styling

Each feature has its own SCSS file in `src/styles/theme/` following BEM naming conventions. Capitec corporate colours are defined in `src/styles/utils/Colours.scss`. Layout uses Bootstrap's grid system. Tailwind CSS is available for utility-level adjustments.

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot-reload |
| `npm run build`   | Type-check and build for production      |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint                               |
| `npm run test`    | Run tests (Vitest)                       |

## Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
```

Currently unused all endpoints are intercepted by MSW. Set this when integrating with a real backend.

### Switching to a Real Backend

1. Remove or conditionally disable MSW in `src/main.tsx`
2. Update `VITE_API_URL` to point to your backend
3. The hooks and components require no changes they already use standard `fetch` calls to `/api/...` endpoints

### API Endpoints (MSW)

| Method | Endpoint                                 | Description              |
| ------ | ---------------------------------------- | ------------------------ |
| GET    | `/api/customers/:id/profile`             | Customer profile         |
| GET    | `/api/customers/:id/spending/summary`    | Spending summary         |
| GET    | `/api/customers/:id/spending/categories` | Spending by category     |
| GET    | `/api/customers/:id/spending/trends`     | Monthly spending trends  |
| GET    | `/api/customers/:id/transactions`        | Paginated transactions   |
| GET    | `/api/customers/:id/goals`               | Savings goals            |
| GET    | `/api/customers/:id/filters`             | Available filter options |
| POST   | `/api/loans/eligibility`                 | Check loan eligibility   |
| GET    | `/api/loans/products`                    | Loan product catalogue   |
| POST   | `/api/loans/calculate-rate`              | Calculate interest rate  |
| GET    | `/api/loans/validation-rules`            | Form validation rules    |
| GET    | `/api/branches`                          | All branches and ATMs    |
| GET    | `/api/branches/:id/popular-times`        | Branch busyness by hour  |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
