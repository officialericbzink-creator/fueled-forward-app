// services/api/clients/resources-api.ts
import { BaseApi } from "./base-api"
import type { StrapiResource, StrapiResourceCategory, StrapiResponse } from "./types"

interface GetResourcesParams {
  search?: string
  category?: string
  types?: string[]
  readTimes?: string[]
  page?: number
  pageSize?: number
}

export class ResourcesApi extends BaseApi {
  private apiToken: string

  constructor(config: any, apiToken: string) {
    super(config)
    this.apiToken = apiToken

    this.apisauce.addRequestTransform((request) => {
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.apiToken}`,
      }
    })
  }

  async getResources(): Promise<StrapiResource[]> {
    const queryParams = new URLSearchParams()

    // Only fetch published resources
    queryParams.append("status", "published")
    queryParams.append("populate", "*")

    // Optional: add pagination if you have a lot of resources
    // queryParams.append("pagination[pageSize]", "100")

    const response = await this.apisauce.get(`/resources?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch resources")
    }

    return response.data.data as StrapiResource[]
  }

  async getResourceById(documentId: string): Promise<StrapiResponse<StrapiResource>> {
    // Strapi 5 uses documentId instead of id
    const response = await this.apisauce.get(`/resources/${documentId}?populate=*`)

    console.log("getResourceById response:", JSON.stringify(response, null, 2))

    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch resource")
    }

    return response.data as StrapiResponse<StrapiResource>
  }

  async getCategories(): Promise<StrapiResourceCategory[]> {
    const queryParams = new URLSearchParams()
    // queryParams.append("populate", "*")

    const response = await this.apisauce.get(`/categories?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch categories")
    }

    return response.data.data as StrapiResourceCategory[]
  }
}
