/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number

  withCredentials?: boolean
}

export type CheckInType = {
  date: string
  steps: CheckInStep[]
  overallMood?: number
  completed?: boolean
}

export interface CheckInStep {
  step: number
  mood: number
  notes?: string
}

export interface CheckInDetails extends CheckInType {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CheckInDetailsResponse {
  data: CheckInDetails
}

export interface CreateCheckInResponse {
  message: string
  data: CheckInDetails
}

export type CheckInHistoryResponse = {
  data: CheckInDetails[]
  count: number
}

export interface GoalRecommendation {
  id: string
  title: string
}

export interface Goal {
  id: string
  userId: string
  goal: string
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateGoal {
  goal: string
}

export interface DailyGoalsResponse {
  data: Goal[]
  count: number
}

export interface GoalResponse {
  data: Goal
  message: string
}

export interface DeleteGoalResponse {
  message: string
}

export interface GoalRecommendationsResponse {
  data: string[]
  count: number
}

export interface OnboardingStatusResponse {
  completedOnboarding: boolean
  currentStep: number
  profile?: {
    struggles?: string[]
    struggleTimestamp?: Date
    struggleNotes?: string
    inTherapy: boolean
    therapyDetails?: string
  }
}

export interface OnboardingStepResponse {
  success: boolean
  currentStep: number
}

// Step data types
export interface Step0Data {
  name: string
}

export interface Step1Data {
  struggles: string[]
}

export interface Step2Data {
  importantDate?: string
  importantDateText?: string
}

export interface Step3Data {
  inTherapy: boolean
  therapyDetails?: string
}

export interface Step4Data {
  paywallCompleted: boolean
}

export interface Step5Data {
  biometricEnabled: boolean
}

export type OnboardingStepData =
  | Step0Data
  | Step1Data
  | Step2Data
  | Step3Data
  | Step4Data
  | Step5Data

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export interface ConversationHistoryResponse {
  conversationId: string | null
  messages: ChatMessage[]
}

export interface Profile {
  id: string
  userId: string
  bio: string | null
  createdAt: string
  updatedAt: string | null
  struggles: string[] | null
  struggleTimestamp: string | null
  struggleNotes: string | null
  inTherapy: boolean
  therapyDetails: string | null
}

export interface UserWithProfile {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  role: "user" | "admin"
  banned: boolean
  banReason: string | null
  banExpires: string | null
  username: string | null
  displayUsername: string | null
  localSecurityEnabled: boolean
  completedOnboarding: boolean
  onboardingStep: number
  profile: Profile
}

export type UpdateProfileData = Pick<
  UserWithProfile,
  "name" | "image" | "username" | "displayUsername"
> & {
  profile: Pick<Profile, "bio" | "struggles" | "inTherapy" | "therapyDetails" | "struggleNotes">
}

export interface StrapiResource {
  id: number
  documentId: string
  title: string
  type: string
  read_time: Record<string, any>
  resource_type: Record<string, any>
  category: Record<string, any>
  summary: string
  content: string // Rich text content
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface StrapiResourceCategory {
  createdAt: string
  description: string | null
  documentId: string
  id: number
  locale: string
  name: string
  publishedAt: string
  slug: string | null
  updatedAt: string
}

export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface StrapiMeta {
  pagination?: StrapiPagination
}

export interface StrapiResponse<T> {
  data: T
  meta: StrapiMeta
}
