// components/AnimatedChatMessage.tsx
import { FC, useEffect, useState } from "react"
import { ViewStyle, TextStyle, View, Image } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { TxKeyPath } from "@/i18n"

interface AnimatedChatMessageProps {
  message: string | TxKeyPath
  delay?: number
  onAnimationComplete?: () => void
  translated?: boolean
}

export const AnimatedChatMessage: FC<AnimatedChatMessageProps> = ({
  message,
  delay = 0,
  onAnimationComplete,
  translated = false,
}) => {
  const { themed } = useAppTheme()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Start rendering just before animation begins
    const renderTimeout = setTimeout(() => {
      setShouldRender(true)
    }, delay)

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      }),
    )

    translateY.value = withDelay(
      delay,
      withTiming(
        0,
        {
          duration: 400,
          easing: Easing.out(Easing.ease),
        },
        (finished) => {
          "worklet"
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)()
          }
        },
      ),
    )

    return () => clearTimeout(renderTimeout)
  }, [delay])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  if (!shouldRender) return null

  return (
    <Animated.View style={[themed($messageContainer), animatedStyle]}>
      <Image
        source={require("../../../assets/images/eric-face.png")}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View style={themed($chatBubble)}>
        <Text tx={translated ? (message as TxKeyPath) : undefined} style={themed($messageText)}>
          {translated ? undefined : message}
        </Text>
      </View>
    </Animated.View>
  )
}

const $messageContainer: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral200,
  borderRadius: theme.spacing.md,
  marginBottom: theme.spacing.md,
  maxWidth: "80%",
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: theme.spacing.sm,
})

const $chatBubble: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary200,
  borderTopLeftRadius: theme.spacing.md,
  borderBottomRightRadius: theme.spacing.md,
  borderTopRightRadius: theme.spacing.md,
  padding: theme.spacing.md,
})

const $messageText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  color: theme.colors.text,
})
