// Get the scheme based on APP_ENV at build time
const getScheme = () => {
  const appEnv = process.env.APP_ENV || "development"

  const baseScheme = "fueled-forward-app"

  if (appEnv === "production") {
    return baseScheme
  }
  if (appEnv === "preview") {
    return `${baseScheme}-preview`
  }
  return `${baseScheme}-dev`
}

export const APP_SCHEME = getScheme()
export const BASE_SCHEME = "fueled-forward-app"

// For deep linking
export const DEEP_LINK_URL = `${APP_SCHEME}://`

export const MOOD_IMAGES: Record<number, any> = {
  1: require("../../assets/images/mood-image-1.png"),
  2: require("../../assets/images/mood-image-2.png"),
  3: require("../../assets/images/mood-image-3.png"),
  4: require("../../assets/images/mood-image-4.png"),
  5: require("../../assets/images/mood-image-5.png"),
}
// 50 self care/health goal suggestions
export const GOAL_SUGGESTIONS: string[] = [
  "Take a 10-minute walk outside",
  "Practice deep breathing for 5 minutes",
  "Write in your gratitude journal",
  "Connect with a friend or family member",
  "Drink 8 glasses of water",
  "Spend 15 minutes on a hobby you enjoy",
  "Try a new healthy recipe",
  "Meditate for 10 minutes",
  "Read a chapter of a book",
  "Get at least 7 hours of sleep",
  "Organize your workspace",
  "Limit social media use to 30 minutes",
  "Practice yoga or stretching",
  "Listen to your favorite music",
  "Set aside time for self-reflection",
  "Plan your day the night before",
  "Take a break from screens for an hour",
  "Go to bed 30 minutes earlier",
  "Try a new workout routine",
  "Spend time in nature",
  "Declutter a small area of your home",
  "Practice positive affirmations",
  "Schedule a health check-up",
  "Limit caffeine intake after noon",
  "Try a guided relaxation exercise",
  "Cook a healthy meal at home",
  "Take a digital detox for a day",
  "Write down your goals for the week",
  "Practice mindful eating",
  "Spend quality time with loved ones",
  "Try a new outdoor activity",
  "Set a budget for the month",
  "Create a vision board",
  "Practice forgiveness towards yourself and others",
  "Take a nap if needed",
  "Explore a new place in your city",
  "Join a local club or group",
  "Volunteer for a cause you care about",
  "Practice journaling your thoughts and feelings",
  "Set boundaries for work-life balance",
  "Try aromatherapy or essential oils",
  "Take a relaxing bath",
  "List three things you're thankful for",
  "Spend time with pets or animals",
  "Learn a new skill or hobby",
  "Watch a documentary on a topic of interest",
  "Create a playlist of uplifting songs",
  "Set a daily intention",
  "Practice random acts of kindness",
  "Reflect on your achievements",
  "Plan a fun outing or activity for the weekend",
]

export const NUM_STEPS = 5
export const STEP_QUESTIONS: string[] = [
  "How are you feeling emotionally right now?",
  "How much stress or worry did you feel today?",
  "How was your energy or motivation today?",
  "How connected did you feel to others today?",
  "How in control did you feel today?",
]
export const MOOD_OPTIONS: Record<number, { value: number; label: string }[]> = {
  1: [
    {
      value: 1,
      label: "Heavy",
    },
    {
      value: 2,
      label: "Low",
    },
    {
      value: 3,
      label: "Even",
    },
    {
      value: 4,
      label: "Calm",
    },
    {
      value: 5,
      label: "Hopeful",
    },
  ],
  2: [
    {
      value: 1,
      label: "Heavy",
    },
    {
      value: 2,
      label: "Low",
    },
    {
      value: 3,
      label: "Even",
    },
    {
      value: 4,
      label: "Calm",
    },
    {
      value: 5,
      label: "Hopeful",
    },
  ],
  3: [
    {
      value: 1,
      label: "Heavy",
    },
    {
      value: 2,
      label: "Low",
    },
    {
      value: 3,
      label: "Even",
    },
    {
      value: 4,
      label: "Calm",
    },
    {
      value: 5,
      label: "High",
    },
  ],
  4: [
    {
      value: 1,
      label: "None",
    },
    {
      value: 2,
      label: "Low",
    },
    {
      value: 3,
      label: "Even",
    },
    {
      value: 4,
      label: "Some",
    },
    {
      value: 5,
      label: "Very",
    },
  ],
  5: [
    {
      value: 1,
      label: "None",
    },
    {
      value: 2,
      label: "Low",
    },
    {
      value: 3,
      label: "Even",
    },
    {
      value: 4,
      label: "Some",
    },
    {
      value: 5,
      label: "Very",
    },
  ],
}

export const resourceTypeColors = {
  "Article": {
    bg: "info100" as const,
    text: "info600" as const,
  },
  "Coping Strategy": {
    bg: "success100" as const,
    text: "success600" as const,
  },
  "Guided Exercise": {
    bg: "accent100" as const,
    text: "accent600" as const,
  },
  "Stories & reflection": {
    bg: "error100" as const,
    text: "error600" as const,
  },
  "Tools & Worksheets": {
    bg: "warning100" as const,
    text: "warning600" as const,
  },
} as const

export const STRUGGLE_OPTIONS = [
  "Anxiety",
  "Depression",
  "Stress",
  "Trauma",
  "Grief",
  "Relationship Issues",
  "Self-esteem",
  "Sleep Problems",
  "Other",
] as const
