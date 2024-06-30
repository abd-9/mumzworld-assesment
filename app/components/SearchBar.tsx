// AnimatedSearchBar.tsx
import React, { useState } from "react"
import { StyleSheet, View, TextInput, Pressable, Dimensions } from "react-native"
import { IconButton, useTheme } from "react-native-paper"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

interface AnimatedSearchBarProps {
  placeholder?: string
  onChangeText?: (text: string) => void
  value?: string
}

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  placeholder = "Search",
  onChangeText,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const screenWidth = Dimensions.get("window").width
  const expandedWidth = screenWidth - 40
  const width = useSharedValue(50)
  const handleFocus = () => {
    setIsFocused(true)
    width.value = withTiming(expandedWidth, {
      // should take the full width
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
  }

  const handleBlur = () => {
    setIsFocused(false)
    width.value = withTiming(50, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }))

  return (
    <View style={styles.container}>
      <Pressable onPress={handleFocus}>
        <Animated.View style={[styles.searchContainer, animatedStyle]}>
          <IconButton icon="magnify" size={20} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            value={value}
          />
          {isFocused && (
            <IconButton
              icon="close"
              size={20}
              onPress={() => {
                if (onChangeText) {
                  onChangeText("")
                }
                handleBlur()
              }}
            />
          )}
        </Animated.View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  searchContainer: {
    width: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
  },
})

export default AnimatedSearchBar
