import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../theme";

type OnboardingScreenProps = {
  /** Called when the user finishes the carousel — navigates to CreateAccount. */
  onFinish: () => void;
  theme: AppTheme;
};

const slides = [
  {
    key: "slide-1",
    title: "Hands-free gesture cooking",
    subtitle:
      "Your kitchen should adapt to your hands, not the other way around.",
    icon: "repeat" as const,
  },
  {
    key: "slide-2",
    title: "Import any recipe instantly",
    subtitle:
      "Paste a URL and Savora structures the ingredients, steps, and timing.",
    icon: "link" as const,
  },
  {
    key: "slide-3",
    title: "Cook with confidence",
    subtitle:
      "Wake-lock cooking mode keeps the screen ready when your hands are full.",
    icon: "clock" as const,
  },
];

/*
 * Transition approach: Horizontal swipe via FlatList + pagingEnabled.
 *
 * Why FlatList instead of a custom gesture handler?
 * FlatList's pagingEnabled already delivers native-quality momentum-based
 * snapping on both iOS and Android with no extra dependencies. Adding
 * react-native-gesture-handler PanResponder would be unnecessary complexity
 * for the same UX. The animated dots use an Animated.Value driven by
 * onScroll's contentOffset for a smooth, frame-synced width interpolation.
 */
export function OnboardingScreen({ onFinish, theme }: OnboardingScreenProps) {
  const styles = createStyles(theme);
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<FlatList<(typeof slides)[number]>>(null);

  // Driven by onScroll — used for smooth animated dot interpolation
  const scrollX = useRef(new Animated.Value(0)).current;

  function advanceSlide() {
    if (index === slides.length - 1) {
      onFinish();
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    scrollRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );
    setIndex(newIndex);
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {/* ── Hero brand area ── */}
      <LinearGradient
        colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]}
        style={styles.heroShell}
      >
        <Pressable onPress={onFinish} style={styles.skipLink}>
          <Text style={styles.skipLinkText}>Skip</Text>
        </Pressable>
        <View style={styles.heroContent}>
          <View style={styles.brandRow}>
            <View style={styles.logoShell}>
              <Text style={styles.logo}>S</Text>
            </View>
            <View>
              <Text style={styles.appName}>Savora</Text>
              <Text style={styles.brandLabel}>YOUR POCKET COOKBOOK</Text>
            </View>
          </View>
          <Text style={styles.tagline}>
            Cook smarter. Waste less. Eat better.
          </Text>
        </View>
        <View style={styles.heroAccent} />
      </LinearGradient>

      {/* ── Feature slides ── */}
      <View style={styles.carouselShell}>
        <Animated.FlatList
          data={slides}
          horizontal
          pagingEnabled
          ref={scrollRef as React.RefObject<FlatList<(typeof slides)[number]>>}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={handleMomentumEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          renderItem={({ item, index: slideIndex }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.slideEyebrow}>
                <Text style={styles.slideNumber}>0{slideIndex + 1}</Text>
                <View style={styles.eyebrowLine} />
                <Text style={styles.slideLabel}>SAVORA FEATURES</Text>
              </View>
              <View style={styles.illustrationShell}>
                <View style={styles.illustrationHalo} />
                <View style={styles.illustrationIcon}>
                  <Feather
                    color={theme.colors.textInverse}
                    name={item.icon}
                    size={42}
                  />
                </View>
                <View style={styles.illustrationBadge}>
                  <Feather
                    color={theme.colors.textInverse}
                    name="check"
                    size={14}
                  />
                </View>
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideText}>{item.subtitle}</Text>
            </View>
          )}
        />
      </View>

      {/* ── Footer with animated dots + CTA ── */}
      <View style={styles.footer}>
        <View style={styles.progressRow}>
          <View style={styles.dotsRow}>
            {slides.map((_, slideIndex) => {
              // Smoothly interpolate each dot's width based on scroll position
              const dotWidth = scrollX.interpolate({
                inputRange: [
                  (slideIndex - 1) * width,
                  slideIndex * width,
                  (slideIndex + 1) * width,
                ],
                outputRange: [10, 24, 10],
                extrapolate: "clamp",
              });
              const dotOpacity = scrollX.interpolate({
                inputRange: [
                  (slideIndex - 1) * width,
                  slideIndex * width,
                  (slideIndex + 1) * width,
                ],
                outputRange: [0.4, 1, 0.4],
                extrapolate: "clamp",
              });
              const dotColor = scrollX.interpolate({
                inputRange: [
                  (slideIndex - 1) * width,
                  slideIndex * width,
                  (slideIndex + 1) * width,
                ],
                outputRange: [
                  theme.colors.bgTertiary,
                  theme.colors.accentPrimary,
                  theme.colors.bgTertiary,
                ],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={slideIndex}
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor: dotColor,
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.progressText}>
            {String(index + 1).padStart(2, "0")} / 0{slides.length}
          </Text>
        </View>
        <Pressable
          onPress={advanceSlide}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.ctaText}>
            {index === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Feather
            color={theme.colors.textInverse}
            name="arrow-right"
            size={18}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    // ── Hero ──
    heroShell: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing[5],
      position: "relative",
    },
    skipLink: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      position: "absolute",
      right: spacing[3],
      top: spacing[3],
      zIndex: 1,
    },
    skipLinkText: {
      color: colors.textInverse,
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
    heroContent: {
      alignItems: "center",
      gap: spacing[3],
      marginTop: spacing[8],
    },
    brandRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[4],
    },
    brandLabel: {
      color: colors.accentSecondary,
      fontFamily: fonts.monoMedium,
      fontSize: 9,
      letterSpacing: 1.2,
      marginTop: spacing[1],
    },
    heroAccent: {
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      bottom: spacing[6],
      height: 4,
      left: spacing[6],
      position: "absolute",
      width: 48,
    },
    logoShell: {
      alignItems: "center",
      backgroundColor: colors.bgDark,
      borderRadius: radius.xl,
      height: 96,
      justifyContent: "center",
      width: 96,
    },
    logo: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 42,
      lineHeight: 50,
    },
    appName: {
      color: colors.textPrimary,
      fontFamily: fonts.displayLight,
      fontSize: 32,
      lineHeight: 38,
    },
    tagline: {
      color: colors.textTertiary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
      maxWidth: 280,
      textAlign: "center",
    },
    // ── Carousel ──
    carouselShell: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    slide: {
      alignItems: "center",
      flex: 1,
      justifyContent: "flex-start",
      paddingHorizontal: spacing[6],
      paddingTop: spacing[6],
    },
    slideEyebrow: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[2],
      marginBottom: spacing[4],
      width: "100%",
    },
    slideNumber: {
      color: colors.accentPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 12,
    },
    eyebrowLine: {
      backgroundColor: colors.borderSubtle,
      flex: 1,
      height: 1,
    },
    slideLabel: {
      color: colors.textTertiary,
      fontFamily: fonts.monoMedium,
      fontSize: 10,
      letterSpacing: 1,
    },
    illustrationShell: {
      alignItems: "center",
      backgroundColor: colors.bgDark,
      borderRadius: radius.xl,
      height: 190,
      justifyContent: "center",
      marginBottom: spacing[6],
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
    illustrationHalo: {
      backgroundColor: colors.bgDarkSecondary,
      borderColor: colors.accentPrimary,
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 156,
      opacity: 0.75,
      position: "absolute",
      width: 156,
    },
    illustrationIcon: {
      alignItems: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.xl,
      height: 84,
      justifyContent: "center",
      transform: [{ rotate: "-8deg" }],
      width: 84,
    },
    illustrationBadge: {
      alignItems: "center",
      backgroundColor: colors.accentSecondary,
      borderColor: colors.bgDark,
      borderRadius: radius.pill,
      borderWidth: 4,
      bottom: 40,
      height: 30,
      justifyContent: "center",
      position: "absolute",
      right: "28%",
      width: 30,
    },
    slideTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 32,
      lineHeight: 38,
      marginBottom: spacing[3],
      textAlign: "center",
    },
    slideText: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      maxWidth: 320,
      textAlign: "center",
    },
    // ── Footer ──
    footer: {
      alignItems: "center",
      backgroundColor: colors.bgPrimary,
      paddingBottom: spacing[8],
      paddingHorizontal: spacing[6],
      paddingTop: spacing[2],
    },
    progressRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[5],
      width: "100%",
    },
    dotsRow: {
      flexDirection: "row",
      gap: spacing[3],
    },
    progressText: {
      color: colors.textTertiary,
      fontFamily: fonts.monoMedium,
      fontSize: 11,
    },
    dot: {
      borderRadius: radius.pill,
      height: 10,
    },
    ctaButton: {
      alignItems: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.xl,
      flexDirection: "row",
      gap: spacing[3],
      height: 52,
      justifyContent: "center",
      width: "100%",
    },
    ctaText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    pressed: {
      opacity: 0.8,
    },
  });
}
