import React, { FC, useRef, useMemo, useCallback, useEffect } from "react"
import { FlatList, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Filter, Search } from "iconoir-react-native"
import BottomSheet, { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { Card } from "@/components/Card"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ResourcesStackScreenProps } from "@/navigators/ResourcesNavigator"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { ThemedStyle } from "@/theme/types"

import FilterBottomSheet, { FilterState } from "@/components/ResourceFilterSheet"
import { resourceTypeColors } from "@/utils/constants"
import { useGetResources } from "@/hooks/resources/get-resource-list"
import { useGetResourceCategories } from "@/hooks/resources/get-resource-categories"

interface ResourcesHomeScreenProps extends ResourcesStackScreenProps<"ResourcesHome"> {}

export const ResourcesHomeScreen: FC<ResourcesHomeScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState("")
  const [category, setCategory] = React.useState("All")
  const [filters, setFilters] = React.useState<FilterState>({
    categories: [],
    types: [],
    readTimes: [],
  })

  const {
    data: resourcesData,
    isLoading: resourcesLoading,
    // isError: resourcesError,
  } = useGetResources()
  const {
    data: categories,
    // isLoading: categoriesLoading,
    // isError: categoriesError,
  } = useGetResourceCategories()

  // const isLoading = resourcesLoading || categoriesLoading
  // const isError = resourcesError || categoriesError

  const bottomSheetRef = useRef<BottomSheet>(null)

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  // Check if any filters are active (excluding "All" category selection)
  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 || filters.types.length > 0 || filters.readTimes.length > 0
  }, [filters])

  // Filter resources based on search text, category, and advanced filters
  const filteredResources = useMemo(() => {
    if (!resourcesData) return []

    return resourcesData.filter((resource) => {
      // Search filter
      const matchesSearchText = searchText
        ? resource.title.toLowerCase().includes(searchText.toLowerCase()) ||
          resource.summary.toLowerCase().includes(searchText.toLowerCase())
        : true

      // Category filter (from tabs)
      const matchesCategory = category === "All" || resource.category.name === category

      // Advanced filters (from bottom sheet)
      const matchesFilterCategory =
        filters.categories.length === 0 || filters.categories.includes(resource.category.name)

      const matchesFilterType =
        filters.types.length === 0 || filters.types.includes(resource.resource_type.name)

      const matchesFilterReadTime =
        filters.readTimes.length === 0 || filters.readTimes.includes(resource.read_time.name)

      return (
        matchesSearchText &&
        matchesCategory &&
        matchesFilterCategory &&
        matchesFilterType &&
        matchesFilterReadTime
      )
    })
  }, [resourcesData, searchText, category, filters])

  const handleOpenFilters = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Screen
          safeAreaEdges={["top"]}
          preset="fixed"
          contentContainerStyle={themed($screenContentContainer)}
        >
          {/* Search and Filter - Fixed at top */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              alignItems: "center",
              width: "100%",
              paddingTop: spacing.xs,
              paddingHorizontal: spacing.sm,
            }}
          >
            <TextField
              containerStyle={{ flex: 1, width: "100%" }}
              inputWrapperStyle={{ alignItems: "center" }}
              style={{ fontSize: 12 }}
              placeholderTx="resources:searchPlaceholderText"
              onChangeText={setSearchText}
              LeftAccessory={() => (
                <Search
                  width={24}
                  height={24}
                  color={colors.palette.primary500}
                  style={{ marginLeft: 12 }}
                />
              )}
            />
            <TouchableOpacity onPress={handleOpenFilters} style={{ position: "relative" }}>
              <Filter height={32} width={32} color={"#212121"} />
              {hasActiveFilters && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.palette.error500,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Category tabs - Fixed below search */}
          {categories && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              snapToAlignment={"start"}
              style={{ width: "100%", maxHeight: 40 }}
              contentContainerStyle={{ paddingHorizontal: spacing.sm, flexGrow: 0, flexShrink: 0 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity key={"All"} onPress={() => setCategory("All")}>
                  <Text
                    style={
                      category === "All"
                        ? {
                            paddingHorizontal: spacing.sm,
                            backgroundColor: colors.palette.neutral200,
                            borderBottomColor: colors.palette.neutral800,
                            fontSize: 12,
                            borderBottomWidth: 2,
                            color: colors.palette.primary700,
                          }
                        : {
                            paddingHorizontal: spacing.sm,
                            fontSize: 12,
                            borderBottomWidth: 2,
                            borderBottomColor: colors.palette.neutral200,
                            backgroundColor: colors.palette.neutral200,
                            color: colors.palette.primary500,
                          }
                    }
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {categories.map((resource) => (
                  <TouchableOpacity key={resource.name} onPress={() => setCategory(resource.name)}>
                    <Text
                      style={
                        category === resource.name
                          ? {
                              paddingHorizontal: spacing.sm,
                              backgroundColor: colors.palette.neutral200,
                              borderBottomColor: colors.palette.neutral800,
                              fontSize: 12,
                              borderBottomWidth: 2,
                              color: colors.palette.primary700,
                            }
                          : {
                              paddingHorizontal: spacing.sm,
                              fontSize: 12,
                              borderBottomWidth: 2,
                              borderBottomColor: colors.palette.neutral200,
                              backgroundColor: colors.palette.neutral200,
                              color: colors.palette.primary500,
                            }
                      }
                    >
                      {resource.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* FlatList - Takes remaining space and scrolls */}
          <FlatList
            data={filteredResources}
            contentContainerStyle={{
              backgroundColor: colors.palette.primary100,
              gap: spacing.sm,
              paddingBottom: spacing.xl,
            }}
            style={{
              backgroundColor: colors.palette.primary100,
              paddingHorizontal: spacing.sm,
              width: "100%",
              flex: 1,
            }}
            ListHeaderComponent={() => <Text tx="resources:screenHeading" />}
            ListEmptyComponent={() => (
              <EmptyState
                title={resourcesLoading ? "Loading..." : "No resources found"}
                message={resourcesLoading ? "Please wait" : "Try adjusting your search or filters"}
              />
            )}
            keyExtractor={(el) => el.documentId}
            renderItem={(item) => (
              <Card
                onPress={() =>
                  navigation.navigate({
                    name: "ResourceDetails",
                    params: { resourceId: item.item.documentId },
                  })
                }
                style={{ padding: spacing.sm }}
                HeadingComponent={
                  <Text size={"xs"} weight={"semiBold"} style={{ marginBottom: spacing.xs }}>
                    {item.item.title}
                  </Text>
                }
                ContentComponent={
                  <Text size={"xxs"} weight={"light"} style={{ marginBottom: spacing.xs }}>
                    {item.item.summary}
                  </Text>
                }
                FooterComponent={
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={[
                        themed($resourceTypeBadge),
                        {
                          backgroundColor:
                            colors.palette[
                              resourceTypeColors[item.item.resource_type.name]?.bg || "primary100"
                            ],
                        },
                      ]}
                    >
                      <Text
                        text={item.item.resource_type.name}
                        size="xxs"
                        style={[
                          themed($resourceTypeBadgeText),
                          {
                            color:
                              colors.palette[
                                resourceTypeColors[item.item.resource_type.name]?.text ||
                                  "primary600"
                              ],
                          },
                        ]}
                      />
                    </View>
                    <Text size="xxs" text={`${item.item.read_time.name} read`} />
                  </View>
                }
              />
            )}
          />
        </Screen>

        <FilterBottomSheet
          ref={bottomSheetRef}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          searchText={searchText}
          category={category}
          categories={categories || []}
          resourcesData={resourcesData}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
}

export const EmptyState: FC<EmptyStateProps> = ({
  title = "No Results Found",
  message = "Try adjusting your search or filters",
  icon,
}) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      {icon}
      <Text text={title} preset="subheading" size="md" style={themed($title)} />
      <Text text={message} size="sm" style={themed($message)} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xxl,
})

const $title: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  marginBottom: spacing.xs,
  textAlign: "center",
})

const $message: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  gap: spacing.md,
})

const $resourceTypeBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  borderRadius: 4,
})

const $resourceTypeBadgeText: ThemedStyle<TextStyle> = ({ colors }) => ({})
