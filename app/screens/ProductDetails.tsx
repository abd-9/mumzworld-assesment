import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, ImageStyle, Platform, StyleSheet, View, ViewStyle } from "react-native"
import Animated, {
  Easing,
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { Button, EmptyState, Icon, Screen } from "../components"
import { isRTL, setLanguage } from "../i18n"
import { useStores } from "../models"
import { semanticColors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { AppStackScreenProps, navigationRef } from "app/navigators"
import { ProductDetails } from "app/models/ProductList/Product"
import { Text } from "native-base"
import I18n from "i18n-js"
interface ProductScreenProps extends AppStackScreenProps<"ProductDetails"> {}

export const ProductDetailsScreen: FC<ProductScreenProps> = observer(function ProductDetailsScreen(
  _props,
) {
  const { id: productID } = _props.route.params
  const { productDetailsStore } = useStores()
  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await productDetailsStore.fetchProduct(productID)

      setIsLoading(false)
    })()
  }, [productDetailsStore, productID])

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
  const opacity = useSharedValue(0)
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={{ uri: product.small_image.url }}
          style={[styles.image]}
          entering={FadeInRight}
          layout={Layout.duration(2000).delay(200)}
        />
      </View>
      <View style={styles.backButton}>
        <Icon icon="back" onPress={() => navigationRef.goBack()} style={styles.backButton} />
      </View>
      <View style={styles.fab}>
        <Icon icon="heart" onPress={() => {}} />
      </View>
      <Animated.View entering={FadeInDown} style={[styles.descriptionContainer, { flex: 1 }]}>
        <View style={styles.titlePriceContainer}>
          <Text style={styles.titleText}>{product.name}</Text>
          <Text style={styles.priceText}>
            {product.base_price_range.minimum_price.final_price.currency}{" "}
            {product.base_price_range.minimum_price.regular_price.value}
          </Text>
        </View>
        <Text style={styles.smallText}>{product.meta_description}</Text>
      </Animated.View>
      <View style={styles.addToCartContainer}>
        <Button
          style={styles.addToCartButton}
          onPress={() => {
            I18n.locale == "en" ? setLanguage("ar") : setLanguage("en")
          }}
        >
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
