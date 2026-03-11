import React, { FC, useRef, useMemo, useCallback, useEffect } from "react"
import { ActivityIndicator, FlatList, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import BottomSheet, { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { Filter, Search } from "iconoir-react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import FilterBottomSheet, { FilterState } from "@/components/ResourceFilterSheet"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { useGetProfile } from "@/hooks/profile/get-profile"
import { useGetResourceCategories } from "@/hooks/resources/get-resource-categories"
import { useGetResources } from "@/hooks/resources/get-resource-list"
import { ResourcesStackScreenProps } from "@/navigators/ResourcesNavigator"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { ThemedStyle } from "@/theme/types"
import { resourceTypeColors } from "@/utils/constants"

interface ResourcesHomeScreenProps extends ResourcesStackScreenProps<"ResourcesHome"> {}

const RECOMMENDED_TAB = "__recommended__"
const PAGE_SIZE = 25

export const ResourcesHomeScreen: FC<ResourcesHomeScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState("")
  const [debouncedSearchText, setDebouncedSearchText] = React.useState("")
  const [category, setCategory] = React.useState<string>(RECOMMENDED_TAB)
  const [filters, setFilters] = React.useState<FilterState>({
    categories: [],
    types: [],
    readTimes: [],
  })

  const { user } = useAuth()
  const { data: profileData } = useGetProfile(user?.id || "")

  const {
    resources,
    data: resourcesPages,
    isLoading: resourcesLoading,
    refetch: refetchResources,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // isError: resourcesError,
  } = useGetResources(
    useMemo(() => {
      const rawStruggles = profileData?.profile?.struggles ?? []
      const recommendedCategories = rawStruggles.filter(Boolean)

      const tabCategories =
        category === RECOMMENDED_TAB
          ? recommendedCategories.length > 0
            ? recommendedCategories
            : undefined
          : [category]

      // Intersect tab categories with filter-sheet categories (if any)
      const effectiveCategories = (() => {
        if (filters.categories.length === 0) return tabCategories
        if (!tabCategories) return filters.categories
        const intersection = tabCategories.filter((c) => filters.categories.includes(c))
        // If the user has both filters active but they don't overlap, we should return 0 results
        // (not "all resources"). We do that by querying a category that won't exist.
        return intersection.length > 0 ? intersection : ["__no_match__"]
      })()

      return {
        search: debouncedSearchText,
        categories: effectiveCategories,
        types: filters.types,
        readTimes: filters.readTimes,
        pageSize: PAGE_SIZE,
      }
    }, [profileData?.profile?.struggles, category, filters.categories, filters.types, filters.readTimes, debouncedSearchText]),
  )
  const {
    data: categories,
    // isLoading: categoriesLoading,
    // isError: categoriesError,
  } = useGetResourceCategories()

  // const isLoading = resourcesLoading || categoriesLoading
  // const isError = resourcesError || categoriesError

  const bottomSheetRef = useRef<BottomSheet>(null)
  const listRef = useRef<FlatList>(null)
  const didMountRef = useRef(false)

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchText(searchText), 250)
    return () => clearTimeout(t)
  }, [searchText])

  // Check if any filters are active (excluding "All" category selection)
  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 || filters.types.length > 0 || filters.readTimes.length > 0
  }, [filters])

  // Explicitly refetch on tab switching and reset scroll position
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
    refetchResources()
  }, [category, refetchResources])

  // When filters/search change, reset scroll so it’s obvious results updated.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [debouncedSearchText, filters])

  const handleOpenFilters = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [])

  const lastPageCount =
    resourcesPages?.pages?.[resourcesPages.pages.length - 1]?.data?.length ?? 0
  const canLoadMore = Boolean(hasNextPage) || lastPageCount === PAGE_SIZE

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
                <TouchableOpacity key={"Recommended"} onPress={() => setCategory(RECOMMENDED_TAB)}>
                  <Text
                    style={
                      category === RECOMMENDED_TAB
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
                    Recommended
                  </Text>
                </TouchableOpacity>
                {categories
                  .filter((c) => c.name.trim().toLowerCase() !== "all")
                  .map((resource) => (
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
            ref={listRef}
            data={resources}
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
            ListFooterComponent={() => {
              if (isFetchingNextPage) {
                return (
                  <View style={{ paddingVertical: spacing.md }}>
                    <ActivityIndicator />
                  </View>
                )
              }
              if (!canLoadMore) {
                return (
                  <View style={{ paddingVertical: spacing.md, alignItems: "center" }}>
                    <Text size="xxs" text={`Showing ${resources.length}`} />
                  </View>
                )
              }
              return (
                <View style={{ paddingVertical: spacing.md, gap: spacing.xs }}>
                  <Text size="xxs" text={`Showing ${resources.length}`} />
                  <Button text="See more" onPress={() => fetchNextPage()} />
                </View>
              )
            }}
            keyExtractor={(el) => el.documentId}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (canLoadMore && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
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
          resourcesData={resources}
          recommendedCategories={profileData?.profile?.struggles ?? []}
          recommendedTabKey={RECOMMENDED_TAB}
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
