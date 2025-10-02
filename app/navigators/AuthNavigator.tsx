import { TextStyle, ViewStyle } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppStackParamList, AppStackScreenProps } from "@/navigators/AppNavigator"
import { HomeScreen } from "@/screens/HomeScreen"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export type AuthNavigatorParamList = {
  Home: undefined
  Resources: undefined
  AiChat: undefined
}

export type AuthTabScreenProps<T extends keyof AuthNavigatorParamList> = CompositeScreenProps<
  BottomTabScreenProps<AuthNavigatorParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<AuthNavigatorParamList>()
export const AuthNavigator = () => {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen name={"Home"} component={HomeScreen} />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
