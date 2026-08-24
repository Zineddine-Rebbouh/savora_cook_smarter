import { Feather } from "@expo/vector-icons";
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

import { OnboardingSlide } from "../components/OnboardingSlide";
import { onboardingSlides } from "./onboardingData";
import type { AppTheme } from "../theme";

type OnboardingScreenProps = {
  onFinish: () => void;
  theme: AppTheme;
};

export function OnboardingScreen({ onFinish, theme }: OnboardingScreenProps) {
  const styles = createStyles(theme);
  const [index, setIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<FlatList<(typeof onboardingSlides)[number]>>(null);

  function goToSlide(nextIndex: number) {
    if (nextIndex === index) return;
    setIndex(nextIndex);
    scrollRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }

  function advance() {
    if (index === onboardingSlides.length - 1) {
      onFinish();
      return;
    }
    goToSlide(index + 1);
  }

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.shell}>
        <Animated.FlatList
          bounces={false}
          data={onboardingSlides}
          onLayout={(event) => setCarouselHeight(event.nativeEvent.layout.height)}
          style={styles.carousel}
          horizontal
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={handleMomentumEnd}
          pagingEnabled
          ref={scrollRef as React.RefObject<FlatList<(typeof onboardingSlides)[number]>>}
          renderItem={({ item, index: slideIndex }) => (
            <OnboardingSlide
              activeIndex={index}
              data={item}
              index={slideIndex}
              onSkip={onFinish}
              theme={theme}
              width={width}
              height={carouselHeight}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {onboardingSlides.map((slide, slideIndex) => (
              <Pressable
                accessibilityLabel={`Go to onboarding slide ${slideIndex + 1}`}
                accessibilityRole="button"
                key={slide.key}
                onPress={() => goToSlide(slideIndex)}
                style={[
                  styles.dot,
                  slideIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={advance}
            style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
          >
            <Text style={styles.ctaText}>
              {index === onboardingSlides.length - 1 ? "Get started" : "Next"}
            </Text>
            <Feather color={theme.colors.textInverse} name="arrow-right" size={16} />
          </Pressable>
          {index === onboardingSlides.length - 1 && (
            <Text style={styles.finalTagline}>Cook smarter. Waste less. Eat better.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, spacing } = theme;

  return StyleSheet.create({
    safeArea: { backgroundColor: colors.bgDark, flex: 1 },
    shell: { backgroundColor: colors.bgDark, flex: 1 },
    carousel: { flex: 1 },
    footer: {
      alignItems: "center",
      backgroundColor: colors.bgDark,
      paddingBottom: spacing[6],
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
    },
    dotsRow: { flexDirection: "row", gap: spacing[2], marginBottom: spacing[6] },
    dot: { borderRadius: radius.pill, height: 4 },
    activeDot: { backgroundColor: colors.accentPrimary, width: 28 },
    inactiveDot: { backgroundColor: "rgba(245,239,230,0.2)", width: 8 },
    ctaButton: {
      alignItems: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      flexDirection: "row",
      gap: spacing[3],
      height: 58,
      justifyContent: "center",
      width: "100%",
    },
    ctaText: { color: colors.textInverse, fontFamily: fonts.bodyMedium, fontSize: 15 },
    pressed: { opacity: 0.8 },
    finalTagline: {
      color: "rgba(245,239,230,0.35)",
      fontFamily: fonts.body,
      fontSize: 12,
      letterSpacing: 1,
      marginTop: spacing[4],
      textTransform: "uppercase",
    },
  });
}
