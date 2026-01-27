import { BaseApi } from "./base-api"
import type {
  CheckInHistoryResponse,
  CheckInDetailsResponse,
  CheckInType,
  CreateCheckInResponse,
} from "./types"

export class CheckInApi extends BaseApi {
  async getCheckInHistory(): Promise<CheckInHistoryResponse> {
    const response = await this.apisauce.get("/check-in/history")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch check-in history")
    }
    return response.data as CheckInHistoryResponse
  }

  async getTodaysCheckIn(): Promise<CheckInDetailsResponse | { data: null }> {
    const response = await this.apisauce.get("/check-in/today")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch today's check-in")
    }

    return (response.data as CheckInDetailsResponse) || { data: null }
  }

  async hasCheckedInToday(): Promise<{ hasCheckedIn: boolean }> {
    const response = await this.apisauce.get("/check-in/has-checked-in-today")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to check today's check-in status")
    }
    return response.data as { hasCheckedIn: boolean }
  }

  async getCheckInDetails(id: string) {
    const response = await this.apisauce.get(`/check-in/details/${id}`)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch check-in details")
    }
    return response.data
  }

  async createCheckIn(checkInData: CheckInType): Promise<CreateCheckInResponse> {
    const response = await this.apisauce.post("/check-in", checkInData)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to create check-in")
    }
    return response.data as CreateCheckInResponse
  }
}
