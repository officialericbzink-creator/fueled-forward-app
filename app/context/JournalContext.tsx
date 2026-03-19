import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useAuth } from "@/context/AuthContext"
import { entriesApi } from "@/services/api"
import type { JournalEntry, JournalEntryType } from "@/services/api/entries-api"

export type JournalViewModel = {
  entries: JournalEntry[]
  recentEntries: JournalEntry[]
  isLoading: boolean
  refreshAll: () => Promise<void>
  createEntry: (type: JournalEntryType, content: string) => Promise<JournalEntry>
}

const JournalContext = createContext<JournalViewModel | null>(null)

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return
    setIsLoading(true)
    try {
      const [all, recent] = await Promise.all([entriesApi.list(), entriesApi.recent(8)])
      setEntries(all)
      setRecentEntries(recent)
    } catch {
      /* keep existing */
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id])

  useEffect(() => {
    void refreshAll()
  }, [refreshAll])

  const createEntry = useCallback(async (type: JournalEntryType, content: string) => {
    const entry = await entriesApi.create({ type, content })
    setEntries((prev) => [entry, ...prev])
    setRecentEntries((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)].slice(0, 8))
    return entry
  }, [])

  const value = useMemo<JournalViewModel>(
    () => ({
      entries,
      recentEntries,
      isLoading,
      refreshAll,
      createEntry,
    }),
    [entries, recentEntries, isLoading, refreshAll, createEntry],
  )

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}

export function useJournal(): JournalViewModel {
  const ctx = useContext(JournalContext)
  if (!ctx) {
    throw new Error("useJournal must be used within JournalProvider")
  }
  return ctx
}
