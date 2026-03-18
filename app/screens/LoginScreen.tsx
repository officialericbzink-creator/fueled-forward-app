import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { Linking, Pressable, TextInput, View, ViewStyle } from "react-native"
import Toast from "react-native-toast-message"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, TextFieldAccessoryProps } from "@/components/TextField"
import Config from "@/config"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { setHomeWalkthroughFromUser } from "@/utils/homeWalkthroughFlag"
import { posthog } from "@/utils/posthog"
import { useHeader } from "@/utils/useHeader"

import { authClient } from "../../lib/auth"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const lastAutoLoginKey = useRef<string | null>(null)
  const wasAutoFilled = useRef(false)
  const prevPasswordLength = useRef(0)

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useHeader({
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    titleTx: "auth:signIn.title",
  })

  const login = async () => {
    setIsSubmitted(true)

    try {
      if (!authEmail || authEmail.length === 0) return
      if (authEmail.length < 6) return
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return

      if (!authPassword || authPassword.length === 0) return
      if (authPassword.length < 6) return
      const response = await authClient.signIn.email({
        email: authEmail,
        password: authPassword,
      })
      if (response.data) {
        const sess = await authClient.getSession()
        setHomeWalkthroughFromUser(sess.data?.user)
        posthog.capture("login_successful", {
          email: authEmail,
          timestamp: Date.now(),
        })
      } else {
        if (response.error.code === "EMAIL_NOT_VERIFIED") {
          Toast.show({
            type: "info",
            text1: "Email Not Verified",
            text2: "Please verify your email before logging in.",
          })
          navigation.navigate("EmailVerification", { email: authEmail })
        } else {
          console.error("Login failed:", response.error)
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: response.error?.message || "An error occurred during login.",
          })
          throw new Error(response.error?.message || "Login failed")
        }
      }
    } catch (error) {
      posthog.captureException(error, {
        context: "LoginScreen.login",
        email: authEmail,
        timestamp: Date.now(),
      })
      console.error("An error occurred during login:", error)
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: (error as Error).message || "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitted(false)
    }
  }

  const handlePasswordChange = (text: string) => {
    const lengthDiff = text.length - prevPasswordLength.current
    // Autofill typically adds many characters at once (> 3)
    if (lengthDiff > 3) {
      wasAutoFilled.current = true
    }
    prevPasswordLength.current = text.length
    setAuthPassword(text)
  }

  // Auto-submit ONLY after iOS Password AutoFill (FaceID) fills credentials.
  // Only triggers if password was filled via autofill (many chars at once).
  useEffect(() => {
    if (isSubmitted) return
    if (!wasAutoFilled.current) return

    const email = authEmail.trim()
    const password = authPassword

    if (!email || email.length < 6) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    if (!password || password.length < 6) return

    const key = `${email}::${password}`
    if (lastAutoLoginKey.current === key) return
    lastAutoLoginKey.current = key

    const timeout = setTimeout(() => {
      login()
    }, 250)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authEmail, authPassword, isSubmitted])

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

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text tx={"auth:signIn.title"} />

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        textContentType="emailAddress"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="next"
        labelTx="auth:signIn.emailFieldLabel"
        placeholderTx="auth:signIn.emailFieldPlaceholder"
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={handlePasswordChange}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        returnKeyType="done"
        labelTx="auth:signIn.passwordFieldLabel"
        placeholderTx="auth:signIn.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <View style={themed($signUpContainer)}>
        <Text tx={"auth:signIn.noAccountText"} />
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ textDecorationLine: "underline" }} tx={"auth:signIn.signUpButton"} />
        </Pressable>
      </View>
      <View style={themed($signUpContainer)}>
        <Pressable onPress={() => Linking.openURL(Config.PASSWORD_RESET_URL)}>
          <Text
            size="xxs"
            style={{ textDecorationLine: "underline" }}
            tx={"auth:signIn.forgotPassword"}
          />
        </Pressable>
      </View>
      <Button
        testID="login-button"
        tx={isSubmitted ? "auth:signIn.signInButtonLoading" : "auth:signIn.submitButton"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
        disabled={isSubmitted}
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

const $signUpContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  marginBottom: spacing.md,
})
