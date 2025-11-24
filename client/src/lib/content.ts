// Configuration file for app messages, tone, and content

// Mid-session motivational/sarcastic messages for timers
export const MID_SESSION_MESSAGES = [
  "You're literally ignoring your phone right now. Iconic.",
  "Neurons are connecting. Future self: proud.",
  "Somewhere, someone is procrastating. Not you.",
  "Resist the scroll. Stay feral.",
  "Attention span: upgrading…",
  "Brain cells activated",
  "No scrolling. Stay locked.",
  "Future you will thank you.",
  "Focus mode engaged",
  "You're doing great",
  "Deep work in progress",
  "Main character energy",
  "This is the way",
  "Locked in fr",
  "No cap, you're crushing it"
];

// Strict mode exit warning messages
export const STRICT_MODE_WARNINGS = [
  "Leaving breaks your streak. Sure?",
  "Don't quit now. You'll regret it.",
  "Exit = streak reset. Make the right choice.",
  "Really? You were doing so well.",
  "Stay locked in. Don't fold now."
];

// Level-up celebration messages
export const LEVEL_UP_MESSAGES = [
  "LEVEL UP ⚡",
  "New Level. New Era.",
  "You're evolving 🧠🔥",
  "Level unlocked 🎯",
  "Main character moment ✨"
];

// End-session reward messages
export const SESSION_COMPLETE_MESSAGES = [
  "Respect. That was clean.",
  "You showed up. That's what matters.",
  "One win at a time. Keep going.",
  "Momentum unlocked.",
  "nice grind",
  "locked in fr",
  "big brain energy",
  "we're so back",
  "touch grass later",
  "Absolutely unhinged focus",
  "Chef's kiss 👌",
  "You get it."
];

// Gen-Z tone button labels
export const BUTTON_LABELS = {
  startFocus: "Lock In",
  startPomodoro: "Let's Go",
  pause: "Pause",
  resume: "Resume",
  endSession: "Wrap It",
  breakTime: "Fine. Take a Break.",
  startAnother: "Run It Back",
  backToHome: "Back to Base",
  strictMode: "Strict Mode",
  soundToggle: "Vibes",
  settings: "Settings"
};

// Helper function to get random message from array
export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Helper to get random interval between min and max seconds
export function getRandomInterval(minSeconds: number, maxSeconds: number): number {
  return (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;
}
