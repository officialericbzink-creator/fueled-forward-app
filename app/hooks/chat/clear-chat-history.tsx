import { useMutation, useQueryClient } from "@tanstack/react-query"

import { chatApi } from "@/services/api"

export const useClearConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return chatApi.clearConversationHistory()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat-history"] })
    },
    onError: (error) => {
      console.log("Error clearing conversation")
      throw error
    },
  })
}
