import { FC, useState, useEffect } from "react"
import { ViewStyle, TextStyle, Pressable, View } from "react-native"
import Animated from "react-native-reanimated"

import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface Step3TherapyProps {
  onDataChange: (data: { inTherapy: boolean; therapyDetails?: string }) => void
  onValidationChange: (isValid: boolean) => void
}

export const Step3Therapy: FC<Step3TherapyProps> = ({ onDataChange, onValidationChange }) => {
  const { themed, theme } = useAppTheme()
  const [showOptions, setShowOptions] = useState(false)
  const [inTherapy, setInTherapy] = useState<boolean | null>(null)

  useEffect(() => {
    if (inTherapy === null) {
      onValidationChange(false)
      return
    }

    onDataChange({ inTherapy })
    onValidationChange(true)
  }, [inTherapy, onDataChange, onValidationChange])

  const handleTherapyChoice = (choice: boolean) => {
    setInTherapy(choice)
  }

  return (
    <Animated.View style={themed($container)}>
      <AnimatedChatMessage message="Are you currently in therapy?" delay={0} />
      <AnimatedChatMessage
        message="This helps us understand your current support system."
        delay={600}
        onAnimationComplete={() => setShowOptions(true)}
      />

      {showOptions && (
        <View style={themed($optionsContainer)}>
          <Pressable
            style={[themed($option), inTherapy === true && { backgroundColor: theme.colors.tint }]}
            onPress={() => handleTherapyChoice(true)}
          >
            <Text
              style={[
                themed($optionText),
                inTherapy === true && { color: theme.colors.palette.neutral100 },
              ]}
            >
              Yes
            </Text>
          </Pressable>

          <Pressable
            style={[themed($option), inTherapy === false && { backgroundColor: theme.colors.tint }]}
            onPress={() => handleTherapyChoice(false)}
          >
            <Text
              style={[
                themed($optionText),
                inTherapy === false && { color: theme.colors.palette.neutral100 },
              ]}
            >
              No
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
