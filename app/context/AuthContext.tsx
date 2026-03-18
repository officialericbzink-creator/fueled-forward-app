import { createContext, FC, PropsWithChildren, useContext, useCallback, useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { SessionQueryParams } from "better-auth/types"

import { clearHomeWalkthroughFlag } from "@/utils/homeWalkthroughFlag"
import { posthog } from "@/utils/posthog"

import { authClient } from "../../lib/auth"

export type AuthContextType = {
  // Session data
  session: typeof authClient.$Infer.Session | null
  user: typeof authClient.$Infer.Session.user | null
  isAuthenticated: boolean

  // Loading states
  isLoading: boolean
  isPending: boolean

  // Actions
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    data?: any
    error?: { message: string }
  }>
  signOut: () => Promise<void>

  // Error state
  error: Error | null
  refetch: (queryParams?: { query?: SessionQueryParams }) => void
  isRefetching: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const queryClient = useQueryClient()
  const { data: session, isPending, error, refetch, isRefetching } = authClient.useSession()
  const [hasResolvedSession, setHasResolvedSession] = useState(false)

  useEffect(() => {
    // `isPending` may briefly flip true again during refetches (e.g. app foreground/background
    // transitions triggered by FaceID/Password AutoFill). We only want to treat loading as a
    // one-time "bootstrapping" state so the app doesn't unmount navigation and reset screens.
    if (!isPending) setHasResolvedSession(true)
  }, [isPending])

  useEffect(() => {
    console.log("🔍 AUTH STATE CHANGED:", {
      hasSession: !!session,
      userId: session?.user?.id,
      isPending,
      timestamp: new Date().toISOString(),
    })
  }, [session, isPending])

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        queryClient.removeQueries({ queryKey: ["onboarding"] })
        return {
          data: result.data,
          error: result.error ? { message: result.error.message || "Sign in failed" } : undefined,
        }
      } catch (err) {
        posthog.captureException(err, { context: "AuthProvider.signIn", timestamp: Date.now() })
        return {
          error: { message: err instanceof Error ? err.message : "An unexpected error occurred" },
        }
      }
    },
    [queryClient],
  )

  const signOut = useCallback(async () => {
    try {
      clearHomeWalkthroughFlag()
      await authClient.signOut()
      queryClient.clear()
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }, [queryClient])

  const value: AuthContextType = {
    session: session ?? null,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: !hasResolvedSession,
    isPending,
    signIn,
    signOut,
    error: error ?? null,
    refetch,
    isRefetching,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
