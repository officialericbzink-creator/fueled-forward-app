import { useQuery } from "@tanstack/react-query"

import { checkInApi } from "@/services/api"

export const useGetTodaysCheckIn = () => {
  return useQuery({
    queryKey: ["check-in-today"],
    queryFn: async () => {
      const response = await checkInApi.getTodaysCheckIn()
      return {
        hasCheckedIn: !!response.data, // or response.data?.completed
        data: response.data,
      }
    },
  })
}
