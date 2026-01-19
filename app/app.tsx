import "./utils/gestureHandler"

import { useEffect, useState, useCallback } from "react"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import * as SplashScreen from "expo-splash-screen"
import { QueryClientProvider } from "@tanstack/react-query"
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
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
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
