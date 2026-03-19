import { FC } from "react"
import { View } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"

/**
 * Snapshot tab (Home | Tools | Chat | Snapshot | Resources).
 */
export const SnapshotScreen: FC = () => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme

  useHeader({
    titleTx: "snapshot:title",
    backgroundColor: colors.palette.primary100,
  })

  return (
    <Screen preset="fixed">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg }}>
        <Text size="xs" style={{ color: colors.textDim }} tx="snapshot:comingSoon" />
      </View>
    </Screen>
  )
}
