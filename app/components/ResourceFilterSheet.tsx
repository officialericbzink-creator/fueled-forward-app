// components/FilterBottomSheet.tsx
import React, { useMemo, forwardRef, useCallback } from "react"
import { View, ViewStyle, TouchableOpacity } from "react-native"
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { resourceCategories, resourceTypes, resources } from "../../lib/mockData/resources"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StrapiResource, StrapiResourceCategory } from "@/services/api/types"

const READ_TIME_OPTIONS = ["5 min", "10 min", "15+ min"] as const

export interface FilterState {
  categories: string[]
  types: string[]
  readTimes: string[]
}

interface FilterBottomSheetProps {
  filters: FilterState
  onApplyFilters: (filters: FilterState) => void
  searchText: string
  category: string
  categories: StrapiResourceCategory[]
  resourcesData: StrapiResource[] | undefined
}

const FilterBottomSheet = forwardRef<BottomSheet, FilterBottomSheetProps>(
  ({ filters, onApplyFilters, searchText, category, resourcesData, categories }, ref) => {
    const snapPoints = useMemo(() => ["50%", "85%"], [])
    const [tempFilters, setTempFilters] = React.useState<FilterState>(filters)
    const insets = useSafeAreaInsets()

    const {
      themed,
      theme: { spacing, colors },
    } = useAppTheme()

    React.useEffect(() => {
      setTempFilters(filters)
    }, [filters])

    // Calculate result count based on temp filters (live preview)
    const resultCount = useMemo(() => {
      if (!resourcesData) return 0

      return resourcesData.filter((resource) => {
        const matchesSearchText = searchText
          ? resource.title.toLowerCase().includes(searchText.toLowerCase()) ||
            resource.summary.toLowerCase().includes(searchText.toLowerCase())
          : true

        const matchesCategory = category === "All" || resource.category.name === category

        const matchesFilterCategory =
          tempFilters.categories.length === 0 ||
          tempFilters.categories.includes(resource.category.name)

        const matchesFilterType =
          tempFilters.types.length === 0 || tempFilters.types.includes(resource.resource_type.name)

        const matchesFilterReadTime =
          tempFilters.readTimes.length === 0 ||
          tempFilters.readTimes.includes(resource.read_time.name)

        return (
          matchesSearchText &&
          matchesCategory &&
          matchesFilterCategory &&
          matchesFilterType &&
          matchesFilterReadTime
        )
      }).length
    }, [tempFilters, searchText, category, resourcesData])

    const handleClearAll = useCallback(() => {
      setTempFilters({
        categories: [],
        types: [],
        readTimes: [],
      })
    }, [])

    const handleToggleCategory = useCallback((category: string) => {
      setTempFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      }))
    }, [])

    const handleToggleType = useCallback((type: string) => {
      setTempFilters((prev) => ({
        ...prev,
        types: prev.types.includes(type)
          ? prev.types.filter((t) => t !== type)
          : [...prev.types, type],
      }))
    }, [])

    const handleToggleReadTime = useCallback((readTime: string) => {
      setTempFilters((prev) => ({
        ...prev,
        readTimes: prev.readTimes.includes(readTime)
          ? prev.readTimes.filter((rt) => rt !== readTime)
          : [...prev.readTimes, readTime],
      }))
    }, [])

    const handleApply = useCallback(() => {
      onApplyFilters(tempFilters)
      ;(ref as any)?.current?.close()
    }, [tempFilters, onApplyFilters, ref])

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
      [],
    )

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.palette.neutral400 }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
        animateOnMount={true}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        topInset={insets.top}
      >
        <BottomSheetScrollView
          contentContainerStyle={themed($contentContainer)}
          showsVerticalScrollIndicator={true}
        >
          {/* Header */}
          <View style={themed($header)}>
            <Text tx="resources:filter.heading" preset="heading" size="lg" />
            <TouchableOpacity onPress={handleClearAll}>
              <Text
                tx="resources:filter.clearText"
                size="xxs"
                style={{ color: colors.palette.primary500 }}
              />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={themed($section)}>
            <Text tx="resources:filter.categoryText" preset="subheading" size="md" />
            <View style={themed($checkboxGroup)}>
              {categories.slice(1).map((category) => (
                <Checkbox
                  key={category.id}
                  label={category.name}
                  value={tempFilters.categories.includes(category.name)}
                  onValueChange={() => handleToggleCategory(category.name)}
                />
              ))}
            </View>
          </View>

          {/* Resource Types */}
          <View style={themed($section)}>
            <Text tx="resources:filter.typeText" preset="subheading" size="md" />
            <View style={themed($checkboxGroup)}>
              {resourceTypes.map((type) => (
                <Checkbox
                  key={type}
                  label={type}
                  value={tempFilters.types.includes(type)}
                  onValueChange={() => handleToggleType(type)}
                />
              ))}
            </View>
          </View>

          {/* Read Time */}
          <View style={themed($section)}>
            <Text tx="resources:filter.readTimeText" preset="subheading" size="md" />
            <View style={themed($checkboxGroup)}>
              {READ_TIME_OPTIONS.map((readTime) => (
                <Checkbox
                  key={readTime}
                  label={readTime}
                  value={tempFilters.readTimes.includes(readTime)}
                  onValueChange={() => handleToggleReadTime(readTime)}
                />
              ))}
            </View>
          </View>

          {/* Footer Button */}
          <View style={themed($footer)}>
            <Button
              text={`See ${resultCount} Result${resultCount !== 1 ? "s" : ""}`}
              onPress={handleApply}
              style={{ width: "100%" }}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    )
  },
)

FilterBottomSheet.displayName = "FilterBottomSheet"

export default FilterBottomSheet

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.xxl,
  backgroundColor: colors.background,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: spacing.xs,
  paddingBottom: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E5E5",
  marginBottom: spacing.md,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $checkboxGroup: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  marginTop: spacing.sm,
})

const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.lg,
  paddingBottom: spacing.md,
  borderTopWidth: 1,
  borderTopColor: "#E5E5E5",
  marginTop: spacing.lg,
})
