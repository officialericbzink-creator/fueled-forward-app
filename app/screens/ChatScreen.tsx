import { FC, useEffect, useState, useRef } from "react"
import { Screen } from "@/components/Screen"
import { useHeader } from "@/utils/useHeader"
import { useAppTheme } from "@/theme/context"
import { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Button } from "@/components/Button"
import { ScrollView, TextInput, View, ActivityIndicator, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { MoreHoriz, SendDiagonal } from "iconoir-react-native"
import { useAuth } from "@/context/AuthContext"
import { useGetConversationHistory } from "@/hooks/chat/get-chat-history"
import { ThemedStyle } from "@/theme/types"
import { useSocket } from "@/context/AIChatContext"
import Animated from "react-native-reanimated"
import { AnimatedChatMessage } from "@/components/Onboarding/AnimatedChatMessage"
import { ChatMessage } from "@/services/api"
// import * as Notifications from "expo-notifications"

interface AIChatScreenProps extends AppStackScreenProps<"AIChat"> {}

export const AIChatScreen: FC<AIChatScreenProps> = ({ navigation }) => {
  const { session } = useAuth()
  const { socket, connected, markAsRead } = useSocket()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const {
    theme: { spacing, colors },
    themed,
  } = useAppTheme()

  const { data: conversationData, isLoading: isLoadingHistory } = useGetConversationHistory()

  // Initialize messages from history when data loads
  useEffect(() => {
    if (conversationData?.messages) {
      setMessages(conversationData.messages)
    }
  }, [conversationData])

  // Handle incoming messages and typing events
  useEffect(() => {
    if (!socket) return

    const handleTyping = (data) => {
      setTimeout(() => setIsTyping(data.typing), data.typing ? 500 : 0)
    }

    const handleMessageResponse = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.messageId,
          role: "assistant",
          content: data.content,
          createdAt: data.timestamp,
        },
      ])
    }

    socket.on("typing", handleTyping)
    socket.on("messageResponse", handleMessageResponse)

    return () => {
      socket.off("typing", handleTyping)
      socket.off("messageResponse", handleMessageResponse)
    }
  }, [socket])

  // Disable push notifications when on chat screen
  useEffect(() => {
    // Mark messages as read
    markAsRead()

    // // Disable push notifications while on chat screen
    // Notifications.setNotificationHandler({
    //   handleNotification: async () => ({
    //     shouldShowAlert: false,
    //     shouldPlaySound: false,
    //     shouldSetBadge: false,
    //   }),
    // })

    // // Re-enable push notifications when leaving chat screen
    // return () => {
    //   Notifications.setNotificationHandler({
    //     handleNotification: async () => ({
    //       shouldShowAlert: true,
    //       shouldPlaySound: true,
    //       shouldSetBadge: true,
    //     }),
    //   })
    // }
  }, [markAsRead])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!isLoadingHistory) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 0)
    }
  }, [messages, isTyping, isLoadingHistory])

  const sendMessage = () => {
    if (!inputText.trim() || !session?.user?.id) return

    const userMessage = {
      role: "user" as const,
      content: inputText,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    socket?.emit("sendMessage", {
      userId: session.user.id,
      message: inputText,
    })

    setInputText("")
  }

  useHeader({
    title: "Eric",
    onLeftPress: () => navigation.goBack(),
    leftIcon: "back",
    // rightIcon: "more",
    titleContainerStyle: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-start",
      marginLeft: 20,
      gap: spacing.sm,
    },
    titleImage: require("../../assets/images/eric-face.png"),
  })

  if (isLoadingHistory) {
    return (
      <Screen contentContainerStyle={themed($loadingContainer)}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ marginTop: spacing.md }}>Loading conversation...</Text>
      </Screen>
    )
  }

  return (
    <Screen
      contentContainerStyle={{ flex: 1 }}
      safeAreaEdges={["bottom"]}
      preset="auto"
      // keyboardShouldPersistTaps="handled"
      keyboardBottomOffset={0}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, paddingHorizontal: spacing.sm }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          {messages.length === 0 && (
            <Animated.View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                paddingBottom: spacing.xl,
              }}
            >
              <AnimatedChatMessage translated message="chat:welcome.messageOne" delay={500} />
              <AnimatedChatMessage translated message="chat:welcome.messageTwo" delay={1500} />
              <AnimatedChatMessage translated message="chat:welcome.messageThree" delay={3000} />
              <AnimatedChatMessage translated message="chat:welcome.messageFour" delay={4500} />
            </Animated.View>
          )}

          {messages.map((msg, index) => (
            <View
              key={msg.id || index}
              style={msg.role === "user" ? themed($userMessage) : themed($ericMessage)}
            >
              <Text
                style={msg.role === "user" ? themed($userMessageText) : themed($ericMessageText)}
              >
                {msg.content}
              </Text>
            </View>
          ))}

          {isTyping && (
            <View style={themed($typingIndicator)}>
              <MoreHoriz color="#fff" strokeWidth={3} width={60} height={20} />
            </View>
          )}
        </ScrollView>

        <View style={themed($textInputContainer)}>
          <TextInput
            style={themed($textInput)}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textDim}
            onSubmitEditing={sendMessage}
            editable={connected && !isTyping}
            multiline
          />
          <Button
            onPress={sendMessage}
            disabled={!connected || !inputText.trim() || isTyping}
            style={themed($sendButton)}
          >
            <SendDiagonal
              color={colors.palette.primary900}
              strokeWidth={2}
              height={20}
              width={20}
            />
          </Button>
        </View>
      </View>
    </Screen>
  )
}

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $ericMessage: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  marginVertical: spacing.xs,
  backgroundColor: colors.palette.primary800,
  borderRadius: 12,
  alignSelf: "flex-start",
  maxWidth: "80%",
})

const $ericMessageText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary100,
})

const $userMessage: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.md,
  marginVertical: spacing.xs,
  backgroundColor: colors.palette.primary200,
  borderRadius: 12,
  alignSelf: "flex-end",
  maxWidth: "80%",
})

const $userMessageText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary900,
})

const $sendButton: ThemedStyle<ViewStyle> = () => ({
  padding: 0,
  borderRadius: 999,
  minHeight: 40,
  height: 45,
  maxHeight: 50,
})

const $textInputContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  padding: spacing.sm,
  alignItems: "flex-end",
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: colors.border,
})

const $textInput: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: spacing.lg,
  padding: spacing.sm,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.background,
  color: colors.text,
  maxHeight: 250,
})

const $typingIndicator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.sm,
  marginVertical: spacing.xs,
  backgroundColor: colors.palette.primary800,
  borderRadius: 12,
  alignSelf: "flex-start",
  maxWidth: "80%",
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})
