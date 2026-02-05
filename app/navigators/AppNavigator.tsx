/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { ComponentProps } from "react"
import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
  LinkingOptions,
  getStateFromPath,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import * as Linking from "expo-linking"
import { useEffect } from "react"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { AuthNavigator, AuthNavigatorParamList } from "@/navigators/AuthNavigator"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { LoginScreen } from "@/screens/LoginScreen"
import { SignUpScreen } from "@/screens/SignUpScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { useAppTheme } from "@/theme/context"

import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { AIChatScreen } from "@/screens/ChatScreen"
import { EmailVerificationScreen } from "@/screens/EmailVerificationScreen"
import { SettingsNavigator, SettingsNavigatorParamList } from "./SettingsNavigator"
import { OnboardingScreen } from "@/screens/OnboardingScreen"

const prefix = Linking.createURL("/")

const linking: LinkingOptions<AppStackParamList> = {
  prefixes: [prefix],
  config: {
    screens: {
      Welcome: "welcome",
      Login: "login",
      SignUp: "signup",
      EmailVerification: "verify-email",
    },
    initialRouteName: "Welcome",
  },
}

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  // 🔥 Your screens go here
  Login: undefined
  SignUp: undefined
  Auth: NavigatorScreenParams<AuthNavigatorParamList>
  AIChat: undefined
  Onboarding: undefined
  EmailVerification: { token?: string; email?: string }
  SettingsMain: NavigatorScreenParams<SettingsNavigatorParamList>
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const {
    theme: { colors },
  } = useAppTheme()

  if (isLoading) {
    return null
  }

  // const emailVerified = user?.emailVerified ?? false
  // const completedOnboarding = user?.completedOnboarding ?? false

  return (
    <Stack.Navigator
      key={isAuthenticated ? "authenticated" : "unauthenticated"}
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.palette.primary100,
        },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        </>
      ) : isAuthenticated && !user?.completedOnboarding ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="AIChat" component={AIChatScreen} />
          <Stack.Screen name="SettingsMain" component={SettingsNavigator} />
        </>
      )}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer linking={linking} ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
