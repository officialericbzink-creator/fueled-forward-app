import { useMutation, useQueryClient } from "@tanstack/react-query"

import { profileApi } from "@/services/api"

export function useDeleteProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return await profileApi.deleteProfile()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
