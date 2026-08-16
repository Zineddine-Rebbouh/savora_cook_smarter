# Savora

Cook smarter. Waste less. Eat better.

Savora is a mobile-first cooking product built around the idea that the app should be useful in the kitchen, not just pleasant on a laptop. The core experience lives on the phone: import recipes, match them to pantry inventory, cook hands-free, and stay in flow while your screen stays awake and your hands stay busy.

## Product Position

Savora is not a recipe website in app form. Its differentiated features are mobile-native:

- Hands-free cooking with voice and gesture support
- Camera OCR for cookbook pages and receipts
- Pantry scanning and structured ingredient tracking
- Wake-lock cooking mode for live step-by-step guidance
- Fast recipe capture from URLs, photos, dictation, and manual entry

If we build web first, we build the least differentiated version of the product first. The mobile app is the product. The web experience comes later as a companion surface.

## Platform Strategy

### Phase 1

- `apps/mobile`: primary product surface
- `backend`: shared API and realtime infrastructure

### Phase 2

- `apps/web`: companion surfaces only
  - landing page
  - account management
  - recipe importer extension support

## Why Mobile First

- The strongest features depend on device hardware and OS integrations.
- React Native gives one client codebase for iOS and Android.
- Django + DRF + Channels stays the same regardless of client platform.
- Android-first delivery shortens iteration time and removes Apple submission friction during early demos.

## Initial Build Order

1. Recipe Detail Screen
2. Home / Discovery Feed
3. Import URL Flow
4. Pantry Screen
5. Cooking Mode
6. Smart Substitution Bottom Sheet
7. Discover / Search
8. Meal Planner
9. Profile + Cook Log
10. Onboarding

## Tech Direction

### Mobile

- React Native
- Expo
- TypeScript
- React Navigation for the app shell and tabs
- Zustand for app-level client state
- TanStack Query for API sync and server cache
- Expo SQLite for offline-first local storage
- Expo Keep Awake for cooking mode
- Reanimated for motion and transitions

### Backend

- Django
- Django REST Framework
- Django Channels
- Local-first sync model with background reconciliation

### Web Companion

- Marketing site
- Account settings
- Import helpers and browser extension support

## Repository Layout

```text
apps/
  mobile/
  web/
backend/
docs/
  architecture/
  product/
  roadmap/
```

## Documents

- [Savora Design Brief](C:/Users/mkrym/OneDrive/Documents/My%20Folders/My%20Profile/My%20Projects/get-recipe/docs/product/savora-design-brief.md)
- [Mobile-First Architecture](C:/Users/mkrym/OneDrive/Documents/My%20Folders/My%20Profile/My%20Projects/get-recipe/docs/architecture/mobile-first-platform.md)
- [Build Sequence Roadmap](C:/Users/mkrym/OneDrive/Documents/My%20Folders/My%20Profile/My%20Projects/get-recipe/docs/roadmap/build-sequence.md)

## Next Build Step

Stand up `apps/mobile` first and treat every early screen as a production-quality vertical slice, not a throwaway prototype.
