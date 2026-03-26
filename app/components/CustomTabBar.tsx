import React, { useCallback, useEffect } from "react"
import { View, TouchableOpacity, StyleSheet, Dimensions, ViewStyle } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { HomeSimple, OpenBook, ChatLinesSolid, Tools, Brain } from "iconoir-react-native"
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot"

import { Text } from "@/components/Text"
import { useSocket } from "@/context/AIChatContext"
import { useSubscription } from "@/context/InAppSubscriptionContext"
import { usePaywall } from "@/context/PaywallContext"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

const { width } = Dimensions.get("window")

const CopilotBox = walkthroughable(View)

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { themed } = useAppTheme()
  const { unreadCount } = useSocket()
  const { checkForActiveSubscription } = useSubscription()
  const { openPaywall } = usePaywall()
  const { currentStep, visible } = useCopilot()

  // Keep Home mounted so the Goals walkthrough step can measure after Resources tab step.
  useEffect(() => {
    if (visible && currentStep?.name === "resources_tab") {
      navigation.navigate("Home")
    }
  }, [visible, currentStep, navigation])

  const handleNavigateToChat = useCallback(() => {
    if (checkForActiveSubscription()) {
      navigation.navigate("AIChat")
    } else {
      openPaywall({ source: "Chat", onSubscribed: () => navigation.navigate("AIChat") })
    }
  }, [checkForActiveSubscription, navigation, openPaywall])

  return (
    <View style={styles.container}>
      <View style={themed($tabBarBackground)}>
        <View style={themed($cutout)} />
      </View>

      <View style={styles.tabBar}>
        {/* Home Tab */}
        {state.routes.map((route, index) => {
          if (index !== 0) return null

          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <TouchableOpacity key={index} onPress={onPress} style={styles.tab} activeOpacity={0.7}>
              <HomeSimple
                strokeWidth={isFocused ? 2 : 1}
                height={24}
                width={24}
                color={isFocused ? "#212121" : "#8E8E93"}
              />
              <Text style={{ fontSize: 10, lineHeight: 15 }}>{route.name}</Text>
            </TouchableOpacity>
          )
        })}

        {/* Tools Tab (between Home and Chat) */}
        {state.routes.map((route, index) => {
          if (index !== 1) return null
          const isFocused = state.index === index
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              if (checkForActiveSubscription()) {
                navigation.navigate(route.name)
              } else {
                openPaywall({
                  source: "Tools",
                  onSubscribed: () => navigation.navigate(route.name),
                })
              }
            }
          }
          return (
            <CopilotStep
              key={route.key}
              order={4}
              name="tools_tab"
              text="Tools: Journaling and more supportive tools live here."
            >
              <CopilotBox style={styles.tab}>
                <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }} activeOpacity={0.7}>
                  <Tools
                    height={24}
                    width={24}
                    color={isFocused ? "#212121" : "#8E8E93"}
                    strokeWidth={isFocused ? 2 : 1}
                  />
                  <Text style={{ fontSize: 10, lineHeight: 15 }}>{route.name}</Text>
                </TouchableOpacity>
              </CopilotBox>
            </CopilotStep>
          )
        })}

        {/* Center Chat */}
        <CopilotStep
          order={5}
          name="tools_chat"
          text="Tap Chat to talk to Eric anytime."
        >
          <CopilotBox style={styles.centerButton}>
            <TouchableOpacity
              onPress={handleNavigateToChat}
              style={{ alignItems: "center" }}
              activeOpacity={0.7}
            >
              <View style={styles.centerButtonInner}>
                <ChatLinesSolid color="#fff" height={32} width={32} />
                {unreadCount > 0 && <View style={themed($badge)}></View>}
              </View>
              <Text style={{ fontSize: 10, lineHeight: 15, marginTop: 2 }}>Chat</Text>
            </TouchableOpacity>
          </CopilotBox>
        </CopilotStep>

        {/* Snapshot Tab (balance between Chat and Resources) */}
        {state.routes.map((route, index) => {
          if (index !== 2) return null
          const isFocused = state.index === index
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              if (checkForActiveSubscription()) {
                navigation.navigate(route.name)
              } else {
                openPaywall({
                  source: "Snapshot",
                  onSubscribed: () => navigation.navigate(route.name),
                })
              }
            }
          }
          return (
            <CopilotStep
              key={route.key}
              order={6}
              name="snapshot_tab"
              text="Snapshot: See your progress summary and insights in one place."
            >
              <CopilotBox style={styles.tab}>
                <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }} activeOpacity={0.7}>
                  <Brain
                    height={24}
                    width={24}
                    color={isFocused ? "#212121" : "#8E8E93"}
                    strokeWidth={isFocused ? 2 : 1}
                  />
                  <Text style={{ fontSize: 10, lineHeight: 15 }}>{route.name}</Text>
                </TouchableOpacity>
              </CopilotBox>
            </CopilotStep>
          )
        })}

        {/* Resources Tab */}
        {state.routes.map((route, index) => {
          if (index !== 3) return null
          const isFocused = state.index === index
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              if (checkForActiveSubscription()) {
                navigation.navigate(route.name)
              } else {
                openPaywall({
                  source: "Resources",
                  onSubscribed: () => navigation.navigate(route.name),
                })
              }
            }
          }
          return (
            <CopilotStep
              key={route.key}
              order={7}
              name="resources_tab"
              text="Resources: Articles and tools to support your journey."
            >
              <CopilotBox style={styles.tab}>
                <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }} activeOpacity={0.7}>
                  <OpenBook
                    height={24}
                    width={24}
                    color={isFocused ? "#212121" : "#8E8E93"}
                    strokeWidth={isFocused ? 2 : 1}
                  />
                  <Text style={{ fontSize: 10, lineHeight: 15 }}>{route.name}</Text>
                </TouchableOpacity>
              </CopilotBox>
            </CopilotStep>
          )
        })}
      </View>
    </View>
  )
}

const $badge: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: "#FF3B30",
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  position: "absolute",
  right: -5,
  top: -5,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 5,
  borderWidth: 2,
  borderColor: "#fff",
})

const $tabBarBackground: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.isDark ? theme.colors.palette.primary200 : "#fff",
  bottom: 0,
  elevation: 8,
  height: 85,
  left: 0,
  position: "absolute",
  right: 0,
})

const $cutout: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.isDark ? theme.colors.palette.primary200 : "#fff",
  borderColor: theme.isDark ? theme.colors.palette.primary200 : "#fff",
  borderRadius: 40,
  borderWidth: 10,
  height: 80,
  left: width / 2 - 40,
  position: "absolute",
  top: -30,
  width: 80,
})

const styles = StyleSheet.create({
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  centerButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    marginTop: -20,
  },
  centerButtonInner: {
    alignItems: "center",
    backgroundColor: "#212121",
    borderRadius: 30,
    elevation: 8,
    height: 60,
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 60,
  },
  container: {
    position: "relative",
  },

  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",
    height: 85,
    paddingBottom: 10,
  },
})
