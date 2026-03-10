import { FC, useCallback } from "react"
import { Alert, Linking, Pressable, TouchableOpacity, View, ViewStyle } from "react-native"
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Key,
  ProfileCircle,
  Lock,
  Trash,
  Clock,
  UserXmark,
} from "iconoir-react-native"
import Toast from "react-native-toast-message"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { useClearConversation } from "@/hooks/chat/clear-chat-history"
import { SettingsStackScreenProps } from "@/navigators/SettingsNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { BASE_WEB_URL } from "@/utils/constants"
import { useHeader } from "@/utils/useHeader"
// import { useNavigation } from "@react-navigation/native"

interface SettingsMenuScreenProps extends SettingsStackScreenProps<"SettingsMenu"> {}

export const SettingsMainScreen: FC<SettingsMenuScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth()
  const {
    themed,
    theme: { spacing, colors },
  } = useAppTheme()

  const { isError, mutateAsync: clearConversation } = useClearConversation()

  const handleClearConversation = useCallback(() => {
    Alert.alert("Clear Conversation", "Are you sure you want to clear the conversation history?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        onPress: async () => {
          try {
            await clearConversation()
            Toast.show({ type: "success", text1: "Conversation cleared successfully" })
          } catch (error) {
            console.log(error)
            Toast.show({ type: "error", text1: "Failed to clear conversation" })
          }
        },
        style: "destructive",
      },
    ])
  }, [clearConversation])
  useHeader({
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    title: "Settings",
  })
  return (
    <Screen
      contentContainerStyle={{ flex: 1 }}
      style={themed($root)}
      preset="auto"
      safeAreaEdges={["bottom"]}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsProfile")}>
          <View
            style={{
              paddingVertical: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <ProfileCircle width={36} height={36} color={colors.text} />
            <Text text="Edit Profile" weight="semiBold" size="xs" />
            <ArrowRight width={20} height={20} color={colors.text} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsSubscription")}>
          <View
            style={{
              paddingVertical: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <CreditCard width={36} height={36} color={colors.text} />
            <Text text="My Subscription" weight="semiBold" size="xs" />
            <ArrowRight width={20} height={20} color={colors.text} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsAccountDelete")}>
          <View
            style={{
              paddingVertical: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <UserXmark width={36} height={36} color={colors.text} />
            <Text text="Delete Account" weight="semiBold" size="xs" />
            <ArrowRight width={20} height={20} color={colors.text} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearConversation}>
          <View
            style={{
              paddingVertical: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Trash width={36} height={36} color={colors.text} />
            <Text text="Clear Conversation" weight="semiBold" size="xs" />
          </View>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => navigation.navigate("SettingsCheckIn")}>
          <View
            style={{
              paddingVertical: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Clock width={36} height={36} color={colors.text} />
            <Text text="Check-in Reminder" weight="semiBold" size="xs" />
            <ArrowRight width={20} height={20} color={colors.text} />
          </View>
        </TouchableOpacity>*/}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: spacing.xxl,
            gap: spacing.sm,
          }}
        >
          <Pressable onPress={() => Linking.openURL(`${BASE_WEB_URL}/terms`)}>
            <Text size="xxs" style={{ color: colors.tint, textDecorationLine: "underline" }}>
              Terms of Use
            </Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(`${BASE_WEB_URL}/privacy`)}>
            <Text size="xxs" style={{ color: colors.tint, textDecorationLine: "underline" }}>
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </View>

      <Button testID="login-button" text={"Logout"} preset="cancel" onPress={() => signOut()} />
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.lg,
})
