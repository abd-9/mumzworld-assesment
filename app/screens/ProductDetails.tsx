import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import {
  Button,
  ButtonAccessoryProps,
  Card,
  EmptyState,
  Icon,
  ListView,
  Screen,
  Text,
  Toggle,
} from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { AppStackScreenProps } from "app/navigators"
import { Product, ProductDetails } from "app/models/ProductList/Product"

const ICON_SIZE = 14

// const rnrImage1 = require("../../assets/images/demo/rnr-image-1.png")
interface ProductScreenProps extends AppStackScreenProps<"ProductDetails"> {}

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
      <Text size="xxl" text={productID.toString()}></Text>
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
  isFavorite,
  onPressFavorite,
}: {
  product: ProductDetails
  onPressFavorite?: () => void
  isFavorite?: boolean
}) {
  const liked = useSharedValue(isFavorite ? 1 : 0)

  const animatedLikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    }
  })

  // Pink heart
  const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    }
  })

  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityLabel: product.name,
          accessibilityHint: translate("demoPodcastListScreen.accessibility.cardHint", {
            action: isFavorite ? "unfavorite" : "favorite",
          }),
        },
        android: {
          accessibilityLabel: product.name,
          accessibilityActions: [
            {
              name: "longpress",
              label: translate("demoPodcastListScreen.accessibility.favoriteAction"),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === "longpress") {
              handlePressFavorite()
            }
          },
        },
      }),
    [product, isFavorite],
  )

  const handlePressFavorite = () => {
    liked.value = withSpring(liked.value ? 0 : 1)
  }

  const handlePressCard = () => {
    console.log("Card clicked!") // openLinkInBrowser(episode.enclosure.link)
  }

  const ButtonLeftAccessory: ComponentType<ButtonAccessoryProps> = useMemo(
    () =>
      function ButtonLeftAccessory() {
        return (
          <View>
            <Animated.View
              style={[$iconContainer, StyleSheet.absoluteFill, animatedLikeButtonStyles]}
            >
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.neutral800} // dark grey
              />
            </Animated.View>
            <Animated.View style={[$iconContainer, animatedUnlikeButtonStyles]}>
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.primary400} // pink
              />
            </Animated.View>
          </View>
        )
      },
    [],
  )

  return (
    <>
      <Text text={product.name} size="xl"></Text>
    </>
    // <Card
    //   style={$item}
    //   verticalAlignment="force-footer-bottom"
    //   onPress={handlePressCard}
    //   onLongPress={handlePressFavorite}
    //   HeadingComponent={
    //     <View style={$metadata}>
    //       <Text style={$metadataText} size="xxs" accessibilityLabel={product.name}>
    //         {product.categories[0]?.name}
    //       </Text>
    //       <Text style={$metadataText} size="xxs" accessibilityLabel={product.brand_info.title}>
    //         {product.brand_info.title}
    //       </Text>
    //     </View>
    //   }
    //   content={`${product.parsedTitleAndSubtitle.title} - ${product.parsedTitleAndSubtitle.price}`}
    //   {...accessibilityHintProps}
    //   RightComponent={
    //     <Image
    //       source={{
    //         uri: product.small_image.url,
    //       }}
    //       style={$itemThumbnail}
    //       // style={{ resizeMode: "cover", width: 20, height: 20 }}
    //     />
    //   }
    //   FooterComponent={
    //     <Button
    //       onPress={handlePressFavorite}
    //       onLongPress={handlePressFavorite}
    //       style={[$favoriteButton, isFavorite && $unFavoriteButton]}
    //       accessibilityLabel={
    //         isFavorite
    //           ? translate("demoPodcastListScreen.accessibility.unfavoriteIcon")
    //           : translate("demoPodcastListScreen.accessibility.favoriteIcon")
    //       }
    //       LeftAccessory={ButtonLeftAccessory}
    //     >
    //       <Text
    //         size="xxs"
    //         accessibilityLabel={translate("demoPodcastListScreen.unfavoriteButton")}
    //         weight="medium"
    //         text={
    //           isFavorite
    //             ? translate("demoPodcastListScreen.unfavoriteButton")
    //             : translate("demoPodcastListScreen.favoriteButton")
    //         }
    //       />
    //     </Button>
    //   }
    // />
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

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  borderRadius: 50,
  alignSelf: "flex-start",
  height: 50,
  width: 50,
}

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginEnd: spacing.sm,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.md,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xxxs,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
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
// #endregion
