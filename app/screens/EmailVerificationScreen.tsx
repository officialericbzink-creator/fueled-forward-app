import { FC, useEffect, useState } from "react"
import { Pressable, View, ViewStyle } from "react-native"
import { Mail, CheckCircle } from "iconoir-react-native"
import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
import { authClient } from "@/lib/auth" // your auth client
import { DEEP_LINK_URL } from "@/utils/constants"

interface EmailVerificationScreenProps extends AppStackScreenProps<"EmailVerification"> {}

export const EmailVerificationScreen: FC<EmailVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()

  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get token from deep link params
  const token = route.params?.token
  const userEmail = route.params?.email // pass this from sign up screen

  useHeader({
    onLeftPress: () => navigation.goBack(),
    leftIcon: "back",
  })

  // Handle verification when token is present
  useEffect(() => {
    if (token) {
      handleVerification(token)
    }
  }, [token])

  useEffect(() => {
    console.log("EmailVerificationScreen mounted with token:", token)
    console.log("and email:", userEmail)
  }, [token, userEmail])

  const handleVerification = async (verificationToken: string) => {
    setIsVerifying(true)
    setError(null)

    try {
      // Call your verification endpoint with the token
      const { data, error } = await authClient.verifyEmail({
        token: verificationToken,
      })

      if (error) {
        setError("Verification failed. Please try again.")
      } else {
        setIsVerified(true)
        // Optional: Auto-navigate to login after a delay
        setTimeout(() => {
          navigation.navigate("Login")
        }, 2000)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendVerification = async () => {
    if (!userEmail) return

    try {
      await authClient.sendVerificationEmail({
        email: userEmail,
        callbackURL: DEEP_LINK_URL, // Your deep link path
      })
      // Show success message
      alert("Verification email sent!")
    } catch (err) {
      alert("Failed to send verification email")
    }
  }

  // Show verification success state
  if (isVerified) {
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={{ flex: 1 }}
        preset="fixed"
        safeAreaEdges={["bottom"]}
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
          <View
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              backgroundColor: colors.palette.success100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckCircle width={40} height={40} color={colors.palette.success700} />
          </View>
          <Text size="xxl" text="You're verified!" centered />
          <Text centered text="Your email has been verified successfully." />
        </View>
        <View style={{ paddingBottom: spacing.lg }}>
          <Button text="Continue to Sign In" onPress={() => navigation.navigate("Login")} />
        </View>
      </Screen>
    )
  }

  // Show verifying state
  if (isVerifying) {
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={{ flex: 1 }}
        preset="fixed"
        safeAreaEdges={["bottom"]}
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text text="Verifying your email..." centered />
        </View>
      </Screen>
    )
  }

  // Show error or default state
  return (
    <Screen
      style={themed($root)}
      contentContainerStyle={{ flex: 1 }}
      preset="fixed"
      safeAreaEdges={["bottom"]}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
        <View
          style={{
            height: 80,
            width: 80,
            borderRadius: 40,
            backgroundColor: error ? colors.palette.angry100 : colors.palette.primary200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Mail
            width={40}
            height={40}
            color={error ? colors.palette.angry700 : colors.palette.primary700}
          />
        </View>
        <Text size="xxl" text={error || "Let's get you verified!"} centered />
        <Text
          centered
          text={
            error
              ? "The verification link may be invalid or expired."
              : "Check your email for a verification link to get started."
          }
        />
      </View>
      <View style={{ paddingBottom: spacing.lg }}>
        <Button
          text="Sign In"
          preset="reversed"
          style={{ marginBottom: spacing.lg }}
          onPress={() => navigation.navigate("Login")}
        />
        <Pressable onPress={handleResendVerification}>
          <Text
            size="xs"
            style={{ textDecorationLine: "underline" }}
            centered
            text="Resend verification link"
          />
        </Pressable>
      </View>
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})
