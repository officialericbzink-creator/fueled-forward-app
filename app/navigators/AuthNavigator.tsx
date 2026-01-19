import { TextStyle, ViewStyle } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { CustomTabBar } from "@/components/CustomTabBar"
import { AppStackParamList, AppStackScreenProps } from "@/navigators/AppNavigator"
import { ResourcesNavigator, ResourcesNavigatorParamList } from "@/navigators/ResourcesNavigator"
import { HomeScreen } from "@/screens/HomeScreen"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { CheckInProvider } from "@/context/CheckInContext"
import { HomeCheckInNavigator } from "./CheckInNavigator"
import { AIChatScreen } from "@/screens/ChatScreen"

export type AuthNavigatorParamList = {
  Home: undefined
  // AIChat: undefined
  Resources: NavigatorScreenParams<ResourcesNavigatorParamList>
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
    <CheckInProvider>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.text,
          tabBarLabelStyle: themed($tabBarLabel),
          tabBarItemStyle: themed($tabBarItem),
          sceneStyle: {
            backgroundColor: colors.palette.primary100,
          },
        }}
      >
        <Tab.Screen name={"Home"} component={HomeCheckInNavigator} />
        {/*<Tab.Screen
          name={"AIChat"}
          component={AIChatScreen}
          options={{
            tabBarStyle: { display: "none" }, // Hide tab bar on this screen only
          }}
        />*/}
        <Tab.Screen name={"Resources"} component={ResourcesNavigator} />
      </Tab.Navigator>
    </CheckInProvider>
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
