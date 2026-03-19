import { FC } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { ToolsStackScreenProps } from "@/navigators/ToolsNavigator"
import type { JournalEntryType } from "@/services/api/entries-api"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

const OPTIONS: { type: JournalEntryType; label: string }[] = [
  { type: "journal_entry", label: "New Journal Entry" },
  { type: "activity_log", label: "New Activity Log" },
  { type: "vent", label: "Vent" },
]

export const NewEntryOptionsScreen: FC<ToolsStackScreenProps<"NewEntryOptions">> = ({
  navigation,
}) => {
  const { themed, theme } = useAppTheme()
  const { colors, spacing } = theme

  useHeader({
    title: "New",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    backgroundColor: colors.palette.primary100,
  })

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: spacing.md }}>
      {OPTIONS.map((o) => (
        <TouchableOpacity
          key={o.type}
          style={themed($option)}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("JournalEditor", { entryType: o.type })}
        >
          <Text weight="medium" size="sm">
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Screen>
  )
}

const $option: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
  marginBottom: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})
