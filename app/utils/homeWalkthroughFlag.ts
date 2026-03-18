import { storage } from "@/utils/storage"

const KEY = "homeWalkthrough.done"

/** Call on logout — next session can show the walkthrough again as configured. */
export function clearHomeWalkthroughFlag() {
  storage.delete(KEY)
}

/** After login: completed onboarding → skip walkthrough; otherwise show it after home. */
export function setHomeWalkthroughFromUser(user: unknown) {
  const u = user as { completedOnboarding?: boolean | null } | null | undefined
  if (u?.completedOnboarding === true) {
    storage.set(KEY, true)
  } else {
    storage.delete(KEY)
  }
}

/** After register — always show walkthrough once they reach home (post-onboarding). */
export function setHomeWalkthroughNotDoneAfterRegister() {
  storage.delete(KEY)
}
