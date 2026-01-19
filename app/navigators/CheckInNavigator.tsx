import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { CheckInScreen } from "@/screens/CheckInScreen"
import { HomeScreen } from "@/screens/HomeScreen"

export type HomeCheckInStackParamList = {
  HomeDashboard: undefined
  CheckIn: undefined
}

export type HomeCheckInStackScreenProps<T extends keyof HomeCheckInStackParamList> =
  NativeStackScreenProps<HomeCheckInStackParamList, T>

const Stack = createNativeStackNavigator<HomeCheckInStackParamList>()
export const HomeCheckInNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false }}
    >
      <Stack.Screen name={"HomeDashboard"} component={HomeScreen} />
      <Stack.Screen name={"CheckIn"} component={CheckInScreen} />
    </Stack.Navigator>
  )
}
