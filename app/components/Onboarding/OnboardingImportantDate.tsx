// components/onboarding/Step2ImportantDate.tsx
import { FC, useState, useEffect } from "react"
import { ViewStyle, View } from "react-native"
import Animated from "react-native-reanimated"

import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface Step2ImportantDateProps {
  onDataChange: (data: { importantDate?: string; importantDateText?: string }) => void
  onValidationChange: (isValid: boolean) => void
}

export const Step2ImportantDate: FC<Step2ImportantDateProps> = ({
  onDataChange,
  onValidationChange,
}) => {
  const { themed, theme } = useAppTheme()
  const [showInput, setShowInput] = useState(false)
  const [description, setDescription] = useState("")

  useEffect(() => {
    const trimmed = description.trim()
    onDataChange({ importantDateText: trimmed.length > 0 ? trimmed : undefined })
    onValidationChange(trimmed.length > 0)
  }, [description, onDataChange, onValidationChange])

  return (
    <Animated.View style={themed($container)}>
      <AnimatedChatMessage message="Can you share what this important event was?" delay={0} />
      <AnimatedChatMessage
        message="This could be a traumatic event, loss, or significant life change. Describe it."
        delay={600}
        onAnimationComplete={() => setShowInput(true)}
      />

      {showInput && (
        <View style={themed($inputContainer)}>
          <TextField
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., 'A car accident in 2021' or 'Losing my job last year'"
            multiline
            containerStyle={themed($textAreaContainer)}
            inputWrapperStyle={themed($textAreaWrapper)}
            autoFocus
          />
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

const $inputContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.lg,
})

const $textAreaContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.md,
})

const $textAreaWrapper: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral100,
  borderRadius: theme.spacing.md,
  minHeight: 120,
})
