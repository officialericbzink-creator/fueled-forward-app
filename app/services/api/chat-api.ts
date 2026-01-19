import { BaseApi } from "./base-api"
import type { ConversationHistoryResponse } from "./types"

export class ChatApi extends BaseApi {
  async getConversationHistory(): Promise<ConversationHistoryResponse> {
    const response = await this.apisauce.get("/chat/conversation")
    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to get conversation history")
    }
    return response.data as ConversationHistoryResponse
  }
}
