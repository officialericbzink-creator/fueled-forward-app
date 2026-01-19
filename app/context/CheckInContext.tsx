import { createContext, FC, PropsWithChildren, useContext, useCallback, useState } from "react"

export type CheckInType = {
  date: string
  data: CheckInDataType[]
  overallMood?: number
  completed?: boolean
}

export type CheckInDataType = {
  step: number
  mood: number | null
  notes: string
}

export type CheckInContextType = {
  checkInHistory: CheckInType[]
  addCheckIn: (checkIn: CheckInType) => void
  hasCheckedInToday: () => boolean
}

const checkInHistoryMock: CheckInType[] = [
  {
    date: "2024-06-20T00:00:00.000Z",
    data: [
      {
        step: 1,
        mood: 2,
        notes: "Had a tough day",
      },
      {
        step: 2,
        mood: 3,
        notes: "Feeling a bit better",
      },
      {
        step: 3,
        mood: 1,
        notes: "Struggled with focus",
      },
      {
        step: 4,
        mood: 2,
        notes: "Managed to get some work done",
      },
    ],
    overallMood: 2,
  },
  {
    date: "2024-06-19T00:00:00.000Z",
    data: [
      {
        step: 1,
        mood: 5,
        notes: "Great day!",
      },
      {
        step: 2,
        mood: 4,
        notes: "Productive morning.",
      },
      {
        step: 3,
        mood: 5,
        notes: "Enjoyed my lunch break.",
      },
      {
        step: 4,
        mood: 4,
        notes: "Finished work on time.",
      },
    ],
    overallMood: 4,
  },
]

export const CheckInContext = createContext<CheckInContextType | null>(null)

export interface CheckInProviderProps {}

export const CheckInProvider: FC<PropsWithChildren<CheckInProviderProps>> = ({ children }) => {
  const [checkInHistory, setCheckInHistory] = useState<CheckInType[]>(checkInHistoryMock)

  const addCheckIn = useCallback((checkIn: CheckInType) => {
    // Logic to add a new check-in (e.g., update state or send to backend)
    console.log("New check-in added:", checkIn)
    const averageMood =
      checkIn.data.reduce((sum, entry) => sum + entry.mood, 0) / checkIn.data.length
    console.log("Average mood for this check-in:", averageMood)
    checkIn.overallMood = Math.round(averageMood)
    setCheckInHistory((prev) => [...prev, checkIn])
  }, [])

  const hasCheckedInToday = () => {
    if (checkInHistory.length === 0) return false
    const latestCheckIn = checkInHistory[checkInHistory.length - 1]
    const today = new Date()
    const checkInDate = new Date(latestCheckIn.date)
    return (
      today.getFullYear() === checkInDate.getFullYear() &&
      today.getMonth() === checkInDate.getMonth() &&
      today.getDate() === checkInDate.getDate()
    )
  }

  const value: CheckInContextType = {
    checkInHistory,
    addCheckIn,
    hasCheckedInToday,
  }

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
}
export const useCheckIn = (): CheckInContextType => {
  const context = useContext(CheckInContext)
  if (!context) {
    throw new Error("useCheckIn must be used within a CheckInProvider")
  }
  return context
}
