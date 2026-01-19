import { ApisauceInstance, create } from "apisauce"
import { authClient } from "../../../lib/auth"
import { ApiConfig } from "./types"

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
        console.log("Unauthorized request, session may have expired")
      }
    })
  }
}
