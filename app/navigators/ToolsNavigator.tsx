import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { JournalEditorScreen } from "@/screens/Tools/JournalEditorScreen"
import { JournalListScreen } from "@/screens/Tools/JournalListScreen"
import { ToolsHomeScreen } from "@/screens/Tools/ToolsHomeScreen"
import type { JournalEntryType } from "@/services/api/entries-api"

export type ToolsStackParamList = {
  ToolsHome: undefined
  JournalList: undefined
  JournalEditor: { entryType: JournalEntryType }
}

export type ToolsStackScreenProps<T extends keyof ToolsStackParamList> = NativeStackScreenProps<
  ToolsStackParamList,
  T
>

const Stack = createNativeStackNavigator<ToolsStackParamList>()

export const ToolsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ToolsHome"
      screenOptions={{ contentStyle: { backgroundColor: "transparent" }, headerShown: false }}
    >
      <Stack.Screen name="ToolsHome" component={ToolsHomeScreen} />
      <Stack.Screen name="JournalList" component={JournalListScreen} />
      <Stack.Screen name="JournalEditor" component={JournalEditorScreen} />
    </Stack.Navigator>
  )
}
