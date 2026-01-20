import { BaseApi } from "./base-api"
import type { OnboardingStatusResponse, OnboardingStepData, OnboardingStepResponse } from "./types"

export class OnboardingApi extends BaseApi {
  async getOnboardingStatus(): Promise<OnboardingStatusResponse> {
    const response = await this.apisauce.get("/profile/onboarding/status")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to get onboarding status")
    }
    return response.data as OnboardingStatusResponse
  }

  async submitOnboardingStep(
    step: number,
    stepData: OnboardingStepData,
  ): Promise<OnboardingStepResponse> {
    console.log(stepData)
    const response = await this.apisauce.post(`/profile/onboarding/${step}`, stepData)
    if (!response.ok) {
      throw new Error(response.data?.message || `Failed to submit step ${step}`)
    }
    return response.data as OnboardingStepResponse
  }

  async completeOnboarding(): Promise<{ success: boolean }> {
    const response = await this.apisauce.post("/profile/onboarding/complete")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to complete onboarding")
    }
    return response.data as { success: boolean }
  }
}
