import { useQuery } from "@tanstack/react-query"

import { goalsApi } from "@/services/api"
import type { DailyGoalsResponse } from "@/services/api/types"

export const useGetDailyGoals = () => {
  return useQuery<DailyGoalsResponse>({
    queryKey: ["daily-goals"],
    queryFn: () => goalsApi.getDailyGoals(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
