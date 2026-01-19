// components/onboarding/Step2ImportantDate.tsx
import { FC, useState, useEffect } from "react"
import { ViewStyle, TextStyle, Pressable, View, Platform } from "react-native"
import Animated from "react-native-reanimated"
import DateTimePicker from "@react-native-community/datetimepicker"
import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { TextField } from "@/components/TextField"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface Step2ImportantDateProps {
  onDataChange: (data: { importantDate?: string; importantDateText?: string }) => void
  onValidationChange: (isValid: boolean) => void
}

type TabType = "date" | "manual"

export const Step2ImportantDate: FC<Step2ImportantDateProps> = ({
  onDataChange,
  onValidationChange,
}) => {
  const { themed, theme } = useAppTheme()
  const [showTabs, setShowTabs] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("date")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [manualText, setManualText] = useState("")

  useEffect(() => {
    if (activeTab === "date") {
      // Always valid with date picker since there's always a date
      onDataChange({ importantDate: selectedDate.toISOString() })
      onValidationChange(true)
    } else {
      // Manual text must have content
      onDataChange({ importantDateText: manualText })
      onValidationChange(manualText.trim().length > 0)
    }
  }, [activeTab, selectedDate, manualText])

  const handleDateChange = (event: any, date?: Date) => {
    // On Android, picker closes after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false)
    }

    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <Animated.View style={themed($container)}>
      <AnimatedChatMessage message="Can you share when this important event happened?" delay={0} />
      <AnimatedChatMessage
        message="This could be a traumatic event, loss, or significant life change."
        delay={600}
        onAnimationComplete={() => setShowTabs(true)}
      />

      {showTabs && (
        <View style={themed($tabsContainer)}>
          {/* Tab Headers */}
          <View style={themed($tabHeaderContainer)}>
            <Pressable
              style={[themed($tab), activeTab === "date" && { backgroundColor: theme.colors.tint }]}
              onPress={() => setActiveTab("date")}
            >
              <Text
                style={[
                  themed($tabText),
                  activeTab === "date" && { color: theme.colors.palette.neutral100 },
                ]}
              >
                Select Date
              </Text>
            </Pressable>

            <Pressable
              style={[
                themed($tab),
                activeTab === "manual" && { backgroundColor: theme.colors.tint },
              ]}
              onPress={() => setActiveTab("manual")}
            >
              <Text
                style={[
                  themed($tabText),
                  activeTab === "manual" && { color: theme.colors.palette.neutral100 },
                ]}
              >
                Describe It
              </Text>
            </Pressable>
          </View>

          {/* Tab Content */}
          <View style={themed($tabContent)}>
            {activeTab === "date" ? (
              <View>
                {Platform.OS === "ios" && (
                  // iOS: Always show picker inline
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    style={themed($iosDatePicker)}
                  />
                )}

                {Platform.OS === "android" && (
                  <>
                    <Pressable style={themed($dateButton)} onPress={() => setShowDatePicker(true)}>
                      <Text style={themed($dateButtonText)}>
                        {selectedDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </Pressable>

                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                      />
                    )}
                  </>
                )}
              </View>
            ) : (
              <TextField
                value={manualText}
                onChangeText={setManualText}
                placeholder="e.g., 'Around 5 years ago' or 'I prefer not to specify'"
                multiline
                style={themed($textInput)}
                autoFocus
              />
            )}
          </View>
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

const $tabsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.lg,
})

const $tabHeaderContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.md,
})

const $tab: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.md,
  borderRadius: theme.spacing.md,
  backgroundColor: theme.colors.palette.neutral200,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral400,
  alignItems: "center",
})

const $tabText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  fontWeight: "600",
  color: theme.colors.text,
})

const $tabContent: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.md,
})

const $dateButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral100,
  padding: theme.spacing.md,
  borderRadius: theme.spacing.md,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral400,
  alignItems: "center",
})

const $dateButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  color: theme.colors.text,
})

const $textInput: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral100,
  minHeight: 100,
})

const $iosDatePicker: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  alignSelf: "center",
})
