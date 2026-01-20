import { useQuery } from "@tanstack/react-query"

import { useAuth } from "@/context/AuthContext"
import { onboardingApi } from "@/services/api"

export const useGetOnboardingStatus = () => {
  const { user } = useAuth()

  const queryKey = ["onboarding", "status", user?.id] // ← Include userId
  const queryFn = () => onboardingApi.getOnboardingStatus()

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!user?.id, // ← Only run query if user exists
    refetchOnMount: true,
    staleTime: 0,
  })
}
