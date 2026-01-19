const palette = {
  neutral100: "#F9FAFB",
  neutral200: "#F3F4F6",
  neutral300: "#E5E7EB",
  neutral400: "#D1D5DB",
  neutral500: "#9CA3AF",
  neutral600: "#6B7280",
  neutral700: "#4B5563",
  neutral800: "#374151",
  neutral900: "#1F2937",

  // Primary - Black scale
  primary100: "#F5F5F5",
  primary200: "#E5E5E5",
  primary300: "#D4D4D4",
  primary400: "#A3A3A3",
  primary500: "#737373",
  primary600: "#525252",
  primary700: "#404040",
  primary800: "#262626",
  primary900: "#171717",

  // Secondary - Slate (cool gray for subtle UI)
  secondary100: "#F8FAFC",
  secondary200: "#F1F5F9",
  secondary300: "#E2E8F0",
  secondary400: "#CBD5E1",
  secondary500: "#94A3B8",
  secondary600: "#64748B",
  secondary700: "#475569",
  secondary800: "#334155",
  secondary900: "#1E293B",

  // Accent - Amber/Gold
  accent100: "#FEF3C7",
  accent200: "#FDE68A",
  accent300: "#FCD34D",
  accent400: "#FBBF24",
  accent500: "#F59E0B",
  accent600: "#D97706",
  accent700: "#B45309",
  accent800: "#92400E",
  accent900: "#78350F",

  // Success - Green
  success100: "#D1FAE5",
  success200: "#A7F3D0",
  success300: "#6EE7B7",
  success400: "#34D399",
  success500: "#10B981",
  success600: "#059669",
  success700: "#047857",
  success800: "#065F46",
  success900: "#064E3B",

  // Warning - Orange
  warning100: "#FFEDD5",
  warning200: "#FED7AA",
  warning300: "#FDBA74",
  warning400: "#FB923C",
  warning500: "#F97316",
  warning600: "#EA580C",
  warning700: "#C2410C",
  warning800: "#9A3412",
  warning900: "#7C2D12",

  // Info - Blue
  info100: "#DBEAFE",
  info200: "#BFDBFE",
  info300: "#93C5FD",
  info400: "#60A5FA",
  info500: "#3B82F6",
  info600: "#2563EB",
  info700: "#1D4ED8",
  info800: "#1E40AF",
  info900: "#1E3A8A",

  // Error/Angry - Red
  error100: "#FEE2E2",
  error200: "#FECACA",
  error300: "#FCA5A5",
  error400: "#F87171",
  error500: "#EF4444",
  error600: "#DC2626",
  error700: "#B91C1C",
  error800: "#991B1B",
  error900: "#7F1D1D",

  // Legacy angry colors (mapped to error)
  angry100: "#FEE2E2",
  angry500: "#EF4444",

  // Overlays
  overlay20: "rgba(0, 0, 0, 0.2)",
  overlay50: "rgba(0, 0, 0, 0.5)",
  overlay70: "rgba(0, 0, 0, 0.7)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral900,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral300,
  /**
   * The main tinting color.
   */
  tint: palette.primary700,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral400,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral200,
  /**
   * Error messages.
   */
  error: palette.error500,
  /**
   * Error Background.
   */
  errorBackground: palette.error100,
} as const
