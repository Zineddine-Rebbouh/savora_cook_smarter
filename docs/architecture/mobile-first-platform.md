# Mobile-First Platform Architecture

## Thesis

Savora should be structured as one backend serving multiple clients, with the mobile app treated as the primary product surface and the web app treated as a secondary companion.

## Product Surface Roles

### `apps/mobile`

Owns the core value of Savora:

- recipe import
- pantry intelligence
- cooking mode
- voice and gesture interaction
- offline-first recipe access

### `backend`

Owns shared business logic and synchronization:

- authentication
- recipe normalization and storage
- pantry and meal-plan APIs
- AI-assisted parsing and substitution endpoints
- realtime updates via Channels
- background sync and notifications

### `apps/web`

Owns support surfaces only:

- landing page
- account management
- browser-assisted import helpers
- future recipe-sharing surfaces

## Why This Split Works

- The backend investment is reusable regardless of client platform.
- Mobile captures the highest-value workflows first.
- Web can remain intentionally narrow and avoid consuming early product energy.
- Offline-first expectations are easiest to honor when mobile owns the main experience.

## Recommended Repository Direction

```text
apps/
  mobile/
  web/
backend/
docs/
```

## Backend Responsibilities

### Django + DRF

- canonical recipe model
- ingredient normalization
- pantry inventory and expiry logic
- meal planning and grocery aggregation
- auth and profile management

### Channels

- import progress streaming
- sync status events
- collaborative or multi-device updates later

### AI/ML-adjacent Services

- recipe extraction from raw HTML
- OCR cleanup and structure repair
- substitution suggestions
- smart query interpretation

## Mobile Responsibilities

### Local-First Data

- Store recipes, pantry items, and recent plans in SQLite-backed local storage
- Render immediately from local state
- Reconcile in background when network is available

### State Management

- Zustand for cross-screen app state and derived selectors
- A reducer or XState-style flow model for the import funnel

### Hardware Features

- camera capture and OCR
- microphone dictation
- wake-lock handling
- haptics
- gesture detection

## Delivery Recommendation

### Stage 1: Android First

- fastest internal iteration
- sideloadable demos
- no App Store review dependency during early UX refinement

### Stage 2: Dual-Store Launch

- launch iOS and Android together once onboarding, import, pantry, and cooking mode are stable

## Non-Goals for Early Web

- full recipe browsing parity
- cooking mode parity
- pantry-first workflows
- feature duplication just for platform symmetry

## Architectural Rule

If a feature does not strengthen the mobile cooking loop, it should not outrank work on import, pantry intelligence, or cooking mode.
