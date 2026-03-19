import { TextStyle, ViewStyle } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { CopilotProvider } from "react-native-copilot"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { CustomTabBar } from "@/components/CustomTabBar"
import { CheckInProvider } from "@/context/CheckInContext"
import { JournalProvider } from "@/context/JournalContext"
import { AppStackParamList, AppStackScreenProps } from "@/navigators/AppNavigator"
import { ResourcesNavigator, ResourcesStackParamList } from "@/navigators/ResourcesNavigator"
import { ToolsNavigator, ToolsStackParamList } from "@/navigators/ToolsNavigator"
import { SnapshotScreen } from "@/screens/SnapshotScreen"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

import { HomeCheckInNavigator } from "./CheckInNavigator"

export type AuthNavigatorParamList = {
  Home: undefined
  Tools: NavigatorScreenParams<ToolsStackParamList>
  Snapshot: undefined
  Resources: NavigatorScreenParams<ResourcesStackParamList>
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
    <JournalProvider>
      <CheckInProvider>
        <CopilotProvider
        labels={{ skip: "Skip", next: "Next", previous: "Back", finish: "Done" }}
        backdropColor="rgba(0, 0, 0, 0.5)"
      >
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
        <Tab.Screen name="Home" component={HomeCheckInNavigator} />
        <Tab.Screen name="Tools" component={ToolsNavigator} />
        <Tab.Screen name="Snapshot" component={SnapshotScreen} />
        <Tab.Screen name="Resources" component={ResourcesNavigator} />
        </Tab.Navigator>
        </CopilotProvider>
      </CheckInProvider>
    </JournalProvider>
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
