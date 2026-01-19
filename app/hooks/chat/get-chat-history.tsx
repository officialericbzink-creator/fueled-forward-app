import { useQuery } from "@tanstack/react-query"

import { chatApi } from "@/services/api"

export const useGetConversationHistory = () => {
  const queryKey = ["chat-history"]

  const queryFn = () => {
    return chatApi.getConversationHistory()
  }
  return useQuery({ queryKey, queryFn })
}
