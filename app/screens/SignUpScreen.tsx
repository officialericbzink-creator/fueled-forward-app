import { ComponentType, FC, useMemo, useRef, useState } from "react"
import { Pressable, TextInput, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, TextFieldAccessoryProps } from "@/components/TextField"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

import { authClient } from "../../lib/auth"
import { usePostHog } from "posthog-react-native"

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
      if (authPassword !== confirmPassword) return
      const response = await authClient.signUp.email({
        email: authEmail,
        password: authPassword,
        name: "Default User",
      })
      if (response.data) {
        // On successful sign up, navigate to the Welcome screen
        console.log(response.data)
        posthog.capture("sign_up", {
          method: "email",
          userId: response.data.user.id,
          timestamp: Date.now(),
        })
        navigation.navigate("Onboarding")
      } else {
        // Handle sign up failure (e.g., show an error message)
        console.error("Sign up failed:", response.error)
        posthog.captureException(new Error("Sign up failed"))
      }
    } catch (error) {
      console.error("An error occurred during sign up:", error)
      posthog.captureException(error)
    } finally {
      setIsSubmitted(false)
    }
  }

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
        autoComplete="off"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="auth:signIn.emailFieldLabel"
        placeholderTx="auth:signUp.emailFieldPlaceholder"
        textContentType="none"
        // onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="auth:signIn.passwordFieldLabel"
        placeholderTx="auth:signUp.passwordFieldPlaceholder"
        // onSubmitEditing={signUp}
        textContentType="none"
        RightAccessory={PasswordRightAccessory}
      />
      <TextField
        ref={confirmPasswordInput}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="auth:signUp.confirmPasswordFieldLabel"
        placeholderTx="auth:signUp.confirmPasswordFieldPlaceholder"
        // onSubmitEditing={signUp}
        textContentType="none"
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
