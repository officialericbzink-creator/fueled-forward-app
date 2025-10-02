import { FC } from "react"
import { ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { AuthTabScreenProps } from "@/navigators/AuthNavigator"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

// import { useNavigation } from "@react-navigation/native"

interface HomeScreenProps extends AuthTabScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = () => {
  const { session, signOut } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="auto">
      <Text text="home" />
      <Button
        testID="login-button"
        // tx="loginScreen:tapToLogIn"
        text={"Logout"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={() => signOut()}
      />
      <Text>{JSON.stringify(session, null, 2)}</Text>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
