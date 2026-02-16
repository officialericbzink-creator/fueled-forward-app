import { FC } from "react"
import { TextStyle, View, ViewStyle, ActivityIndicator, Pressable, Linking } from "react-native"
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

      {/* Header Section */}
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

      {/* Article Content */}
      <Markdown>{resource.content}</Markdown>

      {/* Citations and Sources */}
      <View style={themed($sourcesContainer)}>
        <Text size="md" weight="semiBold">
          Medical & Health Information Sources
        </Text>
        <Text size="xs" style={{ marginTop: spacing.sm, color: colors.textDim }}>
          Content in this section is informed by the following trusted sources:
        </Text>

        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <SourceLink
            name="National Institute of Mental Health (NIMH)"
            url="https://www.nimh.nih.gov"
          />
          <SourceLink
            name="NAMI (National Alliance on Mental Illness)"
            url="https://www.nami.org"
          />
          <SourceLink name="Psych Central" url="https://psychcentral.com" />
          <SourceLink name="ChatGPT (OpenAI)" />
          <SourceLink name="Lived Experience & Personal Insights" url="https://ericbzink.com" />
        </View>

        <Text
          size="xxs"
          style={{ marginTop: spacing.md, color: colors.textDim, fontStyle: "italic" }}
        >
          This information is for educational purposes and is not a substitute for professional
          medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
          qualified health provider.
        </Text>
      </View>
      <View style={{ height: spacing.xl }}></View>
    </Screen>
  )
}

const SourceLink = ({ name, url }: { name: string; url?: string }) => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  if (url) {
    return (
      <Pressable onPress={() => Linking.openURL(url)}>
        <Text size="xs" style={{ color: colors.tint }}>
          • {name} ↗
        </Text>
      </Pressable>
    )
  }

  return (
    <Text size="xs" style={{ color: colors.text }}>
      • {name}
    </Text>
  )
}

const $sourcesContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xxl,
  padding: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.border,
})

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
