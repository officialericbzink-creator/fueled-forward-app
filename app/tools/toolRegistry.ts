import type { TxKeyPath } from "@/i18n"
import type { ToolsStackParamList } from "@/navigators/ToolsNavigator"

export type ToolId = "journaling"

export type ToolEntryScreen = "ToolsHome" | "JournalList"

export interface RegisteredTool {
  id: ToolId
  titleKey: TxKeyPath
  subtitleKey: TxKeyPath
  screen: ToolEntryScreen
}

export const REGISTERED_TOOLS: RegisteredTool[] = [
  {
    id: "journaling",
    titleKey: "tools:journaling.title",
    subtitleKey: "tools:journaling.subtitle",
    screen: "JournalList",
  },
]
