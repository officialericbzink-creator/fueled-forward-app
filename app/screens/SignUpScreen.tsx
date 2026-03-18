import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { Pressable, TextInput, View, ViewStyle } from "react-native"
import { usePostHog } from "posthog-react-native"
import Toast from "react-native-toast-message"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, TextFieldAccessoryProps } from "@/components/TextField"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { setHomeWalkthroughNotDoneAfterRegister } from "@/utils/homeWalkthroughFlag"
import { useHeader } from "@/utils/useHeader"

import { authClient } from "../../lib/auth"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
  const posthog = usePostHog()
  const authPasswordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const lastAutoSignUpKey = useRef<string | null>(null)
  const wasAutoFilled = useRef(false)
  const prevPasswordLength = useRef(0)
  const prevConfirmLength = useRef(0)

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useHeader({
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    titleTx: "auth:signUp.title",
  })

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  const signUp = async () => {
    setIsSubmitted(true)

    try {
      // TODO: Add proper validation and error handling
      if (!authEmail || authEmail.length === 0) return
      if (authEmail.length < 6) return
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return

      if (!authPassword || authPassword.length === 0) return
      if (authPassword.length < 6) return
      if (authPassword !== confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Passwords don't match",
          text2: "Please make sure both password fields are the same.",
        })
        confirmPasswordInput.current?.focus()
        return
      }
      const response = await authClient.signUp.email({
        email: authEmail,
        password: authPassword,
        name: "Default User",
      })
      if (response.data) {
        setHomeWalkthroughNotDoneAfterRegister()
        // On successful sign up, the auth state should flip and AppNavigator
        // will mount the authenticated stack (which contains Onboarding).
        console.log(response.data)
        posthog.capture("sign_up", {
          method: "email",
          userId: response.data.user.id,
          timestamp: Date.now(),
        })
        // Avoid manual navigation to "Onboarding" here; it may not exist in the
        // unauthenticated stack yet, and the navigator will switch automatically.
      } else {
        // Handle sign up failure (e.g., show an error message)
        const code = (response.error as any)?.code as string | undefined
        const message = response.error?.message || "An error occurred during sign up."
        const normalized = `${code || ""} ${message}`.toLowerCase()

        console.error("Sign up failed:", response.error)
        posthog.captureException(new Error(message), {
          ...(code ? { code } : {}),
          context: "SignUpScreen.signUp",
          timestamp: Date.now(),
        })

        if (
          normalized.includes("already") &&
          (normalized.includes("exist") ||
            normalized.includes("registered") ||
            normalized.includes("taken"))
        ) {
          Toast.show({
            type: "error",
            text1: "Account already exists",
            text2: "Try signing in with this email instead.",
          })
          return
        }

        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: message,
        })
      }
    } catch (error) {
      console.error("An error occurred during sign up:", error)
      posthog.captureException(error)
    } finally {
      setIsSubmitted(false)
    }
  }

  const handlePasswordChange = (text: string) => {
    const lengthDiff = text.length - prevPasswordLength.current
    if (lengthDiff > 3) {
      wasAutoFilled.current = true
    }
    prevPasswordLength.current = text.length
    setAuthPassword(text)
  }

  const handleConfirmChange = (text: string) => {
    const lengthDiff = text.length - prevConfirmLength.current
    if (lengthDiff > 3) {
      wasAutoFilled.current = true
    }
    prevConfirmLength.current = text.length
    setConfirmPassword(text)
  }

  // Auto-submit ONLY after iOS Password AutoFill fills credentials.
  // Only triggers if password was filled via autofill (many chars at once).
  useEffect(() => {
    if (isSubmitted) return
    if (!wasAutoFilled.current) return

    const email = authEmail.trim()
    const password = authPassword
    const confirm = confirmPassword

    if (!email || email.length < 6) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    if (!password || password.length < 6) return
    if (password !== confirm) return

    const key = `${email}::${password}`
    if (lastAutoSignUpKey.current === key) return
    lastAutoSignUpKey.current = key

    const timeout = setTimeout(() => {
      signUp()
    }, 250)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authEmail, authPassword, confirmPassword, isSubmitted])

  return (
    <Screen
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
      preset="auto"
    >
      <Text tx={"auth:signUp.title"} />
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="auth:signIn.emailFieldLabel"
        placeholderTx="auth:signUp.emailFieldPlaceholder"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={handlePasswordChange}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        returnKeyType="next"
        labelTx="auth:signIn.passwordFieldLabel"
        placeholderTx="auth:signUp.passwordFieldPlaceholder"
        textContentType="newPassword"
        onSubmitEditing={() => confirmPasswordInput.current?.focus()}
        RightAccessory={PasswordRightAccessory}
      />
      <TextField
        ref={confirmPasswordInput}
        value={confirmPassword}
        onChangeText={handleConfirmChange}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        returnKeyType="done"
        labelTx="auth:signUp.confirmPasswordFieldLabel"
        placeholderTx="auth:signUp.confirmPasswordFieldPlaceholder"
        textContentType="newPassword"
        onSubmitEditing={signUp}
        RightAccessory={PasswordRightAccessory}
      />
      <View style={themed($signInContainer)}>
        <Text tx={"auth:signUp.haveAccountText"} />
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={{ textDecorationLine: "underline" }} tx={"auth:signUp.signInButton"} />
        </Pressable>
      </View>
      <Button
        testID="login-button"
        tx={isSubmitted ? "auth:signUp.loadingButton" : "auth:signUp.submitButton"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={signUp}
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $signInContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  marginBottom: spacing.lg,
})
