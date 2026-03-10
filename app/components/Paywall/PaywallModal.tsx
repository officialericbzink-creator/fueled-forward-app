import React, { FC, useMemo, useState } from "react"
import { Alert, Linking, Modal, Pressable, View, ViewStyle } from "react-native"
import { Xmark } from "iconoir-react-native"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Radio } from "@/components/Toggle/Radio"
import { useSubscription } from "@/context/InAppSubscriptionContext"
import type { OfferingPackage, PlanType } from "@/context/InAppSubscriptionContext"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { BASE_WEB_URL } from "@/utils/constants"

type PaywallModalProps = {
  visible: boolean
  source?: string
  onClose: () => void
  onSubscribed?: () => void
}

const withPeriodSuffix = (price: string, planType: PlanType) => {
  // If RevenueCat already includes a period (e.g. "$12.99/month"), don't double-suffix.
  const hasPeriod = /\/\s*(mo|month|yr|year|annual)/i.test(price)
  if (hasPeriod) return price
  return `${price}/${planType === "monthly" ? "month" : "year"}`
}

const getPlanLabel = (planType: PlanType) => (planType === "monthly" ? "Monthly" : "Yearly")

export const PaywallModal: FC<PaywallModalProps> = ({ visible, source, onClose, onSubscribed }) => {
  const { themed, theme } = useAppTheme()
  const { isInitialized, purchasePlan, isLoading, availablePackages, isLoadingOfferings } =
    useSubscription()

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const features = useMemo(() => ["Chat", "Check-ins", "Resources"], [])

  const monthlyPackage = availablePackages.find((p) => p.planType === "monthly")
  const yearlyPackage = availablePackages.find((p) => p.planType === "yearly")

  const canSubmit =
    !!selectedPlan &&
    agreed &&
    isInitialized &&
    !isPurchasing &&
    !isLoading &&
    !isLoadingOfferings &&
    availablePackages.length > 0

  const handleStartTrial = async () => {
    if (!selectedPlan) return
    if (!agreed) return
    if (!isInitialized) {
      Alert.alert(
        "Not ready",
        "Subscription options are still loading. Please try again in a moment.",
      )
      return
    }

    setIsPurchasing(true)
    const result = await purchasePlan(selectedPlan)
    setIsPurchasing(false)

    if (result.success) {
      setSelectedPlan(null)
      setAgreed(false)
      onSubscribed?.()
      return
    }

    Alert.alert("Purchase Failed", result.error || "Something went wrong. Please try again.", [
      { text: "OK" },
    ])
  }

  const closeAndReset = () => {
    setSelectedPlan(null)
    setAgreed(false)
    setIsPurchasing(false)
    onClose()
  }

  const renderPlanRow = (pkg: OfferingPackage) => {
    const isSelected = selectedPlan === pkg.planType
    return (
      <Pressable
        key={pkg.identifier}
        onPress={() => setSelectedPlan(pkg.planType)}
        style={themed([$planRow, isSelected && $planRowSelected])}
      >
        <Radio value={isSelected} />
        <View style={{ flex: 1 }}>
          <Text size="xs" weight="semiBold" text={getPlanLabel(pkg.planType)} />
          <Text
            size="xxs"
            text={withPeriodSuffix(pkg.price, pkg.planType)}
            style={{ color: theme.colors.textDim }}
          />
        </View>
      </Pressable>
    )
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={closeAndReset}>
      <View style={themed($modalRoot)}>
        <Pressable style={themed($backdrop)} onPress={closeAndReset} />

        <Card
          style={themed($card)}
          HeadingComponent={
            <View style={themed($headerRow)}>
              <View style={{ flex: 1 }}>
                <Text size="lg" weight="semiBold" text="Start your 3-day free trial" />
                {!!source && (
                  <Text
                    size="xxs"
                    text={`To continue to ${source}, please choose a plan.`}
                    style={{ color: theme.colors.textDim, marginTop: theme.spacing.xs }}
                  />
                )}
              </View>
              <Pressable onPress={closeAndReset}>
                <Xmark width={28} height={28} color={theme.colors.text} />
              </Pressable>
            </View>
          }
          ContentComponent={
            <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.sm }}>
              <View style={{ gap: theme.spacing.xs }}>
                <Text
                  size="xl"
                  weight="semiBold"
                  text="Your healing journey, supported every step."
                />
                <Text
                  size="xs"
                  text="Fueled Forward was created to give you a private, supportive space where you can work through life's challenges at your own pace."
                />
                <Text
                  size="xs"
                  text="With expert-guided tools, gentle reminders, and the security of full privacy, your journey is always in your hands."
                />
              </View>

              <View style={{ gap: theme.spacing.xs }}>
                <Text size="xs" weight="semiBold" text="Included with Premium" />
                {features.map((f) => (
                  <Text key={f} size="xs" text={`• ${f}`} />
                ))}
              </View>

              <View style={{ gap: theme.spacing.sm }}>
                <Text size="xs" weight="semiBold" text="Choose a plan" />
                {isLoadingOfferings ? (
                  <Text
                    size="xxs"
                    text="Loading subscription options..."
                    style={{ color: theme.colors.textDim }}
                  />
                ) : availablePackages.length === 0 ? (
                  <Text
                    size="xxs"
                    text="Unable to load subscription options. Please try again."
                    style={{ color: theme.colors.error }}
                  />
                ) : (
                  <>
                    {yearlyPackage && renderPlanRow(yearlyPackage)}
                    {monthlyPackage && renderPlanRow(monthlyPackage)}
                  </>
                )}
              </View>

              <Text
                size="xxs"
                text="3-day free trial • Cancel or switch plans anytime"
                centered
                style={{ color: theme.colors.textDim }}
              />

              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
                <Checkbox value={agreed} onPress={() => setAgreed((v) => !v)} />
                <Text size="xxs" text="I agree to start a subscription after the free trial." />
              </View>

              <Button
                preset="reversed"
                text={isPurchasing ? "Starting..." : "Start your 3-day free trial"}
                onPress={handleStartTrial}
                disabled={!canSubmit}
              />

              <View style={themed($linksRow)}>
                <Pressable onPress={() => Linking.openURL(`${BASE_WEB_URL}/terms`)}>
                  <Text
                    size="xxs"
                    style={{ color: theme.colors.tint, textDecorationLine: "underline" }}
                  >
                    Terms of Use
                  </Text>
                </Pressable>
                <Pressable onPress={() => Linking.openURL(`${BASE_WEB_URL}/privacy`)}>
                  <Text
                    size="xxs"
                    style={{ color: theme.colors.tint, textDecorationLine: "underline" }}
                  >
                    Privacy Policy
                  </Text>
                </Pressable>
              </View>
            </View>
          }
        />
      </View>
    </Modal>
  )
}

const $modalRoot: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing.md,
})

const $backdrop: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.colors.palette.primary500,
  opacity: 0.5,
})

const $card: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  maxWidth: 520,
  padding: theme.spacing.sm,
})

const $headerRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
})

const $planRow: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing.sm,
  padding: theme.spacing.sm,
  borderRadius: 8,
  borderColor: theme.colors.palette.primary300,
  borderWidth: 2,
})

const $planRowSelected: ThemedStyle<ViewStyle> = (theme) => ({
  borderColor: theme.colors.text,
  backgroundColor: theme.colors.palette.primary100,
})

const $linksRow: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: theme.spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.lg,
})
