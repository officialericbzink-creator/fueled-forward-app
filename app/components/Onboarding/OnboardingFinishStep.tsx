import { FC, useEffect } from "react"
import { View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface OnboardingFinishStepProps {
  onDataChange: (data: { paywallCompleted: boolean }) => void
  onValidationChange: (isValid: boolean) => void
}

export const OnboardingFinishStep: FC<OnboardingFinishStepProps> = ({
  onDataChange,
  onValidationChange,
}) => {
  const { themed } = useAppTheme()

  useEffect(() => {
    onDataChange({ paywallCompleted: true })
    onValidationChange(true)
  }, [onDataChange, onValidationChange])

  return (
    <View style={themed($container)}>
      <Text size="xl" weight="semiBold" text="You’re all set." />
      <Text
        size="xs"
        text="You can explore the app now. Premium features like Chat and Check-ins will prompt a free trial when you try them."
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingTop: theme.spacing.md,
  gap: theme.spacing.md,
})
