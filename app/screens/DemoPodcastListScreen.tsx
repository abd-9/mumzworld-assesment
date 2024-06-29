import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import { Screen, Text, Toggle, EmptyState, ListView } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { Product } from "app/models/ProductList/Product"
import ProductCard from "app/components/ProductCard"

export const ProductListScreen: FC<DemoTabScreenProps<"ProductList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { productStore } = useStores()
    const navigation = _props.navigation
    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await productStore.fetchProducts()
        setIsLoading(false)
      })()
    }, [productStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([productStore.fetchProducts(), delay(750)])
      setRefreshing(false)
    }

    const Separator = () => <View style={styles.separator} />

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ListView<Product>
          numColumns={2}
          contentContainerStyle={$listContentContainer}
          data={productStore.products}
          ItemSeparatorComponent={Separator}
          extraData={productStore.favorites.length + productStore.products.length}
          refreshing={refreshing}
          estimatedItemSize={200}
          onRefresh={manualRefresh}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx={
                  productStore.favoritesOnly
                    ? "demoPodcastListScreen.noFavoritesEmptyState.heading"
                    : undefined
                }
                contentTx={
                  productStore.favoritesOnly
                    ? "demoPodcastListScreen.noFavoritesEmptyState.content"
                    : undefined
                }
                button={productStore.favoritesOnly ? "" : undefined}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoPodcastListScreen.title" />
              {(productStore.favoritesOnly || productStore.episodesForList.length > 0) && (
                <View style={$toggle}>
                  <Toggle
                    value={productStore.favoritesOnly}
                    onValueChange={() =>
                      productStore.setProp("favoritesOnly", !productStore.favoritesOnly)
                    }
                    variant="switch"
                    labelTx="demoPodcastListScreen.onlyFavorites"
                    labelPosition="left"
                    labelStyle={$labelStyle}
                    accessibilityLabel={translate("demoPodcastListScreen.accessibility.switch")}
                  />
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <_ProductCard
              product={item}
              isFavorite={false}
              onPressFavorite={() => {
                navigation.push("ProductDetails", { id: item.id })
              }}
            />
          )}
        />
      </Screen>
    )
  },
)

const _ProductCard = observer(function _ProductCard({
  product,
  isFavorite,
  onPressFavorite,
}: {
  product: Product
  onPressFavorite: () => void
  isFavorite: boolean
}) {
  return (
    <ProductCard
      image={product.small_image.url}
      description={product.name}
      name={product.brand_info.title}
      price={product.getPrice}
      newPrice={product.getDiscount}
      rating={4.5}
      discount={product.getDiscountPersantage}
      isNew={true}
      onAddToCart={() => {}}
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $columnWrapperStyle: ViewStyle = {}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const styles = StyleSheet.create({
  separator: {
    height: 3,
  },
  columnWrapper: {
    marginHorizontal: 22, // Add horizontal margin to each item
  },
})
