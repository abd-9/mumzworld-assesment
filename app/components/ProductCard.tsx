import React, { useState } from "react"
import { AccessibilityProps, Platform, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Card, Title, Paragraph, Text } from "react-native-paper"
import { FontAwesome } from "@expo/vector-icons"
import Animated, {
  BounceIn,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import RatingBar from "./Rating"
import { random } from "lodash"
import { ButtonAccessoryProps } from "./Button"
import { colors, spacing } from "app/theme"
import { Icon } from "./Icon"
import { translate } from "app/i18n"
// import { Rating } from "react-native-ratings"

interface ProductCardProps {
  image: string
  name: string
  description: string
  price: string
  oldPrice?: string
  rating: number
  discount?: number
  newPrice?: string
  isNew?: boolean
  onAddToCart: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  description,
  price,
  newPrice,
  rating,
  discount,
  isNew,
  onAddToCart,
}) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <View style={styles.card}>
      <View style={styles.labelsContainer}>
        {discount && discount > 0 && <Text style={styles.discountLabel}>-{discount}%</Text>}
        {/* {isNew && <Text style={styles.newLabel}>New</Text>} */}
      </View>
      <Card.Cover source={{ uri: image }} style={styles.coverImage} />
      <View style={styles.favoriteIconContainer}>
        <FontAwesome
          name={isFavorite ? "heart" : "heart-o"}
          size={24}
          color={isFavorite ? "red" : "gray"}
          onPress={handleFavoriteToggle}
        />
      </View>
      <Card.Content>
        <RatingBar rating={random(2, 5, true)} size={20} />
        <Title style={styles.title}>{name}</Title>
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
        <View style={styles.priceContainer}>
          {newPrice ? (
            <>
              <Text style={styles.oldPrice}> {price}</Text>
              <Text style={styles.price}> {newPrice}</Text>
            </>
          ) : (
            <Text style={styles.price}>{price}</Text>
          )}
        </View>
      </Card.Content>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 0,
    paddingHorizontal: 0,
    marginBottom: 10,
    // backgroundColor: colors.border,
    borderRadius: 15,
    width: "100%",
  },
  labelsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    borderRadius: 10,
  },
  discountLabel: {
    backgroundColor: "red",
    color: "white",
    padding: 5,
    borderRadius: 10,
    marginBottom: 5,
  },
  newLabel: {
    backgroundColor: "green",
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
  coverImage: {
    height: 200,
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingNumber: {
    marginLeft: 5,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "gray",
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  columnWrapper: {
    marginHorizontal: 21,
  },
})

export default ProductCard
