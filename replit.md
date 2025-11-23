# Leveli - Gamified Focus Timer

## Overview
Leveli is a mobile-first gamified focus timer web app designed for Gen-Z students and creators. Instead of forcing discipline, it uses positive reinforcement through XP leveling, streak building, and achievements to make productivity feel like a game.

## Features

### Core Functionality
- **Focus Timer**: Continuous focus sessions with simple start/pause/end controls
- **Pomodoro Timer**: 25-minute focus / 5-minute break cycles with visual cycle indicators
- **XP & Leveling**: Earn 1 XP per minute focused, with bonus XP for completing Pomodoro cycles
- **Daily Streaks**: Track consecutive days of productivity
- **Achievements**: Unlock badges for milestones (First Session, 100 Minutes, 7-Day Streak, etc.)
- **Statistics Dashboard**: View daily/weekly/monthly progress with charts

### Technical Features
- **State Persistence**: Timer state saves across page reloads and tab switches
- **LocalStorage**: All user data persists locally (no backend required)
- **Mobile-First**: Optimized for mobile with thumb-friendly touch targets
- **Dark Mode**: Full light/dark theme support
- **Offline**: Works completely offline

## Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── LevelBadge.tsx
│   │   ├── XPProgressBar.tsx
│   │   ├── StreakCounter.tsx
│   │   ├── ActionCard.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   ├── PomodoroIndicator.tsx
│   │   ├── SessionCompleteModal.tsx
│   │   ├── StatCard.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── BottomNav.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/
│   │   ├── useTimer.ts      # Timer logic with persistence
│   │   └── useGameState.ts  # Game state management
│   ├── lib/
│   │   └── achievements.ts  # Achievement definitions and XP calculations
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── FocusTimer.tsx
│   │   ├── PomodoroTimer.tsx
│   │   ├── Stats.tsx
│   │   └── Achievements.tsx
│   └── App.tsx
```

## Data Model

### LocalStorage Keys
- `focusgate_progress`: Main game state
  - totalMinutes: Total focus time across all sessions
  - xp: Experience points (1 min = 1 XP)
  - level: Current level (calculated as floor(xp/100) + 1)
  - streakDays: Consecutive days with at least one session
  - achievements: Array of unlocked achievement IDs
  - sessions: Array of completed session objects
  - pomodorosCompleted: Count of completed Pomodoro cycles
  - lastActiveDate: Last date user had a session

- `focus_timer_state`: Focus timer persistence
- `pomodoro_timer_state`: Pomodoro timer persistence
- `pomodoro_state`: Pomodoro cycle/mode tracking

### Game Mechanics
- **XP Formula**: 1 minute = 1 XP
- **Pomodoro Bonus**: +10 XP for completing a full Pomodoro cycle
- **Level Formula**: level = floor(xp / 100) + 1
- **XP for Next Level**: currentLevel × 100

### Achievements
1. First Session (1 session)
2. 100 Minutes (100 total minutes)
3. Big Brain Day (180 minutes in one day)
4. Week Warrior (7-day streak)
5. Pomodoro Pro (25 Pomodoro completions)
6. Grind Mode (500 total minutes)
7. Consistency King (30-day streak)
8. Locked In (1000 total minutes)
9. Session Master (50 sessions)

## Design System

### Colors
- Primary: Purple gradient (#8B5CF6 range)
- Background: Adaptive light/dark
- Text: Three-tier hierarchy (default, muted, tertiary)

### Typography
- Primary Font: Inter
- Display Font: Space Grotesk (for levels, XP, headings)
- Timer Digits: 80-120px, tabular numerals

### Spacing
- Consistent 4px-based scale
- Component padding: 24-32px
- Section gaps: 24-32px

### Components
- Rounded corners: rounded-2xl to rounded-3xl
- Elevation: Subtle hover/active states
- Gradients: Used strategically for XP bars and badges

## Development

### Running the App
```bash
npm run dev
```
App runs on port 5000.

### Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- Wouter (routing)
- Recharts (statistics)
- LocalStorage (persistence)

### Key Features Implementation

#### Timer Persistence
Timers save their state to LocalStorage and restore on reload, calculating elapsed time accurately even if the tab was closed or minimized.

#### Streak Tracking
Checks if the last active date was yesterday - if so, maintains streak; if more than a day ago, resets to 0.

#### Achievement System
Achievements are checked after each session completion. The system evaluates all achievement conditions against current stats and unlocks any newly met achievements.

## User Experience

### Playful Messaging
Session completion messages use Gen-Z vernacular:
- "nice grind"
- "locked in fr"
- "big brain energy"
- "we're so back"
- "touch grass later"

### Mobile-First Design
- Max width: 480px (mobile sweet spot)
- Thumb-friendly buttons (min 40px touch targets)
- Bottom navigation for easy reach
- Full viewport timer pages

### Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader descriptions

## Future Enhancements (Phase 2)
- Unlockable premium themes (Pastel, Neon, Anime, Forest, Cyber)
- Sound effects and celebration animations
- PWA support with offline mode
- Data export functionality
- Cloud sync for cross-device access
- Advanced statistics (productivity heatmap, focus time analysis)
