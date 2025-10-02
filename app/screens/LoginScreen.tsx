import { ComponentType, FC, useMemo, useRef, useState } from "react"
import { Pressable, TextInput, View, ViewStyle } from "react-native"
import { Link, useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, TextFieldAccessoryProps } from "@/components/TextField"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

import { authClient } from "../../lib/auth"
import Toast from "react-native-toast-message"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
// import { useNavigation } from "@react-navigation/native"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("richardsprins@gmail.com")
  const [authPassword, setAuthPassword] = useState("test1234")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const { data: session } = authClient.useSession()
  // Pull in navigation via hook
  const navigation = useNavigation()

  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const login = async () => {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (!authEmail || authEmail.length === 0) return
    if (authEmail.length < 6) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return

    if (!authPassword || authPassword.length === 0) return
    if (authPassword.length < 6) return

    try {
      const response = await authClient.signIn.email({
        email: authEmail,
        password: authPassword,
      })
      if (response.data) {
        // On successful login, navigate to the Welcome screen
        console.log(response.data)
      } else {
        // Handle login failure (e.g., show an error message)
        console.error("Login failed:", response.error)
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: response.error?.message || "An error occurred during login.",
        })
      }
    } catch (error) {
      console.error("An error occurred during login:", error)
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: (error as Error).message || "An unexpected error occurred.",
      })
    }
  }

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
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="auth:signIn.emailFieldLabel"
        placeholderTx="auth:signIn.emailFieldPlaceholder"
        // helper={error}
        // status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
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
      <Button
        testID="login-button"
        tx="auth:signIn.submitButton"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
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
  // justifyContent: "center",
  gap: spacing.sm,
  marginBottom: spacing.lg,
})
