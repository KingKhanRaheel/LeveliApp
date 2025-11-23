# FocusGate Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from Duolingo's playful gamification, Forest's calm focus aesthetic, and modern mobile-first apps like Notion and Linear. The design must appeal to Gen-Z with a fresh, slightly irreverent personality while maintaining functional clarity.

## Core Design Principles
1. **Mobile-First Always:** Every element designed for thumb reach and portrait orientation
2. **Playful Minimalism:** Clean but never sterile - inject personality through micro-interactions and copy
3. **Reward Visibility:** Progress, XP gains, and achievements always prominent and celebrated
4. **Frictionless Flow:** Zero cognitive load between "I want to focus" and timer running

---

## Typography System

**Font Stack:**
- Primary: Inter or DM Sans (clean, modern, Gen-Z friendly)
- Accent: Space Grotesk or Outfit (for headings, level numbers, XP callouts)

**Hierarchy:**
- Timer digits: Extremely large (80-120px), tabular numerals, bold weight
- Level/XP numbers: 32-48px, medium-bold weight
- Page headings: 24-32px, semibold
- Body text: 16-18px, regular weight
- Captions/meta: 14px, medium weight
- Button text: 16px, semibold

---

## Layout & Spacing System

**Tailwind Spacing Units:** Consistently use 4, 6, 8, 12, 16, 24 for all spacing
- Component padding: p-6 to p-8
- Section gaps: gap-6 to gap-8
- Page margins: px-4 on mobile, px-6 on tablet
- Card padding: p-6 to p-8

**Container Strategy:**
- Max width: 480px (mobile sweet spot)
- Center all content with mx-auto
- Full viewport height sections where appropriate (timer pages)
- Comfortable breathing room - never cramped

---

## Component Library

### Home Page
**Layout:**
- Top: User level badge + XP progress bar (full width)
- Below: Current streak counter with flame icon
- Center: Two large card-style buttons (Focus Timer / Pomodoro)
- Bottom nav: Stats icon + Achievements icon

**Level Badge:**
- Circular or rounded-square avatar showing current level
- Glowing border effect (subtle gradient ring)
- Large level number centered

**XP Progress Bar:**
- Thick (12-16px height), rounded-full
- Gradient fill showing progress to next level
- Shows "Level X → Level Y" labels above/below
- Current XP / XP needed displayed

**Main Action Cards:**
- Large touch targets (min 120px height)
- Rounded-3xl corners
- Subtle gradient backgrounds or glassmorphic effect
- Icon + label stacked vertically
- Hover: slight scale up (1.02) and shadow increase

### Timer Pages (Focus & Pomodoro)

**Full-Screen Experience:**
- Vertically centered timer display
- Top: Small back button + session type label
- Center: Massive timer digits with colon
- Below timer: Current mode label ("Focus Time" / "Break Time")
- Bottom: Large circular play/pause button + small end session button

**Pomodoro Specific:**
- Cycle indicator: 4 dots showing completed/current/upcoming cycles
- Progress ring around timer showing session completion

**Timer Controls:**
- Primary button: 80-100px circular, centered
- Icon only (play/pause) with subtle pulse animation when active
- Secondary actions (reset, end): smaller, text-based, lower position

### Post-Session XP Screen

**Modal/Full-Screen:**
- Celebration message: Playful, randomized ("nice grind", "locked in fr", "big brain energy")
- XP gained: Large number with "+" prefix and sparkle icon
- Progress bar: Showing XP increase animation
- Level up?: If leveled up, show level badge burst animation
- Continue button: Large, prominent

### Stats Dashboard

**Grid Layout:**
- Top cards: Total time, streak count, current level (3-column grid on mobile)
- Charts section: Daily bar chart (7 days horizontal scroll)
- Weekly summary: Larger bar chart
- Monthly view: Ring/donut chart showing monthly target progress

**Stat Cards:**
- Rounded-2xl containers
- Icon + big number + label
- Gradient or subtle background
- Minimal borders, rely on shadows

### Achievements Page

**Grid Display:**
- 2-column grid on mobile (gap-4)
- Each badge: Square container, rounded-2xl
- Locked: Grayscale + lock icon overlay
- Unlocked: Full color + subtle glow

**Badge Design:**
- Icon/illustration centered
- Badge name below
- Progress indicator if multi-level achievement
- Tap: Opens modal with full description + date earned

**Achievement Modal:**
- Large badge display at top
- Achievement name (headline size)
- Witty description text
- Date earned (small, muted)
- Close button (top-right X)

### Navigation

**Bottom Nav Bar:**
- Fixed position, 3-4 icons
- Icons: Home, Stats, Achievements, (Settings)
- Active state: icon fill + label color change
- Height: 64-72px with padding
- Subtle blur background or solid with border-top

---

## Visual Elements

**Glassmorphism (Strategic Use):**
- Stats cards
- Modal overlays
- Bottom navigation
- Achievement badges (unlocked state)

**Gradients:**
- XP progress bars: Smooth two-color gradients
- Level badges: Subtle radial gradients
- Card backgrounds: Very subtle, low-contrast

**Shadows & Depth:**
- Cards: Soft shadow (shadow-lg equivalent)
- Buttons: Increase shadow on hover
- Modals: Heavy shadow for separation (shadow-2xl)
- Flat elements: Use border instead of shadow

**Rounded Corners:**
- Buttons: rounded-full for primary circular buttons
- Cards: rounded-2xl to rounded-3xl
- Modals: rounded-3xl
- Input fields: rounded-xl
- Badges: rounded-2xl

---

## Animations & Feedback

**Micro-Interactions:**
- Button press: Scale down slightly (0.98) with spring animation
- XP gain: Number count-up animation over 0.8s
- Level up: Badge pulse + brief confetti burst
- Achievement unlock: Slide-in from bottom with bounce
- Streak increment: Flame icon flicker

**Timing:**
- Fast interactions: 150-200ms
- Meaningful transitions: 300-400ms
- Celebration moments: 800-1200ms

**Restraint:**
- No constant animations - only on interaction or achievement
- No auto-playing loops
- Prefer subtle CSS transitions over JavaScript

---

## Content Tone & Copy

**Voice:**
- Casual, supportive, slightly sarcastic
- Gen-Z vernacular without being cringe
- Examples: "locked in", "grind mode", "touch grass later", "brain rotted enough for today"

**Messaging:**
- Session complete: Rotate between 5-8 playful messages
- Achievement names: Puns and references welcome
- Error states: Friendly, not patronizing
- Empty states: Encouraging, not guilt-tripping

---

## Images

This app does NOT require hero images. All visual interest comes from:
- Gradient backgrounds
- Achievement badge illustrations (icon-based, not photos)
- Chart visualizations
- UI animations and progress indicators

Keep the aesthetic clean and interface-driven rather than image-heavy.