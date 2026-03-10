import { FC, useState } from "react"
import { ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { useDeleteProfile } from "@/hooks/profile/delete-profile"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { SettingsStackScreenProps } from "@/navigators/SettingsNavigator"
import { colors } from "@/theme/colors"
import { useAppTheme } from "@/theme/context"
// import { useNavigation } from "@react-navigation/native"

interface SettingsAccountDeleteScreenProps extends SettingsStackScreenProps<"SettingsAccountDelete"> {}

export const SettingsAccountDeleteScreen: FC<SettingsAccountDeleteScreenProps> = ({
  navigation,
}) => {
  const { user, signOut } = useAuth()
  const [confirmText, setConfirmText] = useState("")
  const { mutateAsync } = useDeleteProfile()

  const { theme } = useAppTheme()

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return

    console.log("Deleting account for user:", user?.id)

    // Call your API endpoint to delete account
    const response = await mutateAsync()

    if (response.success) {
      console.log("Account deleted successfully")
      await signOut()
    } else {
      console.error("Failed to delete account")
    }
  }

  return (
    <Screen
      preset="auto"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm }}
    >
      <Text size="lg" weight="bold">
        Delete Account
      </Text>

      <Text style={{ color: colors.error }}>Warning: This action cannot be undone.</Text>

      <Text>Deleting your account will permanently remove:</Text>
      <Text>• All your messages and conversations</Text>
      <Text>• Your mood check-in history</Text>
      <Text>• Your daily goals and progress</Text>
      <Text>• Your profile information</Text>

      <Text>Type DELETE to confirm:</Text>
      <TextField value={confirmText} onChangeText={setConfirmText} placeholder="DELETE" />

      <Button
        preset="cancel"
        text="Delete My Account"
        onPress={handleDelete}
        disabled={confirmText !== "DELETE"}
      />

      <Button preset="default" text="Cancel" onPress={() => navigation.goBack()} />
    </Screen>
  )
}
