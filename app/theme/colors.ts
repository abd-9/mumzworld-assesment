export const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#A54F31",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const semanticColors = {
  fg: {
    /**
     * This is the darkest gray and default text color.
     */
    text: "#27272a",
    /**
     * This is a little lighter gray.
     */
    textWeak: "#71717a",
    /**
     * The lightest of all the grays.
     */
    textDisabled: "#d4d4d8",
    /**
     * White text for dark backgrounds.
     */
    textInvert: "#ffffff",
    /**
     * Brand primary color on icons.
     */
    icon: "#0070BE",
    /**
     * Accent color used for important information and promo banners.
     */
    accent: "#C30045",
    /**
     * Accent color used for hyperlinks.
     */
    link: "#0583F2",
    /**
     * Used for success copy text.
     */
    success: "#1ac057",
    /**
     * Used for attention and warnings.
     */
    attention: "#c88a04",
    /**
     * Used for error text.
     */
    error: "#f67416",
  },
  bg: {
    /**
     * Used when an action or navigation is on a subtle background.
     */
    muted: "#e4e4e7",
    /**
     * Used as a background color in components such as Page and Frame backgrounds.
     */
    subtle: "#f4f4f5",
    /**
     * Default background color for the whole website.
     */
    white: "#ffffff",
    /**
     * Primary background color.
     */
    primary: "#fd6b6b",
    /**
     * Primary light background color.
     */
    primaryLight: "#fef1f1",
    /**
     * Secondary background color.
     */
    secondary: "#0583F2",
    /**
     * Light version of the secondary background color.
     */
    secondaryLight: "#23468C",
  },
  support: {
    /**
     * Cyan support color.
     */
    cyan: "#C7E3FC",
    /**
     * Light cyan support color.
     */
    cyanLight: "#EFF7FF",
    /**
     * Dark cyan support color.
     */
    cyanDark: "#04ADBF",
    /**
     * Lime support color.
     */
    lime: "#026873",
    /**
     * Light lime support color.
     */
    limeLight: "#BEEDF2",
    /**
     * Dark lime support color.
     */
    limeDark: "#ECFDFF",
    /**
     * Yellow support color.
     */
    yellow: "#F1BE71",
    /**
     * Light yellow support color.
     */
    yellowLight: "#864E0E",
    /**
     * Dark yellow support color.
     */
    yellowDark: "#FCF2E3",
  },
  feedback: {
    /**
     * Color for UI elements related to errors.
     */
    errorLight: "#ffedd6",
    /**
     * Color for UI elements related to errors.
     */
    error: "#f67416",
    /**
     * Dark color for UI elements related to errors.
     */
    errorDark: "#9b3b12",
    /**
     * Background color for UI elements related to success.
     */
    successLight: "#defce9",
    /**
     * Color for UI elements related to success.
     */
    success: "#1ac057",
    /**
     * Dark color for UI elements related to success.
     */
    successDark: "#1c713c",
    /**
     * Color for UI elements related to warning.
     */
    warningLight: "#fef9c3",
    /**
     * Color for UI elements related to warning.
     */
    warning: "#e7b008",
    /**
     * Dark color for UI elements related to warning.
     */
    warningDark: "#864E0E",
  },
} as const

export const colors = {
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: semanticColors.fg.text,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: semanticColors.bg.primaryLight,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: semanticColors.feedback.error,
  /**
   * Error Background.
   */
  errorBackground: semanticColors.feedback.errorLight,
} as const
