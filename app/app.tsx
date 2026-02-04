import "./utils/gestureHandler"

import { useEffect, useState, useCallback } from "react"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import * as SplashScreen from "expo-splash-screen"
import { QueryClientProvider } from "@tanstack/react-query"
import { PostHogProvider } from "posthog-react-native"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"

import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

import { AuthProvider, useAuth } from "./context/AuthContext"
import { initI18n } from "./i18n"
import { AppNavigator } from "./navigators/AppNavigator"
import { ThemeProvider } from "./theme/context"
import { customFontsToLoad } from "./theme/typography"
import queryClient from "../lib/queryClient"
import { SocketProvider } from "./context/AIChatContext"
import { InAppSubscriptionProvider } from "./context/InAppSubscriptionContext"
import { loadDateFnsLocale } from "./utils/formatDate"

if (__DEV__) {
  require("./devtools/ReactotronConfig.ts")
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const prefix = Linking.createURL("/")
const config = {
  screens: {
    Welcome: "",
    Login: {
      path: "login",
    },
    SignUp: {
      path: "signup",
    },
    ResourcesHome: {
      path: "resources",
    },
  },
}

const linking = {
  prefixes: [prefix],
  config,
}

export function App() {
  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const isAppReady = isI18nInitialized && (areFontsLoaded || !!fontLoadError)

  if (!isAppReady) {
    return null
  }

  return (
    <PostHogProvider
      apiKey="phc_Jr5GtJ6tJ1XgHIRHQOn7b5qUk4d07CJynLHLzbneZ5m"
      options={{
        host: "https://us.i.posthog.com",

        // check https://posthog.com/docs/session-replay/installation?tab=React+Native
        // for more config and to learn about how we capture sessions on mobile
        // and what to expect
        enableSessionReplay: true,
        sessionReplayConfig: {
          // Whether text inputs are masked. Default is true.
          // Password inputs are always masked regardless
          maskAllTextInputs: false,
          // Whether images are masked. Default is true.
          maskAllImages: true,
          // Capture logs automatically. Default is true.
          // Android only (Native Logcat only)
          captureLog: true,
          // Whether network requests are captured in recordings. Default is true
          // Only metric-like data like speed, size, and response code are captured.
          // No data is captured from the request or response body.
          // iOS only
          captureNetworkTelemetry: true,
          // Throttling delay used to reduce the number of snapshots captured and reduce performance impact
          // The lower the number more snapshots will be captured but higher the performance impact
          // Default is 1000ms
          throttleDelayMs: 1000,
        },
      }}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <InAppSubscriptionProvider>
                  <SocketProvider>
                    <AppContent />
                  </SocketProvider>
                </InAppSubscriptionProvider>
              </AuthProvider>
              <ToastWrapper />
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </PostHogProvider>
  )
}

function AppContent() {
  const { isLoading: isAuthLoading } = useAuth()

  const onLayoutRootView = useCallback(async () => {
    if (!isAuthLoading) {
      await SplashScreen.hideAsync()
    }
  }, [isAuthLoading])

  if (isAuthLoading) {
    return null
  }

  return <AppNavigator linking={linking} onReady={onLayoutRootView} />
}

function ToastWrapper() {
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])
  return <Toast topOffset={$topContainerInsets.paddingTop} />
}
