import { useQuery } from "@tanstack/react-query"

import { profileApi } from "@/services/api"

export const useGetProfile = (userId: string) => {
  const queryKey = ["profile"]
  const queryFn = async () => {
    return await profileApi.getProfile()
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId,
  })
}
