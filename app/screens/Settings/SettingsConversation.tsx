import { FC } from "react"
import { ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SettingsStackScreenProps } from "@/navigators/SettingsNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
// import { useNavigation } from "@react-navigation/native"

interface SettingsMenuScreenProps extends SettingsStackScreenProps<"SettingsConversation"> {}

export const SettingsConversationScreen: FC<SettingsMenuScreenProps> = ({ navigation }) => {
  const { themed } = useAppTheme()
  useHeader({
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    title: "Clear Conversation",
  })
  return (
    <Screen style={themed($root)} preset="auto">
      <Text text="settings conversation" />
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})
