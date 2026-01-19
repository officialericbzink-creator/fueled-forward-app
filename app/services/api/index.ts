import Config from "@/config"

import { ChatApi } from "./chat-api"
import { CheckInApi } from "./check-in-api"
import { GoalsApi } from "./goals-api"
import { OnboardingApi } from "./onboarding-api"
import { ProfileApi } from "./profile-api"
import { ResourcesApi } from "./resources-api"

const DEFAULT_API_CONFIG = {
  url: Config.API_URL,
  timeout: 10000,
}

const CMS_API_CONFIG = {
  url: Config.STRAPI_URL,
  timeout: 10000,
}

// Main backend API instances
export const profileApi = new ProfileApi(DEFAULT_API_CONFIG)
export const checkInApi = new CheckInApi(DEFAULT_API_CONFIG)
export const goalsApi = new GoalsApi(DEFAULT_API_CONFIG)
export const onboardingApi = new OnboardingApi(DEFAULT_API_CONFIG)
export const chatApi = new ChatApi(DEFAULT_API_CONFIG)

// CMS (Strapi) API instances
export const resourcesApi = new ResourcesApi(CMS_API_CONFIG, Config.STRAPI_TOKEN)

// Re-export types
export * from "./types"
