import { FC, useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native"
import { Xmark } from "iconoir-react-native"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-toast-message"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { translate } from "@/i18n/translate"
import { snapshotApi, type SnapshotThemeItem, type UserSnapshot } from "@/services/api"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

/** True if `iso` is on the same local calendar day as `ref` (default: now). */
function isSameLocalCalendarDay(iso: string, ref: Date = new Date()) {
  const d = new Date(iso)
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  )
}

function formatSnapshotDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/** API returns JSON arrays; normalize to { label, why }. */
function parseThemes(raw: unknown): SnapshotThemeItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    if (item && typeof item === "object" && "label" in item) {
      const o = item as Record<string, unknown>
      return {
        label: String(o.label ?? "").trim(),
        why: String(o.why ?? "").trim(),
      }
    }
    if (typeof item === "string") return { label: item.trim(), why: "" }
    return { label: "", why: "" }
  })
}

function ThemeSection({
  headingTx,
  items,
  textDim,
  spacing,
}: {
  headingTx: "snapshot:strugglesHeading" | "snapshot:positivesHeading"
  items: SnapshotThemeItem[]
  textDim: string
  spacing: { xs: number; sm: number; md: number }
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text weight="semiBold" size="md" tx={headingTx} style={{ marginBottom: spacing.sm }} />
      {items.map((item, i) => (
        <View key={`${item.label}-${i}`} style={{ marginBottom: spacing.sm }}>
          <Text size="sm">
            {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
          </Text>
          {item.why ? (
            <Text size="xs" style={{ color: textDim, marginTop: spacing.xs }}>
              {item.why.charAt(0).toUpperCase() + item.why.slice(1)}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  )
}

/**
 * Snapshot tab — AI therapy-prep summary (struggles + positives + history).
 */
export const SnapshotScreen: FC = () => {
  const { themed, theme } = useAppTheme()
  const { colors, spacing } = theme
  const { height: windowHeight } = useWindowDimensions()
  /** Modal sheet max height; scroll area = sheet minus fixed header so content always scrolls inside. */
  const modalMaxHeight = Math.min(windowHeight * 0.88, 720)
  const modalHeaderHeight = 52
  const modalScrollMaxHeight = Math.max(modalMaxHeight - modalHeaderHeight, 200)

  const [snapshots, setSnapshots] = useState<UserSnapshot[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [selected, setSelected] = useState<UserSnapshot | null>(null)

  const loadSnapshots = useCallback(async () => {
    setLoadError(null)
    setLoadingList(true)
    try {
      const data = await snapshotApi.list(50)
      setSnapshots(data)
    } catch {
      setLoadError(translate("snapshot:loadError"))
    } finally {
      setLoadingList(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void loadSnapshots()
    }, [loadSnapshots]),
  )

  useHeader({
    titleTx: "snapshot:title",
    backgroundColor: colors.palette.primary100,
  })

  const hasSnapshotToday = useMemo(
    () => snapshots.some((s) => isSameLocalCalendarDay(s.createdAt)),
    [snapshots],
  )

  const onGenerate = async () => {
    if (hasSnapshotToday) return
    setGenerateError(null)
    setGenerating(true)
    try {
      await snapshotApi.generate()
      Toast.show({
        type: "success",
        text1: translate("snapshot:generateSuccess"),
        text2: translate("snapshot:generateSuccessSub"),
      })
      await loadSnapshots()
    } catch (e) {
      const msg = e instanceof Error ? e.message : translate("snapshot:generateError")
      setGenerateError(msg)
      Toast.show({ type: "error", text1: msg })
    } finally {
      setGenerating(false)
    }
  }

  const renderRow: ListRenderItem<UserSnapshot> = ({ item }) => (
    <TouchableOpacity
      style={themed($historyRow)}
      activeOpacity={0.85}
      onPress={() => setSelected(item)}
    >
      <Text size="sm">{formatSnapshotDate(item.createdAt)}</Text>
      <Text size="xxs" style={{ color: colors.textDim, marginTop: spacing.xs }} tx="snapshot:tapToView" />
    </TouchableOpacity>
  )

  const header = (
    <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
      <Text size="xs" style={{ color: colors.textDim, marginBottom: spacing.md }} tx="snapshot:descriptor" />

      <Button
        preset="reversed"
        tx={
          generating
            ? "snapshot:generating"
            : hasSnapshotToday
              ? "snapshot:generateDoneToday"
              : "snapshot:generateButton"
        }
        onPress={onGenerate}
        disabled={generating || hasSnapshotToday}
        style={{ marginBottom: spacing.sm }}
      />

      {!generating && hasSnapshotToday ? (
        <Text
          size="xxs"
          style={{ color: colors.textDim, marginBottom: spacing.md, textAlign: "center" }}
          tx="snapshot:generateLimitToday"
        />
      ) : null}

      {generating ? (
        <View style={{ alignItems: "center", marginVertical: spacing.sm }}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : null}

      {generateError ? (
        <Text size="xs" style={{ color: colors.error, marginBottom: spacing.md }}>
          {generateError}
        </Text>
      ) : null}

      {loadError ? (
        <Text size="xs" style={{ color: colors.error, marginBottom: spacing.md }}>
          {loadError}
        </Text>
      ) : null}

      {loadingList && snapshots.length === 0 ? (
        <View style={{ paddingVertical: spacing.xl, alignItems: "center" }}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : null}

      {!loadingList && snapshots.length > 0 ? (
        <Text weight="semiBold" size="sm" tx="snapshot:historyHeading" style={{ marginBottom: spacing.sm }} />
      ) : null}

      {!loadingList && snapshots.length === 0 ? (
        <View style={{ paddingVertical: spacing.lg }}>
          <Text centered size="sm" tx="snapshot:emptyHistory" />
          <Text
            centered
            size="xxs"
            style={{ color: colors.textDim, marginTop: spacing.sm }}
            tx="snapshot:emptyHistorySub"
          />
        </View>
      ) : null}
    </View>
  )

  return (
    <>
      <Screen preset="fixed">
        <FlatList
          data={snapshots}
          keyExtractor={(item) => item.id}
          renderItem={renderRow}
          ListHeaderComponent={header}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      </Screen>

      <Modal visible={!!selected} animationType="fade" transparent onRequestClose={() => setSelected(null)}>
        <View style={themed($modalRoot)}>
          <Pressable
            style={[StyleSheet.absoluteFillObject, themed($modalBackdropFill)]}
            onPress={() => setSelected(null)}
            accessibilityRole="button"
            accessibilityLabel={translate("common:cancel")}
          />
          <View style={themed($modalCenter)}>
            <View style={[themed($modalCard), { maxHeight: modalMaxHeight }]}>
              {selected ? (
                <View style={themed($modalSheet)}>
                  <View style={[themed($modalHeader), { minHeight: modalHeaderHeight }]}>
                    <Text weight="semiBold" size="md" tx="snapshot:modalTitle" />
                    <TouchableOpacity
                      onPress={() => setSelected(null)}
                      style={themed($closeBtn)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="button"
                      accessibilityLabel={translate("common:cancel")}
                    >
                      <Xmark width={24} height={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    style={{ maxHeight: modalScrollMaxHeight }}
                    contentContainerStyle={{
                      paddingBottom: spacing.xl,
                      paddingHorizontal: spacing.xs,
                    }}
                    showsVerticalScrollIndicator
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    bounces
                  >
                    <Text size="xs" style={{ color: colors.textDim, marginBottom: spacing.md }}>
                      {formatSnapshotDate(selected.createdAt)}
                    </Text>
                    <ThemeSection
                      headingTx="snapshot:strugglesHeading"
                      items={parseThemes(selected.struggles)}
                      textDim={colors.textDim}
                      spacing={spacing}
                    />
                    <ThemeSection
                      headingTx="snapshot:positivesHeading"
                      items={parseThemes(selected.positives)}
                      textDim={colors.textDim}
                      spacing={spacing}
                    />
                    {/* {selected.contextDigest ? (
                      <View style={{ marginTop: spacing.sm }}>
                        <Text
                          weight="semiBold"
                          size="sm"
                          tx="snapshot:overviewHeading"
                          style={{ marginBottom: spacing.xs }}
                        />
                        <Text size="xs" style={{ color: colors.textDim }}>
                          {selected.contextDigest}
                        </Text>
                      </View>
                    ) : null} */}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const $historyRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

const $modalRoot: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $modalBackdropFill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.overlay70,
})

const $modalCenter: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
  pointerEvents: "box-none",
})

const $modalCard: ThemedStyle<ViewStyle> = () => ({
  width: "95%",
  maxWidth: 420,
})

const $modalSheet: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: "100%",
  borderRadius: spacing.md,
  backgroundColor: colors.background,
  overflow: "hidden",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xs,
})

const $modalHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
})

const $closeBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  marginRight: -spacing.xs,
})
