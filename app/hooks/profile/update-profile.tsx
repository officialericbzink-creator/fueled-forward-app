import { useMutation, useQueryClient } from "@tanstack/react-query"

import { profileApi } from "@/services/api"
import { Profile, UserWithProfile } from "@/services/api/types"

type UpdateProfileData = Pick<UserWithProfile, "name" | "image"> & {
  profile: Pick<Profile, "bio" | "struggles" | "inTherapy" | "therapyDetails" | "struggleNotes">
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileData: UpdateProfileData) => {
      return await profileApi.updateProfile(profileData)
    },
    onSuccess: () => {
      // Invalidate the profile query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}
