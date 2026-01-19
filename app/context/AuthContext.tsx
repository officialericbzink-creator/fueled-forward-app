import { createContext, FC, PropsWithChildren, useContext, useCallback, useEffect } from "react"

import { authClient } from "../../lib/auth"
import { SessionQueryParams } from "better-auth/types"

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
  // Get session from Better Auth with loading states
  const { data: session, isPending, error, refetch, isRefetching } = authClient.useSession()

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      return {
        data: result.data,
        error: result.error ? { message: result.error.message || "Sign in failed" } : undefined,
      }
    } catch (err) {
      return {
        error: { message: err instanceof Error ? err.message : "An unexpected error occurred" },
      }
    }
  }, [])

  const signOut = useCallback(async () => {
    // console.log("Signing out user...")
    try {
      await authClient.signOut()
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }, [])

  const value: AuthContextType = {
    session: session ?? null,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    isPending,
    signIn,
    signOut,
    error: error ?? null,
    refetch,
    isRefetching,
  }

  // useEffect(() => {
  //   if (session) {
  //     console.log("Full session object:", JSON.stringify(session, null, 2))
  //   }
  // }, [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
