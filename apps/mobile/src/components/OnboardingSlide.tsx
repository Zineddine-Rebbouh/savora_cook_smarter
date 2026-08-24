import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { AppTheme } from "../theme";
import type { OnboardingSlideData } from "../screens/onboardingData";

type OnboardingSlideProps = {
  data: OnboardingSlideData;
  index: number;
  width: number;
  activeIndex: number;
  theme: AppTheme;
  onSkip: () => void;
  height: number;
};

export function OnboardingSlide({
  data,
  index,
  width,
  activeIndex,
  theme,
  onSkip,
  height,
}: OnboardingSlideProps) {
  const styles = createStyles(theme);

  return (
    <View style={[styles.slide, { height, width }]}>
      <View style={styles.heroImageShell}>
        <Image
          accessibilityLabel={data.imageAlt}
          source={{ uri: data.image }}
          style={styles.heroImage}
        />
        <View style={[styles.imageTint, { backgroundColor: data.tint }]} />
        <View style={styles.imageHeader}>
          <View>
            <View style={styles.counterLine} />
            <Text style={styles.counterText}>0{index + 1} / 03</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.contentSheet}>
        {activeIndex === 0 && <Text style={styles.wordmark}>SAVORA</Text>}
        <Text style={styles.slideTitle}>{data.title}</Text>
        <Text style={styles.slideText}>{data.subtitle}</Text>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, spacing } = theme;

  return StyleSheet.create({
    slide: { flex: 1 },
    heroImageShell: { height: "62%", overflow: "hidden", position: "relative" },
    heroImage: { ...StyleSheet.absoluteFillObject, resizeMode: "cover" },
    imageTint: { ...StyleSheet.absoluteFillObject },
    imageHeader: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
      left: spacing[6],
      position: "absolute",
      right: spacing[6],
      top: spacing[8],
    },
    counterLine: {
      backgroundColor: "rgba(245,239,230,0.45)",
      height: 1,
      marginBottom: spacing[2],
      width: 48,
    },
    counterText: {
      color: "rgba(245,239,230,0.65)",
      fontFamily: fonts.mono,
      fontSize: 11,
      letterSpacing: 1,
    },
    skipText: { color: "rgba(245,239,230,0.7)", fontFamily: fonts.body, fontSize: 13 },
    contentSheet: {
      backgroundColor: colors.bgDark,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      flex: 1,
      marginTop: -28,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[8],
      zIndex: 1,
    },
    wordmark: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      letterSpacing: 2.2,
      marginBottom: spacing[4],
    },
    slideTitle: {
      color: colors.textInverse,
      fontFamily: fonts.displayLight,
      fontSize: 38,
      lineHeight: 43,
      marginBottom: spacing[3],
    },
    slideText: {
      color: "rgba(245,239,230,0.58)",
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
