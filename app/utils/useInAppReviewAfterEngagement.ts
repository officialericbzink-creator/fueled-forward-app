import { useCallback, useRef } from "react"
import { InteractionManager } from "react-native"
import { NavigationState } from "@react-navigation/native"

import { getActiveRouteName } from "@/navigators/navigationUtilities"
import { storage } from "@/utils/storage"
import { promptToReviewAsync } from "@/utils/useStoreReviewRequest"

// Versioned key so legacy onboarding-triggered prompts don't permanently disable FF-21 behavior.
const STORE_REVIEW_REQUESTED_KEY = "storeReviewRequestedAfterEngagement_v1"

const excludedRoutes = new Set<string>([
  "Welcome",
  "Login",
  "SignUp",
  "EmailVerification",
  "Onboarding",
])

function engagedScreensKey(userId: string) {
  return `storeReviewEngagedScreens:${userId}`
}

function readEngagedScreens(userId: string): Set<string> {
  const raw = storage.getString(engagedScreensKey(userId))
  if (!raw) return new Set()
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((x): x is string => typeof x === "string" && x.length > 0))
  } catch {
    return new Set()
  }
}

function writeEngagedScreens(userId: string, screens: Set<string>) {
  storage.set(engagedScreensKey(userId), JSON.stringify(Array.from(screens)))
}

/**
 * Triggers the in-app review prompt only after a user has engaged with 3+ distinct screens.
 * Designed to be wired into `NavigationContainer`'s `onStateChange`.
 */
export function useInAppReviewAfterEngagement(options: { userId?: string; enabled: boolean }) {
  const { userId, enabled } = options
  const previousRouteNameRef = useRef<string | undefined>(undefined)
  const isPromptingRef = useRef(false)

  const onNavigationStateChange = useCallback(
    (state: NavigationState | undefined) => {
      if (!state) return

      const currentRouteName = getActiveRouteName(state)
      const previousRouteName = previousRouteNameRef.current
      previousRouteNameRef.current = currentRouteName

      if (previousRouteName === currentRouteName) return
      if (!enabled || !userId) return
      if (excludedRoutes.has(currentRouteName)) return
      if (storage.getBoolean(STORE_REVIEW_REQUESTED_KEY)) return

      const engaged = readEngagedScreens(userId)
      engaged.add(currentRouteName)
      writeEngagedScreens(userId, engaged)

      if (engaged.size < 3) return
      if (isPromptingRef.current) return
      isPromptingRef.current = true

      // Run after navigation interactions so Alert/dialog isn't swallowed by transitions.
      InteractionManager.runAfterInteractions(() => {
        promptToReviewAsync()
          .then(() => {
            storage.set(STORE_REVIEW_REQUESTED_KEY, true)
          })
          .catch(() => {
            // Swallow errors; we never want review prompting to crash navigation.
          })
          .finally(() => {
            isPromptingRef.current = false
          })
      })
    },
    [enabled, userId],
  )

  return { onNavigationStateChange }
}
