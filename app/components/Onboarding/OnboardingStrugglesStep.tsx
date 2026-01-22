import { FC, useState, useEffect } from "react"
import { ViewStyle, TextStyle, Pressable } from "react-native"
import Animated from "react-native-reanimated"

import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface Step1StrugglesProps {
  onDataChange: (struggles: { struggles: string[] }) => void
  onValidationChange: (isValid: boolean) => void
}

const STRUGGLE_OPTIONS = [
  "Anxiety",
  "Depression",
  "Stress",
  "Trauma",
  "Grief",
  "Relationship Issues",
  "Self-esteem",
  "Sleep Problems",
  "Other",
]

export const Step1Struggles: FC<Step1StrugglesProps> = ({ onDataChange, onValidationChange }) => {
  const { themed, theme } = useAppTheme()
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([])
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    onDataChange({ struggles: selectedStruggles })
    onValidationChange(selectedStruggles.length > 0)
  }, [selectedStruggles, onDataChange, onValidationChange])

  const toggleStruggle = (struggle: string) => {
    setSelectedStruggles((prev) =>
      prev.includes(struggle) ? prev.filter((s) => s !== struggle) : [...prev, struggle],
    )
  }

  return (
    <Animated.View style={themed($container)}>
      <AnimatedChatMessage
        message="Thanks! Now, what are you currently struggling with?"
        delay={0}
      />
      <AnimatedChatMessage
        message="Select all that apply:"
        delay={600}
        onAnimationComplete={() => setShowOptions(true)}
      />
      {showOptions && (
        <Animated.View style={themed($optionsContainer)}>
          {STRUGGLE_OPTIONS.map((struggle) => {
            const isSelected = selectedStruggles.includes(struggle)
            return (
              <Pressable
                key={struggle}
                onPress={() => toggleStruggle(struggle)}
                style={[themed($option), isSelected && { backgroundColor: theme.colors.tint }]}
              >
                <Text
                  style={[
                    themed($optionText),
                    isSelected && { color: theme.colors.palette.neutral100 },
                  ]}
                >
                  {struggle}
                </Text>
              </Pressable>
            )
          })}
        </Animated.View>
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
  flexWrap: "wrap",
  marginTop: theme.spacing.md,
  gap: theme.spacing.sm,
})

const $option: ThemedStyle<ViewStyle> = (theme) => ({
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  borderRadius: theme.spacing.lg,
  backgroundColor: theme.colors.palette.neutral200,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral400,
})

const $optionText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  color: theme.colors.text,
})
