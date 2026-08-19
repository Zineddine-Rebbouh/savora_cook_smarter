import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../theme";
import { useAuth } from "../state/AuthContext";

type OnboardingScreenProps = {
  onFinish: () => void;
  theme: AppTheme;
};

const slides = [
  {
    key: "slide-1",
    title: "Hands-free gesture cooking",
    subtitle:
      "Your kitchen should adapt to your hands, not the other way around.",
    icon: "repeat",
  },
  {
    key: "slide-2",
    title: "Import any recipe instantly",
    subtitle:
      "Paste a URL and Savora structures the ingredients, steps, and timing.",
    icon: "link",
  },
  {
    key: "slide-3",
    title: "Cook with confidence",
    subtitle:
      "Wake-lock cooking mode keeps the screen ready when your hands are full.",
    icon: "clock",
  },
];

const dietaryPreferences = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Halal",
  "Keto",
  "None",
];

export function OnboardingScreen({ onFinish, theme }: OnboardingScreenProps) {
  const styles = createStyles(theme);
  const [stage, setStage] = useState<"carousel" | "account">("carousel");
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<FlatList<any>>(null);

  const { registerUser, error: authError, clearError } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function toggleDiet(label: string) {
    setSelectedDiets((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  function advanceSlide() {
    if (index === slides.length - 1) {
      setStage("account");
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    scrollRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }

  async function handleCreateAccount() {
    if (!email || !password) {
      setLocalError("Please enter both an email and password.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    setLocalError(null);
    clearError();
    setSubmitting(true);
    try {
      await registerUser(email.trim(), password, selectedDiets);
      onFinish();
    } catch (err: any) {
      // Error handled by AuthContext or caught here
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = localError || authError;

  if (stage === "account") {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.pagePadding}>
          <View style={styles.accountContent}>
            <Text style={styles.accountTitle}>Set up your cookbook</Text>
            <Text style={styles.accountSubtitle}>
              Tell us how you eat. Set these now, skip forever.
            </Text>

            {displayError ? (
              <View style={styles.errorContainer}>
                <Feather color="#D94F3D" name="alert-circle" size={16} />
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={(val) => {
                setEmail(val);
                if (localError) setLocalError(null);
                if (authError) clearError();
              }}
              placeholder="Email"
              placeholderTextColor={theme.colors.textTertiary}
              style={styles.input}
              value={email}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              onChangeText={(val) => {
                setPassword(val);
                if (localError) setLocalError(null);
                if (authError) clearError();
              }}
              placeholder="Password (min 8 chars)"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              style={styles.input}
              value={password}
            />

            <Text style={styles.dietLabel}>Dietary preferences</Text>
            <View style={styles.dietRow}>
              {dietaryPreferences.map((label) => {
                const active = selectedDiets.includes(label);

                return (
                  <Pressable
                    key={label}
                    onPress={() => toggleDiet(label)}
                    style={[styles.dietChip, active && styles.dietChipActive]}
                  >
                    <Text
                      style={[
                        styles.dietChipText,
                        active && styles.dietChipTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            disabled={submitting}
            onPress={handleCreateAccount}
            style={({ pressed }) => [
              styles.accountCtaButton,
              styles.ctaSpacing,
              (pressed || submitting) && styles.pressed,
            ]}
          >
            <Text style={styles.ctaText}>
              {submitting ? "Creating..." : "Create My Cookbook"}
            </Text>
          </Pressable>
          <Pressable onPress={onFinish} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <LinearGradient
        colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]}
        style={styles.heroShell}
      >
        <Pressable onPress={() => setStage("account")} style={styles.skipLink}>
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

      <View style={styles.carouselShell}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );
            setIndex(newIndex);
          }}
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

      <View style={styles.footer}>
        <View style={styles.progressRow}>
          <View style={styles.dotsRow}>
            {slides.map((_, slideIndex) => (
              <View
                key={slideIndex}
                style={[styles.dot, slideIndex === index && styles.dotActive]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            {String(index + 1).padStart(2, "0")} / 03
          </Text>
        </View>
        <Pressable onPress={advanceSlide} style={styles.ctaButton}>
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

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    pagePadding: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[10],
      paddingBottom: spacing[6],
    },
    accountContent: {
      flex: 1,
      justifyContent: "center",
    },
    accountTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 36,
    },
    accountSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
      marginBottom: spacing[4],
    },
    errorContainer: {
      alignItems: "center",
      backgroundColor: "#FDF2F0",
      borderColor: colors.danger,
      borderRadius: radius.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing[2],
      marginBottom: spacing[3],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
    },
    errorText: {
      color: colors.danger,
      flex: 1,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    input: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing[3],
      minHeight: 54,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dietLabel: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[4],
      marginBottom: spacing[3],
    },
    dietRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing[2],
    },
    dietChip: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dietChipActive: {
      backgroundColor: colors.accentPrimary,
      borderColor: colors.accentPrimary,
    },
    dietChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    dietChipTextActive: {
      color: colors.textInverse,
    },
    accountCtaButton: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.xl,
      height: 52,
      justifyContent: "center",
      width: "90%",
    },
    ctaSpacing: {
      marginTop: "auto",
    },
    skipButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      paddingVertical: spacing[3],
    },
    skipText: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
    pressed: {
      opacity: 0.8,
    },
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
      textAlign: "center",
      maxWidth: 280,
    },
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
      textAlign: "center",
      maxWidth: 320,
    },
    footer: {
      alignItems: "center",
      backgroundColor: colors.bgPrimary,
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[8],
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
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.pill,
      height: 10,
      width: 10,
    },
    dotActive: {
      backgroundColor: colors.accentPrimary,
      width: 24,
    },
    ctaButton: {
      alignItems: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.xl,
      height: 52,
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing[3],
      width: "100%",
    },
    ctaText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
