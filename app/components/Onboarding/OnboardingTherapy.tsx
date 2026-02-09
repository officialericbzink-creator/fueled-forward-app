import { FC, useState, useEffect } from "react"
import { ViewStyle, TextStyle, Pressable, View } from "react-native"
import Animated from "react-native-reanimated"

import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { storage } from "@/utils/storage"
import { promptToReviewAsync } from "@/utils/useStoreReviewRequest"
import { useMMKVBoolean } from "react-native-mmkv"

interface Step3TherapyProps {
  onDataChange: (data: { inTherapy: boolean; therapyDetails?: string }) => void
  onValidationChange: (isValid: boolean) => void
}

export const Step3Therapy: FC<Step3TherapyProps> = ({ onDataChange, onValidationChange }) => {
  const { themed, theme } = useAppTheme()
  const [showOptions, setShowOptions] = useState(false)
  const [inTherapy, setInTherapy] = useState<boolean | null>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [therapyDetails, setTherapyDetails] = useState("")
  const [hasRequestedReview, setHasRequestedReview] = useMMKVBoolean(
    "storeReviewRequested",
    storage,
  )

  useEffect(() => {
    if (!hasRequestedReview) {
      promptToReviewAsync().then(() => setHasRequestedReview(true))
    }
  }, [hasRequestedReview, setHasRequestedReview])

  useEffect(() => {
    if (inTherapy === null) {
      onValidationChange(false)
      return
    }

    if (inTherapy) {
      const isValid = therapyDetails.trim().length > 0
      onDataChange({ inTherapy, therapyDetails: therapyDetails.trim() })
      onValidationChange(isValid)
    } else {
      onDataChange({
        inTherapy,
        therapyDetails: therapyDetails.trim().length > 0 ? therapyDetails.trim() : undefined,
      })
      onValidationChange(true)
    }
  }, [inTherapy, therapyDetails])

  const handleTherapyChoice = (choice: boolean) => {
    setInTherapy(choice)
    setTherapyDetails("")
    setShowFollowUp(true)
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

      {/* Follow-up question */}
      {showFollowUp && inTherapy !== null && (
        <Animated.View style={themed($followUpContainer)}>
          <AnimatedChatMessage
            message={
              inTherapy
                ? "How long have you been in therapy?"
                : "Would you like to share why not? (Optional)"
            }
            delay={400}
          />

          <TextField
            value={therapyDetails}
            onChangeText={setTherapyDetails}
            placeholder={
              inTherapy
                ? 'e.g., "6 months" or "About a year"'
                : 'e.g., "Too expensive" or "Haven\'t found the right fit"'
            }
            multiline={!inTherapy}
            style={themed($textInput)}
            autoFocus
          />
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

const $followUpContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.lg,
})

const $textInput: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.md,
})
