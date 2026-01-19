// Dark Theme Color Palette
// Inverted neutrals and adjusted semantic colors for dark mode

const palette = {
  // Neutrals - Inverted for dark mode
  neutral100: "#1F2937",
  neutral200: "#374151",
  neutral300: "#4B5563",
  neutral400: "#6B7280",
  neutral500: "#9CA3AF",
  neutral600: "#D1D5DB",
  neutral700: "#E5E7EB",
  neutral800: "#F3F4F6",
  neutral900: "#F9FAFB",

  // Primary - Inverted black scale (lighter for dark mode)
  primary100: "#171717",
  primary200: "#262626",
  primary300: "#404040",
  primary400: "#525252",
  primary500: "#737373",
  primary600: "#A3A3A3",
  primary700: "#D4D4D4",
  primary800: "#E5E5E5",
  primary900: "#F5F5F5",

  // Secondary - Inverted slate
  secondary100: "#1E293B",
  secondary200: "#334155",
  secondary300: "#475569",
  secondary400: "#64748B",
  secondary500: "#94A3B8",
  secondary600: "#CBD5E1",
  secondary700: "#E2E8F0",
  secondary800: "#F1F5F9",
  secondary900: "#F8FAFC",

  // Accent - Same amber/gold (works in both themes)
  accent100: "#78350F",
  accent200: "#92400E",
  accent300: "#B45309",
  accent400: "#D97706",
  accent500: "#F59E0B",
  accent600: "#FBBF24",
  accent700: "#FCD34D",
  accent800: "#FDE68A",
  accent900: "#FEF3C7",

  // Success - Adjusted for dark mode
  success100: "#064E3B",
  success200: "#065F46",
  success300: "#047857",
  success400: "#059669",
  success500: "#10B981",
  success600: "#34D399",
  success700: "#6EE7B7",
  success800: "#A7F3D0",
  success900: "#D1FAE5",

  // Warning - Adjusted for dark mode
  warning100: "#7C2D12",
  warning200: "#9A3412",
  warning300: "#C2410C",
  warning400: "#EA580C",
  warning500: "#F97316",
  warning600: "#FB923C",
  warning700: "#FDBA74",
  warning800: "#FED7AA",
  warning900: "#FFEDD5",

  // Info - Adjusted for dark mode
  info100: "#1E3A8A",
  info200: "#1E40AF",
  info300: "#1D4ED8",
  info400: "#2563EB",
  info500: "#3B82F6",
  info600: "#60A5FA",
  info700: "#93C5FD",
  info800: "#BFDBFE",
  info900: "#DBEAFE",

  // Error - Adjusted for dark mode
  error100: "#7F1D1D",
  error200: "#991B1B",
  error300: "#B91C1C",
  error400: "#DC2626",
  error500: "#EF4444",
  error600: "#F87171",
  error700: "#FCA5A5",
  error800: "#FECACA",
  error900: "#FEE2E2",

  // Overlays - Lighter overlay for dark mode
  overlay20: "rgba(255, 255, 255, 0.2)",
  overlay50: "rgba(255, 255, 255, 0.5)",
  overlay70: "rgba(255, 255, 255, 0.7)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral900,
  textDim: palette.neutral600,
  background: palette.neutral100,
  border: palette.neutral300,
  tint: palette.primary700,
  tintInactive: palette.neutral500,
  separator: palette.neutral200,
  error: palette.error500,
  errorBackground: palette.error100,
} as const
