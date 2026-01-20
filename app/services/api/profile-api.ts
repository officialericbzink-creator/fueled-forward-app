import { BaseApi } from "./base-api"
import type { UserWithProfile, UpdateProfileData, ImageUploadResult } from "./types"

export class ProfileApi extends BaseApi {
  async getProfile(): Promise<UserWithProfile> {
    const response = await this.apisauce.get(`/profile/me`)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch profile")
    }
    return response.data as UserWithProfile
  }

  async updateProfile(profileData: Partial<UpdateProfileData>): Promise<{ success: boolean }> {
    const response = await this.apisauce.post("/profile/update", profileData)
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to update profile")
    }
    return response.data as { success: boolean }
  }

  async uploadAvatar(avatarData: FormData): Promise<ImageUploadResult> {
    const response = await this.apisauce.post("/profile/avatar", avatarData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to upload avatar")
    }
    return response.data as ImageUploadResult
  }
}
