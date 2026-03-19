import { BaseApi } from "./base-api"

export type JournalEntryType = "journal_entry" | "activity_log" | "vent"

export interface JournalEntry {
  id: string
  userId: string
  type: string
  content: string
  summary: string
  insights?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export class EntriesApi extends BaseApi {
  async create(payload: { type: JournalEntryType; content: string }): Promise<JournalEntry> {
    const response = await this.apisauce.post<{ data: JournalEntry }>("/entries", payload)
    if (!response.ok || !response.data?.data) {
      throw new Error(
        (response.data as { message?: string })?.message || "Failed to save entry",
      )
    }
    return response.data.data
  }

  async list(): Promise<JournalEntry[]> {
    const response = await this.apisauce.get<{ data: JournalEntry[] }>("/entries")
    if (!response.ok || !response.data?.data) {
      throw new Error("Failed to load journal entries")
    }
    return response.data.data
  }

  async recent(limit = 10): Promise<JournalEntry[]> {
    const response = await this.apisauce.get<{ data: JournalEntry[] }>("/entries/recent", {
      limit,
    })
    if (!response.ok || !response.data?.data) {
      throw new Error("Failed to load recent entries")
    }
    return response.data.data
  }
}
