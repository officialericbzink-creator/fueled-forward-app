import React, { useCallback } from "react"
import { View, TouchableOpacity, StyleSheet, Dimensions, ViewStyle } from "react-native"
import { HomeSimple, OpenBook, ChatLinesSolid } from "iconoir-react-native"
import { Text } from "@/components/Text"
import { useSocket } from "@/context/AIChatContext"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useSubscription } from "@/context/InAppSubscriptionContext"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

const { width } = Dimensions.get("window")

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { themed } = useAppTheme()
  const { unreadCount } = useSocket()
  const { checkForActiveSubscription } = useSubscription()

  const handleNavigateToChat = useCallback(() => {
    if (checkForActiveSubscription()) {
      navigation.navigate("AIChat")
    } else {
      navigation.navigate("SettingsMain", { screen: "SettingsSubscription" })
    }
  }, [checkForActiveSubscription, navigation])

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

        {/* Center AI Chat Button */}
        <TouchableOpacity
          onPress={handleNavigateToChat}
          style={styles.centerButton}
          activeOpacity={0.7}
        >
          <View style={styles.centerButtonInner}>
            <ChatLinesSolid color="#fff" height={32} width={32} />
            {unreadCount > 0 && <View style={themed($badge)}></View>}
          </View>
        </TouchableOpacity>

        {/* Resources Tab */}
        {state.routes.map((route, index) => {
          if (index !== 1) return null

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
              <OpenBook
                height={24}
                width={24}
                color={isFocused ? "#212121" : "#8E8E93"}
                strokeWidth={isFocused ? 2 : 1}
              />
              <Text style={{ fontSize: 10, lineHeight: 15 }}>{route.name}</Text>
            </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 60,
    position: "relative",
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
