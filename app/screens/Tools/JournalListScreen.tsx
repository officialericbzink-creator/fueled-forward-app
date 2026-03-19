import { FC, useCallback, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Xmark } from "iconoir-react-native"
import { useFocusEffect } from "@react-navigation/native"

import { Card } from "@/components/Card"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useJournal } from "@/context/JournalContext"
import { TxKeyPath } from "@/i18n"
import { ToolsStackScreenProps } from "@/navigators/ToolsNavigator"
import type { JournalEntry, JournalEntryType } from "@/services/api/entries-api"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

const NEW_ENTRY_OPTIONS: { type: JournalEntryType; labelKey: "journal:newEntryModal.optionJournalEntry" | "journal:newEntryModal.optionActivityLog" | "journal:newEntryModal.optionVent" }[] = [
  { type: "journal_entry", labelKey: "journal:newEntryModal.optionJournalEntry" },
  { type: "activity_log", labelKey: "journal:newEntryModal.optionActivityLog" },
  { type: "vent", labelKey: "journal:newEntryModal.optionVent" },
]

function formatEntryDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const ENTRY_TYPE_LABELS: Record<string, TxKeyPath> = {
  journal_entry: "journal:newEntryModal.optionJournalEntry",
  activity_log: "journal:newEntryModal.optionActivityLog",
  vent: "journal:newEntryModal.optionVent",
}

export const JournalListScreen: FC<ToolsStackScreenProps<"JournalList">> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()
  const { colors, spacing } = theme
  const { entries, isLoading, refreshAll } = useJournal()
  const [newOptionsModalVisible, setNewOptionsModalVisible] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  useFocusEffect(
    useCallback(() => {
      void refreshAll()
    }, [refreshAll]),
  )

  const openEditor = (entryType: JournalEntryType) => {
    setNewOptionsModalVisible(false)
    navigation.navigate("JournalEditor", { entryType })
  }

  useHeader({
    titleTx: "journal:listScreen.title",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    rightTx: "journal:listScreen.newButton",
    onRightPress: () => setNewOptionsModalVisible(true),
    backgroundColor: colors.palette.primary100,
  })

  const renderItem = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      style={themed($item)}
      activeOpacity={0.85}
      onPress={() => setSelectedEntry(item)}
    >
      <Text weight="semiBold" size="sm" numberOfLines={2}>
        {item.summary}
      </Text>
      <Text size="xxs" style={{ color: colors.textDim, marginTop: spacing.xs }}>
        {formatEntryDate(item.createdAt)}
      </Text>
    </TouchableOpacity>
  )

  return (
    <>
      <Screen preset="fixed">
        {isLoading && entries.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator color={colors.text} />
          </View>
        ) : entries.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", padding: spacing.lg }}>
            <Text centered size="sm" tx="journal:listScreen.emptyText" />
            <Text
              centered
              size="xxs"
              style={{ color: colors.textDim, marginTop: spacing.sm }}
              tx="journal:listScreen.emptySubText"
            />
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}
          />
        )}
      </Screen>

      <Modal visible={newOptionsModalVisible} animationType="fade" transparent>
        <Pressable
          style={themed($modalBackdrop)}
          onPress={() => setNewOptionsModalVisible(false)}
        >
          <Card
            style={themed($modalCard)}
            HeadingComponent={
              <View style={themed($centeredSpacedRow)}>
                <Text size="sm" weight="semiBold" tx="journal:newEntryModal.title" />
                <Pressable onPress={() => setNewOptionsModalVisible(false)}>
                  <Xmark width={24} height={24} color={colors.text} />
                </Pressable>
              </View>
            }
            ContentComponent={
              <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
                {NEW_ENTRY_OPTIONS.map((o) => (
                  <TouchableOpacity
                    key={o.type}
                    style={themed($option)}
                    activeOpacity={0.85}
                    onPress={() => openEditor(o.type)}
                  >
                    <Text weight="medium" size="sm" tx={o.labelKey} />
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
        </Pressable>
      </Modal>

      <Modal visible={!!selectedEntry} animationType="fade" transparent>
        <View style={themed($modalBackdrop)}>
          {selectedEntry && (
            <>
              <Pressable
                style={StyleSheet.absoluteFillObject}
                onPress={() => setSelectedEntry(null)}
              />
              <View style={themed($detailsModalWrapper)} pointerEvents="box-none">
                <Card
                  style={themed($detailsModalCard)}
                  HeadingComponent={
                    <View style={themed($detailsModalHeader)}>
                      <View style={themed($detailsModalHeaderTop)}>
                        <Text size="md" weight="semiBold" tx="journal:detailsModal.title" />
                        <Pressable
                          onPress={() => setSelectedEntry(null)}
                          style={themed($detailsModalCloseBtn)}
                          hitSlop={12}
                        >
                          <Xmark width={24} height={24} color={colors.text} />
                        </Pressable>
                      </View>
                      <Text
                        size="xs"
                        style={{ color: colors.textDim, marginTop: spacing.xs }}
                        tx={(ENTRY_TYPE_LABELS[selectedEntry.type] ?? "journal:editor.titleFallback") as TxKeyPath}
                      />
                      <Text
                        size="xs"
                        style={{ color: colors.textDim, marginTop: 2 }}
                        text={formatEntryDate(selectedEntry.createdAt)}
                      />
                    </View>
                  }
                  ContentComponent={
                    <ScrollView
                      style={themed($detailsScroll)}
                      contentContainerStyle={themed($detailsScrollContent)}
                      showsVerticalScrollIndicator={true}
                      bounces={true}
                      overScrollMode="always"
                    >
                    {selectedEntry.summary ? (
                      <View style={{ marginBottom: spacing.md, marginTop: spacing.md }}>
                        <Text size="sm" weight="semiBold" tx="journal:detailsModal.summaryLabel" />
                        <Text size="sm" style={{ marginTop: spacing.xs }}>{selectedEntry.summary}</Text>
                      </View>
                    ) : null}
                    <View style={{ marginBottom: spacing.md }}>
                      <Text size="sm" weight="semiBold" tx="journal:detailsModal.contentLabel" />
                      <Text size="sm" style={{ marginTop: spacing.xs }}>{selectedEntry.content}</Text>
                    </View>
                    {/* {selectedEntry.insights &&
                      typeof selectedEntry.insights === "object" &&
                      Object.keys(selectedEntry.insights).length > 0 && (
                        <View>
                          <Text size="sm" weight="semiBold" tx="journal:detailsModal.insightsLabel" />
                          <View style={{ marginTop: spacing.xs, gap: spacing.xs }}>
                            {(selectedEntry.insights as { emotions?: string[] }).emotions?.length ? (
                              <Text size="sm" style={{ color: colors.textDim }}>
                                {(selectedEntry.insights as { emotions?: string[] }).emotions?.join(", ")}
                              </Text>
                            ) : null}
                            {(selectedEntry.insights as { sentiment?: string }).sentiment ? (
                              <Text size="sm" style={{ color: colors.textDim }}>
                                {(selectedEntry.insights as { sentiment?: string }).sentiment}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      )} */}
                    </ScrollView>
                  }
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  )
}

const $item: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  marginBottom: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})

const $centeredSpacedRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: spacing.sm,
})

const $modalBackdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
  backgroundColor: colors.palette.overlay70,
})

const $modalCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  width: "100%",
  maxWidth: 320,
})

const $option: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})

const $detailsModalWrapper: ThemedStyle<ViewStyle> = () => ({
  width: "95%",
  maxWidth: 420,
  maxHeight: "90%",
})

const $detailsModalCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  padding: spacing.md,
})

const $detailsModalHeader: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
})

const $detailsModalHeaderTop: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
})

const $detailsModalCloseBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  marginRight: -spacing.xs,
})

const $detailsScroll: ThemedStyle<ViewStyle> = () => ({
  minHeight: 200,
  maxHeight: 440,
})

const $detailsScrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
  flexGrow: 1,
})
