import * as SecureStore from "expo-secure-store"
import { expoClient } from "@better-auth/expo/client"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "fueled-forward-app",
      storagePrefix: "fueled-forward-app",
      storage: SecureStore,
    }),
  ],
})
