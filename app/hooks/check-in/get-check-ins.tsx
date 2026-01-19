import { useQuery } from "@tanstack/react-query"

import { checkInApi } from "@/services/api"

export const useGetCheckInHistory = () => {
  const queryKey = ["check-in-history"]

  const queryFn = () => {
    return checkInApi.getCheckInHistory()
  }
  return useQuery({ queryKey, queryFn })
}
