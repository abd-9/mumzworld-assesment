import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

interface Money {
  currency: string
  value: number
}

interface Price {
  amount: Money
}

interface ProductPrice {
  discount?: {
    amount_off: number
    percent_off: number
  }
  final_price: Money
  regular_price: Money
}

interface PriceRange {
  minimum_price: ProductPrice
}

interface BrandInfo {
  title: string
  __typename: string
}

interface CategoryTree {
  name: string
  __typename: string
}

interface ProductLabel {
  active_from: string
  active_to: string
  background_color: string
  label_id: number | null
  label_text: string
  name: string
  text_color: string
  __typename: string
}

interface ProductImage {
  url: string
  __typename: string
}

/**
 * This represents an product of React Native Radio.
 */
export const ProductModel = types
  .model("Product")
  .props({
    id: types.identifierNumber,
    name: "",
    brand: types.number,
    brand_info: types.frozen<BrandInfo>(),
    categories: types.array(types.frozen<CategoryTree>()),
    is_yalla: types.array(types.string),
    low_stock_qty: types.maybeNull(types.number),
    price: types.frozen<{ regularPrice: Price }>(),
    price_range: types.frozen<PriceRange>(),
    base_price_range: types.frozen<PriceRange>(),
    usd_price_range: types.frozen<PriceRange>(),
    product_label: types.frozen<ProductLabel>(),
    sku: "",
    small_image: types.frozen<ProductImage>(),
    stock_status: "",
    type_id: "",
    uid: "",
    url_key: "",
    url_suffix: "",
  })
  .actions(withSetPropAction)
  .views((product) => ({
    get parsedTitleAndSubtitle() {
      return { title: product.name, price: product.price }
    },
  }))

export interface Product extends Instance<typeof ProductModel> {}
export interface ProductSnapshotOut extends SnapshotOut<typeof ProductModel> {}
export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}
