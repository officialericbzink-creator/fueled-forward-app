import { useQuery } from "@tanstack/react-query"

import { useAuth } from "@/context/AuthContext"
import { checkInApi } from "@/services/api"

export const useGetTodaysCheckIn = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["check-in-today", user?.id],
    queryFn: async () => {
      const response = await checkInApi.getTodaysCheckIn()
      return {
        hasCheckedIn: !!response.data, // or response.data?.completed
        data: response.data,
        enabled: !!user?.id,
      }
    },
  })
}
