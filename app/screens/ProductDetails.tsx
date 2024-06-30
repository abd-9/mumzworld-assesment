import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useState } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  Dimensions,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { Button, EmptyState, Icon, ListView, Screen, Toggle } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, semanticColors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { AppStackScreenProps, navigationRef } from "app/navigators"
import { Product, ProductDetails } from "app/models/ProductList/Product"
import { Surface } from "react-native-paper"
import { Text } from "native-base"
interface ProductScreenProps extends AppStackScreenProps<"ProductDetails"> {}

const HEADER_HEIGHT = 300
export const ProductDetailsScreen: FC<ProductScreenProps> = observer(function DemoPodcastListScreen(
  _props,
) {
  const { id: productID } = _props.route.params
  const { productDetailsStore } = useStores()
  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await productDetailsStore.fetchProduct(productID)

      setIsLoading(false)
    })()
  }, [productDetailsStore, productID])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([productDetailsStore.fetchProduct(productID), delay(750)])
    setRefreshing(false)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : productDetailsStore.productDetails.length ? (
        <>
          <ProductDetailsComponent product={productDetailsStore.productDetails[1]} />
        </>
      ) : (
        <EmptyState
          preset="generic"
          style={$emptyState}
          headingTx={
            productDetailsStore.favoritesOnly
              ? "demoPodcastListScreen.noFavoritesEmptyState.heading"
              : undefined
          }
          contentTx={
            productDetailsStore.favoritesOnly
              ? "demoPodcastListScreen.noFavoritesEmptyState.content"
              : undefined
          }
          button={productDetailsStore.favoritesOnly ? "" : undefined}
          buttonOnPress={manualRefresh}
          imageStyle={$emptyStateImage}
          ImageProps={{ resizeMode: "contain" }}
        />
      )}
    </Screen>
  )
})

const ProductDetailsComponent = observer(function ProductCard({
  product,
}: {
  product: ProductDetails
  onPressFavorite?: () => void
  isFavorite?: boolean
}) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={{ uri: product.small_image.url }}
          style={[styles.image, { transform: [{ scale: 1 }] }]}
        />
      </View>
      <View style={styles.backButton}>
        <Icon icon="back" onPress={() => navigationRef.goBack()} style={styles.backButton} />
      </View>
      <View style={styles.fab}>
        <Icon icon="heart" onPress={() => {}} />
      </View>
      <View style={[styles.descriptionContainer, { flex: 1 }]}>
        <View style={styles.titlePriceContainer}>
          <Text style={styles.titleText}>{product.name}</Text>
          <Text style={styles.priceText}>
            {product.base_price_range.minimum_price.final_price.currency}{" "}
            {product.base_price_range.minimum_price.regular_price.value}
          </Text>
        </View>

        <Text style={styles.smallText}>{product.meta_description}</Text>
      </View>

      <View style={styles.addToCartContainer}>
        <Button style={styles.addToCartButton} onPress={() => {}}>
          <Text fontWeight={900} bold>
            Add to Cart
          </Text>
        </Button>
      </View>
    </View>
  )
})

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  image: {
    width: "98%",
    height: 400,
    resizeMode: "cover",
  },
  imageContainer: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    shadowOpacity: 1,
    elevation: 3,
    // background color must be set
    backgroundColor: "#0000", // invisible color
  },
  descriptionContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: semanticColors.bg.subtle,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 2,
    borderColor: semanticColors.fg.textDisabled,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titlePriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    color: "green",
  },
  smallText: {
    paddingHorizontal: 16,
    marginTop: 8,
    color: "gray",
  },
  addToCartContainer: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    paddingHorizontal: 16,
  },
  addToCartButton: {
    borderRadius: 10,
    backgroundColor: semanticColors.bg.primaryLight,
  },
})
