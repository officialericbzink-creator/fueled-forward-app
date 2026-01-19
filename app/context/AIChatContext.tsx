// context/SocketContext.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./AuthContext"
import Config from "@/config"

interface SocketContextValue {
  socket: Socket | null
  connected: boolean
  unreadCount: number
  markAsRead: () => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return

    const newSocket = io(Config.API_URL, {
      auth: {
        userId: user.id,
      },
    })

    newSocket.on("connect", () => {
      console.log("✅ Socket connected")
      setConnected(true)
    })

    newSocket.on("messageResponse", (data) => {
      // Increment unread count (will be cleared when user opens chat)
      setUnreadCount((prev) => prev + 1)
    })

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected")
      setConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user?.id])

  const markAsRead = () => setUnreadCount(0)

  return (
    <SocketContext.Provider value={{ socket, connected, unreadCount, markAsRead }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error("useSocket must be used within SocketProvider")
  return context
}
