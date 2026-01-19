import React, { FC } from "react"
import { View, StyleSheet, Animated, ViewStyle } from "react-native"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
interface ProgressBarProps {
  progress: number
  maxSteps?: number
  animated?: boolean
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, maxSteps = 5, animated = false }) => {
  const { themed } = useAppTheme()

  const normalized = (progress - 1) / (maxSteps - 1)
  const clampedProgress = Math.min(Math.max(normalized, 0), 1)

  const animatedWidth = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 300,
        useNativeDriver: false, // width animations require false
      }).start()
    }
  }, [clampedProgress, animated, animatedWidth])

  const widthStyle = animated
    ? {
        width: animatedWidth.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        }),
      }
    : { width: `${clampedProgress * 100}%` }

  return (
    <View style={themed($progressMeter)}>
      <Animated.View style={[themed($progressBar), widthStyle]} />
    </View>
  )
}
const $progressMeter: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "100%",
  height: 6,
  backgroundColor: colors.palette.primary200, // gray
  borderRadius: 4,
  overflow: "hidden",
})

const $progressBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: "100%",
  backgroundColor: colors.palette.success500, // green
  borderRadius: 4,
})
