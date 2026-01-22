import { FC, useState, useEffect } from "react"
import { ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface Step0NameProps {
  onDataChange: ({ name }: { name: string }) => void
  onValidationChange: (isValid: boolean) => void
}

export const Step0Name: FC<Step0NameProps> = ({ onDataChange, onValidationChange }) => {
  const { themed } = useAppTheme()
  const [name, setName] = useState("")
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    onDataChange({ name })
    onValidationChange(name.trim().length > 0)
  }, [name, onDataChange, onValidationChange])

  return (
    <Animated.View style={themed($container)}>
      <AnimatedChatMessage
        message="Hi! Welcome to your mental health journey. Let's start with the basics."
        delay={0}
      />
      <AnimatedChatMessage
        message="What's your name?"
        delay={600}
        onAnimationComplete={() => setShowInput(true)}
      />
      {showInput && (
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="Enter your preferred name"
          autoFocus
          returnKeyType="done"
          style={themed($input)}
          containerStyle={themed($inputContainer)}
        />
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
  marginTop: theme.spacing.md,
})

const $input: ThemedStyle<ViewStyle> = (theme) => ({})
