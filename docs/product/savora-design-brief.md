# Savora Design Brief

## Identity

- App name: Savora
- Tagline: Cook smarter. Waste less. Eat better.
- Design movement: Culinary Modernism

Savora should feel like warm precision: part kitchen ritual, part intelligent tool. The interface must avoid both sterile health-app coldness and rustic food-blog nostalgia. It should feel editorial, calm, and built for real cooking conditions.

## Brand Principles

- Generous whitespace is functional, not trendy.
- Readability from arm's length matters more than decorative density.
- Earth tones set the base; one sharp accent signals intelligence.
- Display typography should feel magazine-grade.
- Body typography should stay effortless in low-light kitchens.

## Color Tokens

```text
BACKGROUND
--bg-primary:        #FEFCF7
--bg-secondary:      #F5F0E8
--bg-tertiary:       #EDE6D6
--bg-dark:           #1C1814
--bg-dark-secondary: #2A2420

TEXT
--text-primary:      #1C1814
--text-secondary:    #6B5E52
--text-tertiary:     #9C8B7E
--text-inverse:      #FEFCF7

ACCENTS
--accent-primary:    #E8854A
--accent-secondary:  #3DBE6C
--accent-danger:     #D94F3D
--accent-warning:    #F2C94C

SURFACES
--surface-card:      #FFFFFF
--surface-elevated:  #FFFFFF
--border-subtle:     #E8E0D0
--border-strong:     #C8BDB0

AI
--ai-bg:             #EDF9F2
--ai-border:         #3DBE6C
--ai-text:           #1A6640
```

## Typography

### Font Stack

- Display and headings: Fraunces
- UI and body: DM Sans
- Numeric content: DM Mono

### Scale

```text
--text-xs: 11 / 14
--text-sm: 13 / 18
--text-base: 15 / 22
--text-md: 17 / 24
--text-lg: 20 / 28
--text-xl: 24 / 32
--text-2xl: 32 / 40
--text-3xl: 42 / 50
--text-display: 56 / 62
```

## Spacing and Shape

- Base grid: 4px
- Standard card radius: 16px
- Large card radius: 24px
- Chip radius: 8px
- Standard button radius: 12px
- Pill CTA radius: 100px
- Horizontal margins: 20px on phone, 32px on tablet

## Motion

```text
--duration-instant: 80ms
--duration-fast: 150ms
--duration-normal: 250ms
--duration-slow: 400ms
--duration-crawl: 600ms
```

- Standard: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- Decelerate: `cubic-bezier(0.0, 0.0, 0.2, 1)`
- Accelerate: `cubic-bezier(0.4, 0.0, 1.0, 1)`
- Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)`

## Screen Frames

Design all primary screens at `390x844px` with safe areas visible. Every screen needs light and dark mode variants. Cooking mode is intentionally always dark.

## Core Screens

### 1. Onboarding

- Splash on dark espresso background
- Editorial logo lockup and tagline
- Three-slide value prop carousel
- Account setup with lightweight auth and dietary preference chips

### 2. Home / Discovery Feed

- Sticky header with contextual greeting
- Horizontal "Ready to Cook" rail
- Large personalized feed cards
- Collection carousel
- Recently saved row
- Five-tab bottom navigation with elevated center import FAB

### 3. Recipe Detail

- Full-bleed hero image
- Premium editorial treatment for title and source
- Quick stats row
- Primary "Start Cooking" CTA
- Pantry intelligence banner
- Dynamic ingredient list with scalable servings
- Instruction steps with inline timers
- Collapsible nutrition
- Cook log and review history

### 4. Recipe Import

- FAB-triggered method selector
- URL import flow with four states:
  - input
  - processing
  - review
  - success
- Support for OCR, voice dictate, and manual entry paths

### 5. Cooking Mode

- Distinct full-screen dark experience
- Large-step typography optimized for distance viewing
- Automatic timer surfaces
- Voice and gesture affordances
- Persistent wake-lock assumptions
- Quick ingredient drawer

### 6. Pantry

- Inventory overview with category chips
- Expiry intelligence banner
- Smart zero-waste recommendation card
- Grid of ingredient cards
- Add-item flow with search, receipt OCR, and smart free-text parsing

### 7. Discover / Search

- Large search bar with visible filters
- Editorial browse mode when empty
- Live grouped results when searching
- Smart natural-language query interpretation

### 8. Meal Planner

- Weekly calendar header
- Meal slot grid
- Sticky weekly summary footer
- Grocery list grouped by category with pantry-aware prechecks

### 9. Profile

- Large personal avatar header
- Saved/cooked/collection metrics
- Collection mosaic grid
- Cooking journal timeline
- Settings list

## Component Priorities

### Recipe Cards

- Large feed card
- Compact horizontal card
- Grid card

### FAB

- 56x56
- Accent gradient
- Rotation from `+` to `x`
- Elevated above nav bar

### AI Badge

- Pill shape
- Sage-tinted background
- Consistent iconography

### Ingredient Row

- Fixed-width numeric column using DM Mono
- Expandable actions for substitution and pantry add

### Timer

- Distinct inactive and active states
- Support multiple concurrent timers in cooking mode

## Illustration and Iconography

- Use a coherent outline icon set such as Phosphor
- Reserve filled icons for active nav state only
- Empty-state illustrations should feel editorial and warm, not mascot-driven
- Avoid full character avatars

## Dark Mode Rules

```text
--bg-primary     -> #1C1814
--bg-secondary   -> #242018
--bg-tertiary    -> #2E2822
--surface-card   -> #2A2420
--border-subtle  -> #3A332D
--border-strong  -> #4A4038
--text-primary   -> #F5F0E8
--text-secondary -> #9C8B7E
--text-tertiary  -> #6B5E52
```

Accent colors remain unchanged between light and dark modes.

## React Native Implementation Notes

- Use Expo + TypeScript for the initial app shell and iteration speed
- Load Fraunces, DM Sans, and DM Mono with `expo-font` or bundled local assets
- Use React Navigation for the app shell and persistent bottom tabs
- Use Zustand for shared client state
- Use TanStack Query for API sync and server cache
- Use SQLite-backed local storage for recipes, pantry items, and drafts
- Use `expo-keep-awake` in cooking mode
- Use Reanimated for motion implementation
- Plan camera, OCR, and gesture-heavy work around a custom dev client when native modules are needed

## Build Priority

### Sprint 1

1. Recipe Detail Screen
2. Home / Discovery Feed
3. Import URL Flow

### Sprint 2

4. Pantry Screen
5. Cooking Mode
6. Smart Substitution Bottom Sheet

### Sprint 3

7. Discover / Search
8. Meal Planner
9. Profile + Cook Log
10. Onboarding

## Quality Checklist

### Typography

- Fraunces for display and recipe titles
- DM Mono for quantities, timers, and nutrition
- Minimum 11px text size

### Color

- No hardcoded hex values in production UI
- Every screen has a dark variant
- AI features consistently use AI tokens

### Accessibility

- 4.5:1 contrast minimum
- Accessibility labels for interactive controls
- 44x44 minimum touch targets
- No color-only meaning

### Layout

- Spacing values in 4px increments
- 16px card padding
- 20px horizontal screen margins
- 32px minimum section separation

### States

- Buttons: default, pressed, disabled
- Inputs: empty, active, filled, error
- Loading states for import, search, and AI actions

### Mobile Specifics

- Top and bottom safe area support
- Bottom nav never obscures content
- Wake-lock indicator visible in cooking mode
- Landscape layout considered for cooking mode
