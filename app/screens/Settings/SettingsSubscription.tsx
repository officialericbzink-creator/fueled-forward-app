import { FC, useState, useEffect } from "react"
import { ViewStyle, Pressable, View, ScrollView, ActivityIndicator, Alert } from "react-native"
import { SettingsStackScreenProps } from "@/navigators/SettingsNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useHeader } from "@/utils/useHeader"
import { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { Radio } from "@/components/Toggle/Radio"

import { useSubscription } from "@/context/InAppSubscriptionContext"
import type { PlanType } from "@/context/InAppSubscriptionContext"

interface SettingsMenuScreenProps extends SettingsStackScreenProps<"SettingsSubscription"> {}

export const SettingsSubscriptionScreen: FC<SettingsMenuScreenProps> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()

  // Get subscription data from context
  const {
    subscriptionData,
    isLoading: isContextLoading,
    isInitialized,
    purchasePlan,
    restorePurchases,
    manageSubscription,
    refreshSubscriptionStatus,
    availablePackages,
    isLoadingOfferings,
  } = useSubscription()

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useHeader({
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    title: "My Subscription",
  })

  // Refresh subscription status on mount
  useEffect(() => {
    if (isInitialized) {
      refreshSubscriptionStatus()
    }
  }, [isInitialized, refreshSubscriptionStatus])

  const calculateYearlyTotal = (monthlyPrice: string): string => {
    const match = monthlyPrice.match(/\d+\.?\d*/)
    if (!match) return ""

    const price = parseFloat(match[0])
    const yearlyTotal = (price * 12).toFixed(2)
    return `$${yearlyTotal}/yr`
  }

  const handleRestorePurchases = async () => {
    const result = await restorePurchases()

    if (result.success) {
      Alert.alert("Success", "Your purchases have been restored!", [{ text: "OK" }])
    } else {
      Alert.alert(
        "Restore Failed",
        result.error || "Could not restore purchases. Please try again.",
        [{ text: "OK" }],
      )
    }
  }

  const handleManageSubscription = () => {
    manageSubscription()
  }

  const handlePurchase = async () => {
    if (!selectedPlan) return

    setIsPurchasing(true)
    const result = await purchasePlan(selectedPlan)
    setIsPurchasing(false)

    if (result.success) {
      Alert.alert(
        "Welcome to Fueled Forward!",
        "Your 7-day free trial has started. You can cancel anytime.",
        [{ text: "Get Started" }],
      )
      // Clear selection after successful purchase
      setSelectedPlan(null)
    } else {
      Alert.alert("Purchase Failed", result.error || "Something went wrong. Please try again.", [
        { text: "OK" },
      ])
    }
  }

  const handleResubscribe = async () => {
    // Resubscribe uses the same flow as new purchase
    if (!selectedPlan) {
      Alert.alert("Select a Plan", "Please select a plan to continue.", [{ text: "OK" }])
      return
    }

    setIsPurchasing(true)
    const result = await purchasePlan(selectedPlan)
    setIsPurchasing(false)

    if (result.success) {
      Alert.alert("Welcome Back!", "Your subscription has been reactivated.", [
        { text: "Continue" },
      ])
      setSelectedPlan(null)
    } else {
      Alert.alert("Resubscribe Failed", result.error || "Something went wrong. Please try again.", [
        { text: "OK" },
      ])
    }
  }

  // Active Subscription UI
  const renderActiveSubscription = () => (
    <View style={themed($contentContainer)}>
      <View style={themed($statusCard)}>
        <Text size="lg" weight="bold" text="Active Subscription" />
        <View style={themed($infoRow)}>
          <Text size="xs" text="Plan:" style={{ color: theme.colors.textDim }} />
          <Text size="xs" weight="semiBold" text={subscriptionData.planName || "N/A"} />
        </View>
        <View style={themed($infoRow)}>
          <Text size="xs" text="Price:" style={{ color: theme.colors.textDim }} />
          <Text size="xs" weight="semiBold" text={subscriptionData.price || "N/A"} />
        </View>
        <View style={themed($infoRow)}>
          <Text size="xs" text="Next Billing:" style={{ color: theme.colors.textDim }} />
          <Text size="xs" weight="semiBold" text={subscriptionData.nextBillingDate || "N/A"} />
        </View>
      </View>

      <Button
        preset="default"
        text="Manage Subscription"
        onPress={handleManageSubscription}
        style={themed($button)}
      />

      <Pressable onPress={handleRestorePurchases} style={themed($restoreButton)}>
        <Text size="xs" text="Restore Purchases" style={{ color: theme.colors.tint }} />
      </Pressable>
    </View>
  )

  // Trial Period UI
  const renderTrialSubscription = () => (
    <View style={themed($contentContainer)}>
      <View style={themed($statusCard)}>
        <Text size="lg" weight="bold" text="Free Trial Active" />
        <Text
          size="md"
          text={`${subscriptionData.trialDaysRemaining} days remaining`}
          style={{ color: theme.colors.tint, marginTop: theme.spacing.xs }}
        />
        <View style={[themed($infoRow), { marginTop: theme.spacing.md }]}>
          <Text size="xs" text="Plan:" style={{ color: theme.colors.textDim }} />
          <Text size="xs" weight="semiBold" text={subscriptionData.planName || "N/A"} />
        </View>
        <View style={themed($infoRow)}>
          <Text size="xs" text="Price after trial:" style={{ color: theme.colors.textDim }} />
          <Text size="xs" weight="semiBold" text={subscriptionData.price || "N/A"} />
        </View>
        <View style={themed($infoRow)}>
          <Text size="xs" text="First charge:" style={{ color: theme.colors.textDim }} />
          <Text size="xs" weight="semiBold" text={subscriptionData.nextBillingDate || "N/A"} />
        </View>
      </View>

      <Text
        size="xs"
        text="Cancel anytime before your trial ends to avoid being charged."
        centered
        style={{ color: theme.colors.textDim, marginTop: theme.spacing.md }}
      />

      <Button
        preset="default"
        text="Manage Subscription"
        onPress={handleManageSubscription}
        style={themed($button)}
      />

      <Pressable onPress={handleRestorePurchases} style={themed($restoreButton)}>
        <Text size="xs" text="Restore Purchases" style={{ color: theme.colors.tint }} />
      </Pressable>
    </View>
  )

  // Expired Subscription UI
  const renderExpiredSubscription = () => (
    <View style={themed($contentContainer)}>
      <View style={themed($statusCard)}>
        <Text size="lg" weight="bold" text="Subscription Expired" />
        <Text
          size="xs"
          text={`Expired on ${subscriptionData.expirationDate || "N/A"}`}
          style={{ color: theme.colors.textDim, marginTop: theme.spacing.xs }}
        />
      </View>

      <Text
        size="sm"
        weight="semiBold"
        text="Resubscribe to continue your healing journey"
        centered
        style={{ marginVertical: theme.spacing.lg }}
      />

      {renderPlanSelection(true)}
    </View>
  )

  // No Subscription / Choose Plan UI (matches paywall)
  const renderPlanSelection = (isResubscribe = false) => {
    const monthlyPackage = availablePackages.find((pkg) => pkg.planType === "monthly")
    const yearlyPackage = availablePackages.find((pkg) => pkg.planType === "yearly")

    const monthlySelected = selectedPlan === "monthly"
    const yearlySelected = selectedPlan === "yearly"

    // Show loading while fetching packages
    if (isLoadingOfferings) {
      return (
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.tint} />
          <Text text="Loading plans..." style={{ marginTop: theme.spacing.md }} />
        </View>
      )
    }

    // Show error if no packages
    if (availablePackages.length === 0) {
      return (
        <View style={themed($loadingContainer)}>
          <Text
            text="Unable to load subscription options. Please try again later."
            style={{ color: theme.colors.error, textAlign: "center" }}
          />
        </View>
      )
    }

    return (
      <>
        {!isResubscribe && (
          <>
            <Text
              size="xl"
              weight="semiBold"
              text="Your healing journey, supported every step."
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text
              size="xs"
              text="Fueled Forward was created to give you a private, supportive space where you can work through life's challenges at your own pace."
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text
              size="xs"
              text="With expert-guided tools, gentle reminders, and the security of full privacy, your journey is always in your hands."
            />
          </>
        )}

        <View style={themed($offersContainer)}>
          {yearlyPackage && (
            <Pressable
              onPress={() => setSelectedPlan("yearly")}
              style={themed([$offerButton, yearlySelected && $selectedOfferButton])}
            >
              <Radio value={yearlySelected} />
              <Text weight="semiBold" text="Yearly Plan" size="xxs" />
              <Text
                style={{ marginVertical: theme.spacing.xs }}
                text={yearlyPackage.price}
                weight="bold"
              />
              <Text
                size="xxs"
                text={`This is ${yearlyPackage.pricePerMonth}`}
                style={{ color: theme.colors.textDim }}
              />
            </Pressable>
          )}

          {monthlyPackage && (
            <Pressable
              onPress={() => setSelectedPlan("monthly")}
              style={themed([$offerButton, monthlySelected && $selectedOfferButton])}
            >
              <Radio value={monthlySelected} />
              <Text weight="semiBold" text="Monthly Plan" size="xxs" />
              <Text
                style={{ marginVertical: theme.spacing.xs }}
                text={monthlyPackage.price}
                weight="bold"
              />
              {yearlyPackage && (
                <Text
                  size="xxs"
                  text={calculateYearlyTotal(monthlyPackage.price)}
                  style={{ color: theme.colors.textDim }}
                />
              )}
            </Pressable>
          )}
        </View>

        <Text
          size="xxs"
          text={
            isResubscribe
              ? "Cancel or switch plans anytime"
              : "3-day free trial • Cancel or switch plans anytime"
          }
          centered
          style={{ color: theme.colors.textDim, marginTop: theme.spacing.sm }}
        />

        <Button
          preset="reversed"
          text={isResubscribe ? "Resubscribe" : "Start Free Trial"}
          onPress={isResubscribe ? handleResubscribe : handlePurchase}
          style={themed($button)}
          disabled={!selectedPlan || isPurchasing}
        />

        <Pressable onPress={handleRestorePurchases} style={themed($restoreButton)}>
          <Text size="xs" text="Restore Purchases" style={{ color: theme.colors.tint }} />
        </Pressable>
      </>
    )
  }

  // Main render logic
  const renderContent = () => {
    // Show loading if context is loading or we're purchasing
    if (isContextLoading || isPurchasing) {
      return (
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.tint} />
          <Text
            text={isPurchasing ? "Processing..." : "Loading subscription..."}
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      )
    }

    // Show error if RC not initialized
    if (!isInitialized) {
      return (
        <View style={themed($loadingContainer)}>
          <Text
            size="sm"
            text="Unable to load subscription information"
            style={{ color: theme.colors.error, marginBottom: theme.spacing.md }}
          />
          <Button preset="default" text="Retry" onPress={refreshSubscriptionStatus} />
        </View>
      )
    }

    // Render based on subscription status
    switch (subscriptionData.status) {
      case "active":
        return renderActiveSubscription()
      case "trial":
        return renderTrialSubscription()
      case "expired":
        return renderExpiredSubscription()
      case "none":
      default:
        return <View style={themed($contentContainer)}>{renderPlanSelection(false)}</View>
    }
  }

  return (
    <Screen style={themed($root)} preset="auto">
      <ScrollView
        contentContainerStyle={themed($scrollContent)}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $scrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.lg,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  gap: spacing.md,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 300,
})

const $statusCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.md,
  borderRadius: 12,
  backgroundColor: colors.palette.primary100,
  borderWidth: 2,
  borderColor: colors.palette.primary300,
  gap: spacing.sm,
})

const $infoRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $restoreButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignSelf: "center",
  padding: spacing.sm,
  marginTop: spacing.sm,
})

const $offersContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  gap: spacing.md,
  flexDirection: "row",
})

const $offerButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  padding: spacing.sm,
  borderRadius: 8,
  borderColor: colors.palette.primary300,
  borderWidth: 2,
  gap: spacing.sm,
})

const $selectedOfferButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.text,
  backgroundColor: colors.palette.primary100,
})
