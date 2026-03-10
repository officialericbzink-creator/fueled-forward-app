import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"

import Config from "@/config"
import { posthog } from "@/utils/posthog"

import { useAuth } from "./AuthContext"

interface SocketContextValue {
  socket: Socket | null
  connected: boolean
  unreadCount: number
  markAsRead: () => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

let globalSocketInstance: Socket | null = null
let globalSocketCount = 0

export const SocketProvider = ({ children }) => {
  const { session } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const socketRef = useRef<Socket | null>(null)
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const currentUserId = session?.user?.id

    if (!currentUserId) {
      console.log("⚠️ No user session")

      if (socketRef.current) {
        console.log("🧹 User logged out, cleaning up socket")
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
        globalSocketInstance = null
        setSocket(null)
        setConnected(false)
      }
      return
    }

    if (lastUserIdRef.current === currentUserId && socketRef.current) {
      console.log("✅ Socket already exists for this user, skipping creation")
      return
    }

    globalSocketCount++
    const socketNumber = globalSocketCount
    console.log(`🔌 [Socket #${socketNumber}] Creating for user: ${currentUserId}`)

    if (socketRef.current || globalSocketInstance) {
      const oldSocket = socketRef.current || globalSocketInstance
      console.log(`🔌 [Socket #${socketNumber}] Cleaning up old socket:`, oldSocket?.id)
      oldSocket?.removeAllListeners()
      oldSocket?.disconnect()
    }

    const newSocket = io(Config.API_URL, {
      auth: {
        userId: currentUserId,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket"],
    })

    newSocket.on("connect", () => {
      console.log(`✅ [Socket #${socketNumber}] Connected:`, newSocket.id)
      setConnected(true)
    })

    newSocket.on("messageResponse", (data) => {
      console.log(`📨 [Socket #${socketNumber}] Message received`)
      setUnreadCount((prev) => prev + 1)
    })

    newSocket.on("disconnect", (reason) => {
      console.log(`❌ [Socket #${socketNumber}] Disconnected:`, reason)
      setConnected(false)
    })

    newSocket.on("connect_error", (error) => {
      console.error(`❌ [Socket #${socketNumber}] Connection error:`, error.message)
      posthog.captureException(error, { socketNumber, userId: currentUserId })
    })

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 [Socket #${socketNumber}] Reconnected after ${attemptNumber} attempts`)
    })

    socketRef.current = newSocket
    globalSocketInstance = newSocket
    lastUserIdRef.current = currentUserId
    setSocket(newSocket)

    return () => {
      if (socketRef.current === newSocket) {
        console.log(`🧹 [Socket #${socketNumber}] Disconnecting:`, newSocket.id)
        newSocket.removeAllListeners()
        newSocket.disconnect()
        socketRef.current = null
        globalSocketInstance = null
      }
    }
  }, [session?.user?.id])

  const markAsRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

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
