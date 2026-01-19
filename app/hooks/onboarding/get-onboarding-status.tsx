import { useQuery } from "@tanstack/react-query"

import { onboardingApi } from "@/services/api"

export const useGetOnboardingStatus = () => {
  const queryKey = ["onboarding", "status"]

  const queryFn = () => onboardingApi.getOnboardingStatus()
  return useQuery({
    queryKey,
    queryFn,
  })
}
