import { FC } from "react"
import { TextStyle, View, ViewStyle, ActivityIndicator } from "react-native"
import Markdown from "react-native-markdown-display"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useGetResource } from "@/hooks/resources/get-resource-details"
import { ResourcesStackScreenProps } from "@/navigators/ResourcesNavigator"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { ThemedStyle } from "@/theme/types"
import { resourceTypeColors } from "@/utils/constants"
import { useHeader } from "@/utils/useHeader"

interface ResourceDetailsScreenProps extends ResourcesStackScreenProps<"ResourceDetails"> {}

export const ResourceDetailsScreen: FC<ResourceDetailsScreenProps> = ({ navigation, route }) => {
  const {
    params: { resourceId },
  } = route

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const { data: resource, isLoading, isError } = useGetResource(resourceId)

  useHeader({
    backgroundColor: colors.palette.primary100,
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  })

  if (isLoading) {
    return (
      <Screen contentContainerStyle={{ flex: 1 }} style={themed($root)} preset="fixed">
        <View style={themed($centerContainer)}>
          <ActivityIndicator size="large" color={colors.palette.primary500} />
        </View>
      </Screen>
    )
  }

  if (isError || !resource) {
    return (
      <Screen style={themed($root)} preset="fixed">
        <EmptyState
          heading="We couldn't load this resource. Please try again."
          button="Go back to resources"
          buttonOnPress={navigation.goBack}
          content=""
        />
      </Screen>
    )
  }

  return (
    <Screen style={themed($root)} preset="auto">
      <Text text={resource.title} size={"xl"} weight={"bold"} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
          marginVertical: spacing.sm,
        }}
      >
        <View
          style={[
            themed($resourceTypeBadge),
            {
              backgroundColor:
                colors.palette[resourceTypeColors[resource.resource_type.name]?.bg || "primary100"],
            },
          ]}
        >
          <Text
            text={resource.resource_type.name}
            size="xxs"
            style={[
              themed($resourceTypeBadgeText),
              {
                color:
                  colors.palette[
                    resourceTypeColors[resource.resource_type.name]?.text || "primary600"
                  ],
              },
            ]}
          />
        </View>
        <Text size="xxs" text={`${resource.read_time.name} read`} />
      </View>
      <Text
        text={resource.summary}
        size="xxs"
        style={{ marginVertical: spacing.lg, color: colors.palette.primary500 }}
      />
      <Markdown>{resource.content}</Markdown>
      <View style={{ height: spacing.xl }}></View>
    </Screen>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.sm,
  paddingBottom: spacing.xl,
})

const $centerContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $resourceTypeBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  borderRadius: 4,
})

const $resourceTypeBadgeText: ThemedStyle<TextStyle> = () => ({})
