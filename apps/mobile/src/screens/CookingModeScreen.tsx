import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type CookingModeScreenProps = {
  onExit: () => void;
  theme: AppTheme;
};

const steps = [
  {
    title: 'Heat the pan over medium heat with oil',
    note: 'Use a heavy skillet',
    timer: null,
  },
  {
    title: 'Add garlic and cook until fragrant',
    note: null,
    timer: 2,
  },
  {
    title: 'Stir in tomatoes and simmer for 12 minutes',
    note: 'Keep the lid slightly ajar',
    timer: 12,
  },
  {
    title: 'Fold in spinach and finish with lemon zest',
    note: null,
    timer: null,
  },
];

export function CookingModeScreen({ onExit, theme }: CookingModeScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const styles = createStyles(theme);
  const step = steps[currentStep - 1];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.modeLabel}>Savora cooking mode</Text>
            <Text style={styles.recipeName}>Creamy Tuscan Chicken</Text>
          </View>
          <View style={styles.exitPill}>
            <Pressable onPress={onExit} style={styles.exitButton}>
              <Text style={styles.exitText}>✕ Exit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.stepIndicator}>
          <Text style={styles.stepCount}>Step {currentStep} of {steps.length}</Text>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>0{currentStep}</Text>
          <Text style={styles.stepCopy}>{step.title}</Text>
          {step.note ? <Text style={styles.stepNote}>{step.note}</Text> : null}
          {step.timer ? (
            <View style={styles.timerChip}>
              <Feather color={theme.colors.bgDark} name="clock" size={14} />
              <Text style={styles.timerChipText}>{step.timer}:00 — Tap to start</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.controlsRow}>
          <Pressable
            disabled={currentStep === 1}
            onPress={() => setCurrentStep((value) => Math.max(1, value - 1))}
            style={[styles.navButton, currentStep === 1 && styles.navButtonDisabled]}
          >
            <Feather color={theme.colors.textPrimary} name="chevron-left" size={20} />
            <Text style={styles.navLabel}>Prev</Text>
          </Pressable>
          <Pressable style={styles.voiceButton}>
            <View style={styles.voicePulse} />
            <Feather color={theme.colors.textInverse} name="mic" size={20} />
          </Pressable>
          <Pressable
            disabled={currentStep === steps.length}
            onPress={() => setCurrentStep((value) => Math.min(steps.length, value + 1))}
            style={[styles.navButton, currentStep === steps.length && styles.navButtonDisabled]}
          >
            <Text style={styles.navLabel}>Next</Text>
            <Feather color={theme.colors.textPrimary} name="chevron-right" size={20} />
          </Pressable>
        </View>

        <View style={styles.quickGlanceCard}>
          <Text style={styles.quickGlanceTitle}>Ingredients quick glance</Text>
          {['2 cloves garlic', '1 lemon', '120g spinach'].map((item) => (
            <View key={item} style={styles.quickItemRow}>
              <Text style={styles.quickItemAmount}>1x</Text>
              <Text style={styles.quickItemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.bgDark,
      flex: 1,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
      paddingBottom: spacing[5],
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[6],
    },
    modeLabel: {
      color: colors.textInverse,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      opacity: 0.6,
      marginBottom: spacing[1],
    },
    recipeName: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 22,
      lineHeight: 30,
    },
    exitPill: {
      backgroundColor: colors.bgDarkSecondary,
      borderRadius: radius.xl,
    },
    exitButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    exitText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
    },
    stepIndicator: {
      marginBottom: spacing[4],
    },
    stepCount: {
      color: colors.textInverse,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      opacity: 0.55,
    },
    stepCard: {
      alignItems: 'center',
      backgroundColor: colors.bgDarkSecondary,
      borderRadius: radius.xl,
      minHeight: 340,
      justifyContent: 'center',
      padding: spacing[6],
      position: 'relative',
    },
    stepNumber: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 120,
      lineHeight: 120,
      opacity: 0.08,
      position: 'absolute',
      right: spacing[5],
      top: spacing[5],
    },
    stepCopy: {
      color: colors.textInverse,
      fontFamily: fonts.displaySemiBold,
      fontSize: 34,
      lineHeight: 42,
      textAlign: 'center',
      marginBottom: spacing[4],
    },
    stepNote: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
      textAlign: 'center',
    },
    timerChip: {
      alignItems: 'center',
      backgroundColor: colors.accentWarning,
      borderRadius: radius.pill,
      flexDirection: 'row',
      gap: spacing[2],
      marginTop: spacing[4],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    timerChipText: {
      color: colors.bgDark,
      fontFamily: fonts.monoMedium,
      fontSize: 14,
      lineHeight: 20,
    },
    controlsRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing[6],
    },
    navButton: {
      alignItems: 'center',
      backgroundColor: colors.bgDarkSecondary,
      borderRadius: radius.xl,
      flex: 1,
      flexDirection: 'row',
      gap: spacing[2],
      justifyContent: 'center',
      paddingVertical: spacing[4],
    },
    navButtonDisabled: {
      opacity: 0.4,
    },
    navLabel: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    voiceButton: {
      alignItems: 'center',
      backgroundColor: colors.accentSecondary,
      borderRadius: radius.xl,
      height: 56,
      justifyContent: 'center',
      width: 56,
    },
    voicePulse: {
      borderColor: colors.textInverse,
      borderRadius: 999,
      borderWidth: 1,
      height: 56,
      position: 'absolute',
      width: 56,
      opacity: 0.3,
    },
    quickGlanceCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      marginTop: spacing[5],
      padding: spacing[5],
      ...theme.shadows.card,
    },
    quickGlanceTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 18,
      lineHeight: 26,
      marginBottom: spacing[4],
    },
    quickItemRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[3],
    },
    quickItemAmount: {
      color: colors.accentPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 14,
      lineHeight: 20,
      width: 28,
    },
    quickItemText: {
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
