// ProductApi.ts
import { ApiResponse } from "apisauce"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"
import { DEFAULT_API_CONFIG, Api } from "./api"
import { ProductSnapshotIn } from "app/models/Product/Product"

export class ProductApi extends Api {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config)
  }
  async getProducts(): Promise<{ kind: "ok"; products: ProductSnapshotIn[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiProductsResponse> = await this.apisauce.get(`product-list-lite`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data?.data.products
      const products: ProductSnapshotIn[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", products }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

export const productApi = new ProductApi()
