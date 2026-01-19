import { Pressable, View, ViewStyle, ActivityIndicator } from "react-native"
import { Text } from "../Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useEffect, useState } from "react"
import { Radio } from "../Toggle/Radio"
import { useSubscription } from "@/context/InAppSubscriptionContext"
import type { PlanType } from "@/context/InAppSubscriptionContext"

interface OnboardingPaywallStepProps {
  onDataChange: (data: { paywallCompleted: boolean; planType?: PlanType }) => void
  onValidationChange: (isValid: boolean) => void
}

export const OnboardingPaywallStep: FC<OnboardingPaywallStepProps> = ({
  onDataChange,
  onValidationChange,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const { themed, theme } = useAppTheme()

  const { availablePackages, isLoadingOfferings, isInitialized } = useSubscription()

  // Get packages
  const monthlyPackage = availablePackages.find((pkg) => pkg.planType === "monthly")
  const yearlyPackage = availablePackages.find((pkg) => pkg.planType === "yearly")

  useEffect(() => {
    const isValid = !!selectedPlan && isInitialized && !isLoadingOfferings
    onDataChange({
      paywallCompleted: isValid,
      planType: selectedPlan || undefined,
    })
    onValidationChange(isValid)
  }, [selectedPlan, isInitialized, isLoadingOfferings, onDataChange, onValidationChange])

  const monthlySelected = selectedPlan === "monthly"
  const yearlySelected = selectedPlan === "yearly"

  // Show loading state while packages are loading
  if (isLoadingOfferings || !isInitialized) {
    return (
      <View style={themed($container)}>
        <Text size="xl" weight="semiBold" text="Your healing journey, supported every step." />
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.tint} />
          <Text text="Loading subscription options..." style={{ marginTop: theme.spacing.md }} />
        </View>
      </View>
    )
  }

  // Show error if no packages available
  if (availablePackages.length === 0) {
    return (
      <View style={themed($container)}>
        <Text size="xl" weight="semiBold" text="Your healing journey, supported every step." />
        <View style={themed($loadingContainer)}>
          <Text
            text="Unable to load subscription options. Please check your connection and try again."
            style={{ color: theme.colors.error, textAlign: "center" }}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      <Text size="xl" weight="semiBold" text="Your healing journey, supported every step." />
      <Text
        size="xs"
        text="Fueled Forward was created to give you a private, supportive space where you can work through life's challenges at your own pace."
      />
      <Text
        size="xs"
        text="With expert-guided tools, gentle reminders, and the security of full privacy, your journey is always in your hands."
      />

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
                text={`This is ${calculateYearlyTotal(monthlyPackage.price)}`}
                style={{ color: theme.colors.textDim }}
              />
            )}
          </Pressable>
        )}
      </View>

      <Text
        size="xxs"
        text="3-day free trial • Cancel or switch plans anytime"
        centered
        style={{ color: theme.colors.textDim }}
      />
    </View>
  )
}

// Helper to calculate yearly total from monthly price
const calculateYearlyTotal = (monthlyPrice: string): string => {
  const match = monthlyPrice.match(/\d+\.?\d*/)
  if (!match) return ""

  const price = parseFloat(match[0])
  const yearlyTotal = (price * 12).toFixed(2)
  return `$${yearlyTotal}/yr`
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingTop: theme.spacing.md,
  gap: theme.spacing.md,
})

const $loadingContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: theme.spacing.xxl,
})

const $offersContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: "auto",
  gap: theme.spacing.md,
  flexDirection: "row",
})

const $offerButton: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: theme.spacing.sm,
  borderRadius: 8,
  borderColor: theme.colors.palette.primary300,
  borderWidth: 2,
  gap: theme.spacing.sm,
})

const $selectedOfferButton: ThemedStyle<ViewStyle> = (theme) => ({
  borderColor: theme.colors.text,
  backgroundColor: theme.colors.palette.primary100,
})
