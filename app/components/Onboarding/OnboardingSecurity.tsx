// components/onboarding/Step5Biometric.tsx
import { FC, useState, useEffect } from "react"
import { ViewStyle, TextStyle, Pressable, View } from "react-native"
import Animated from "react-native-reanimated"
import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface Step5BiometricProps {
  onDataChange: (data: { biometricEnabled: boolean }) => void
  onValidationChange: (isValid: boolean) => void
}

export const Step5Biometric: FC<Step5BiometricProps> = ({ onDataChange, onValidationChange }) => {
  const { themed, theme } = useAppTheme()
  const [showOptions, setShowOptions] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    if (biometricEnabled !== null) {
      onDataChange({ biometricEnabled })
      onValidationChange(true)
    } else {
      onValidationChange(false)
    }
  }, [biometricEnabled])

  return (
    <Animated.View style={themed($container)}>
      <AnimatedChatMessage
        message="One last thing - would you like to add biometric security?"
        delay={0}
      />
      <AnimatedChatMessage
        message="This adds an extra layer of protection for your personal information."
        delay={600}
        onAnimationComplete={() => setShowOptions(true)}
      />

      {showOptions && (
        <View style={themed($optionsContainer)}>
          <Pressable
            style={[
              themed($option),
              biometricEnabled === true && { backgroundColor: theme.colors.tint },
            ]}
            onPress={() => setBiometricEnabled(true)}
          >
            <Text
              style={[
                themed($optionText),
                biometricEnabled === true && { color: theme.colors.palette.neutral100 },
              ]}
            >
              Enable
            </Text>
          </Pressable>

          <Pressable
            style={[
              themed($option),
              biometricEnabled === false && { backgroundColor: theme.colors.tint },
            ]}
            onPress={() => setBiometricEnabled(false)}
          >
            <Text
              style={[
                themed($optionText),
                biometricEnabled === false && { color: theme.colors.palette.neutral100 },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingTop: theme.spacing.xl,
  justifyContent: "flex-end",
})

const $optionsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  marginTop: theme.spacing.md,
  gap: theme.spacing.sm,
})

const $option: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingVertical: theme.spacing.md,
  paddingHorizontal: theme.spacing.lg,
  borderRadius: theme.spacing.md,
  backgroundColor: theme.colors.palette.neutral200,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral400,
  alignItems: "center",
})

const $optionText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontWeight: "600",
  color: theme.colors.text,
})
