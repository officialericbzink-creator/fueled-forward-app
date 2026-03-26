import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Image,
  ImageStyle,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
} from "react-native"
import { CheckCircle, Journal, Plus, Xmark } from "iconoir-react-native"

import { AIDisclosureModal } from "@/components/AIAcceptanceModal"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useAuth } from "@/context/AuthContext"
import { useJournal } from "@/context/JournalContext"
import { useSubscription } from "@/context/InAppSubscriptionContext"
import { usePaywall } from "@/context/PaywallContext"
import { useGetCheckInHistory } from "@/hooks/check-in/get-check-ins"
import { useGetTodaysCheckIn } from "@/hooks/check-in/get-today-check-in"
import { useDailyGoalsActions } from "@/hooks/goals/daily-goal-actions"
import { useGetDailyGoals } from "@/hooks/goals/get-daily-goals"
import { useGoalRecommendations } from "@/hooks/goals/get-goal-recommendations"
import { useGetProfile } from "@/hooks/profile/get-profile"
import { useAIDisclosure } from "@/hooks/useAIDisclosure"
import { TxKeyPath } from "@/i18n"
import { HomeCheckInStackScreenProps } from "@/navigators/CheckInNavigator"
import { CheckInDetails } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { AVG_MOOD, MOOD_IMAGES, MOOD_OPTIONS, STEP_QUESTIONS } from "@/utils/constants"
import { storage } from "@/utils/storage"
import { useHeader } from "@/utils/useHeader"
import { useMMKVBoolean } from "react-native-mmkv"
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot"

interface HomeScreenProps extends HomeCheckInStackScreenProps<"HomeDashboard"> {}

const CopilotWrap = walkthroughable(View)

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { recentEntries } = useJournal()
  const { data: profile, isLoading: profileLoading } = useGetProfile(user?.id || "")
  const { checkForActiveSubscription } = useSubscription()
  const { openPaywall } = usePaywall()
  const { hasAcceptedAIDisclosure, acceptDisclosure } = useAIDisclosure()
  const [showAIDisclosure, setShowAIDisclosure] = useState(false)
  const [walkthroughDone, setWalkthroughDone] = useMMKVBoolean("homeWalkthrough.done", storage)
  const { start, copilotEvents } = useCopilot()
  const walkthroughDidStart = useRef(false)

  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [goalText, setGoalText] = useState("")

  const [checkInDetailsModalOpen, setCheckInDetailsModalOpen] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInDetails | null>(null)

  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()

  useHeader({
    // LeftActionComponent: (
    //   <Image
    //     source={profile?.image ? { uri: profile.image } : DEFAULT_AVATAR}
    //     style={{ height: 45, width: 45, marginLeft: spacing.md, borderRadius: 22.5 }}
    //   />
    // ),
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

  useEffect(() => {
    if (!hasAcceptedAIDisclosure && !isLoading) {
      // Small delay to let the screen render first
      const timer = setTimeout(() => {
        setShowAIDisclosure(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [hasAcceptedAIDisclosure, isLoading])

  useEffect(() => {
    const onStop = () => setWalkthroughDone(true)
    copilotEvents.on("stop", onStop)
    return () => {
      copilotEvents.off("stop", onStop)
    }
  }, [copilotEvents, setWalkthroughDone])

  useEffect(() => {
    if (walkthroughDone || isLoading || showAIDisclosure || !hasAcceptedAIDisclosure) return
    const t = setTimeout(() => {
      if (walkthroughDidStart.current) return
      walkthroughDidStart.current = true
      void start()
    }, 900)
    return () => clearTimeout(t)
  }, [walkthroughDone, isLoading, showAIDisclosure, hasAcceptedAIDisclosure, start])

  const handleAcceptAIDisclosure = () => {
    acceptDisclosure()
    setShowAIDisclosure(false)
  }

  const handleDeclineAIDisclosure = () => {
    // User declined - could navigate them to learn more
    // Or just close the modal (they'll see it again next time)
    setShowAIDisclosure(false)

    // Optional: Navigate to a "Learn More" page
    // navigation.navigate('AIDisclosureInfo')
  }

  const handleToggleGoalComplete = (goalId: string) => toggleGoal.mutate(goalId)

  const handleOpenGoalModal = useCallback(() => {
    if (checkForActiveSubscription()) {
      setGoalModalOpen(true)
    } else {
      openPaywall({ source: "Premium", onSubscribed: () => setGoalModalOpen(true) })
    }
  }, [checkForActiveSubscription, openPaywall])

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
            <TouchableOpacity
              key={checkIn.id}
              onPress={() => {
                setSelectedCheckIn(checkIn)
                setCheckInDetailsModalOpen(true)
              }}
              activeOpacity={0.85}
            >
              <View style={themed($checkInChip)}>
                <Image
                  source={MOOD_IMAGES[checkIn.overallMood || 3]}
                  style={{ height: 30, width: 30 }}
                />
                <Text
                  text={renderCheckInHistoryDate(checkIn.date)}
                  style={{ fontSize: 8, lineHeight: 8 }}
                />
              </View>
            </TouchableOpacity>
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

  const handleNavigateToCheckIn = useCallback(() => {
    if (checkForActiveSubscription()) {
      navigation.navigate("CheckIn")
    } else {
      openPaywall({ source: "Check-ins", onSubscribed: () => navigation.navigate("CheckIn") })
    }
  }, [checkForActiveSubscription, navigation, openPaywall])

  const openJournalList = useCallback(() => {
    const go = () => navigation.getParent()?.navigate("Tools", { screen: "JournalList" })
    if (checkForActiveSubscription()) {
      go()
    } else {
      openPaywall({ source: "Journal", onSubscribed: go })
    }
  }, [navigation, checkForActiveSubscription, openPaywall])

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
          onPress={handleNavigateToCheckIn}
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
    iconElement,
    title,
    rightComponent,
  }: {
    icon?: any
    iconElement?: React.ReactNode
    title: TxKeyPath | undefined
    rightComponent?: React.ReactNode
  }) => (
    <View style={themed($centeredSpacedRow)}>
      <View style={themed($cardHeaderRow)}>
        {iconElement != null ? (
          <View>{iconElement}</View>
        ) : icon ? (
          <Image source={icon} />
        ) : null}
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
    <>
      <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)}>
        {/* Check-ins */}
        <CopilotStep
          order={1}
          name="checkins"
          text="Check-ins: Complete your daily check-in to track mood and progress."
        >
          <CopilotWrap collapsable={false} style={{ width: "100%" }}>
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
          </CopilotWrap>
        </CopilotStep>

        {/* Goals */}
        <CopilotStep
          order={2}
          name="goals"
          text="Goals: Set daily goals and check them off as you go."
        >
          <CopilotWrap collapsable={false} style={{ width: "100%" }}>
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
                        onPress={handleOpenGoalModal}
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
                    onPress={handleOpenGoalModal}
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
          </CopilotWrap>
        </CopilotStep>

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
                  <Text
                    centered
                    style={{ fontSize: 10 }}
                    tx="home:goalsCard.suggestionCaptionText"
                  />
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

        {/* Previous check-ins */}
        <CopilotStep
          order={3}
          name="previous_checkins"
          text="Previous check-ins: Tap a day to open details and review your past entries."
        >
          <CopilotWrap collapsable={false} style={{ width: "100%" }}>
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
          </CopilotWrap>
        </CopilotStep>

        {/* Recent journal (below previous check-ins) — framed like Goals card; not part of Copilot */}
        <Card
          style={{ padding: spacing.md, marginTop: spacing.md }}
          HeadingComponent={
            <CardHeader
              iconElement={
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#E6FFFA",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Journal width={22} height={22} color="#14B8A6" strokeWidth={1.5} />
                </View>
              }
              title="home:recentJournal.heading"
              rightComponent={
                <Button
                  style={{ minHeight: 16, paddingVertical: 4, alignItems: "center" }}
                  textStyle={{ fontSize: 12 }}
                  tx="home:recentJournal.seeAll"
                  onPress={openJournalList}
                />
              }
            />
          }
          ContentComponent={
            recentEntries.length === 0 ? (
              <View style={{ marginTop: spacing.lg }}>
                <Text
                  centered
                  size="xs"
                  style={{ color: colors.textDim }}
                  tx="home:recentJournal.emptyText"
                />
              </View>
            ) : (
              <View style={{ marginTop: spacing.lg, gap: spacing.sm, marginHorizontal: spacing.sm }}>
                {recentEntries.slice(0, 3).map((e, index) => (
                  <TouchableOpacity key={e.id} onPress={openJournalList} activeOpacity={0.85}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.sm,
                        paddingVertical: spacing.xs,
                        borderBottomWidth: index !== Math.min(recentEntries.length, 5) - 1 ? 1 : 0,
                        borderBottomColor: colors.palette.neutral300,
                      }}
                    >
                      <Text size="xxs" numberOfLines={2} weight="medium" style={{ flex: 1 }}>
                        {e.summary}
                      </Text>
                      <Text size="xxs" style={{ color: colors.textDim }}>
                        {new Date(e.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          }
          FooterComponent={
            recentEntries.length === 0 ? (
              <Button
                onPress={openJournalList}
                LeftAccessory={() => (
                  <Plus color={colors.palette.primary900} width={24} height={24} />
                )}
                style={{ marginTop: spacing.md, gap: spacing.sm }}
                tx="home:recentJournal.startEntryButton"
              />
            ) : (
              <></>
            )
          }
        />
      </Screen>

      {/* Check-in Details Modal */}
      <Modal visible={checkInDetailsModalOpen} animationType="fade" transparent>
        <View style={themed($checkInDetailsModalContainer)}>
          <Pressable
            style={themed($checkInDetailsBackdrop)}
            onPress={() => {
              setCheckInDetailsModalOpen(false)
              setSelectedCheckIn(null)
            }}
          />
          <Card
            style={themed($checkInDetailsCard)}
            HeadingComponent={
              <View style={themed($centeredSpacedRow)}>
                <View>
                  <Text size="sm" weight="semiBold" text="Check-in details" />
                  {selectedCheckIn?.date ? (
                    <Text
                      size="xxs"
                      text={new Date(selectedCheckIn.date).toDateString()}
                      style={themed($checkInDetailsDateText)}
                    />
                  ) : null}
                </View>
                <Pressable
                  onPress={() => {
                    setCheckInDetailsModalOpen(false)
                    setSelectedCheckIn(null)
                  }}
                >
                  <Xmark width={32} height={32} color={colors.text} />
                </Pressable>
              </View>
            }
            ContentComponent={
              <ScrollView
                style={themed($checkInDetailsScroll)}
                contentContainerStyle={themed($checkInDetailsScrollContent)}
                showsVerticalScrollIndicator={false}
              >
                {!selectedCheckIn ? (
                  <Text size="xs" text="No check-in selected." centered />
                ) : (
                  <>
                    <View style={themed($checkInOverallRow)}>
                      <Image
                        source={MOOD_IMAGES[selectedCheckIn.overallMood || 3]}
                        style={themed($checkInOverallImage)}
                      />
                      <View style={themed($checkInOverallTextColumn)}>
                        <Text size="xxs" weight="semiBold" text="Overall mood" />
                        <Text
                          size="xs"
                          text={
                            AVG_MOOD.find((m) => m.value === selectedCheckIn.overallMood)?.label ||
                            "—"
                          }
                        />
                      </View>
                    </View>

                    <View style={themed($checkInDetailsStepsContainer)}>
                      {[...(selectedCheckIn.steps || [])]
                        .sort((a, b) => a.step - b.step)
                        .map((s) => {
                          const moodLabel =
                            MOOD_OPTIONS[s.step]?.find((opt) => opt.value === s.mood)?.label ||
                            `${s.mood}`
                          return (
                            <View
                              key={`${selectedCheckIn.id}-${s.step}`}
                              style={themed($checkInDetailsStepCard)}
                            >
                              <Text
                                size="xxs"
                                weight="semiBold"
                                text={`Step ${s.step}: ${STEP_QUESTIONS[s.step - 1] || ""}`}
                              />
                              <View style={themed($checkInDetailsStepMoodRow)}>
                                <Image
                                  source={MOOD_IMAGES[s.mood || 3]}
                                  style={themed($checkInDetailsStepMoodImage)}
                                />
                                <Text size="xs" text={moodLabel} />
                              </View>
                              {s.notes ? (
                                <View style={themed($checkInDetailsNotesContainer)}>
                                  <Text size="xxs" weight="semiBold" text="Notes" />
                                  <Text size="xs" text={s.notes} />
                                </View>
                              ) : null}
                            </View>
                          )
                        })}
                    </View>
                  </>
                )}
              </ScrollView>
            }
          />
        </View>
      </Modal>

      <AIDisclosureModal
        visible={showAIDisclosure}
        onAccept={handleAcceptAIDisclosure}
        onDecline={handleDeclineAIDisclosure}
      />
    </>
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

const $checkInDetailsModalContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.md,
})

const $checkInDetailsBackdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.palette.primary500,
  opacity: 0.5,
})

const $checkInDetailsCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.sm,
  width: "100%",
  maxHeight: "85%",
})

const $checkInDetailsDateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})

const $checkInDetailsScroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $checkInDetailsScrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.md,
  gap: spacing.md,
})

const $checkInOverallRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  padding: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: spacing.sm,
  backgroundColor: colors.palette.neutral100,
})

const $checkInOverallImage: ThemedStyle<ImageStyle> = () => ({
  height: 44,
  width: 44,
})

const $checkInOverallTextColumn: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $checkInDetailsStepsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $checkInDetailsStepCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  gap: spacing.xs,
})

const $checkInDetailsStepMoodRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
})

const $checkInDetailsStepMoodImage: ThemedStyle<ImageStyle> = () => ({
  height: 28,
  width: 28,
})

const $checkInDetailsNotesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
