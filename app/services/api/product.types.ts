interface BrandInfo {
  title: string
  __typename: string
}

interface CategoryTree {
  name: string
  __typename: string
}

interface Money {
  currency: string
  value: number
  __typename: string
}

interface Price {
  amount: Money
  __typename: string
}

interface ProductPrices {
  regularPrice: Price
  __typename: string
}

interface ProductDiscount {
  amount_off: number
  percent_off: number
  __typename: string
}

interface ProductPrice {
  discount?: ProductDiscount
  final_price: Money
  regular_price: Money
  __typename: string
}

interface PriceRange {
  minimum_price: ProductPrice
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

interface SimpleProduct {
  brand: number
  brand_info: BrandInfo
  categories: CategoryTree[]
  id: number
  is_yalla: string[]
  low_stock_qty: number | null
  name: string
  price: ProductPrices
  price_range: PriceRange
  base_price_range: PriceRange
  usd_price_range: PriceRange
  product_label: ProductLabel
  sku: string
  small_image: ProductImage
  stock_status: string
  type_id: string
  uid: string
  url_key: string
  url_suffix: string
  __typename: string
}

interface PageInfo {
  total_pages: number
  __typename: string
}

interface Products {
  items: SimpleProduct[]
  page_info: PageInfo
  total_count: number
  yalla_total_count: number
  __typename: string
}

interface ApiProductsResponse {
  data: {
    products: Products
  }
}
