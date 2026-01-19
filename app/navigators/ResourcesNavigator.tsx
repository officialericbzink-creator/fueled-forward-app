import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { ResourceDetailsScreen } from "@/screens/Resources/ResourceDetailsScreen"
import { ResourcesHomeScreen } from "@/screens/Resources/ResourcesHomeScreen"

export type ResourcesStackParamList = {
  ResourcesHome: undefined
  ResourceDetails: { resourceId: string }
}

export type ResourcesStackScreenProps<T extends keyof ResourcesStackParamList> =
  NativeStackScreenProps<ResourcesStackParamList, T>

const Stack = createNativeStackNavigator<ResourcesStackParamList>()
export const ResourcesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false }}
    >
      <Stack.Screen name={"ResourcesHome"} component={ResourcesHomeScreen} />
      <Stack.Screen name={"ResourceDetails"} component={ResourceDetailsScreen} />
    </Stack.Navigator>
  )
}
