import { FC, useMemo, useState } from "react"
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { CheckCircle, Plus, User, Xmark } from "iconoir-react-native"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useAuth } from "@/context/AuthContext"
import { useGetCheckInHistory } from "@/hooks/check-in/get-check-ins"
import { useGetTodaysCheckIn } from "@/hooks/check-in/get-today-check-in"
import { useDailyGoalsActions } from "@/hooks/goals/daily-goal-actions"
import { useGetDailyGoals } from "@/hooks/goals/get-daily-goals"
import { useGoalRecommendations } from "@/hooks/goals/get-goal-recommendations"
import { useGetProfile } from "@/hooks/profile/get-profile"
import { TxKeyPath } from "@/i18n"
import { HomeCheckInStackScreenProps } from "@/navigators/CheckInNavigator"
import { CheckInDetails } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { MOOD_IMAGES } from "@/utils/constants"
import { useHeader } from "@/utils/useHeader"

interface HomeScreenProps extends HomeCheckInStackScreenProps<"HomeDashboard"> {}

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useGetProfile(user?.id || "")

  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [goalText, setGoalText] = useState("")

  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()

  useHeader({
    LeftActionComponent: profile?.image ? (
      <Image
        source={{ uri: profile.image }}
        style={{ height: 45, width: 45, marginLeft: spacing.md, borderRadius: 22.5 }}
      />
    ) : (
      <User
        color={colors.palette.primary900}
        width={40}
        height={40}
        style={{ marginLeft: spacing.md }}
      />
    ),
    rightIcon: "settings",
    onRightPress: () => navigation.navigate("SettingsMain", { screen: "SettingsMenu" }),
  })

  const {
    data: checkInHistory,
    isError: checkInHistoryError,
    isLoading: checkInHistoryLoading,
  } = useGetCheckInHistory()
  const {
    data: todaysCheckIn,
    isError: todaysCheckInError,
    isLoading: todaysCheckInLoading,
  } = useGetTodaysCheckIn()

  const { data: goalsData, isError: goalsError, isLoading: goalsLoading } = useGetDailyGoals()
  const { data: recommendationsData } = useGoalRecommendations()
  const { createGoal, toggleGoal } = useDailyGoalsActions()

  const goals = goalsData?.data || []
  const suggestedGoals = useMemo(
    () => [...(recommendationsData?.data || [])].sort(() => 0.5 - Math.random()).slice(0, 4),
    [recommendationsData?.data],
  )

  const isLoading = checkInHistoryLoading || todaysCheckInLoading || goalsLoading || profileLoading

  const handleToggleGoalComplete = (goalId: string) => toggleGoal.mutate(goalId)

  const handleSubmitGoal = () => {
    if (goalText.trim()) {
      createGoal.mutate(
        { goal: goalText.trim() },
        {
          onSuccess: () => {
            setGoalText("")
            setGoalModalOpen(false)
          },
        },
      )
    }
  }

  const renderCheckInHistoryDate = (dateString: string) => {
    const checkInDate = new Date(dateString)
    const today = new Date()
    const isToday =
      checkInDate.getDate() === today.getDate() &&
      checkInDate.getMonth() === today.getMonth() &&
      checkInDate.getFullYear() === today.getFullYear()

    return isToday
      ? "Today"
      : checkInDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const LoadingSkeleton = ({
    height,
    width,
    style = {},
  }: {
    height: number
    width: number | string
    style?: ViewStyle
  }) => (
    <View
      style={{
        height,
        width,
        backgroundColor: colors.palette.primary100,
        borderRadius: 4,
        ...style,
      }}
    />
  )

  const renderCheckInHistory = () => {
    if (checkInHistoryError) return <Text size="xs" tx="home:checkInHistory.errorText" />

    if (checkInHistory && checkInHistory?.data.length > 0) {
      return (
        <ScrollView
          horizontal
          contentContainerStyle={{ flexDirection: "row", gap: spacing.xs, marginTop: spacing.lg }}
        >
          {checkInHistory.data.map((checkIn: CheckInDetails) => (
            <View style={themed($checkInChip)} key={checkIn.date}>
              <Image
                source={MOOD_IMAGES[checkIn.overallMood || 3]}
                style={{ height: 30, width: 30 }}
              />
              <Text
                text={renderCheckInHistoryDate(checkIn.date)}
                style={{ fontSize: 8, lineHeight: 8 }}
              />
            </View>
          ))}
        </ScrollView>
      )
    }

    return (
      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Text centered size="xs" tx="home:checkInHistory.emptyText" />
        <Text centered size="xxs" tx="home:checkInHistory.emptySubText" />
      </View>
    )
  }

  const renderDailyCheckInStatus = () => {
    if (todaysCheckInError) return <Text size="xs" tx="home:checkInCard.errorText" />

    if (todaysCheckIn?.hasCheckedIn) {
      return (
        <View style={themed($checkInCompleteAlert)}>
          <CheckCircle color={colors.palette.success700} height={20} strokeWidth={2} width={20} />
          <Text style={{ color: colors.palette.success700 }} tx="home:checkInCard.completeText" />
        </View>
      )
    }

    return (
      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Text centered size="xxs" tx="home:checkInCard.buttonCaption"></Text>
        <Button
          onPress={() => navigation.navigate("CheckIn")}
          preset="reversed"
          tx="home:checkInCard.checkInButtonText"
        />
      </View>
    )
  }

  const renderGoalsContent = () => {
    if (goalsError) {
      return (
        <View style={{ marginTop: spacing.lg }}>
          <Text size="xs" centered tx="home:goalsCard.errorText" />
        </View>
      )
    }

    if (goals.length > 0) {
      return (
        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          {goals.map((g, index) => (
            <View
              key={g.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                paddingVertical: spacing.xs,
                borderBottomWidth: index !== goals.length - 1 ? 1 : 0,
                borderBottomColor: colors.palette.neutral300,
              }}
            >
              <Checkbox value={g.completed} onPress={() => handleToggleGoalComplete(g.id)} />
              <Text
                size="xxs"
                numberOfLines={1}
                style={{
                  flex: 1,
                  textDecorationLine: g.completed ? "line-through" : "none",
                  color: g.completed ? colors.palette.neutral500 : colors.text,
                }}
              >
                {g.goal}
              </Text>
            </View>
          ))}
        </View>
      )
    }

    return (
      <View style={{ marginTop: spacing.lg }}>
        <Text size="xs" centered tx="home:goalsCard.emptyPromptText"></Text>
      </View>
    )
  }

  const CardHeader = ({
    icon,
    title,
    rightComponent,
  }: {
    icon: any
    title: TxKeyPath | undefined
    rightComponent?: React.ReactNode
  }) => (
    <View style={themed($centeredSpacedRow)}>
      <View style={themed($cardHeaderRow)}>
        <Image source={icon} />
        {title && <Text size="xs" weight="semiBold" tx={title} />}
      </View>
      {rightComponent}
    </View>
  )

  const LoadingCardHeader = () => (
    <View style={themed($cardHeaderRow)}>
      <LoadingSkeleton height={40} width={40} style={{ borderRadius: 20 }} />
      <LoadingSkeleton height={20} width={120} />
    </View>
  )

  return (
    <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)}>
      {/* Daily Check In Section */}
      <Card
        style={{ padding: spacing.md }}
        HeadingComponent={
          isLoading ? (
            <View style={themed($cardHeaderRow)}>
              <LoadingSkeleton height={40} width={40} style={{ borderRadius: 20 }} />
              <View>
                <LoadingSkeleton height={28} width={140} style={{ marginBottom: spacing.sm }} />
                <LoadingSkeleton height={12} width={180} />
              </View>
            </View>
          ) : (
            <View style={themed($cardHeaderRow)}>
              <Image source={require("@assets/images/eric-face.png")} />
              <View>
                <Text size="lg" weight="semiBold">
                  Hey {profile?.name}!
                </Text>
                <Text size="xs" weight="light" tx="home:checkInCard.subheading" />
              </View>
            </View>
          )
        }
        ContentComponent={
          isLoading ? (
            <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
              <LoadingSkeleton height={18} width={220} style={{ alignSelf: "center" }} />
              <LoadingSkeleton height={55} width="100%" />
            </View>
          ) : (
            renderDailyCheckInStatus()
          )
        }
      />

      {/* Goals Section */}
      <Card
        style={{ padding: spacing.md }}
        HeadingComponent={
          isLoading ? (
            <LoadingCardHeader />
          ) : (
            <CardHeader
              icon={require("@assets/images/goals-icon.png")}
              title="home:goalsCard.heading"
              rightComponent={
                <Button
                  style={{ minHeight: 16, paddingVertical: 4, alignItems: "center" }}
                  textStyle={{ fontSize: 12 }}
                  LeftAccessory={() => (
                    <Plus color={colors.palette.primary900} width={20} height={20} />
                  )}
                  onPress={() => setGoalModalOpen(true)}
                  tx="home:goalsCard.headerButtonText"
                ></Button>
              }
            />
          )
        }
        ContentComponent={
          isLoading ? (
            <View style={{ gap: spacing.sm }}>
              <LoadingSkeleton height={16} width="100%" style={{ marginTop: spacing.lg }} />
              <LoadingSkeleton height={16} width={150} style={{ alignSelf: "center" }} />
            </View>
          ) : (
            renderGoalsContent()
          )
        }
        FooterComponent={
          isLoading ? (
            <LoadingSkeleton
              height={55}
              width="100%"
              style={{ marginTop: spacing.md, borderRadius: spacing.xs }}
            />
          ) : goals.length === 0 ? (
            <Button
              onPress={() => setGoalModalOpen(true)}
              LeftAccessory={() => (
                <Plus color={colors.palette.primary900} width={24} height={24} />
              )}
              style={{ marginTop: spacing.md, gap: spacing.sm }}
              tx="home:goalsCard.buttonText"
            ></Button>
          ) : (
            <></>
          )
        }
      />

      {/* New Goal Modal */}
      <Modal visible={goalModalOpen} animationType="fade" transparent>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.md }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.palette.primary500,
              opacity: 0.5,
            }}
            onPress={() => setGoalModalOpen(false)}
          />
          <Card
            style={{ padding: spacing.sm }}
            HeadingComponent={
              <View style={themed($centeredSpacedRow)}>
                <Text size="sm" weight="semiBold" tx="home:goalsCard.modalHeading" />
                <Pressable onPress={() => setGoalModalOpen(false)}>
                  <Xmark width={32} height={32} color={colors.text} />
                </Pressable>
              </View>
            }
            ContentComponent={
              <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                <Text tx="home:goalsCard.inputLabelText" size="xxs" weight="semiBold" />
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <TextField
                    containerStyle={{ flex: 1 }}
                    value={goalText}
                    onChangeText={setGoalText}
                    placeholderTx="home:goalsCard.inputPlaceholderText"
                  />
                  <Button
                    preset="reversed"
                    style={{ minHeight: 42, paddingVertical: 4, alignItems: "center" }}
                    textStyle={{ fontSize: 12 }}
                    LeftAccessory={() => (
                      <Plus color={colors.palette.neutral100} width={20} height={20} />
                    )}
                    onPress={handleSubmitGoal}
                    disabled={createGoal.isPending}
                    tx={
                      createGoal.isPending
                        ? "home:goalsCard.inputButtonLoadingText"
                        : "home:goalsCard.inputButtonText"
                    }
                  />
                </View>
                <Text centered style={{ fontSize: 10 }} tx="home:goalsCard.suggestionCaptionText" />
                <View>
                  {suggestedGoals.map((suggestion) => (
                    <TouchableOpacity key={suggestion} onPress={() => setGoalText(suggestion)}>
                      <View
                        style={{
                          paddingVertical: spacing.md,
                          paddingHorizontal: spacing.sm,
                          borderWidth: 1,
                          borderColor: colors.palette.neutral400,
                          borderRadius: spacing.sm,
                          marginBottom: spacing.xs,
                        }}
                      >
                        <Text size="xxs" text={suggestion} numberOfLines={1} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
          />
        </View>
      </Modal>

      {/* Previous Check Ins Section */}
      <Card
        style={{ padding: spacing.md }}
        HeadingComponent={
          isLoading ? (
            <LoadingCardHeader />
          ) : (
            <CardHeader
              icon={require("@assets/images/check-in-icon.png")}
              title="home:checkInHistory.heading"
            />
          )
        }
        ContentComponent={
          isLoading ? (
            <View style={{ flexDirection: "row", gap: spacing.xs, marginTop: spacing.lg }}>
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <LoadingSkeleton
                    key={index}
                    height={68}
                    width={56}
                    style={{
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: colors.palette.primary100,
                    }}
                  />
                ))}
            </View>
          ) : (
            renderCheckInHistory()
          )
        }
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
  paddingTop: spacing.md,
  paddingHorizontal: spacing.md,
  gap: spacing.md,
})

const $centeredSpacedRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $checkInChip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.palette.primary400,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  borderRadius: 4,
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.sm,
  backgroundColor: colors.palette.neutral100,
})

const $cardHeaderRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  alignItems: "center",
})

const $checkInCompleteAlert: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.success100,
  borderColor: colors.palette.success700,
  borderWidth: 1,
  borderRadius: spacing.sm,
  marginTop: spacing.lg,
  padding: spacing.sm,
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
})
