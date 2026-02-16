import { FC } from "react"
import { Modal, Pressable, View, ViewStyle, Linking, ScrollView } from "react-native"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Xmark } from "iconoir-react-native"

interface AIDisclosureModalProps {
  visible: boolean
  onAccept: () => void
  onDecline: () => void
}

export const AIDisclosureModal: FC<AIDisclosureModalProps> = ({ visible, onAccept, onDecline }) => {
  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={themed($modalOverlay)}>
        <Pressable style={themed($backdrop)} onPress={onDecline} />

        <View style={themed($modalContainer)}>
          <ScrollView
            contentContainerStyle={themed($modalContent)}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={themed($header)}>
              <Text size="sm" weight="bold">
                About Your AI Companion
              </Text>
              <Pressable onPress={onDecline}>
                <Xmark width={24} height={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Main Content */}
            <View style={{ gap: spacing.md }}>
              <Text size="xxs">
                Fueled Forward uses Claude, an AI assistant created by Anthropic, to provide
                supportive conversations and personalized guidance for your mental health journey.
              </Text>

              <View>
                <Text size="xs" weight="semiBold" style={{ marginBottom: spacing.xs }}>
                  What data is shared:
                </Text>
                <Text size="xxs" style={{ color: colors.textDim }}>
                  • Your messages and conversations with the AI
                </Text>
                <Text size="xxs" style={{ color: colors.textDim }}>
                  • Your mood check-in responses
                </Text>
                <Text size="xxs" style={{ color: colors.textDim }}>
                  • Your daily goals and progress
                </Text>
              </View>

              <View>
                <Text size="xs" weight="semiBold" style={{ marginBottom: spacing.xs }}>
                  Who receives this data:
                </Text>
                <Text size="xxs">
                  Anthropic, Inc. processes your conversations to provide AI responses.
                </Text>
                <Pressable
                  onPress={() => Linking.openURL("https://anthropic.com/privacy")}
                  style={{ marginTop: spacing.xs }}
                >
                  <Text size="xxs" style={{ color: colors.tint }}>
                    View Anthropic's Privacy Policy ↗
                  </Text>
                </Pressable>
              </View>

              <View style={themed($privacyNote)}>
                <Text size="xxs" style={{ color: colors.textDim }}>
                  All data is encrypted and handled in accordance with our{" "}
                  <Text
                    size="xxs"
                    style={{ color: colors.tint }}
                    onPress={() => Linking.openURL("https://fueledforward.com/privacy")}
                  >
                    Privacy Policy
                  </Text>
                  . You can delete your account and all associated data at any time in Settings.
                </Text>
              </View>

              <View style={themed($disclaimer)}>
                <Text size="xxs" weight="semiBold" style={{ marginBottom: spacing.xs }}>
                  Important Notice
                </Text>
                <Text size="xxs" style={{ color: colors.textDim }}>
                  This AI companion is not a replacement for professional therapy or medical advice.
                  If you're in crisis, please contact the National Suicide Prevention Lifeline at
                  988 or Crisis Text Line by texting HOME to 741741.
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
              <Button preset="reversed" text="I Understand and Agree" onPress={onAccept} />
              <Button preset="cancel" text="Decline" onPress={onDecline} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
})

const $backdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.palette.neutral900,
  opacity: 0.7,
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: spacing.md,
  width: "100%",
  maxWidth: 500,
  maxHeight: "80%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
})

const $modalContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $privacyNote: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})

const $disclaimer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  backgroundColor: colors.palette.warning100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.warning400,
})
