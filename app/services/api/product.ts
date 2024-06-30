// ProductApi.ts
import { ApiResponse } from "apisauce"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig } from "./api.types"
import { DEFAULT_API_CONFIG, Api } from "./api"
import { ProductDetailsSnapshotIn, ProductSnapshotIn } from "app/models/ProductList/Product"

export class ProductApi extends Api {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config)
  }
  async getProducts(): Promise<{ kind: "ok"; products: ProductSnapshotIn[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiProductsResponse> = await this.apisauce.get(`product-list-large`)

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
  async getProduct(): Promise<
    { kind: "ok"; product?: ProductDetailsSnapshotIn[] } | GeneralApiProblem
  > {
    const response: ApiResponse<ApiProductDetailsResponse> = await this.apisauce.get(`product`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data?.data.product
      if (rawData?.length) {
        const product: ProductDetailsSnapshotIn[] = rawData!!

        return { kind: "ok", product }
      } else return { kind: "ok", product: [] }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

export const productApi = new ProductApi()
