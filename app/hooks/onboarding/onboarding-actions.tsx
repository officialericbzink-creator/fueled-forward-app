import { useMutation, useQueryClient } from "@tanstack/react-query"

import { onboardingApi } from "@/services/api"
import { OnboardingStepData } from "@/services/api/types"
import Toast from "react-native-toast-message"

export const useSubmitOnboardingStep = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ step, data }: { step: number; data: OnboardingStepData }) => {
      return onboardingApi.submitOnboardingStep(step, data)
    },
    // onSuccess: () => {
    //   // Invalidate onboarding status to refetch
    //   queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] })
    // },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error submitting step",
        text2: error.message || "Please try again.",
      })
      console.error("Error submitting onboarding step:", error)
    },
  })
}

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => {
      console.log("Completing onboarding")
      return onboardingApi.completeOnboarding()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] })
      // You might also want to invalidate user data here
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Error completing onboarding",
        text2: "Please try again.",
      })
    },
  })
}
