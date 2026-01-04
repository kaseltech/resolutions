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

---

## Session: January 3, 2026

### Overview
Added social login (Apple/Google), spotlight tutorial for onboarding, help/feedback UI, and various fixes.

---

### Changes Made

#### 1. Social Login - Sign in with Apple & Google
**Files:**
- `src/lib/socialAuth.ts` (NEW)
- `src/lib/biometric.ts` (updated import)
- `src/components/AuthForm.tsx`
- `src/context/AuthContext.tsx`
- `ios/App/App/Info.plist`

- Replaced `capacitor-native-biometric` with `@capgo/capacitor-native-biometric` (better maintained)
- Added `@capgo/capacitor-social-login` for Apple/Google sign in
- Native iOS login uses `signInWithIdToken()` to Supabase
- Web fallback uses Supabase OAuth flow
- Added social logout on sign out (clears cached sessions for account switching)
- Configured Google URL scheme in Info.plist

**Configuration Required:**
- Supabase: Enable Apple/Google providers with client IDs
- Apple Developer: App ID with Sign in with Apple capability
- Apple Developer: Service ID for web OAuth (com.resolutions2026.app.web)
- Google Cloud: iOS OAuth client + Web OAuth client
- Comma-separated client IDs in Supabase for audience validation

#### 2. Simplified Splash Screen
**Files:** `src/components/AnimatedSplash.tsx`

- Removed complex path/grid animations (looked bad)
- Simplified to: logo + twinkling stars + app name
- Smooth fade transitions between phases
- 2 second duration

#### 3. Dark App Icon (No White Border)
**Files:** `scripts/generate-assets.js`

- Changed app icon to full square dark background
- iOS automatically rounds corners
- Matches the dark theme of the app

#### 4. Spotlight Tutorial (Onboarding)
**Files:**
- `src/components/SpotlightTutorial.tsx` (NEW)
- `src/app/page.tsx`

- Coach marks style tutorial that highlights actual UI elements
- 4 steps: Add button, Resolution card, View toggle, Settings button
- Dark overlay with spotlight cutout around highlighted element
- Tooltip card with title, description, navigation
- Auto-scrolls page to bring off-screen elements into view
- Smart tooltip positioning (flips if not enough space)
- Skips steps if element not found
- Stores completion in Preferences

#### 5. Sample Resolution for New Users
**Files:** `src/context/ResolutionContext.tsx`

- Creates a starter resolution for first-time users
- Title: "Complete my first resolution"
- Includes 4 milestones to demonstrate the feature
- 25% progress (first milestone completed)
- Only creates once (tracked via Preferences)

#### 6. Help & Feedback UI
**Files:**
- `src/components/HelpFeedback.tsx` (NEW)
- `src/components/Settings.tsx`

- Two tabs: FAQ and Send Feedback
- FAQ: 5 expandable questions about app usage
- Feedback: Type selector (Bug/Feature/General), optional email, message
- Shows thank-you message on submit (no email backend yet)
- Accessible from Settings > Help & Support

#### 7. Settings Updates
**Files:** `src/components/Settings.tsx`

- Added "Help & Support" section with:
  - Help & FAQ button (opens HelpFeedback modal)
  - View Tutorial button (resets and shows onboarding)

---

### Key Files Added/Modified
| File | Description |
|------|-------------|
| `src/lib/socialAuth.ts` | Apple/Google native + web sign in |
| `src/components/SpotlightTutorial.tsx` | Coach marks onboarding |
| `src/components/HelpFeedback.tsx` | FAQ and feedback UI |
| `src/components/Settings.tsx` | Added help/tutorial options |
| `src/context/ResolutionContext.tsx` | Sample resolution for new users |
| `src/components/AnimatedSplash.tsx` | Simplified splash |
| `scripts/generate-assets.js` | Dark app icon |

---

### Packages Added
- `@capgo/capacitor-native-biometric@8.0.3` (replaced old biometric plugin)
- `@capgo/capacitor-social-login@8.2.9`

---

### Pending/Future
- Email backend for feedback form
- Push notification improvements
- Achievement badges system (planned)

---

## Session: January 4, 2026

### Overview
Major rebrand from "2026 Resolutions" to "YearVow" with new brand identity, colors, and logo.

---

### Changes Made

#### 1. Complete App Rebrand - YearVow
**Brand Identity:**
- Name: YearVow
- Logo: Text-only wordmark ("Year" light + "Vow" bold)
- Primary Color: Midnight Blue `#0F1C2E`
- Secondary/Background: Warm Neutral `#F6F4EF`

**Files Modified:**
- `src/components/Logo.tsx` - New text-based wordmark logo
- `src/context/ThemeContext.tsx` - Updated color palette
- `capacitor.config.ts` - appId: com.yearvow.app, appName: YearVow
- `public/manifest.json` - Updated names and theme colors
- `package.json` - name: yearvow
- `src/app/layout.tsx` - Updated metadata
- `ios/App/App/Info.plist` - CFBundleDisplayName: YearVow
- `ios/App/App.xcodeproj/project.pbxproj` - PRODUCT_NAME updates
- `src/app/page.tsx` - Header uses wordmark logo
- `src/components/AnimatedSplash.tsx` - New splash with wordmark
- `src/components/AuthForm.tsx` - Updated branding
- `src/components/AuthGuard.tsx` - Updated colors
- `src/components/Settings.tsx` - About section
- `scripts/generate-assets.js` - YV monogram app icon
- `src/lib/biometric.ts` - Updated prompts
- `PRIVACY.md` - Updated app name

---

### New Color Palette
```javascript
// Light theme
const lightColors = {
  bg: '#F6F4EF',           // Warm neutral background
  cardBg: '#ffffff',
  accent: '#0F1C2E',       // Midnight blue accent
  text: '#0F1C2E',         // Midnight blue text
};

// Dark theme
const darkColors = {
  bg: '#0F1C2E',           // Midnight blue background
  cardBg: '#1A2B3C',
  accent: '#5B8CB8',       // Lighter blue accent
  text: '#F6F4EF',         // Warm neutral text
};
```

---

### Logo Component
- Text-only wordmark using system fonts
- "Year" in light weight (300), muted color
- "Vow" in bold weight (700), standout color
- Sizes: sm (18px), md (24px), lg (32px), xl (48px)
- Supports light/dark themes

---

### App Icon
- "YV" monogram on midnight blue gradient background
- iOS automatically rounds corners
- Generated at all required iOS sizes

---

### To Apply Changes
1. Run `npm run build`
2. Run `npx cap sync`
3. Clean Xcode build: Product > Clean Build Folder
4. Delete app from simulator/device
5. Rebuild and run
