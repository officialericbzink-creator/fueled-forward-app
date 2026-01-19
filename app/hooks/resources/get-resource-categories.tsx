import { useQuery } from "@tanstack/react-query"

import { resourcesApi } from "@/services/api"

export function useGetResourceCategories() {
  return useQuery({
    queryKey: ["resource-categories"],
    queryFn: () => resourcesApi.getCategories(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since resources don't change often
  })
}
