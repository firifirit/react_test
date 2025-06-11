# Project Requirements Document (PRD)

## 1. Project Overview

This is a responsive React application designed for both desktop browsers and mobile WebView containers. It features three logical areas—Admin, General Web, and Mobile—each maintained in its own folder. The app uses Vite powered by Bun for ultra-fast builds, TypeScript for end-to-end type safety, and Tailwind CSS (v4.1+) for styling. Users see a public introduction page in English or Korean, can log in via JWT-based authentication, and then access role-based dashboards (admin vs. general user) showcasing Kendo UI’s DataGrid and Chart components.

We’re building this project to demonstrate a full-stack, enterprise-style React setup with real-world features: role-based access control, token refresh logic, responsive layouts, i18n, and integration with third-party UI libraries. Success criteria include a working demo of admin and user flows, stable JWT handling (login, refresh, logout), smooth responsive behavior across breakpoints, and clear separation of concerns in code structure.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (v1)

*   Project scaffold with Vite + Bun + TypeScript

*   Tailwind CSS v4.1+ setup with custom theme (Material-inspired)

*   Fonts: Pretendard, KoPubWorld Dotum, Batang

*   i18n support (English + Korean) with language toggle persisted in localStorage

*   Folder structure:

    *   `/admin`
    *   `/web` (general user)
    *   `/mobile` (responsive layouts, WebView)
    *   `/shared` (utilities, common components)

*   State management via Zustand

*   API client via Axios with interceptors for JWT bearer tokens

*   Authentication flow (login, token storage, auto-refresh, logout)

*   Role-based access control (RBAC) for `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_USER`

*   Public introduction page (no auth required)

*   Demo pages:

    *   Admin Dashboard (`/admin/dashboard`) using Kendo DataGrid + Chart
    *   General User Overview (`/user/overview`) with simplified DataGrid + Chart

*   Responsive header-sidebar layout on desktop, collapsible hamburger menu on mobile

*   Error handling for 401/403 (global Axios interceptors)

*   Docker setup for local development and on-premises deployment

### Out-of-Scope (v1)

*   Manager-specific pages beyond placeholder routing
*   Production-grade backend implementation (only stubbed API spec at `http://localhost:8081`)
*   Additional languages beyond English/Korean
*   Offline support or service workers
*   Push notifications or real-time websockets
*   Extensive branding beyond basic Material-inspired theme

## 3. User Flow

**Anonymous Visitor**\
A new user lands on the Introduction Page. They see a header with language toggle (English/Korean) and a concise description of the app’s value. Two call-to-action buttons allow them to explore the demo (leading to a public “About” page) or go to Login. The language choice persists across pages and refreshes. All content here is accessible without signing in.

**Authenticated User**\
After clicking “Login,” the user enters companyID, userID, and password. Axios posts credentials to `/api/auth/login`. On success, the access and refresh tokens are stored (in memory/cookie), Zustand updates the user store, and the user is redirected to their default landing page based on primary role. The header now shows the user’s name, logout button, and the sidebar displays menu items allowed for their role. They navigate between dashboard components (DataGrid, Chart), and any 401 triggers auto token refresh; a failed refresh logs them out and sends them back to Login.

## 4. Core Features

*   **Project Configuration**

    *   Vite + Bun setup, TypeScript enabled, linting & formatting.

*   **Folder Structure**

    *   `/admin`, `/web`, `/mobile`, and `/shared` directories.

*   **Styling & Theming**

    *   Tailwind CSS v4.1+, custom Material-inspired theme.
    *   Fonts: Pretendard, KoPubWorld Dotum, Batang.

*   **Internationalization (i18n)**

    *   English and Korean support with dynamic text loading.
    *   Language preference stored in `localStorage`.

*   **State Management**

    *   Zustand for global and modular state slices.

*   **API Integration**

    *   Axios client with request/response interceptors.
    *   Base URL: `http://localhost:8081`, `Content-Type: application/json`.
    *   Bearer token injection and token refresh logic.

*   **Authentication & Authorization**

    *   JWT access token (1h) and refresh token (6h).
    *   Login (`POST /api/auth/login`), token renewal, logout.
    *   Role-based route guards for `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_USER`.

*   **Routing & Navigation**

    *   React Router (or equivalent) for protected and public routes.
    *   Sidebar + header layout (desktop), hamburger/overlay menu on mobile.

*   **Admin Dashboard Demo**

    *   Kendo UI DataGrid: sortable, pageable user records.
    *   Kendo UI Chart: activity trends.

*   **General User Page Demo**

    *   Kendo DataGrid: user’s own records.
    *   Single-line Chart: personal metrics.

*   **Error Handling**

    *   Global interceptors for 401 (token flow) and 403 (access denied) errors.

*   **Responsive Design**

    *   Tailwind’s responsive utilities to reflow grids, charts, menus.
    *   Mobile WebView support with bottom nav icons on narrow viewports.

*   **Docker Containerization**

    *   Dockerfile and Docker Compose for local dev and on-premises hosting.

## 5. Tech Stack & Tools

*   **Frontend**

    *   React (v18+), TypeScript

    *   Vite + Bun (build tools)

    *   Tailwind CSS ≥4.1

    *   Zustand (state management)

    *   Axios (HTTP client)

    *   React Router (routing)

    *   react-i18next (internationalization)

    *   Fonts: Pretendard, KoPubWorld Dotum, Batang

    *   Component Libraries:

        *   Shadcn UI (headless UI primitives)
        *   Kendo UI for React (DataGrid, Chart)

*   **Backend (stub/API spec)**

    *   Base URL: `http://localhost:8081`
    *   JWT Bearer tokens
    *   JSON over HTTP, UTF-8 encoding

*   **Deployment & Hosting**

    *   Docker (containers)
    *   On-premises servers

*   **IDE & AI Tools**

    *   VS Code
    *   Cursor (AI-powered IDE)
    *   V0 (AI component builder)
    *   Claude 3.7 Sonnet, Claude 3.5, Gemini 2.5 Pro

## 6. Non-Functional Requirements

*   **Performance**

    *   First Contentful Paint < 2s on 3G/4G.
    *   API calls latency < 500ms.
    *   Grid and Chart render < 200ms per dataset.

*   **Security**

    *   JWTs stored in memory or HTTP-only cookies.
    *   CORS policy configured on API.
    *   CSRF and XSS mitigation (sanitize inputs).
    *   HTTPS required in production.

*   **Scalability**

    *   Modular folder structure for easy feature additions.
    *   Stateless API client that can point to any backend URL.

*   **Usability & Accessibility**

    *   WCAG 2.1 AA compliance (semantic HTML, ARIA labels).
    *   Keyboard navigation for menus and data tables.

*   **Reliability**

    *   Automatic token refresh on 401 responses.
    *   Graceful fallback to Login on unrecoverable auth errors.

## 7. Constraints & Assumptions

*   **Tool Availability**

    *   Bun and Vite must be installable on developer machines.
    *   Kendo UI license available for dev and demo.

*   **Backend Dependency**

    *   API at `http://localhost:8081` supports JWT login, token refresh, and data endpoints.
    *   CORS enabled for development domains.

*   **Environment**

    *   Modern browsers with ES2020 support.
    *   Mobile WebViews (iOS/Android) embedding must support standard `<meta viewport>`.

*   **Language Support**

    *   English and Korean translations will be provided in JSON files.

## 8. Known Issues & Potential Pitfalls

*   **Bun + Vite Compatibility**

    *   Risk: plugin ecosystem mismatches.
    *   Mitigation: pin working versions; test dev scripts early.

*   **CORS & Auth Flow**

    *   Risk: CORS errors blocking tokens.
    *   Mitigation: configure API to allow `Authorization` header and credentials.

*   **Token Refresh Loops**

    *   Risk: simultaneous 401s triggering multiple refresh calls.
    *   Mitigation: queue refresh promise in Axios interceptor.

*   **Kendo UI Performance**

    *   Risk: large datasets slow down DataGrid.
    *   Mitigation: implement pagination, virtualization, or lazy loading.

*   **Font Loading**

    *   Risk: FOIT/FOUT delaying text.
    *   Mitigation: preload key fonts in `<head>`.

*   **i18n Flash of Default Language**

    *   Risk: UI shows English before Korean loads.
    *   Mitigation: detect locale in JS before React render; use a loading state.

*   **Responsive Chart Behavior**

    *   Risk: charts overflow on narrow viewports.
    *   Mitigation: wrap in responsive container that resizes on window resize events.

This PRD captures all core requirements and edge considerations for the initial version. It can serve as the single source of truth for subsequent technical documents: Tech Stack Document, Frontend Guidelines, Backend Structure, App Flow Diagrams, and IDE Rules.
