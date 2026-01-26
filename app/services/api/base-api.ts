import { ApisauceInstance, create } from "apisauce"
import { authClient } from "../../../lib/auth"
import { ApiConfig } from "./types"
import { posthog } from "@/utils/posthog"
import * as Localization from "expo-localization"

export class BaseApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    // Add request transform to attach session cookies
    this.apisauce.addRequestTransform((request) => {
      const cookies = authClient.getCookie()
      const { timeZone } = Localization.getCalendars()[0]

      if (timeZone) {
        request.headers = {
          ...request.headers,
          "X-User-Timezone": timeZone,
        }
      }

      if (cookies) {
        request.headers = {
          ...request.headers,
          Cookie: cookies,
        }
      }
    })

    // Handle 401 responses
    this.apisauce.addResponseTransform((response) => {
      if (response.status === 401) {
        posthog.captureException(new Error("Unauthorized request, session may have expired"))
        console.log("Unauthorized request, session may have expired")
      }
    })
  }
}
