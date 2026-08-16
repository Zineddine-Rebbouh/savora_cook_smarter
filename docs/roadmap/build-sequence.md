# Savora Build Sequence

## Guiding Rule

Each sprint should produce a screen or flow that is both demoable and close to product truth. We should avoid throwaway UI that will be rebuilt once the real experience begins.

## Sprint 1: Core Screens

### 1. Recipe Detail Screen

Why first:

- It is the emotional center of the product.
- It establishes typography, spacing, content hierarchy, and food imagery standards.
- It exercises ingredients, steps, metadata, and pantry signals in one place.

Definition of done:

- polished hero layout
- ingredient list with quantity formatting
- steps list with inline timer recognition
- start cooking CTA
- light and dark modes

### 2. Home / Discovery Feed

Why second:

- It becomes the app's strongest first impression.
- It defines card systems and recommendation patterns reused elsewhere.

Definition of done:

- sticky header
- ready-to-cook rail
- for-you feed cards
- collections row
- persistent bottom nav with import FAB

### 3. Import URL Flow

Why third:

- It is the technical showpiece.
- It proves the user can turn outside content into Savora-native value.

Definition of done:

- add-recipe entry sheet
- URL input state
- processing state
- review state
- success state

## Sprint 2: Intelligence Screens

### 4. Pantry Screen

- inventory grid
- expiry banner
- zero-waste recommendation card
- add-item entry points

### 5. Cooking Mode

- immersive dark interface
- timer surface
- previous/next controls
- ingredient quick-glance drawer
- wake-lock integration hooks

### 6. Smart Substitution Bottom Sheet

- launch from missing ingredients
- display structured substitute suggestions
- clarify confidence and tradeoffs

## Sprint 3: Complete Experience

### 7. Discover / Search

- browse mode
- live search mode
- natural-language interpretation chips

### 8. Meal Planner

- weekly grid
- recipe assignment
- shopping summary
- grocery list surface

### 9. Profile + Cook Log

- identity, collections, stats, journal

### 10. Onboarding

- splash
- value-prop carousel
- account setup

## Execution Principles

- Build Android first for fastest iteration.
- Keep backend contracts mobile-oriented from the start.
- Treat web as a companion, not a parity target.
- Reuse design tokens across all screens before expanding feature count.

## Immediate Next Step

Start `apps/mobile` with the design system, bottom navigation shell, and the Recipe Detail screen as the first polished vertical slice.

