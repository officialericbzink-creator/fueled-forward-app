import { FC } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { Journal, NavArrowRight } from "iconoir-react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { REGISTERED_TOOLS } from "@/tools/toolRegistry"
import { ToolsStackScreenProps } from "@/navigators/ToolsNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

export const ToolsHomeScreen: FC<ToolsStackScreenProps<"ToolsHome">> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()
  const { colors, spacing } = theme

  useHeader({
    titleTx: "journal:toolsScreen.title",
    backgroundColor: colors.palette.primary100,
  })

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
      <Text
        size="xs"
        style={{ color: colors.textDim, marginBottom: spacing.md }}
        tx="journal:toolsScreen.subtitle"
      />
      {REGISTERED_TOOLS.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          activeOpacity={0.85}
          onPress={() => navigation.navigate(tool.screen)}
          style={themed($row)}
        >
          <View style={{ marginRight: spacing.sm }}>
            <Journal width={24} height={24} color={colors.text} strokeWidth={1.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="semiBold" size="sm" tx={tool.titleKey} />
            <Text size="xxs" style={{ color: colors.textDim, marginTop: 4 }} tx={tool.subtitleKey} />
          </View>
          <NavArrowRight width={22} height={22} color={colors.text} />
        </TouchableOpacity>
      ))}
    </Screen>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.md,
  marginBottom: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})
