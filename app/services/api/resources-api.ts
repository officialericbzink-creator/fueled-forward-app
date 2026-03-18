// services/api/clients/resources-api.ts
import { posthog } from "@/utils/posthog"

import { BaseApi } from "./base-api"
import type { StrapiResource, StrapiResourceCategory, StrapiResponse } from "./types"

interface GetResourcesParams {
  search?: string
  category?: string
  categories?: string[]
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

  async getResources(params?: GetResourcesParams): Promise<StrapiResponse<StrapiResource[]>> {
    const queryParams = new URLSearchParams()

    // Only fetch published resources
    queryParams.append("status", "published")
    queryParams.append("populate", "*")

    // Pagination (Strapi defaults to a small page size if omitted)
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 25
    queryParams.append("pagination[page]", String(page))
    queryParams.append("pagination[pageSize]", String(pageSize))
    // Ensure Strapi includes `meta.pagination` (total/pageCount)
    queryParams.append("pagination[withCount]", "true")

    // Sort newest first (helps infinite scroll feel consistent)
    queryParams.append("sort[0]", "publishedAt:desc")

    // Search (title OR summary)
    if (params?.search?.trim()) {
      const q = params.search.trim()
      queryParams.append("filters[$or][0][title][$containsi]", q)
      queryParams.append("filters[$or][1][summary][$containsi]", q)
    }

    // Category filters
    const categories =
      params?.categories && params.categories.length > 0
        ? params.categories
        : params?.category
          ? [params.category]
          : []
    categories.forEach((name, idx) => {
      queryParams.append(`filters[category][name][$in][${idx}]`, name)
    })

    // Resource type filters
    params?.types?.forEach((name, idx) => {
      queryParams.append(`filters[resource_type][name][$in][${idx}]`, name)
    })

    // Read time filters
    params?.readTimes?.forEach((name, idx) => {
      queryParams.append(`filters[read_time][name][$in][${idx}]`, name)
    })

    const response = await this.apisauce.get(`/resources?${queryParams.toString()}`)

    if (!response.ok) {
      posthog.captureException(new Error("Failed to fetch resources"))
      throw new Error(response.data?.message || "Failed to fetch resources")
    }

    return response.data as StrapiResponse<StrapiResource[]>
  }

  async getResourceById(documentId: string): Promise<StrapiResponse<StrapiResource>> {
    // Strapi 5 uses documentId instead of id
    const response = await this.apisauce.get(`/resources/${documentId}?populate=*`)

    if (!response.ok) {
      posthog.captureException(new Error("Failed to fetch resource"))
      throw new Error(response.data?.message || "Failed to fetch resource")
    }

    return response.data as StrapiResponse<StrapiResource>
  }

  async getCategories(): Promise<StrapiResourceCategory[]> {
    const queryParams = new URLSearchParams()
    // queryParams.append("populate", "*")

    const response = await this.apisauce.get(`/categories?${queryParams.toString()}`)

    if (!response.ok) {
      posthog.captureException(new Error("Failed to fetch categories"))
      throw new Error(response.data?.message || "Failed to fetch categories")
    }

    return response.data.data as StrapiResourceCategory[]
  }
}
