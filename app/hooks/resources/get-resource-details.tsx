import { useQuery } from "@tanstack/react-query"

import { resourcesApi } from "@/services/api"

export function useGetResource(documentId: string) {
  return useQuery({
    queryKey: ["resource", documentId],
    queryFn: async () => {
      const response = await resourcesApi.getResourceById(documentId)
      return response.data
    },
    enabled: !!documentId,
  })
}
