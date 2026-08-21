import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

type LoginScreenProps = {
  onFinish: () => void;
  onGoToCreateAccount: () => void;
  theme: AppTheme;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({
  onFinish,
  onGoToCreateAccount,
  theme,
}: LoginScreenProps) {
  const styles = createStyles(theme);
  const { loginUser, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Per-field validation state
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Focus tracking
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Shake animation
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

  const formValid = EMAIL_REGEX.test(email) && password.length >= 8;

  // ── Helpers ────────────────────────────────────────────────────────
  function triggerShake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  }

  async function handleLogin() {
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!formValid) {
      triggerShake();
      return;
    }

    clearError();
    setSubmitting(true);
    try {
      await loginUser(email.trim(), password);
      onFinish();
    } catch {
      triggerShake();
    } finally {
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    Alert.alert(
      "Coming soon",
      "Password reset is not yet available. Please contact support if you need help accessing your account.",
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.pagePadding}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerIconShell}>
              <Feather
                color={theme.colors.textInverse}
                name="log-in"
                size={20}
              />
            </View>
            <Text style={styles.headerLabel}>WELCOME BACK</Text>
          </View>
          <Text style={styles.title}>Log in to Savora</Text>
          <Text style={styles.subtitle}>
            Pick up where you left off — your recipes and pantry are waiting.
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
                placeholder="Password"
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
          </View>

          {/* Forgot password link */}
          <Pressable
            onPress={handleForgotPassword}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotLinkText}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* CTA Button */}
        <Animated.View
          style={{ transform: [{ translateX: shakeAnim }] }}
        >
          <Pressable
            disabled={submitting}
            onPress={handleLogin}
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
              {submitting ? "Logging in\u2026" : "Log In"}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Nav toggle to Create Account */}
        <Pressable onPress={onGoToCreateAccount} style={styles.navLink}>
          <Text style={styles.navLinkText}>
            New here?{" "}
            <Text style={styles.navLinkAccent}>Create an account</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
// Intentionally mirrors CreateAccountScreen styles for visual consistency
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
    content: {
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
    title: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 36,
    },
    subtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
      marginBottom: spacing[5],
    },
    // ── Error banner ──
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
    // ── Forgot password ──
    forgotLink: {
      alignSelf: "flex-end",
      paddingVertical: spacing[1],
    },
    forgotLinkText: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
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
