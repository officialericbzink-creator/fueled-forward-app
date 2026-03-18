import { useInfiniteQuery } from "@tanstack/react-query"

import { resourcesApi } from "@/services/api"
import type { StrapiResource } from "@/services/api/types"

export interface ResourcesQueryParams {
  search?: string
  category?: string
  categories?: string[]
  types?: string[]
  readTimes?: string[]
  pageSize?: number
}

export function useGetResources(params?: ResourcesQueryParams) {
  const pageSize = params?.pageSize ?? 25
  const query = useInfiniteQuery({
    queryKey: ["resources", params ?? {}],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      resourcesApi.getResources({
        ...params,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const pagination = lastPage?.meta?.pagination
      if (pagination) {
        if (pagination.page >= pagination.pageCount) return undefined
        return pagination.page + 1
      }

      // Fallback if Strapi doesn't return pagination meta for some reason:
      // if we got a "full" page, assume there might be another.
      const lastCount = lastPage?.data?.length ?? 0
      if (lastCount < pageSize) return undefined
      return allPages.length + 1
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since resources don't change often
  })

  const resources: StrapiResource[] = (query.data?.pages ?? []).flatMap((p) => p.data ?? [])

  return {
    ...query,
    resources,
  }
}
