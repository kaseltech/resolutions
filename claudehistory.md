# Claude Code History - 2026 Resolutions App

## Session: January 2, 2026

### Overview
Major UX overhaul of the 2026 Resolutions iOS app built with Next.js, Capacitor, and Supabase.

---

### Changes Made

#### 1. Logo Redesign - Compass Theme
**Files:** `src/components/Logo.tsx`

- Replaced star-based logo with minimalist compass design
- Teal/emerald color scheme (#0d9488, #14b8a6, #2dd4bf, #5eead4)
- Symmetrical design with:
  - North needle (teal gradient)
  - South needle (muted gray)
  - Cardinal direction marks (N, E, S, W)
  - Minor tick marks for NE, SE, SW, NW
  - Clean center pivot point
- Supports light/dark themes
- Optional animation prop

#### 2. Animated Splash Screen - Journey Theme
**Files:** `src/components/AnimatedSplash.tsx`

- Compass appears with needle spinning animation (west to north)
- Subtle grid pattern background (map-like)
- Journey path draws from bottom-left toward compass
- Waypoint dots appear along the path
- Phases: initial → compass → path → complete → fadeOut
- Tagline: "Chart your journey"

#### 3. App Icons & Native Splash
**Files:**
- `scripts/generate-assets.js`
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/*`
- `ios/App/App/Assets.xcassets/Splash.imageset/*`
- `ios/App/App/Base.lproj/LaunchScreen.storyboard`

- Generated new compass app icons at all required sizes
- Created splash screen with journey theme (grid, path, waypoints)
- Updated LaunchScreen.storyboard with dark background color

#### 4. Swipe Gestures Update
**Files:** `src/app/page.tsx`, `src/components/ResolutionCard.tsx`

- Swipe left: Opens Edit modal (blue)
- Swipe right: Opens Journal entry directly (purple)
- Added `openJournalOnMount` prop to ResolutionCard
- Added `onJournalOpened` callback

#### 5. Reminder System Overhaul
**Files:**
- `src/lib/reminders.ts` (NEW)
- `src/context/ResolutionContext.tsx`
- `src/components/ResolutionForm.tsx`
- `src/components/Settings.tsx`

- Installed `@capacitor/local-notifications`
- Created comprehensive reminder service with:
  - Proper notification scheduling (daily/weekly/monthly)
  - Auto-sync on app launch
  - Cancel reminders when resolutions complete or deleted
  - Motivational reminder messages
  - Test notification functionality
- Integrated with ResolutionContext for automatic scheduling
- Added Notifications section in Settings with toggle and test button

#### 6. Face ID Improvements
**Files:** `src/lib/biometric.ts`, `src/components/AuthForm.tsx`

- Auto-triggers Face ID on app launch if enabled
- Added Face ID verification before storing credentials
- Improved error handling with detailed console logging
- Check for stored credentials before prompting
- Added fallback options in verification dialogs

#### 7. Apple-Style Toggle Component
**Files:**
- `src/components/Toggle.tsx` (NEW)
- `src/components/ResolutionForm.tsx`
- `src/components/Settings.tsx`

- Created iOS-style toggle switch component
- Green (#34c759) when enabled, gray when off
- Three sizes: sm, md, lg
- Haptic feedback on toggle
- Integrated in reminder toggle and notifications settings

#### 8. Long-Press Context Menu
**Files:** `src/components/ContextMenu.tsx`, `src/components/ResolutionCard.tsx`

- Created context menu component with useLongPress hook
- 500ms threshold for long-press detection
- Menu items: Edit, Add Progress, Add Journal Entry, Delete
- Prevents text selection on long-press

#### 9. Expanded Motivational Quotes
**Files:** `src/lib/messages.ts`

- Expanded from ~28 to 215 quotes
- 8 categories: Starting, Early Progress, Momentum, Strong Progress, Almost There, Completion, Comeback, General
- Famous quotes from notable figures

---

### Technical Stack
- **Frontend:** Next.js 16.1.1, React 19.2.3
- **Mobile:** Capacitor 8.0.0
- **Backend:** Supabase
- **Key Packages:**
  - @capacitor/local-notifications
  - @capacitor/haptics
  - @capacitor/preferences
  - capacitor-native-biometric
  - sharp (for asset generation)

---

### Color Palette (Current)
```javascript
const YEAR_COLORS = {
  primary: '#0d9488',      // Teal
  secondary: '#14b8a6',    // Lighter teal
  accent: '#2dd4bf',       // Bright teal
  glow: '#5eead4',         // Light glow
};
```

---

### To Test New Assets
1. Clean Xcode build: Product > Clean Build Folder (Cmd+Shift+K)
2. Delete the app from simulator/device
3. Rebuild and run

---

### Pending/Known Issues
- Face ID requires testing on physical device
- OneSignal push notifications configured but server-side not implemented
- Biometric plugin doesn't have SPM support (warning during sync)
