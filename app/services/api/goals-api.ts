import { BaseApi } from "./base-api"
import type {
  DailyGoalsResponse,
  CreateGoal,
  GoalResponse,
  DeleteGoalResponse,
  GoalRecommendationsResponse,
} from "./types"

export class GoalsApi extends BaseApi {
  async getDailyGoals(): Promise<DailyGoalsResponse> {
    const response = await this.apisauce.get("/goals")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch daily goals")
    }
    return response.data as DailyGoalsResponse
  }

  async createGoal(goalData: CreateGoal): Promise<GoalResponse> {
    const response = await this.apisauce.post("/goals", goalData)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to create goal")
    }
    return response.data as GoalResponse
  }

  async toggleGoal(goalId: string): Promise<GoalResponse> {
    const response = await this.apisauce.patch(`/goals/${goalId}/toggle`)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to update goal")
    }
    return response.data as GoalResponse
  }

  async deleteGoal(goalId: string): Promise<DeleteGoalResponse> {
    const response = await this.apisauce.delete(`/goals/${goalId}`)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to delete goal")
    }
    return response.data as DeleteGoalResponse
  }

  async getGoalRecommendations(): Promise<GoalRecommendationsResponse> {
    const response = await this.apisauce.get("/goals/recommendations")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to get goal recommendations")
    }
    return response.data as GoalRecommendationsResponse
  }
}
