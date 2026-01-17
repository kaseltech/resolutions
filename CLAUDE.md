# YearVow - Complete App Documentation

## Overview

**YearVow** is a New Year's resolution tracking iOS app designed to help users set, track, and achieve their goals throughout the year. The app emphasizes reflection over metrics, creating a "private notebook" feel rather than a gamified dashboard.

**App Store ID:** `com.yearvow.app`
**Current Year:** 2026

---

## Technology Stack

### Frontend
- **Next.js 16.1.1** - React framework with static export
- **React 19.2.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

### Mobile
- **Capacitor 8.0.0** - Native iOS wrapper
- **iOS deployment target:** iOS 14+

### Backend
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **Row Level Security (RLS)** - User data isolation

### Key Packages
```json
{
  "@capacitor/haptics": "8.0.0",
  "@capacitor/local-notifications": "8.0.0",
  "@capacitor/preferences": "8.0.0",
  "@capacitor/push-notifications": "8.0.0",
  "@capacitor/splash-screen": "8.0.0",
  "@capgo/capacitor-native-biometric": "8.0.3",
  "@capgo/capacitor-social-login": "8.2.9",
  "@supabase/supabase-js": "^2.x",
  "@tiptap/react": "^2.x",
  "sharp": "^0.33.x"
}
```

---

## Features

### Authentication
- **Email/Password** - Traditional sign up and sign in
- **Sign in with Apple** - Native iOS integration
- **Sign in with Google** - OAuth flow
- **Face ID / Touch ID** - Biometric login after initial authentication
- Auto-triggers Face ID on app launch if enabled

### Resolution Tracking Types

| Type | Description | Example | Progress Display |
|------|-------------|---------|------------------|
| **Frequency** | Repeating habit goals | "Meditate 3x/week" | Check-in counter per period |
| **Cumulative** | Additive progress toward total | "Save $20,000" | Current / Target with % |
| **Target** | Move a value toward a goal | "Reach 180 lbs" | Current value vs target |
| **Reflection** | Journal-only, no metrics | "Be more mindful" | Journal entries only |

### Dashboard ("Today" View)
- **Time awareness bar** - "Week X of 52 | X days left in 2026"
- **Daily inspirational quote** - 215+ quotes, refreshable
- **Habit Check-ins** - Shows frequency goals with progress bars
- **"Behind pace" alerts** - Only when mathematically difficult to catch up

### Resolution Cards
- **Tap to expand** - Shows journal/notes section
- **Swipe left** - Edit resolution
- **Swipe right** - Add journal entry
- **Long-press (mobile)** - Context menu
- **3-dot menu (desktop)** - Hover to reveal
- **Drag handle (desktop)** - Reorder resolutions

### Journal System
- **Rich text editor** - Tiptap-based with formatting toolbar
- **Formatting options** - Bold, italic, headings, lists, blockquotes
- **Per-resolution journals** - Each goal has its own journal entries
- **Timestamped entries** - Date and time recorded

### Categories
- Health, Career, Finance, Personal, Education, Social, Creative, Other
- Color-coded badges
- Filterable in "All Goals" view

### Reminders & Notifications
- **Local notifications** - Scheduled reminders per resolution
- **Frequency options** - Daily, weekly, monthly
- **Motivational messages** - Randomized encouraging text
- **Test notification** - Available in Settings

### Settings
- **Theme picker** - 8 dark color themes
- **Notifications toggle** - Enable/disable all reminders
- **Face ID toggle** - Enable/disable biometric login
- **Help & FAQ** - Expandable questions
- **View Tutorial** - Replay onboarding
- **About** - App version info

### Onboarding
- **Spotlight Tutorial** - Coach marks highlighting UI elements
- **4 steps** - Add button, resolution card, view toggle, settings
- **Sample resolution** - Created for first-time users with milestones

---

## Color Themes

All themes are dark-only with gold accent (`#C9A75A` or similar).

| Theme | Background | Card Background |
|-------|------------|-----------------|
| Navy | `#0F2233` | `#1A3550` |
| Charcoal | `#121212` | `#1E1E1E` |
| Midnight | `#08080A` | `#131316` |
| Forest | `#0D1A14` | `#152A20` |
| Slate | `#0F172A` | `#1E293B` |
| Plum | `#1A0F1F` | `#2A1A32` |
| Coffee | `#1A1410` | `#2A221A` |
| Ocean | `#0A1520` | `#122535` |

### Brand Colors
```javascript
{
  navy: '#1F3A5A',      // Primary navy (logo, icon background)
  gold: '#C9A75A',      // Gold accent
  cream: '#F5F1EA',     // Off-white text on dark
}
```

---

## Icon System

### App Icon
- **Design:** Serif "V" with "2026" above
- **Style:** Flat, elegant, muted gold on navy
- **Format:** Full-bleed square (iOS adds rounding)

**ChatGPT Prompt for App Icon:**
```
iOS app icon design, perfectly square with NO rounded corners, full bleed.

Solid dark navy blue background (#1F3A5A) filling entire canvas edge to edge.

Large elegant serif letter "V" centered, in muted gold/champagne color (#C9A75A). Subtle gradient shading only - NOT overly metallic or 3D. Refined, understated elegance like a luxury brand logo.

"2026" in matching gold serif font centered above the V, approximately 20-25% the height of the V.

Style: Flat design with minimal depth. Premium and timeless, not flashy or overly glossy. Think high-end stationery or book embossing, not chrome text effect.

No borders, no shadows, no decorative elements. Navy background extends completely to all four edges.
```

### Custom Icons (YearVowIcon Component)
Transparent gold icons generated via ChatGPT/DALL-E:
- checkmark, flame, trophy, gear, compass, heart
- calendar, quill, quill-scroll, book, target, coins

**ChatGPT Prompt for Custom Icons:**
```
Create a set of simple, elegant icons with TRANSPARENT backgrounds (PNG with alpha channel).

Style:
- Muted gold/champagne color (#C9A75A)
- Clean, minimalist line art or simple filled shapes
- Consistent stroke weight across all icons
- Subtle shading allowed but NOT overly 3D or metallic
- Premium, refined aesthetic matching a luxury journaling app

Icons needed:
1. Checkmark - simple elegant check
2. Flame - stylized fire/flame
3. Trophy - achievement cup
4. Gear - settings cog
5. Compass - navigation/direction
6. Heart - love/health
7. Calendar - date/schedule
8. Quill - writing feather pen
9. Book - open or closed book
10. Target - bullseye/goal
11. Coins - stack of coins/money

Each icon should be centered in a square canvas with generous padding. Transparent background is CRITICAL - no solid background color.
```

**Post-processing for icons:**
Icons may need transparency fixes using Python PIL:
```python
from PIL import Image
img = Image.open("icon.png").convert("RGBA")
data = img.getdata()
new_data = []
for item in data:
    # Make near-white pixels transparent
    if item[0] > 200 and item[1] > 200 and item[2] > 200:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
img.putdata(new_data)
img.save("icon.png")
```

Usage:
```tsx
<YearVowIcon name="target" size={64} />
```

---

## Project Structure

```
resolutions/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main app page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles & design tokens
│   ├── components/
│   │   ├── AuthForm.tsx      # Login/signup form
│   │   ├── AuthGuard.tsx     # Auth state wrapper
│   │   ├── AnimatedSplash.tsx # Splash screen
│   │   ├── ResolutionCard.tsx # Goal card component
│   │   ├── ResolutionForm.tsx # Create/edit form
│   │   ├── DashboardStats.tsx # Today view stats
│   │   ├── Settings.tsx      # Settings modal
│   │   ├── Logo.tsx          # YearVow wordmark
│   │   ├── YearVowIcon.tsx   # Custom icon component
│   │   ├── ContextMenu.tsx   # Long-press/right-click menu
│   │   ├── QuickUpdateModal.tsx # Fast progress update
│   │   ├── SpotlightTutorial.tsx # Onboarding coach marks
│   │   ├── JournalEditor.tsx # Tiptap rich text editor
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── ResolutionContext.tsx # Resolutions state & CRUD
│   │   └── ThemeContext.tsx  # Theme state & colors
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── storage.ts        # Data persistence helpers
│   │   ├── biometric.ts      # Face ID / Touch ID
│   │   ├── socialAuth.ts     # Apple/Google sign in
│   │   ├── reminders.ts      # Local notifications
│   │   └── messages.ts       # Motivational quotes
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── public/
│   ├── icons/                # App icons & custom icons
│   ├── splash-bg.png         # Splash background image
│   ├── login-bg.png          # Login background image
│   └── manifest.json         # PWA manifest
├── ios/
│   └── App/
│       ├── App/
│       │   ├── Assets.xcassets/  # iOS assets
│       │   └── Info.plist
│       ├── App.xcodeproj/
│       └── ci_scripts/       # Xcode Cloud scripts
├── scripts/
│   └── generate-assets.js    # Icon/splash generation
├── capacitor.config.ts       # Capacitor configuration
└── package.json
```

---

## Database Schema (Supabase)

### `resolutions` table
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users
title           TEXT NOT NULL
description     TEXT
category        TEXT
progress        INTEGER DEFAULT 0
deadline        TIMESTAMP
milestones      JSONB
journal_entries JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
display_order   INTEGER

-- Tracking type fields
tracking_type   TEXT ('frequency' | 'cumulative' | 'target' | 'reflection')
target_frequency INTEGER
frequency_period TEXT ('day' | 'week' | 'month')
check_ins       JSONB
target_value    NUMERIC
current_value   NUMERIC
unit            TEXT
starting_value  NUMERIC
```

### Row Level Security
- Users can only read/write their own resolutions
- Authenticated users only

---

## Build & Deployment

### Local Development
```bash
npm run dev          # Start Next.js dev server
```

### Production Build
```bash
npm run build        # Build Next.js static export
npx cap sync         # Sync to iOS project
npx cap open ios     # Open in Xcode
```

### iOS Deployment
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select target device/simulator
3. Build and run (Cmd+R)

### Xcode Cloud
- **Workflow:** Archive on push to main
- **Scripts:** `ios/App/ci_scripts/ci_post_clone.sh`
- Installs Node.js, runs `npm ci`, builds Next.js, syncs Capacitor

---

## Key Implementation Details

### Theme Persistence
Saves to BOTH localStorage (web) and Capacitor Preferences (iOS):
```typescript
localStorage.setItem('yearvow_color_theme', theme);
await Preferences.set({ key: 'yearvow_color_theme', value: theme });
```

### iOS Overscroll Fix
Body/HTML background set to match header for bounce effect:
```typescript
document.body.style.backgroundColor = colors.cardBg;
document.documentElement.style.backgroundColor = colors.cardBg;
```

### Resolution Context
- Fetches from Supabase on mount
- Real-time subscription for updates
- Optimistic UI updates
- Celebration confetti on milestones

### Biometric Flow
1. User logs in with email/password
2. If Face ID available + not enabled, prompt to enable
3. Store credentials securely in Keychain
4. On next launch, auto-trigger Face ID
5. Retrieve and use stored credentials

---

## Design Philosophy

1. **Reflection over tracking** - Feel like a private notebook, not a dashboard
2. **Gentle accountability** - "Behind pace" only when mathematically difficult
3. **Minimal friction** - Quick check-ins, swipe gestures, keyboard shortcuts
4. **Premium aesthetic** - Dark themes, gold accents, serif typography
5. **iOS-native feel** - Haptics, safe areas, native gestures

---

## Known Issues / Future Work

### Known Issues
- Xcode Cloud builds may fail if SPM resolution happens before node_modules exists
- Face ID requires physical device testing

### Planned Features
- Frequency check-in history view
- Undo check-in functionality
- Weekly/monthly progress summaries
- Achievement badges for streaks
- Push notification server integration
- Widget support

---

## Development History

See `ClaudeHistory.md` for detailed session-by-session changelog.

### Major Milestones
- **Jan 2, 2026** - Initial app with compass logo, reminder system
- **Jan 3, 2026** - Social login, spotlight tutorial, sample resolution
- **Jan 4, 2026** - YearVow rebrand, V + 2026 logo, dashboard redesign
- **Jan 4-5, 2026** - Tracking types, QuickUpdateModal, card interactions
- **Jan 7-8, 2026** - New icons, 8 dark themes, illustrated backgrounds, iOS fixes

---

## Quick Reference

### Keyboard Shortcuts (Desktop)
- `C` - Create new resolution
- `Escape` - Close modal

### Capacitor Commands
```bash
npx cap sync         # Sync web assets to iOS
npx cap open ios     # Open Xcode
npx cap run ios      # Build and run on device
```

### Asset Generation
```bash
node scripts/generate-assets.js  # Generate icons and splash
```

### Supabase
- Dashboard: https://supabase.com/dashboard
- Project: Check `.env.local` for project URL

---

*Last updated: January 8, 2026*
