// screens/OnboardingScreen.tsx
import { FC, useEffect, useState, useRef, useCallback } from "react"
import { ViewStyle, View, ActivityIndicator } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useHeader } from "@/utils/useHeader"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useGetOnboardingStatus } from "@/hooks/onboarding/get-onboarding-status"
import {
  useCompleteOnboarding,
  useSubmitOnboardingStep,
} from "@/hooks/onboarding/onboarding-actions"
import { Step0Name } from "@/components/Onboarding/OnboardingNameStep"
import { Step1Struggles } from "@/components/Onboarding/OnboardingStrugglesStep"
import { Step2ImportantDate } from "@/components/Onboarding/OnboardingImportantDate"
import { Step3Therapy } from "@/components/Onboarding/OnboardingTherapy"
import { Step5Biometric } from "@/components/Onboarding/OnboardingSecurity"
import { OnboardingPaywallStep } from "@/components/Onboarding/OnboardingPaywall"
import { CommonActions } from "@react-navigation/native"
// Import other step components as we create them

interface OnboardingScreenProps extends AppStackScreenProps<"Onboarding"> {}

export const OnboardingScreen: FC<OnboardingScreenProps> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()
  const {
    data: onboardingStatus,
    isLoading: isLoadingStatus,
    error: statusError,
    isError: isStatusError,
  } = useGetOnboardingStatus()
  const submitStep = useSubmitOnboardingStep()
  const completeOnboarding = useCompleteOnboarding()
  const { refetch } = useAuth()

  useEffect(() => {
    if (onboardingStatus) {
      console.log("Raw onboarding status:", JSON.stringify(onboardingStatus, null, 2))
    }
  }, [onboardingStatus])

  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [stepData, setStepData] = useState<any>(null)
  const [isStepValid, setIsStepValid] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  // Track the furthest step saved in backend
  const maxBackendStepRef = useRef(0)
  const hasNavigatedRef = useRef(false)

  const contentOpacity = useSharedValue(1)

  // Sync with backend status only on initial load
  useEffect(() => {
    if (onboardingStatus?.currentStep !== undefined) {
      console.log("Initial backend step:", onboardingStatus.currentStep)
      if (currentStep === 0 || maxBackendStepRef.current === 0) {
        setCurrentStep(onboardingStatus.currentStep)
      }
      maxBackendStepRef.current = onboardingStatus.currentStep
    }
  }, [onboardingStatus?.currentStep])

  const handleDataChange = useCallback((data: any) => {
    setStepData(data)
  }, [])

  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsStepValid(isValid)
  }, [])

  useEffect(() => {
    if (onboardingStatus?.completedOnboarding && !hasNavigatedRef.current) {
      console.log("Onboarding complete, navigating to Auth...")
      hasNavigatedRef.current = true

      // Small delay to ensure state is updated
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          }),
        )
      }, 100)
    }
  }, [onboardingStatus?.completedOnboarding, navigation])

  // Reset step data and validation when step changes
  useEffect(() => {
    setStepData(null)
    setIsStepValid(false)
  }, [currentStep])

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }))

  const handleNextStep = async () => {
    if (!isStepValid || !stepData) return

    try {
      setIsTransitioning(true)

      // Fade out current content
      contentOpacity.value = withTiming(
        0,
        {
          duration: 300,
          easing: Easing.in(Easing.ease),
        },
        (finished) => {
          "worklet"
          if (finished) {
            runOnJS(submitStepToBackend)()
          }
        },
      )
    } catch (error) {
      console.error("Error during transition:", error)
      setIsTransitioning(false)
      contentOpacity.value = withTiming(1, { duration: 300 })
    }
  }

  const submitStepToBackend = async () => {
    try {
      const submittingStep = currentStep

      const result = await submitStep.mutateAsync({
        step: submittingStep,
        data: stepData,
      })

      // Check if we just submitted the last step (step 4)
      if (submittingStep === 4) {
        console.log("Completing onboarding process")
        setIsCompleting(true)

        // Complete onboarding
        await completeOnboarding.mutateAsync()

        console.log("Onboarding completion successful")

        // Refetch user data if available
        if (refetch) {
          refetch()
        }

        // Don't update currentStep - navigation will happen from useEffect
      } else {
        // Normal step progression - move to next step
        setCurrentStep(result.currentStep)

        if (result.currentStep > maxBackendStepRef.current) {
          maxBackendStepRef.current = result.currentStep
        }

        // Fade in new content
        contentOpacity.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        })
      }
    } catch (error) {
      console.error("Error submitting onboarding step:", error)
      setIsCompleting(false)
      // Fade back in on error
      contentOpacity.value = withTiming(1, { duration: 300 })
    } finally {
      setIsTransitioning(false)
    }
  }

  // Can go back to any previously completed step
  const canGoBack = currentStep > 0 && !isTransitioning && !isCompleting

  useHeader(
    {
      leftIcon: canGoBack ? "back" : undefined,
      onLeftPress: canGoBack
        ? () => {
            // Go back one step
            setCurrentStep((prev) => Math.max(prev - 1, 0))
          }
        : undefined,
    },
    [canGoBack, currentStep],
  )

  if (isLoadingStatus || isCompleting) {
    return (
      <Screen
        contentContainerStyle={{ flex: 1 }}
        style={themed($root)}
        preset="auto"
        safeAreaEdges={["bottom"]}
      >
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.tint} />
          <Text style={{ marginTop: theme.spacing.md }}>
            {isCompleting ? "Completing onboarding..." : "Loading..."}
          </Text>
        </View>
      </Screen>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step0Name
            onDataChange={handleDataChange} // ← Use memoized callback
            onValidationChange={handleValidationChange}
          />
        )
      case 1:
        return (
          <Step1Struggles
            onDataChange={handleDataChange}
            onValidationChange={handleValidationChange}
          />
        )
      case 2:
        return (
          <Step2ImportantDate
            onDataChange={handleDataChange}
            onValidationChange={handleValidationChange}
          />
        )
      case 3:
        return (
          <Step3Therapy
            onDataChange={handleDataChange}
            onValidationChange={handleValidationChange}
          />
        )
      case 4:
        return (
          <OnboardingPaywallStep
            onDataChange={handleDataChange} // ← Use memoized callback
            onValidationChange={handleValidationChange}
          />
        )
      // case 5:
      //   return (
      //     <Step5Biometric
      //       onDataChange={handleDataChange}
      //       onValidationChange={handleValidationChange}
      //     />
      //   )
      default:
        return (
          <View style={themed($loadingContainer)}>
            <ActivityIndicator size="large" color={theme.colors.tint} />
            <Text style={{ marginTop: theme.spacing.md }}>Completing onboarding...</Text>
          </View>
        )
    }
  }

  return (
    <Screen
      contentContainerStyle={{ flex: 1 }}
      style={themed($root)}
      preset="auto"
      safeAreaEdges={["bottom"]}
    >
      <Animated.View style={[themed($contentContainer), contentAnimatedStyle]}>
        {renderStep()}
      </Animated.View>

      <View style={themed($bottomView)}>
        <Button
          preset="reversed"
          onPress={handleNextStep}
          style={themed($nextButton)}
          text="Continue"
          disabled={!isStepValid || isTransitioning || submitStep.isPending || isCompleting}
        />
      </View>
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingHorizontal: theme.spacing.md,
})

const $contentContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  // justifyContent: "flex-end",
})

const $loadingContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $bottomView: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: theme.spacing.md,
})

const $nextButton: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
})
