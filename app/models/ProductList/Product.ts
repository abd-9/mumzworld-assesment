import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

interface Money {
  currency: string
  value: number
}

const MediaGalleryEntry = types.model("MediaGalleryEntry", {
  id: types.identifierNumber,
  file: types.string,
  position: types.number,
})

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
    get isYalla() {
      return product.is_yalla.length > 0
    },
    get getPrice() {
      return (
        product.price.regularPrice.amount.currency +
        " " +
        product.price.regularPrice.amount.value.toFixed(2)
      )
    },
    get getDiscount() {
      if (product.base_price_range.minimum_price.final_price)
        return (
          product.base_price_range.minimum_price.final_price.currency +
          " " +
          product.base_price_range.minimum_price.final_price.value
        )
      else return ""
    },
    get getDiscountPersantage() {
      return product.base_price_range.minimum_price.discount?.percent_off
    },
  }))

export interface Product extends Instance<typeof ProductModel> {}
export interface ProductSnapshotOut extends SnapshotOut<typeof ProductModel> {}
export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}

const Price = types.model({
  currency: types.string,
  value: types.number,
})
// ProductDetails model

const CategoryTreeModel = types.model({
  breadcrumbs: types.maybeNull(types.array(types.frozen())),
  level: types.number,
  id: types.number,
  name: types.string,
  url_path: types.string,
  url_key: types.string,
})
export const ProductDetailsModel = types.model({
  language: types.string,
  redirect_code: types.number,
  relative_url: types.string,
  type: types.string,
  amrma_default_resolution_period: types.number,
  brand: types.number,
  brand_info: types.frozen<BrandInfo>(),

  categories: types.array(CategoryTreeModel),
  // cautions: types.string,
  cross_border_product: types.model({
    is_allowed: types.boolean,
    disallow_countries: types.string,
  }),
  // description: Description,
  // dimensions: types.string,
  features: types.string,
  id: types.number,
  is_yalla: types.array(types.string),
  media_gallery_entries: types.array(MediaGalleryEntry),
  meta_description: types.string,
  meta_title: types.string,
  name: types.string,
  pkgdimensions: types.string,
  // price: Price,
  // price_range: types.model({
  //   minimum_price: types.model({
  //     discount: types.model({
  //       amount_off: types.number,
  //       percent_off: types.number,
  //     }),
  //     final_price: Price,
  //     regular_price: Price,
  //   }),
  // }),
  base_price_range: types.model({
    minimum_price: types.model({
      final_price: Price,
      regular_price: Price,
    }),
  }),
  usd_price_range: types.model({
    minimum_price: types.model({
      final_price: Price,
    }),
  }),
  product_label: types.model({
    active_from: types.string,
    active_to: types.string,
    background_color: types.string,
    label_id: types.maybeNull(types.number),
    label_text: types.string,
    name: types.string,
    text_color: types.string,
  }),
  rating_summary: types.number,
  recom_age: types.string,
  review_count: types.number,
  reviews: types.model({
    items: types.array(types.frozen()),
    page_info: types.model({
      page_size: types.number,
      total_pages: types.number,
    }),
  }),
  shipping_weight: types.maybeNull(types.string),
  sku: types.string,
  small_image: types.model({
    url: types.string,
  }),
  // stock_status: types.enumeration("StockStatus", ["IN_STOCK", "OUT_OF_STOCK"]),
  uid: types.string,
  url_key: types.string,
  weight: types.number,
  options: types.maybeNull(types.frozen()),
})

export interface ProductDetails extends Instance<typeof ProductDetailsModel> {}
export interface ProductDetailsSnapshotIn extends SnapshotIn<typeof ProductDetailsModel> {}
export interface ProductDetailsSnapshotOut extends SnapshotOut<typeof ProductDetailsModel> {}
