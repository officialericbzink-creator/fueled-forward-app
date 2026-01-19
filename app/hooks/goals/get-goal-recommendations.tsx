import { useQuery } from "@tanstack/react-query"

import { goalsApi } from "@/services/api"
import type { GoalRecommendationsResponse } from "@/services/api/types"

export const useGoalRecommendations = () => {
  return useQuery<GoalRecommendationsResponse>({
    queryKey: ["goal-recommendations"],
    queryFn: () => goalsApi.getGoalRecommendations(),
    staleTime: 1000 * 60 * 60,
  })
}
