import { useMutation, useQueryClient } from "@tanstack/react-query"

import { checkInApi } from "@/services/api"
import { CheckInDetails, CheckInType } from "@/services/api/types"

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient()

  const mutationFn = async (data: CheckInType) => {
    try {
      return checkInApi.createCheckIn(data)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["check-in-today"] })
    await queryClient.invalidateQueries({ queryKey: ["check-in-history"] })
  }

  return useMutation({ mutationFn, onSuccess })
}
