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

#### 2. Dashboard Simplification
**Files:** `src/components/DashboardStats.tsx`

- Redesigned to follow "Reflection > Tracking > Metrics" philosophy
- Main view shows only:
  - Time awareness bar ("Week X of 52 | X days left in 2026")
  - Daily inspirational quote (refreshable)
- All metrics moved to collapsible "Insights" section (opt-in):
  - Summary stats (resolutions, completed, overall %)
  - Overall progress bar
  - Achievement progress
  - Category breakdown
- Gentler empty state messaging
- Feels like "private notebook, not dashboard"

#### 3. Desktop Interaction Fixes
**Files:** `src/components/ContextMenu.tsx`, `src/components/ResolutionCard.tsx`, `src/app/page.tsx`

- Split interactions by input type (mobile vs desktop)
- **Mobile (touch):**
  - Long-press (500ms) opens action menu
  - Swipe gestures for Edit/Journal
- **Desktop (mouse):**
  - Long-press disabled (was causing accidental triggers)
  - Menu button (⋮) visible on card hover
  - Drag handle visible on card hover (top-right)
  - Drag only initiates from handle, not whole card

#### 4. Desktop Menu UX - Popover
**Files:** `src/components/ContextMenu.tsx`, `src/components/ResolutionCard.tsx`

- Desktop: Lightweight popover anchored to ⋮ button
  - Smaller icons, lighter font weight
  - No backdrop blur, click outside to dismiss
  - Closes on scroll
- Mobile: Keeps full action sheet with Cancel button
- Menu items reordered by intent:
  1. Edit (primary)
  2. Add Journal Entry (primary)
  3. Update Progress (+10%)
  4. ─────── (divider)
  5. Delete (danger, red)
- Removed trash icon from card tiles (delete only in menu)

#### 5. Xcode Cloud CI Fix
**Files:** `ios/App/ci_scripts/ci_post_clone.sh` (NEW)

- Added post-clone script for Xcode Cloud builds
- Installs Node.js via Homebrew
- Runs `npm ci` to install dependencies
- Runs `npm run build` for Next.js
- Runs `npx cap sync ios`
- Fixes "package cannot be accessed" errors (node_modules not in git)

#### 6. New Logo - V + 2026
**Files:** `scripts/generate-assets.js`, all icon assets

- Replaced YV monogram with V + year design
- **App Icon:** Year above (subtle, 70% opacity, 11px), V below (hero, full gold)
- **Favicon:** V only (cleaner at small sizes)
- **Splash Screen:** Matches icon - year above, large V, tagline below
- Gold (#C9A75A) on navy (#1F3A5A)
- Year can be updated annually by changing `CURRENT_YEAR` constant
- Explored 12+ mockup variations before final selection

---

### New Color Palette (Updated)
```javascript
// YearVow Brand Colors
const COLORS = {
  navy: '#1F3A5A',         // Primary navy (background)
  gold: '#C9A75A',         // Gold accent (logo, highlights)
  cream: '#F5F4EF',        // Off-white (text on dark)
  textMuted: '#B8C4D0',    // Muted text
};
```

---

### To Apply Changes
1. Run `npm run build`
2. Run `npx cap sync`
3. Clean Xcode build: Product > Clean Build Folder
4. Delete app from simulator/device
5. Rebuild and run

---

## Session: January 4-5, 2026 (Continued)

### Overview
Added tracking types for resolutions (frequency, cumulative, target, reflection), QuickUpdateModal for faster progress logging, and various UX improvements.

---

### Changes Made

#### 1. Resolution Tracking Types
**Files:**
- `src/types/index.ts`
- `src/lib/storage.ts`
- `src/components/ResolutionForm.tsx`
- `src/components/ResolutionCard.tsx`

Four tracking types for different goal styles:

| Type | Description | Example |
|------|-------------|---------|
| **Frequency** | Repeating habit goals | "Meditate 3x/week" |
| **Cumulative** | Additive progress toward total | "Save $20,000" |
| **Target** | Move a value toward a goal | "Reach 220 lbs" |
| **Reflection** | Journal-only, no metrics | "Be more mindful" |

**New Fields Added:**
- `trackingType`: 'frequency' | 'cumulative' | 'target' | 'reflection'
- `targetFrequency`: number (for frequency type)
- `frequencyPeriod`: 'day' | 'week' | 'month'
- `checkIns`: array of dated check-ins
- `targetValue`, `currentValue`, `unit`: for cumulative/target
- `startingValue`: for target type (to calculate direction)

#### 2. Type-Aware Context Menu
**Files:** `src/components/ResolutionCard.tsx`

Context menu actions adapt to resolution type:
- **Frequency:** "Check in" button (or "Checked in today!")
- **Cumulative:** "Log progress" → opens QuickUpdateModal
- **Target:** "Update value" → opens QuickUpdateModal
- **Reflection:** No progress action (journal only)

#### 3. QuickUpdateModal Component
**Files:** `src/components/QuickUpdateModal.tsx` (NEW)

Lightweight modal for quick value updates:
- Shows current value vs target
- Simple number input
- Preview of new value
- "Update" button
- Uses React portal to render at document.body (avoids clipping)

#### 4. Redesigned Insights/Dashboard
**Files:** `src/components/DashboardStats.tsx`

Replaced flashy green/yellow cards with subtle, theme-matched design:
- **"Habit Check-ins"** section showing frequency goal progress
  - Mini progress bars for each habit
  - "1/3 this week" style display
- **"Falling behind"** alert only when significantly behind (2+ missed after Thursday)
- Removed "On Track" section (too noisy)
- Uses app theme colors throughout

#### 5. Card Tap Behavior Change
**Files:** `src/components/ResolutionCard.tsx`

- **Before:** Tapping card opened edit mode
- **After:** Tapping card expands journal/notes section
- Edit only accessible via context menu (3-dot or long-press)

#### 6. Context Menu Positioning Fix
**Files:** `src/components/ContextMenu.tsx`

- Fixed flash at (0,0) before positioning by adding `isPositioned` state
- Menu hidden until position calculated
- Added React portal to prevent clipping by parent containers

#### 7. React Portals for Modals
**Files:**
- `src/components/QuickUpdateModal.tsx`
- `src/components/ContextMenu.tsx`

Both components now use `createPortal` to render directly to `document.body`:
- Prevents clipping by parent overflow
- Proper z-index layering (ContextMenu: 100, QuickUpdateModal: 110)
- Required `mounted` state for SSR hydration

---

### Database Changes
Added columns to `resolutions` table:
- `tracking_type` (text)
- `target_frequency` (integer)
- `frequency_period` (text)
- `check_ins` (jsonb)
- `target_value` (numeric)
- `current_value` (numeric)
- `unit` (text)
- `starting_value` (numeric)

---

### Key Commits
| Commit | Description |
|--------|-------------|
| `4f3298e` | Redesign insights with actionable tracking-aware metrics |
| `e27da4d` | Add 'target' tracking type and fix context menu positioning |
| `075de9e` | Improve UX: tap expands cards, redesign insights section |
| `a5e4ab2` | Remove tap-to-edit from Habit Check-ins display |
| `366e991` | Add QuickUpdateModal for cumulative and target types |
| `fac84f4` | Fix QuickUpdateModal: z-index, size, simplify UI |
| `4e4ae8a` | Use React portals for modals/menus to fix clipping |

---

### Other: Fooocus Management Script
**Files:** `~/Fooocus/fooocus.sh`

Created helper script for managing Fooocus AI image generator:
```bash
./fooocus.sh start    # Start Fooocus
./fooocus.sh stop     # Stop Fooocus
./fooocus.sh restart  # Restart
./fooocus.sh status   # Check status
```

Also patched `~/Fooocus/modules/upscaler.py` to handle RuntimeError gracefully (upscale bug workaround).

---

### Pending/Future
- Frequency check-in history view
- Undo check-in functionality
- Weekly/monthly progress summaries
- Achievement badges for streaks

---

## Session: January 7-8, 2026

### Overview
Major visual refresh with new ChatGPT-generated transparent gold icons, multiple dark color themes, illustrated backgrounds, YearVow wordmark integration, and various iOS fixes.

---

### Changes Made

#### 1. New Transparent Gold Icons
**Files:** `public/icons/*.png`, `src/components/YearVowIcon.tsx`

- Replaced old icon set with ChatGPT/DALL-E generated transparent gold icons
- Icons: checkmark, flame, trophy, gear, compass, heart, calendar, quill, quill-scroll, book, target, coins
- Fixed icon transparency issues (calendar interior, book pages made transparent via PIL)
- Updated YearVowIcon component with new icon types
- Changed cumulative tracking icon from 'trophy' to 'coins'

#### 2. Multiple Dark Color Themes
**Files:** `src/context/ThemeContext.tsx`

Removed light mode entirely, added 8 dark themes with gold accent:

| Theme | Preview Color | Description |
|-------|---------------|-------------|
| Navy | `#0F2233` | Default, deep navy blue |
| Charcoal | `#1A1A1A` | Pure dark gray |
| Midnight | `#08080A` | Near-black |
| Forest | `#0D1A14` | Dark green tones |
| Slate | `#0F172A` | Blue-gray |
| Plum | `#1A0F1F` | Purple-tinted dark |
| Coffee | `#1A1410` | Warm brown tones |
| Ocean | `#0A1520` | Deep teal-blue |

Each theme has complete color definitions: bg, cardBg, text, accent, border, category colors, etc.

#### 3. Illustrated Backgrounds
**Files:**
- `public/splash-bg.png` - Golden path through mountains
- `public/login-bg.png` - Constellation night sky
- `src/components/AnimatedSplash.tsx`
- `src/components/AuthForm.tsx`

- Replaced SVG mountain backgrounds with illustrated images
- Splash: Golden winding path through mountainous terrain
- Login: Night sky with constellations and stars

#### 4. YearVow Wordmark Integration
**Files:**
- `public/yearvow-wordmark.png`
- `src/app/page.tsx`
- `src/components/AuthForm.tsx`

- ChatGPT-generated "YearVow 2026" text wordmark
- Cropped from 1534x1024 to 857x242 (removed excess padding)
- Header: 142x40 compact size
- Login: 428x121 with responsive scaling (85vw max on mobile, 400px max on desktop)

#### 5. iOS Native Splash Screen
**Files:**
- `ios/App/App/Assets.xcassets/Splash.imageset/*.png`
- `ios/App/App/Base.lproj/LaunchScreen.storyboard`

- Generated new 2732x2732 splash images from splash-bg.png
- Updated LaunchScreen.storyboard background color to match

#### 6. App Icon Fixes
**Files:** `public/icons/icon-1024.png`, iOS icon assets

- Fixed white border issue (iOS needs full-bleed squares)
- Extended navy background to edges
- Zoomed V and laurel wreath for better visibility

#### 7. Theme Persistence Fix
**Files:** `src/context/ThemeContext.tsx`

- **Problem:** Theme wasn't persisting on iOS or web
- **Solution:** Save to BOTH localStorage AND Capacitor Preferences
- Theme now persists across app restarts on all platforms

#### 8. iOS Overscroll Fix
**Files:**
- `src/app/layout.tsx`
- `src/context/ThemeContext.tsx`
- `src/app/globals.css`

- **Problem:** Scrolling to top revealed gap above header
- **Solution:** Set body/html background to match header color
- ThemeContext dynamically updates body background on theme change
- Initial body color set to navy cardBg (`#1A3550`)

#### 9. Theme-Aware UI Fixes
**Files:** Various

- Quote section: Changed hardcoded navy to `colors.cardBgInset`
- Placeholder text: Changed from navy slate to `rgba(255, 255, 255, 0.4)`
- Removed `theme === 'dark'` checks (all themes are dark now)
- Fixed components: Changelog.tsx, ContextMenu.tsx, Logo.tsx

#### 10. Emoji Replacements
**Files:** `src/app/page.tsx`, `src/components/ResolutionForm.tsx`, `src/components/Settings.tsx`

Replaced emojis with YearVowIcon components:
- Journal empty state: 📝 → quill icon (56px)
- No goals empty state: 🎯 → target icon (64px)
- Settings tutorial: 📖 → book icon (32px)

---

### Key Commits
| Commit | Description |
|--------|-------------|
| `a693d06` | Update app icon and add wordmark to header/login |
| `f3a6779` | Fix quote section theming and add coins icon |
| `ff7fa2c` | Fix wordmark sizing and theme persistence |
| `49a85d1` | Crop wordmark to actual content bounds |
| `a32be04` | Fix iOS overscroll by setting body/html background |

---

### Technical Notes

**Image Processing (PIL):**
- Used Python PIL for icon transparency fixes
- Cropped wordmark to content bounds with `getbbox()`
- Made white/cream pixels transparent for icons

**Theme Storage:**
```typescript
// Save to both for cross-platform persistence
localStorage.setItem(key, theme);
await Preferences.set({ key, value: theme });
```

**iOS Overscroll Fix:**
```typescript
// In ThemeContext useEffect
document.body.style.backgroundColor = colors.cardBg;
document.documentElement.style.backgroundColor = colors.cardBg;
```

---

### Files Added/Modified
| File | Changes |
|------|---------|
| `public/icons/*.png` | New transparent gold icons |
| `public/yearvow-wordmark.png` | Text wordmark asset |
| `public/splash-bg.png` | Illustrated splash background |
| `public/login-bg.png` | Constellation login background |
| `src/context/ThemeContext.tsx` | 8 dark themes, persistence fix |
| `src/app/page.tsx` | Wordmark in header, icon replacements |
| `src/components/AuthForm.tsx` | Wordmark, background image |
| `src/components/AnimatedSplash.tsx` | Background image |
| `src/components/YearVowIcon.tsx` | Added 'coins' icon type |
| `src/app/layout.tsx` | Body background color |
| `src/app/globals.css` | Placeholder text color, iOS fixes |

---
