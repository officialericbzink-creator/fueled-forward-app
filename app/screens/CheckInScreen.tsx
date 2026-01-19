import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { View, ViewStyle, Image, TouchableOpacity, Modal, Pressable } from "react-native"
import { Screen } from "@/components/Screen"
import { useHeader } from "@/utils/useHeader"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { FC, useEffect, useState } from "react"
import { Button } from "@/components/Button"
import { CheckInType } from "@/services/api/types"
import { ArrowLeftTag, NavArrowLeft } from "iconoir-react-native"
import { ProgressBar } from "@/components/ProgressBar"
import { TextField } from "@/components/TextField"
import { MOOD_IMAGES, NUM_STEPS, STEP_QUESTIONS, MOOD_OPTIONS } from "@/utils/constants"
import { useCreateCheckIn } from "@/hooks/check-in/create-check-in"
import Toast from "react-native-toast-message"
import { HomeCheckInStackScreenProps } from "@/navigators/CheckInNavigator"

interface CheckInScreenProps extends HomeCheckInStackScreenProps<"CheckIn"> {}

export const CheckInScreen: FC<CheckInScreenProps> = ({ navigation }) => {
  const { mutateAsync, isPending } = useCreateCheckIn()
  const [step, setStep] = useState(1)
  const [checkInFormState, setCheckInFormState] = useState<CheckInType>({
    overallMood: undefined,
    steps: [],
    date: new Date().toISOString(),
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [notesText, setNotesText] = useState("")

  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()
  useHeader({
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  })

  useEffect(() => {
    const currentStepData = checkInFormState.steps.find((entry) => entry.step === step)
    setNotesText(currentStepData?.notes || "")
  }, [step, checkInFormState.steps])

  const renderButtonText = () => {
    if (step < NUM_STEPS) {
      return `Go to step ${step + 1}`
    } else {
      return isPending ? "Submitting..." : "Finish Check-in"
    }
  }

  const handleButtonPress = () => {
    const currentStepEntry = checkInFormState.steps.find((entry) => entry.step === step)
    if (!currentStepEntry) {
      // No mood selected for current step
      return
    }

    // Create updated state with current notes saved
    const updatedFormState = {
      ...checkInFormState,
      steps: checkInFormState.steps.map((entry) =>
        entry.step === step ? { ...entry, notes: notesText } : entry,
      ),
    }

    if (step < NUM_STEPS) {
      // Save notes and move to next step
      setCheckInFormState(updatedFormState)
      setStep(step + 1)
    } else {
      // Finish check-in - calculate overall mood and submit
      const overallMoodValue = calculateOverallMood(updatedFormState.steps)
      const finalFormState = {
        ...updatedFormState,
        overallMood: overallMoodValue,
      }

      handleSubmit(finalFormState)
    }
  }

  const resetState = () => {
    setCheckInFormState({
      overallMood: undefined,
      steps: [],
      date: new Date().toISOString(),
    })
    setNotesText("")
    setStep(1)
  }

  const handleSubmit = async (data) => {
    try {
      await mutateAsync(data)
      setCheckInFormState((prev) => ({ ...prev, overallMood: data.overallMood }))
      setModalVisible(true)
    } catch (error) {
      // Show error toast - adjust this based on your toast library
      // Example: Toast.show({ type: 'error', text1: 'Failed to submit check-in' })
      console.error("Failed to submit check-in:", error)
      Toast.show({
        type: "error",
        text1: "Failed to submit check-in.",
        text2: "Please try again.",
      })
    }
  }
  const calculateOverallMood = (steps) => {
    const totalMood = steps.reduce((sum, entry) => sum + entry.mood, 0) / steps.length
    return Math.round(totalMood)
  }

  useEffect(() => {
    if (checkInFormState.steps.length === NUM_STEPS) {
      calculateOverallMood(checkInFormState.steps)
    }
  }, [checkInFormState.steps])

  const handleMoodPress = (mood: number) => {
    console.log("Mood selected:", mood)
    const existingEntry = checkInFormState.steps.find((entry) => entry.step === step)
    console.log("Existing entry for step:", existingEntry)
    if (existingEntry) {
      // Update existing entry
      setCheckInFormState((prev) => {
        const updatedSteps = prev.steps.map((entry) =>
          entry.step === step ? { ...entry, mood, notes: notesText || "" } : entry,
        )

        return {
          ...prev,
          steps: updatedSteps,
        }
      })
      return
    }

    // Add new entry
    const newDataEntry = {
      step,
      mood,
      notes: "",
    }
    console.log("Adding new data entry:", newDataEntry)
    setCheckInFormState((prev) => ({
      ...prev,
      steps: [...prev.steps, newDataEntry],
    }))
  }

  const handleNotesChange = (text: string) => {
    setNotesText(text)
  }

  return (
    <Screen style={themed($root)} preset="fixed">
      <Card
        style={{
          padding: spacing.md,
          height: "100%",
        }}
        HeadingComponent={
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
              <Image source={require("@assets/images/check-in-icon.png")} />
              <View>
                <Text weight="semiBold" text="Daily Check-in" />
                <Text
                  size="xxs"
                  text={new Date().toDateString()}
                  style={{ color: colors.palette.primary500 }}
                />
              </View>
            </View>
            <View style={{ gap: spacing.xs }}>
              {step > 1 && step <= NUM_STEPS ? (
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}
                  onPress={() => setStep(step - 1)}
                >
                  <NavArrowLeft height={16} width={16} />
                  <Text size="xs" text={"Previous Step"} />
                </TouchableOpacity>
              ) : (
                <View style={{ height: 28.7 }} />
              )}
              <View style={{ alignItems: "flex-end", gap: 2 }}>
                <Text size="xxs" text={`Step ${step} of ${NUM_STEPS}`} />
                <ProgressBar progress={step} animated={true} />
              </View>
            </View>
          </View>
        }
        ContentComponent={
          <View style={{ flex: 1, marginVertical: spacing.md }}>
            <Text centered text={STEP_QUESTIONS[step - 1]} weight="bold" size="md" />
            <View
              style={{
                flexDirection: "row",
                gap: spacing.xs,
                width: "100%",
                marginTop: spacing.lg,
              }}
            >
              {MOOD_OPTIONS[step].map(({ value, label }) => {
                const isSelected = checkInFormState.steps.find(
                  (entry) => entry.step === step && entry.mood === value,
                )
                return (
                  <TouchableOpacity
                    key={value}
                    style={{ flex: 1 }}
                    onPress={() => handleMoodPress(value)}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.palette.primary400,
                        paddingVertical: spacing.xs,
                        borderRadius: 4,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: spacing.sm,
                        backgroundColor: isSelected
                          ? colors.palette.success100
                          : colors.palette.neutral100,
                        borderColor: isSelected
                          ? colors.palette.success700
                          : colors.palette.primary400,
                      }}
                    >
                      <Image source={MOOD_IMAGES[value]} style={{ height: 30, width: 30 }} />
                      <Text text={label} style={{ fontSize: 8, lineHeight: 8 }} />
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={{ marginTop: spacing.lg }}>
              <TextField
                style={{ height: 150 }}
                value={notesText}
                multiline
                label="Notes (optional)"
                onChangeText={handleNotesChange}
                placeholder="Include any notes about what made you feel this way..."
              />
            </View>
          </View>
        }
        FooterComponent={
          <Button
            disabled={isPending}
            onPress={handleButtonPress}
            preset={"reversed"}
            text={renderButtonText()}
          />
        }
      />

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              backgroundColor: colors.palette.neutral100,
              borderRadius: 8,
              padding: spacing.lg,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/eric-face.png")}
              style={{ width: 60, height: 60, marginBottom: spacing.md }}
            />
            <Text
              weight="bold"
              size="lg"
              text="Check-in Completed!"
              style={{ marginBottom: spacing.sm }}
            />
            <Text
              centered
              size="xxs"
              text="You completed your 5-step check-in. Your overall emotional state today is:"
              style={{ marginBottom: spacing.lg }}
            />

            {/* Display Overall Mood */}
            {checkInFormState.overallMood !== undefined && (
              <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
                <Image
                  source={MOOD_IMAGES[checkInFormState.overallMood]}
                  style={{ height: 60, width: 60, marginBottom: spacing.xs }}
                />
                <Text
                  text={
                    MOOD_OPTIONS.find((opt) => opt.value === checkInFormState.overallMood)?.label ||
                    ""
                  }
                  weight="semiBold"
                />
              </View>
            )}

            <Button
              text="Go Home"
              preset="reversed"
              style={{ width: "100%" }}
              onPress={() => {
                setModalVisible(false)
                navigation.navigate("HomeDashboard")
              }}
            />
            <Button
              text="See Recommended Resources"
              textStyle={{ fontSize: 14 }}
              style={{ width: "100%", marginTop: spacing.sm }}
              onPress={() => {
                setModalVisible(false)
                navigation.navigate("Resources", {
                  screen: "ResourcesHome",
                })
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  paddingBottom: spacing.xxl,
})
