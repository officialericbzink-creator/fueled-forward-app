import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { SettingsAccountDeleteScreen } from "@/screens/Settings/SettingsAccountDeleteScreen"
import { SettingsCheckInScreen } from "@/screens/Settings/SettingsCheckInScreen"
import { SettingsConversationScreen } from "@/screens/Settings/SettingsConversation"
import { SettingsMainScreen } from "@/screens/Settings/SettingsMainScreen"
import { SettingsProfileScreen } from "@/screens/Settings/SettingsProfileScreen"
import { SettingsSecurityScreen } from "@/screens/Settings/SettingsSecurity"
import { SettingsSubscriptionScreen } from "@/screens/Settings/SettingsSubscription"
import { WelcomeScreen } from "@/screens/WelcomeScreen"

export type SettingsNavigatorParamList = {
  SettingsMenu: undefined
  SettingsProfile: undefined
  SettingsSubscription: undefined
  SettingsSecurity: undefined
  SettingsConversation: undefined
  SettingsCheckIn: undefined
  SettingsAccountDelete: undefined
}
export type SettingsStackScreenProps<T extends keyof SettingsNavigatorParamList> =
  NativeStackScreenProps<SettingsNavigatorParamList, T>

const Stack = createNativeStackNavigator<SettingsNavigatorParamList>()
export const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMenu" component={SettingsMainScreen} />
      <Stack.Screen name="SettingsProfile" component={SettingsProfileScreen} />
      <Stack.Screen name="SettingsSubscription" component={SettingsSubscriptionScreen} />
      <Stack.Screen name="SettingsSecurity" component={SettingsSecurityScreen} />
      <Stack.Screen name="SettingsConversation" component={SettingsConversationScreen} />
      <Stack.Screen name="SettingsCheckIn" component={SettingsCheckInScreen} />
      <Stack.Screen name="SettingsAccountDelete" component={SettingsAccountDeleteScreen} />
    </Stack.Navigator>
  )
}
