import { FC } from "react"
import { View } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"

export const ToolsPlaceholderScreen: FC = () => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme

  useHeader({
    titleTx: "toolsPlaceholder:title",
    backgroundColor: colors.palette.primary100,
  })

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: spacing.lg, flex: 1 }}>
      <Text size="sm" style={{ color: colors.textDim }} tx="toolsPlaceholder:subtitle" />
    </Screen>
  )
}
