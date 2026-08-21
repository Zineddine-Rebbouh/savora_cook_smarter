import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../theme";
import { useAuth } from "../state/AuthContext";

type CreateAccountScreenProps = {
  onFinish: () => void;
  onGoToLogin: () => void;
  theme: AppTheme;
};

const dietaryPreferences = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Halal",
  "Keto",
  "None",
];

// Simple email regex — catches most common typos without being overly strict
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateAccountScreen({
  onFinish,
  onGoToLogin,
  theme,
}: CreateAccountScreenProps) {
  const styles = createStyles(theme);
  const { registerUser, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Per-field validation state — only shown after user interacts with field
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Focus tracking for input border highlighting
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Shake animation for submit-error feedback
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Inline Validation ──────────────────────────────────────────────
  const emailError =
    emailTouched && email.length > 0 && !EMAIL_REGEX.test(email)
      ? "Please enter a valid email address"
      : null;

  const passwordError =
    passwordTouched && password.length > 0 && password.length < 8
      ? "Password must be at least 8 characters"
      : null;

  // Password strength indicator (0–3 scale)
  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Good", "Strong"][passwordStrength] ?? "";
  const strengthColor = [
    theme.colors.borderSubtle,
    theme.colors.accentDanger,
    theme.colors.accentWarning,
    theme.colors.accentSecondary,
  ][passwordStrength] ?? theme.colors.borderSubtle;

  const formValid =
    EMAIL_REGEX.test(email) && password.length >= 8;

  // ── Helpers ────────────────────────────────────────────────────────
  function toggleDiet(label: string) {
    setSelectedDiets((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  function triggerShake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  }

  async function handleCreateAccount() {
    // Force-show validation if user hasn't interacted
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!formValid) {
      triggerShake();
      return;
    }

    clearError();
    setSubmitting(true);
    try {
      await registerUser(email.trim(), password, selectedDiets);
      onFinish();
    } catch {
      triggerShake();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.pagePadding}>
        <View style={styles.accountContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerIconShell}>
              <Feather
                color={theme.colors.textInverse}
                name="user-plus"
                size={20}
              />
            </View>
            <Text style={styles.headerLabel}>NEW ACCOUNT</Text>
          </View>
          <Text style={styles.accountTitle}>Set up your cookbook</Text>
          <Text style={styles.accountSubtitle}>
            Create your account to save recipes, plan meals, and cook
            hands-free.
          </Text>

          {/* Backend error banner */}
          {authError ? (
            <View style={styles.errorBanner}>
              <Feather
                color={theme.colors.accentDanger}
                name="alert-circle"
                size={16}
              />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          ) : null}

          {/* Email field */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                emailFocused && styles.inputContainerFocused,
                emailError ? styles.inputContainerError : null,
              ]}
            >
              <Feather
                color={
                  emailError
                    ? theme.colors.accentDanger
                    : emailFocused
                      ? theme.colors.accentPrimary
                      : theme.colors.textTertiary
                }
                name="mail"
                size={18}
                style={styles.inputIcon}
              />
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onBlur={() => {
                  setEmailFocused(false);
                  setEmailTouched(true);
                }}
                onChangeText={(val) => {
                  setEmail(val);
                  if (authError) clearError();
                }}
                onFocus={() => setEmailFocused(true)}
                placeholder="Email address"
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.inputField}
                value={email}
              />
            </View>
            {emailError ? (
              <Text style={styles.fieldError}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password field */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                passwordFocused && styles.inputContainerFocused,
                passwordError ? styles.inputContainerError : null,
              ]}
            >
              <Feather
                color={
                  passwordError
                    ? theme.colors.accentDanger
                    : passwordFocused
                      ? theme.colors.accentPrimary
                      : theme.colors.textTertiary
                }
                name="lock"
                size={18}
                style={styles.inputIcon}
              />
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                onBlur={() => {
                  setPasswordFocused(false);
                  setPasswordTouched(true);
                }}
                onChangeText={(val) => {
                  setPassword(val);
                  setPasswordTouched(true);
                  if (authError) clearError();
                }}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Password (min 8 chars)"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={!showPassword}
                style={styles.inputField}
                value={password}
              />
              <Pressable
                hitSlop={8}
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                <Feather
                  color={theme.colors.textTertiary}
                  name={showPassword ? "eye-off" : "eye"}
                  size={18}
                />
              </Pressable>
            </View>
            {passwordError ? (
              <Text style={styles.fieldError}>{passwordError}</Text>
            ) : null}
            {/* Password strength bar */}
            {password.length > 0 ? (
              <View style={styles.strengthRow}>
                <View style={styles.strengthTrack}>
                  {[0, 1, 2].map((seg) => (
                    <View
                      key={seg}
                      style={[
                        styles.strengthSegment,
                        {
                          backgroundColor:
                            seg < passwordStrength
                              ? strengthColor
                              : theme.colors.borderSubtle,
                        },
                      ]}
                    />
                  ))}
                </View>
                {strengthLabel ? (
                  <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                    {strengthLabel}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>

          {/* Dietary preferences */}
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
                  {active ? (
                    <Feather
                      color={theme.colors.textInverse}
                      name="check"
                      size={12}
                      style={styles.dietChipIcon}
                    />
                  ) : null}
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

        {/* CTA Button */}
        <Animated.View
          style={{ transform: [{ translateX: shakeAnim }] }}
        >
          <Pressable
            disabled={submitting}
            onPress={handleCreateAccount}
            style={({ pressed }) => [
              styles.ctaButton,
              !formValid && !submitting && styles.ctaButtonDisabled,
              (pressed || submitting) && styles.pressed,
            ]}
          >
            {submitting ? (
              <ActivityIndicator
                color={theme.colors.textInverse}
                size="small"
                style={styles.ctaSpinner}
              />
            ) : null}
            <Text style={styles.ctaText}>
              {submitting ? "Creating\u2026" : "Create My Cookbook"}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Nav toggle to Login */}
        <Pressable onPress={onGoToLogin} style={styles.navLink}>
          <Text style={styles.navLinkText}>
            Already have an account?{" "}
            <Text style={styles.navLinkAccent}>Log in</Text>
          </Text>
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
    pagePadding: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[8],
      paddingBottom: spacing[6],
    },
    accountContent: {
      flex: 1,
    },
    headerRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[3],
      marginBottom: spacing[5],
    },
    headerIconShell: {
      alignItems: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.md,
      height: 36,
      justifyContent: "center",
      width: 36,
    },
    headerLabel: {
      color: colors.textTertiary,
      fontFamily: fonts.monoMedium,
      fontSize: 11,
      letterSpacing: 1.2,
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
      marginBottom: spacing[5],
    },
    // ── Error banner (backend errors) ──
    errorBanner: {
      alignItems: "center",
      backgroundColor: colors.warningSurface,
      borderColor: colors.accentDanger,
      borderRadius: radius.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing[2],
      marginBottom: spacing[4],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
    },
    errorBannerText: {
      color: colors.accentDanger,
      flex: 1,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    // ── Input fields ──
    inputWrapper: {
      marginBottom: spacing[3],
    },
    inputContainer: {
      alignItems: "center",
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 54,
    },
    inputContainerFocused: {
      borderColor: colors.accentPrimary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: colors.accentDanger,
      borderWidth: 2,
    },
    inputIcon: {
      marginLeft: spacing[4],
    },
    inputField: {
      color: colors.textPrimary,
      flex: 1,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
    },
    eyeButton: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    fieldError: {
      color: colors.accentDanger,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 16,
      marginTop: spacing[1],
      paddingLeft: spacing[4],
    },
    // ── Password strength ──
    strengthRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[2],
      marginTop: spacing[2],
      paddingLeft: spacing[1],
    },
    strengthTrack: {
      flexDirection: "row",
      gap: spacing[1],
      flex: 1,
    },
    strengthSegment: {
      borderRadius: radius.pill,
      flex: 1,
      height: 4,
    },
    strengthLabel: {
      fontFamily: fonts.monoMedium,
      fontSize: 10,
      letterSpacing: 0.5,
    },
    // ── Dietary preferences ──
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
      alignItems: "center",
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing[1],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dietChipActive: {
      backgroundColor: colors.accentPrimary,
      borderColor: colors.accentPrimary,
    },
    dietChipIcon: {
      marginRight: 2,
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
    // ── CTA Button ──
    ctaButton: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.xl,
      flexDirection: "row",
      gap: spacing[2],
      height: 52,
      justifyContent: "center",
      width: "90%",
    },
    ctaButtonDisabled: {
      opacity: 0.55,
    },
    ctaSpinner: {
      marginRight: spacing[1],
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
    // ── Nav link ──
    navLink: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      paddingVertical: spacing[3],
    },
    navLinkText: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 14,
      lineHeight: 18,
    },
    navLinkAccent: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodySemiBold,
    },
  });
}
