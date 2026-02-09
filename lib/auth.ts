import * as SecureStore from "expo-secure-store"
import { expoClient } from "@better-auth/expo/client"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import Config from "@/config"
import { BASE_SCHEME } from "@/utils/constants"

export const authClient = createAuthClient({
  baseURL: Config.API_URL,
  plugins: [
    expoClient({
      scheme: BASE_SCHEME,
      storagePrefix: BASE_SCHEME,
      storage: SecureStore,
    }),
    inferAdditionalFields({
      user: {
        completedOnboarding: {
          type: "boolean",
          required: false,
        },
        onboardingStep: {
          type: "number",
          required: false,
        },
        role: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
})
