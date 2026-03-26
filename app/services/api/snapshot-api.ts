import { BaseApi } from "./base-api"

function nestErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const msg = (data as { message?: unknown }).message
  if (typeof msg === "string" && msg.length > 0) return msg
  if (Array.isArray(msg) && msg.length > 0 && typeof msg[0] === "string") return msg[0]
  return fallback
}

/** One theme row from the snapshot AI (label + supporting sentence). */
export interface SnapshotThemeItem {
  label: string
  why: string
}

export interface UserSnapshot {
  id: string
  userId: string
  struggles: SnapshotThemeItem[]
  positives: SnapshotThemeItem[]
  contextDigest: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export class SnapshotApi extends BaseApi {
  /**
   * GET /snapshot?limit=
   * Saved snapshots for the current user, newest first.
   */
  async list(limit = 50): Promise<UserSnapshot[]> {
    const response = await this.apisauce.get<{ data: UserSnapshot[] }>("/snapshot", { limit })
    if (!response.ok || !response.data?.data) {
      throw new Error(nestErrorMessage(response.data, "Failed to load snapshots"))
    }
    return response.data.data
  }

  /**
   * POST /snapshot/generate
   * Aggregate user data and create a new AI snapshot (long-running).
   */
  async generate(): Promise<UserSnapshot> {
    const response = await this.apisauce.post<{ data: UserSnapshot }>(
      "/snapshot/generate",
      {},
      { timeout: 120000 },
    )
    if (!response.ok || !response.data?.data) {
      throw new Error(nestErrorMessage(response.data, "Failed to generate snapshot"))
    }
    return response.data.data
  }
}
