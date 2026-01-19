import { FC, useEffect, useReducer, useState } from "react"
import { Alert, Image, Pressable, TextStyle, View, ViewStyle } from "react-native"
import Toast from "react-native-toast-message"

import { SettingsStackScreenProps } from "@/navigators/SettingsNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useHeader } from "@/utils/useHeader"
import { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import { TextField } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useGetProfile } from "@/hooks/profile/get-profile"
import {
  profileFormReducer,
  initialFormState,
  ProfileFormActionType,
} from "@/reducers/profile-form-reducer"
import { Button } from "@/components/Button"
import { useUpdateProfile } from "@/hooks/profile/update-profile"
import { useUploadAvatar } from "@/hooks/profile/upload-avatar"
import { STRUGGLE_OPTIONS } from "@/utils/constants"
// import { useNavigation } from "@react-navigation/native"

const DEFAULT_AVATAR = require("../../../assets/images/default-avatar.png")

interface SettingsMenuScreenProps extends SettingsStackScreenProps<"SettingsProfile"> {}

export const SettingsProfileScreen: FC<SettingsMenuScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { data } = useGetProfile(user?.id || "")

  const [formState, dispatch] = useReducer(profileFormReducer, initialFormState)
  const [imageAsset, setImageAsset] = useState(null)

  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const { isPending: avatarPending, mutate: uploadAvatar } = useUploadAvatar()

  useEffect(() => {
    if (data) {
      dispatch({ type: ProfileFormActionType.SET_INITIAL_DATA, payload: data })
    }
  }, [data])

  const handleAvatarChange = () => {}

  const handleGoBack = () => {
    if (formState.isDirty) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back without saving?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard Changes",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ],
      )
    } else {
      navigation.goBack()
    }
  }

  const {
    themed,
    theme: { spacing, colors },
  } = useAppTheme()
  useHeader(
    {
      leftIcon: "back",
      onLeftPress: handleGoBack,
      title: "Edit Profile",
    },
    [formState.isDirty],
  )

  const handleToggleStruggle = (struggle: string) => {
    dispatch({ type: ProfileFormActionType.TOGGLE_STRUGGLE, payload: struggle })
  }

  const handleNameChange = (name: string) => {
    dispatch({ type: ProfileFormActionType.UPDATE_NAME, payload: name })
  }

  const handleTherapyChange = (inTherapy: boolean) => {
    dispatch({ type: ProfileFormActionType.UPDATE_IN_THERAPY, payload: inTherapy })
  }

  const handleSave = () => {
    if (!formState.isDirty) {
      return
    }

    const { isDirty, ...profileData } = formState

    updateProfile(profileData, {
      onSuccess: () => {
        dispatch({ type: ProfileFormActionType.RESET_DIRTY })
        // Optional: Show success message
        Toast.show({
          type: "success",
          text1: "Profile updated successfully",
        })
        navigation.goBack()
      },
      onError: (error) => {
        // Optional: Show error message
        Toast.show({
          type: "error",
          text1: "Failed to update profile",
          text2: error.message,
        })
      },
    })
  }

  return (
    <Screen
      style={themed($root)}
      contentContainerStyle={{ alignItems: "stretch" }}
      preset="auto"
      safeAreaEdges={["bottom"]}
    >
      <View
        style={{ marginVertical: spacing.lg, gap: spacing.lg, alignItems: "center", width: "100%" }}
      >
        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <Pressable>
            <Image
              source={user?.image ? { uri: user.image } : DEFAULT_AVATAR}
              style={{ height: 150, width: 150, borderRadius: 75 }}
            />
          </Pressable>
          <Text text="Change Profile Image" size="xs" centered />
        </View>
        <TextField
          label="Name"
          placeholder="Your Name"
          value={formState.name}
          onChangeText={handleNameChange}
          containerStyle={{ width: "100%" }}
        />
        <View style={{ width: "100%" }}>
          <Text text="Struggles you are dealing with:" weight="medium" />
          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            {STRUGGLE_OPTIONS.map((struggle) => (
              <Checkbox
                key={struggle}
                label={struggle}
                onValueChange={() => handleToggleStruggle(struggle)}
                value={formState.profile.struggles?.includes(struggle)}
              />
            ))}
          </View>
        </View>
        <View style={{ width: "100%" }}>
          <Text text="Currently in therapy:" weight="medium" />
          <View style={themed($optionsContainer)}>
            <Pressable
              style={[
                themed($option),
                formState.profile.inTherapy === true && { backgroundColor: colors.tint },
              ]}
              onPress={() => handleTherapyChange(true)}
            >
              <Text
                style={[
                  themed($optionText),
                  formState.profile.inTherapy === true && { color: colors.palette.neutral100 },
                ]}
              >
                Yes
              </Text>
            </Pressable>

            <Pressable
              style={[
                themed($option),
                formState.profile.inTherapy === false && { backgroundColor: colors.tint },
              ]}
              onPress={() => handleTherapyChange(false)}
            >
              <Text
                style={[
                  themed($optionText),
                  formState.profile.inTherapy === false && {
                    color: colors.palette.neutral100,
                  },
                ]}
              >
                No
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      {formState.isDirty && (
        <Button
          preset="reversed"
          text={isPending ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={isPending}
        />
      )}
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $optionsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  marginTop: theme.spacing.md,
  gap: theme.spacing.sm,
})

const $option: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingVertical: theme.spacing.md,
  paddingHorizontal: theme.spacing.lg,
  borderRadius: theme.spacing.md,
  backgroundColor: theme.colors.palette.neutral200,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral400,
  alignItems: "center",
})

const $optionText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontWeight: "600",
  color: theme.colors.text,
})
