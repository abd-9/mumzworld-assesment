import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface RatingBarProps {
  rating: number
  size?: number
}

const RatingBar: React.FC<RatingBarProps> = ({ rating, size = 32 }) => {
  const renderStars = () => {
    const filledStars = Math.floor(rating)
    const halfStar = rating - filledStars >= 0.5

    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(<MaterialIcons key={i} name="star" size={size} style={styles.starSelected} />)
      } else if (i === filledStars && halfStar) {
        stars.push(
          <MaterialIcons key={i} name="star-half" size={size} style={styles.starSelected} />,
        )
      } else {
        stars.push(
          <MaterialIcons key={i} name="star-border" size={size} style={styles.starUnselected} />,
        )
      }
    }
    return stars
  }

  return (
    <View style={styles.container}>
      <View style={styles.stars}>{renderStars()}</View>
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  stars: {
    flexDirection: "row",
  },
  starSelected: {
    color: "#FFD700", // gold
  },
  starUnselected: {
    color: "#aaa",
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 10,
  },
})

export default RatingBar
