import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Product, ProductDetailsModel, ProductModel } from "./Product"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { productApi } from "app/services/api/product"

export const ProductDetailsStoreModel = types
  .model("ProductDetailsStore")
  .props({
    productDetails: types.array(ProductDetailsModel),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchProduct(id: number) {
      const response = await productApi.getProduct()
      if (response.kind === "ok") {
        store.setProp("productDetails", response.product)
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
      }
    },
    addFavorite(products: Product) {
      // store.favorites.push(products)
    },
    removeFavorite(product: Product) {
      // store.favorites.remove(product)
    },
  }))
  .views((store) => ({
    // get episodesForList() {
    //   return store.favoritesOnly ? store.favorites : store.products
    // },

    hasFavorite(product: Product) {
      // return store.favorites.includes(product)
    },
  }))
  .actions((store) => ({
    // toggleFavorite(product: Product) {
    //   if (store.hasFavorite(product)) {
    //     store.removeFavorite(product)
    //   } else {
    //     store.addFavorite(product)
    //   }
    // },
  }))

export interface ProductStore extends Instance<typeof ProductDetailsStoreModel> {}
export interface ProductStoreSnapshot extends SnapshotOut<typeof ProductDetailsStoreModel> {}
