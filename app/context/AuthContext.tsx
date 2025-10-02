import { createContext, FC, PropsWithChildren, useContext, useCallback } from "react"

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
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  // Get session from Better Auth with loading states
  const { data: session, isPending, error } = authClient.useSession()

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
    await authClient.signOut()
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
