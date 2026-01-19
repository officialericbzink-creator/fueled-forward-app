const en = {
  auth: {
    signIn: {
      title: "Sign In",
      subtitle: "Welcome back! Please sign in to your account.",
      emailFieldLabel: "Email",
      emailFieldPlaceholder: "Enter your email",
      passwordFieldLabel: "Password",
      passwordFieldPlaceholder: "Enter your password",
      forgotPassword: "Forgot Password?",
      submitButton: "Sign In",
      loadingButton: "Signing In...",
      noAccountText: "Don't have an account?",
      signUpButton: "Sign Up",
    },
    signUp: {
      title: "Create Account",
      subtitle: "Join us today! Create your account.",
      emailFieldLabel: "Email",
      emailFieldPlaceholder: "Enter your email",
      passwordFieldLabel: "Password",
      passwordFieldPlaceholder: "Create a password",
      confirmPasswordFieldLabel: "Confirm Password",
      confirmPasswordFieldPlaceholder: "Re-enter your password",
      submitButton: "Sign Up",
      loadingButton: "Creating Account...",
      haveAccountText: "Already have an account?",
      signInButton: "Sign In",
    },
  },
  onboarding: {
    nameScreen: {
      messageOne: "Hi, I'm Eric! Welcome to your mental health journey.",
      messageTwo: "What's your name?",
    },
    strugglesScreen: {
      messageOne: "Thanks! Now, what are you currently struggling with?",
      messageTwo: "Select all that apply:",
    },
    importantDateScreen: {
      messageOne: "Can you share when this began to happen?",
      messageTwo: "This could be a traumatic event, loss, or significant life change.",
    },
    therapyScreen: {
      messageOne: "Are you currently in therapy?",
      messageTwo: "This helps us understand your current support system",
      inTherapyText: "How long have you been in therapy?",
      notInTherapyText: "Would you like to share why not? (optional)",
    },
    paywallScreen: {
      heading: "Your healing journey, supported every step.",
      trialText: "Free 3 day trial, cancel your membership anytime",
      bodyText:
        "Fueled Forward was created to give you a private, supportive space where you can work through life’s challenges at your own pace.",
      buttonText: "Start my 3 day trial",
    },
  },
  settings: {
    profile: {},
    subscription: {},
  },
  paywall: {},
  home: {
    checkInCard: {
      headingPrefix: "Hey ",
      subheading: "How are you feeling today?",
      buttonCaption: "Take a moment to check in with yourself",
      checkInButtonText: "Start Check-In",
      errorText: "Error loading today's check-in.",
      completeText: "Check-In Complete",
    },
    goalsCard: {
      errorText: "Error loading goals.",
      headerButtonText: "Add Goal",
      buttonText: "Add your first goal",
      heading: "Today's Goals",
      modalHeading: "Add New Goal",
      inputLabelText: "Create your own goal:",
      inputPlaceholderText: "Enter your goal...",
      inputButtonText: "Add Goal",
      inputButtonLoadingText: "Adding...",
      suggestionCaptionText: "or choose from suggestions",
      emptyPromptText: "No goals yet. Add one to help you stay on track today.",
    },
    checkInHistory: {
      heading: "Previous Check-Ins",
      errorText: "Error loading check-in history.",
      emptyText: "No Check-Ins yet",
      emptySubText: "Complete your first check-in to start tracking your progress",
    },
  },
  checkIn: {},
  chat: {
    welcome: {
      messageOne:
        "Hey, I'm Eric, your personal AI companion for any struggles you may be going through.",
      messageTwo:
        "You can talk to me about anything and everything, 24/7. I'm always here for you!",
      messageThree:
        "Keep in mind, I am not a doctor, therapist, or licensed counselor, and do not replace any of these professionals. I am here to make sure you never feel alone.",
      messageFour: "How are you feeling today?",
    },
  },
  resources: {
    screenHeading: "Resources",
    searchPlaceholderText: "Search resources...",
    filter: {
      heading: "Filter Resources",
      clearText: "Clear Filters",
      categoryText: "Categories",
      typeText: "Resource Type",
      readTimeText: "Read Time",
    },
  },
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  welcomeScreen: {
    heading: "Welcome to Fueled Forward",
    subheading: "Your safe space for healing and growth",
    buttonText: "Let's Get Started",
    buttonCaption: "Wherever you are on your journey, we'll meet you there",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
}

export default en
export type Translations = typeof en
