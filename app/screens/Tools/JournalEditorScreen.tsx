import { FC, useState } from "react"
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  ViewStyle,
} from "react-native"
import Toast from "react-native-toast-message"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useJournal } from "@/context/JournalContext"
import { translate } from "@/i18n/translate"
import { ToolsStackScreenProps } from "@/navigators/ToolsNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

const EDITOR_TITLE_KEYS: Record<string, "journal:editor.titleJournalEntry" | "journal:editor.titleActivityLog" | "journal:editor.titleVent"> = {
  journal_entry: "journal:editor.titleJournalEntry",
  activity_log: "journal:editor.titleActivityLog",
  vent: "journal:editor.titleVent",
}

export const JournalEditorScreen: FC<ToolsStackScreenProps<"JournalEditor">> = ({
  navigation,
  route,
}) => {
  const { entryType } = route.params
  const { themed, theme } = useAppTheme()
  const { colors, spacing } = theme
  const { createEntry } = useJournal()
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)

  const titleKey = EDITOR_TITLE_KEYS[entryType]
  const title = titleKey ? translate(titleKey) : translate("journal:editor.titleFallback")

  useHeader({
    title,
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    backgroundColor: colors.palette.primary100,
  })

  const onSave = async () => {
    const content = text.trim()
    if (!content || saving) return
    setSaving(true)
    try {
      await createEntry(entryType, content)
      Toast.show({
        type: "success",
        text1: translate("journal:editor.toastSuccess"),
        text2: translate("journal:editor.toastSuccessSub"),
      })
      navigation.goBack()
    } catch (e) {
      Toast.show({
        type: "error",
        text1: translate("journal:editor.errorTitle"),
        text2: e instanceof Error ? e.message : translate("journal:editor.errorSub"),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={88}
      >
        <Text
          size="xxs"
          style={{
            color: colors.textDim,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
          }}
          tx="journal:editor.hint"
        />
        <TextInput
          style={themed($input)}
          multiline
          textAlignVertical="top"
          placeholder={translate("journal:editor.placeholder")}
          placeholderTextColor={colors.textDim}
          value={text}
          onChangeText={setText}
          autoFocus
        />
        <View style={{ padding: spacing.md }}>
          <Button
            preset="reversed"
            text={saving ? translate("journal:editor.saving") : translate("journal:editor.save")}
            onPress={() => void onSave()}
            disabled={saving || !text.trim()}
            LeftAccessory={
              saving
                ? (props) => (
                    <ActivityIndicator
                      color={colors.palette.neutral100}
                      style={[props.style, { marginRight: 8 }]}
                    />
                  )
                : undefined
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const $input: ThemedStyle<ViewStyle & { fontSize?: number; color?: string }> = ({
  colors,
  spacing,
  typography,
}) => ({
  flex: 1,
  margin: spacing.md,
  marginTop: spacing.sm,
  padding: spacing.md,
  minHeight: 200,
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})
