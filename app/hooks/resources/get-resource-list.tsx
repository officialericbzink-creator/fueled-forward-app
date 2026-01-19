import { useQuery } from "@tanstack/react-query"

import { resourcesApi } from "@/services/api"

export function useGetResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => resourcesApi.getResources(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since resources don't change often
  })
}
