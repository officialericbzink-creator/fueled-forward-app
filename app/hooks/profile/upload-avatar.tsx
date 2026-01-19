import { useMutation, useQueryClient } from "@tanstack/react-query"

import { profileApi } from "@/services/api"

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["upload-avatar"],
    mutationFn: async (avatarData: FormData) => {
      return profileApi.uploadAvatar(avatarData)
    },
    onSuccess: (data) => {
      console.log("Avatar uploaded successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
    onError: (error: any) => {
      console.error("Error uploading avatar:", error.message)
      throw new Error(error.message || "Failed to upload avatar")
    },
  })
}
