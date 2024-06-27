import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Product, ProductModel } from "./Product"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { productApi } from "app/services/api/product"

export const ProductStoreModel = types
  .model("ProductStore")
  .props({
    products: types.array(ProductModel),
    favorites: types.array(types.reference(ProductModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchProducts() {
      const response = await productApi.getProducts()
      if (response.kind === "ok") {
        store.setProp("products", response.products)
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
      }
    },
    addFavorite(products: Product) {
      store.favorites.push(products)
    },
    removeFavorite(product: Product) {
      store.favorites.remove(product)
    },
  }))
  .views((store) => ({
    get episodesForList() {
      return store.favoritesOnly ? store.favorites : store.products
    },

    hasFavorite(product: Product) {
      return store.favorites.includes(product)
    },
  }))
  .actions((store) => ({
    toggleFavorite(product: Product) {
      if (store.hasFavorite(product)) {
        store.removeFavorite(product)
      } else {
        store.addFavorite(product)
      }
    },
  }))

export interface ProductStore extends Instance<typeof ProductStoreModel> {}
export interface ProductStoreSnapshot extends SnapshotOut<typeof ProductStoreModel> {}
