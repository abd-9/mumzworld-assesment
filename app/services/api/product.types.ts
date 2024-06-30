interface BrandInfo {
  img_src?: string
  title: string
  url?: string
  __typename: string
}

interface CategoryTree {
  breadcrumbs?: {
    category_id: number
    category_name: string
    category_url_key: string
    category_url_path: string
    __typename: string
  }[]
  level: number
  id: number
  name: string
  url_path: string
  url_key: string
  __typename: string
}

interface Money {
  currency: string
  value: number
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

interface ComplexTextValue {
  html: string
  __typename: string
}

interface ProductReviews {
  items: any[]
  page_info: {
    page_size: number
    total_pages: number
    __typename: string
  }
  __typename: string
}

interface CrossBorderProduct {
  is_allowed: boolean
  disallow_countries: string
  __typename: string
}

interface ProductDetailsResponse {
  language: string
  redirect_code: number
  relative_url: string
  type: string
  amrma_default_resolution_period: number
  brand: number
  brand_info: BrandInfo
  categories: CategoryTree[]
  //   cautions?: string
  cross_border_product: CrossBorderProduct
  description: ComplexTextValue
  //   dimensions?: string
  features: string
  id: number
  is_yalla: string[]
  media_gallery_entries: {
    disabled: boolean
    file: string
    id: number
    label: any
    position: number
    __typename: string
  }[]
  meta_description: string
  meta_title: string
  name: string
  pkgdimensions: string
  price: {
    regularPrice: {
      amount: Money
      __typename: string
    }
    __typename: string
  }
  price_range: PriceRange
  base_price_range: PriceRange
  usd_price_range: PriceRange
  product_label: ProductLabel
  rating_summary: number
  recom_age: string
  review_count: number
  reviews: ProductReviews
  shipping_weight?: any
  sku: string
  small_image: ProductImage
  stock_status: string
  uid: string
  url_key: string
  weight: number
  url_suffix?: string
  type_id?: string
  __typename: string
  options?: any
}

interface SimpleProduct {
  brand: number
  brand_info: BrandInfo
  categories: CategoryTree[]
  id: number
  is_yalla: string[]
  name: string
  price: {
    regularPrice: {
      amount: Money
      __typename: string
    }
    __typename: string
  }
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

interface ApiProductsResponse {
  data: {
    products: {
      items: SimpleProduct[]
      page_info: PageInfo
      total_count: number
      yalla_total_count: number
      __typename: string
    }
  }
}
interface ApiProductDetailsResponse {
  data: {
    product: ProductDetailsResponse[]
  }
}
