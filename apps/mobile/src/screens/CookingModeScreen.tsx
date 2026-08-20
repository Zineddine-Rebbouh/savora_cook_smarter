import { Feather } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useVoiceCommands } from '../native/useVoiceCommands';
import { useRecipes } from '../state/RecipesContext';
import type { AppTheme } from '../theme';

type CookingModeScreenProps = {
  onExit: () => void;
  recipeId: string;
  theme: AppTheme;
};

type Step = {
  title: string;
  note: string | null;
  timer: number | null;
};

type VoiceCommand =
  | { kind: 'next' }
  | { kind: 'previous' }
  | { kind: 'howMuch'; ingredient: string }
  | null;

function matchCommand(text: string): VoiceCommand {
  const t = text.toLowerCase().trim();

  if (!t) {
    return null;
  }
  if (/\b(next|continue|forward)\b/.test(t)) {
    return { kind: 'next' };
  }
  if (/\b(prev|previous|back|backward)\b/.test(t)) {
    return { kind: 'previous' };
  }

  const howMuch = t.match(/(?:how (?:much|many))\s+(.+)/);

  return howMuch ? { kind: 'howMuch', ingredient: howMuch[1].trim() } : null;
}

export function CookingModeScreen({ onExit, recipeId, theme }: CookingModeScreenProps) {
  useKeepAwake();
  const { isSupported, isListening, partial, results, start, stop } = useVoiceCommands();
  const { getRecipeById } = useRecipes();
  const recipe = getRecipeById(recipeId);
  const styles = createStyles(theme);

  const steps: Step[] = recipe?.steps.length
    ? recipe.steps.map((step) => ({
        title: step.instruction,
        note: step.linkedRecipe ? `${step.linkedRecipe} ->` : null,
        timer: step.timerMinutes ?? null,
      }))
    : [{ title: 'No steps for this recipe yet', note: null, timer: null }];

  const quickGlance = (recipe?.ingredients ?? []).map((ingredient) => {
    const amountStr = `${formatAmount(ingredient.amount)}${
      ingredient.unit ? ` ${ingredient.unit}` : ''
    }`;
    return {
      amountStr,
      name: ingredient.name,
      fullText: `${amountStr} ${ingredient.name}`.trim(),
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [timer, setTimer] = useState<{ minutes: number; remaining: number } | null>(null);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const step = steps[currentStep - 1];

  if (!recipe) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.wrapper}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modeLabel}>Savora cooking mode</Text>
              <Text style={styles.recipeName}>Recipe Not Found</Text>
            </View>
            <View style={styles.exitPill}>
              <Pressable onPress={onExit} style={styles.exitButton}>
                <Text style={styles.exitText}>✕ Exit</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepCopy}>Recipe Not Found</Text>
            <Text style={styles.stepNote}>
              The requested recipe could not be loaded or was removed.
            </Text>
            <Pressable
              onPress={onExit}
              style={({ pressed }) => [
                styles.timerChip,
                pressed && styles.timerChipPressed,
                { marginTop: 24 },
              ]}
            >
              <Feather color={theme.colors.bgDark} name="arrow-left" size={14} />
              <Text style={styles.timerChipText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    setTimer(null);
  }, [currentStep]);

  useEffect(() => {
    const final = results[0];

    if (!final) {
      return;
    }

    const command = matchCommand(final);

    if (command?.kind === 'next') {
      setCurrentStep((value) => Math.min(steps.length, value + 1));
      setVoiceMessage('Next step');
    } else if (command?.kind === 'previous') {
      setCurrentStep((value) => Math.max(1, value - 1));
      setVoiceMessage('Previous step');
    } else if (command?.kind === 'howMuch') {
      const found = quickGlance.find((item) =>
        item.fullText.toLowerCase().includes(command.ingredient),
      );
      setVoiceMessage(found ? found.fullText : `No ingredient "${command.ingredient}" in this recipe`);
    } else {
      setVoiceMessage(`Heard: "${final}"`);
    }
  }, [results]);

  useEffect(() => {
    if (!voiceMessage) {
      return;
    }

    const id = setTimeout(() => setVoiceMessage(null), 4000);

    return () => clearTimeout(id);
  }, [voiceMessage]);

  useEffect(() => {
    if (!timer || timer.remaining > 0) {
      return;
    }

    Vibration.vibrate([500, 300, 500]);
    setTimer(null);
  }, [timer]);

  useEffect(() => {
    if (!timer || timer.remaining <= 0) {
      return;
    }

    const id = setTimeout(
      () => setTimer((value) => (value ? { ...value, remaining: value.remaining - 1 } : value)),
      1000,
    );

    return () => clearTimeout(id);
  }, [timer]);

  function startTimer() {
    if (step.timer) {
      setTimer({ minutes: step.timer, remaining: step.timer * 60 });
    }
  }

  function toggleVoice() {
    if (!isSupported) {
      setVoiceMessage('Voice is not supported on this device');
      return;
    }

    setVoiceMessage(null);
    if (isListening) {
      stop();
    } else {
      start();
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.modeLabel}>Savora cooking mode</Text>
            <Text style={styles.recipeName}>{recipe.title}</Text>
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
            <Pressable
              onPress={startTimer}
              style={({ pressed }) => [
                styles.timerChip,
                pressed && styles.timerChipPressed,
              ]}
            >
              <Feather color={theme.colors.bgDark} name="clock" size={14} />
              <Text style={styles.timerChipText}>
                {timer ? formatTimer(timer.remaining) : `${step.timer}:00 — Tap to start`}
              </Text>
            </Pressable>
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
          <Pressable
            onPress={toggleVoice}
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          >
            <View style={[styles.voicePulse, isListening && styles.voicePulseActive]} />
            <Feather
              color={theme.colors.textInverse}
              name={isListening ? 'square' : 'mic'}
              size={20}
            />
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

        {isListening || voiceMessage ? (
          <View style={styles.voiceBanner}>
            <Feather
              color={theme.colors.accentSecondary}
              name={isListening ? 'mic' : 'check'}
              size={16}
            />
            <Text style={styles.voiceBannerText}>
              {isListening ? (partial ? `"${partial}"` : 'Listening…') : voiceMessage}
            </Text>
          </View>
        ) : null}

        <View style={styles.quickGlanceCard}>
          <Text style={styles.quickGlanceTitle}>Ingredients quick glance</Text>
          {quickGlance.map((item, index) => (
            <View key={`${item.fullText}-${index}`} style={styles.quickItemRow}>
              <Text style={styles.quickItemAmount}>{item.amountStr}</Text>
              <Text style={styles.quickItemText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatAmount(value: number) {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  const rounded = Math.round(value * 100) / 100;

  return `${rounded}`.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
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
    timerChipPressed: {
      opacity: 0.85,
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
    voiceButtonActive: {
      backgroundColor: colors.accentDanger,
    },
    voicePulse: {
      borderColor: colors.textInverse,
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 56,
      position: 'absolute',
      width: 56,
      opacity: 0.3,
    },
    voicePulseActive: {
      opacity: 0.7,
    },
    voiceBanner: {
      alignItems: 'center',
      backgroundColor: colors.bgDarkSecondary,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing[2],
      marginTop: spacing[5],
      padding: spacing[4],
    },
    voiceBannerText: {
      color: colors.textInverse,
      fontFamily: fonts.body,
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
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
