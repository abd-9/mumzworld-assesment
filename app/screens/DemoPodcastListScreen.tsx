import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import { Screen, Text, Toggle, EmptyState, ListView } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { delay } from "../utils/delay"
import { Product } from "app/models/ProductList/Product"
import ProductCard from "app/components/ProductCard"
import AnimatedSearchBar from "app/components/SearchBar"

export const ProductListScreen: FC<DemoTabScreenProps<"ProductList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { productStore } = useStores()
    const navigation = _props.navigation
    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await productStore.fetchProducts()
        setIsLoading(false)
      })()
    }, [productStore])

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
              <AnimatedSearchBar placeholder="Search..." value={""} onChangeText={() => {}} />
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
              onPress={() => navigation.push("ProductDetails", { id: item.id })}
              product={item}
              isFavorite={false}
              onPressFavorite={() => {}}
            />
          )}
        />
      </Screen>
    )
  },
)

const _ProductCard = observer(function _ProductCard({
  product,
  onPress,
}: {
  product: Product
  onPressFavorite: () => void
  onPress: (productId: number) => void
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
      onItemPress={() => {
        onPress(product.id)
      }}
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

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const styles = StyleSheet.create({
  separator: {
    height: 31,
    width: 11, //spacing.md,
  },
  columnWrapper: {
    marginHorizontal: 10, // Add horizontal margin to each item
  },
})
