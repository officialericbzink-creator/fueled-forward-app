import { FC } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Key,
  ProfileCircle,
  Lock,
  Trash,
  Clock,
} from "iconoir-react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { SettingsStackScreenProps } from "@/navigators/SettingsNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
// import { useNavigation } from "@react-navigation/native"

interface SettingsMenuScreenProps extends SettingsStackScreenProps<"SettingsMenu"> {}

export const SettingsMainScreen: FC<SettingsMenuScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth()
  const {
    themed,
    theme: { spacing, colors },
  } = useAppTheme()
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
        {/*<TouchableOpacity onPress={() => navigation.navigate("SettingsSecurity")}>
          <View
            style={{
              paddingVertical: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Lock width={36} height={36} color={colors.text} />
            <Text text="Security" weight="semiBold" size="xs" />
            <ArrowRight width={20} height={20} color={colors.text} />
          </View>
        </TouchableOpacity>*/}
        <TouchableOpacity onPress={() => navigation.navigate("SettingsConversation")}>
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
            <ArrowRight width={20} height={20} color={colors.text} />
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
