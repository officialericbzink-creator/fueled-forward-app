import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { isRTL } from "@/i18n"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Button } from "@/components/Button"

const welcomeBg = require("@assets/images/welcome-screen-bg.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(_props) {
  const { themed, theme } = useAppTheme()

  const { navigation } = _props

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$styles.flex1}>
      <Image source={welcomeBg} style={themed($welcomeBackground)} />
      <View style={themed($topContainer)}>
        <Text
          testID="welcome-heading"
          style={themed($welcomeHeading)}
          tx="welcomeScreen:heading"
          preset="heading"
          centered
        />
        <Text
          style={themed($subheadingText)}
          tx="welcomeScreen:subheading"
          size="sm"
          centered
          preset="subheading"
        />
      </View>

      <View style={themed([$bottomContainer, $bottomContainerInsets])}>
        <Text tx="welcomeScreen:buttonCaption" size="xs" centered style={themed($subheadingText)} />
        <Button
          testID="login-screen-button"
          preset="reversed"
          tx="welcomeScreen:buttonText"
          onPress={() => navigation.navigate("SignUp")}
        />
        <Button
          testID="login-screen-button"
          preset="default"
          text={"Log In"}
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  position: "relative",
})

const $welcomeBackground: ThemedStyle<ImageStyle> = () => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  height: "100%",
  width: "100%",
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  paddingHorizontal: spacing.md,
  gap: spacing.lg,
})

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.md,
  color: colors.palette.primary100,
})
const $subheadingText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.palette.primary100,
})
