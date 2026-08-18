import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecipes } from '../state/RecipesContext';
import type { AppTheme } from '../theme';

type ImportPhase = 'input' | 'processing' | 'review' | 'success';

type UrlImportScreenProps = {
  onClose: () => void;
  onGoToRecipe: (recipeId: string) => void;
  theme: AppTheme;
};

const recentSources = ['seriouseats.com', 'halfbakedharvest.com', 'NYT Cooking'];

const processingSteps = [
  'Fetching page...',
  'Reading recipe...',
  'Structuring data...',
];

export function UrlImportScreen({
  onClose,
  onGoToRecipe,
  theme,
}: UrlImportScreenProps) {
  const styles = createStyles(theme);
  const [phase, setPhase] = useState<ImportPhase>('input');
  const [url, setUrl] = useState('https://www.halfbakedharvest.com/creamy-tuscan-chicken/');
  const [processingIndex, setProcessingIndex] = useState(0);
  const [importedRecipeId, setImportedRecipeId] = useState<string | null>(null);
  const { createRecipeFromUrl, saveRecipe } = useRecipes();
  const successAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== 'processing') {
      return;
    }

    const timers = [
      setTimeout(() => setProcessingIndex(1), 1100),
      setTimeout(() => setProcessingIndex(2), 2200),
      setTimeout(() => {
        const newRecipe = createRecipeFromUrl(url);
        saveRecipe(newRecipe);
        setImportedRecipeId(newRecipe.id);
        setPhase('review');
      }, 3400),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'success') {
      successAnimation.setValue(0);
      Animated.spring(successAnimation, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, successAnimation]);

  function startImport() {
    setProcessingIndex(0);
    setPhase('processing');
  }

  async function pasteFromClipboard() {
    const text = await Clipboard.getStringAsync();

    if (text.trim()) {
      setUrl(text.trim());
    }
  }

  function renderContent() {
    switch (phase) {
      case 'input':
        return (
          <View style={styles.pageBody}>
            <View style={styles.inputCard}>
              <Text style={styles.label}>Recipe URL</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUrl}
                placeholder="Paste a recipe link"
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.input}
                value={url}
              />
              <Pressable
                onPress={pasteFromClipboard}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Paste from clipboard</Text>
              </Pressable>
            </View>

            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Last imported from...</Text>
              <View style={styles.chipWrap}>
                {recentSources.map((source) => (
                  <Pressable
                    key={source}
                    onPress={() => setUrl(`https://${source}/sample-recipe`)}
                    style={styles.sourceChip}
                  >
                    <Text style={styles.sourceChipText}>{source}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              disabled={!url.trim()}
              onPress={startImport}
              style={({ pressed }) => [
                styles.primaryButton,
                !url.trim() && styles.primaryButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Import</Text>
            </Pressable>
          </View>
        );
      case 'processing':
        return (
          <ImageBackground
            imageStyle={styles.processingBackdropImage}
            source={{
              uri: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.processingBackdrop}
          >
            <LinearGradient
              colors={[theme.colors.overlayStrong, theme.colors.bgPrimary]}
              style={styles.processingOverlay}
            >
              <View style={styles.processingCard}>
                <Text style={styles.processingTitle}>Importing Recipe</Text>
                <Text style={styles.processingCopy}>
                  Parsing through the life story to find the recipe...
                </Text>

                <View style={styles.processingList}>
                  {processingSteps.map((step, index) => (
                    <View key={step} style={styles.processingRow}>
                      <View
                        style={[
                          styles.processingBullet,
                          index <= processingIndex &&
                            styles.processingBulletActive,
                        ]}
                      />
                      <Text
                        style={[
                          styles.processingStep,
                          index === processingIndex &&
                            styles.processingStepActive,
                        ]}
                      >
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${[24, 60, 100][processingIndex]}%` },
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        );
      case 'review':
        return (
          <View style={styles.pageBody}>
            <View style={styles.reviewCard}>
              <ImageBackground
                imageStyle={styles.reviewImage}
                source={{
                  uri: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80',
                }}
                style={styles.reviewImage}
              >
                <View style={styles.warningChip}>
                  <Text style={styles.warningChipText}>
                    Some fields may need review
                  </Text>
                </View>
              </ImageBackground>

              <View style={styles.reviewBody}>
                <Text style={styles.reviewTitle}>
                  Creamy Tuscan Chicken with Charred Lemon
                </Text>
                <Text style={styles.reviewMeta}>8 ingredients • 4 steps</Text>
                <Text style={styles.reviewSource}>{url}</Text>
              </View>
            </View>

            <Pressable
              disabled={!importedRecipeId}
              onPress={() => setPhase('success')}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Looks good?</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Edit Before Saving</Text>
            </Pressable>
          </View>
        );
      case 'success':
        return (
          <View style={styles.pageBody}>
            <Animated.View
              style={[
                styles.successCard,
                {
                  opacity: successAnimation,
                  transform: [
                    {
                      translateY: successAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-28, 0],
                      }),
                    },
                    {
                      scale: successAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.94, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.confettiWrap}>
                <View style={[styles.confettiDot, styles.dotOne]} />
                <View style={[styles.confettiDot, styles.dotTwo]} />
                <View style={[styles.confettiDot, styles.dotThree]} />
                <View style={[styles.confettiDot, styles.dotFour]} />
              </View>
              <View style={styles.successIcon}>
                <Feather color={theme.colors.textInverse} name="check" size={22} />
              </View>
              <Text style={styles.successTitle}>Added to Your Cookbook</Text>
              <Text style={styles.successCopy}>
                Your imported recipe is now structured, searchable, and ready for
                pantry-aware cooking.
              </Text>
            </Animated.View>

            <Pressable
              disabled={!importedRecipeId}
              onPress={() => importedRecipeId && onGoToRecipe(importedRecipeId)}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Start Cooking</Text>
            </Pressable>

            <View style={styles.successActions}>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Add to Collection</Text>
              </Pressable>
              <Pressable
                disabled={!importedRecipeId}
                onPress={() => importedRecipeId && onGoToRecipe(importedRecipeId)}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>View Recipe</Text>
              </Pressable>
            </View>
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.headerButton}>
          <Feather color={theme.colors.textPrimary} name="x" size={18} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Import from URL</Text>
          <Text style={styles.headerSubtitle}>
            {phase === 'input' && 'Paste a link and let Savora structure it'}
            {phase === 'processing' && 'Import in progress'}
            {phase === 'review' && 'Review the parsed recipe'}
            {phase === 'success' && 'Recipe saved'}
          </Text>
        </View>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseBadgeText}>{phase}</Text>
        </View>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, shadows, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    header: {
      alignItems: 'center',
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: spacing[3],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
    },
    headerButton: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    headerCopy: {
      flex: 1,
      gap: spacing[1],
    },
    headerTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 30,
    },
    headerSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    phaseBadge: {
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    phaseBadgeText: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
      textTransform: 'capitalize',
    },
    pageBody: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
      paddingBottom: spacing[8],
    },
    inputCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.xl,
      borderWidth: 1,
      padding: spacing[5],
      ...shadows.card,
    },
    label: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 18,
      marginBottom: spacing[3],
    },
    input: {
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      minHeight: 112,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      textAlignVertical: 'top',
    },
    recentSection: {
      marginTop: spacing[8],
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 22,
      lineHeight: 28,
      marginBottom: spacing[3],
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    sourceChip: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    sourceChipText: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      justifyContent: 'center',
      marginTop: 'auto',
      minHeight: 54,
      paddingHorizontal: spacing[4],
      ...shadows.elevated,
    },
    primaryButtonDisabled: {
      opacity: 0.52,
    },
    pressed: {
      opacity: 0.8,
    },
    primaryButtonText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      justifyContent: 'center',
      marginTop: spacing[3],
      minHeight: 48,
      paddingHorizontal: spacing[4],
    },
    secondaryButtonText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
    processingBackdrop: {
      flex: 1,
    },
    processingBackdropImage: {
      opacity: 0.42,
    },
    processingOverlay: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[5],
    },
    processingCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.xl,
      borderWidth: 1,
      padding: spacing[5],
      ...shadows.elevated,
    },
    processingTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 34,
    },
    processingCopy: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
    },
    processingList: {
      gap: spacing[3],
      marginTop: spacing[6],
    },
    processingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[3],
    },
    processingBullet: {
      backgroundColor: colors.borderStrong,
      borderRadius: radius.pill,
      height: 10,
      width: 10,
    },
    processingBulletActive: {
      backgroundColor: colors.accentPrimary,
    },
    processingStep: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
    processingStepActive: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
    },
    progressTrack: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.pill,
      height: 10,
      marginTop: spacing[6],
      overflow: 'hidden',
    },
    progressFill: {
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      height: '100%',
    },
    reviewCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.xl,
      borderWidth: 1,
      overflow: 'hidden',
      ...shadows.card,
    },
    reviewImage: {
      height: 220,
      width: '100%',
    },
    warningChip: {
      alignSelf: 'flex-start',
      backgroundColor: colors.warningSurface,
      borderColor: colors.accentWarning,
      borderRadius: radius.pill,
      borderWidth: 1,
      margin: spacing[4],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    warningChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    reviewBody: {
      gap: spacing[2],
      padding: spacing[5],
    },
    reviewTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 30,
    },
    reviewMeta: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    reviewSource: {
      color: colors.textTertiary,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 18,
    },
    successCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.xl,
      borderWidth: 1,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[8],
      position: 'relative',
      ...shadows.elevated,
    },
    confettiWrap: {
      ...StyleSheet.absoluteFillObject,
    },
    confettiDot: {
      borderRadius: radius.pill,
      height: 10,
      position: 'absolute',
      width: 10,
    },
    dotOne: {
      backgroundColor: colors.accentPrimary,
      left: 36,
      top: 38,
    },
    dotTwo: {
      backgroundColor: colors.accentSecondary,
      right: 44,
      top: 56,
    },
    dotThree: {
      backgroundColor: colors.accentWarning,
      bottom: 70,
      left: 56,
    },
    dotFour: {
      backgroundColor: colors.accentPrimary,
      bottom: 44,
      right: 58,
    },
    successIcon: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      height: 52,
      justifyContent: 'center',
      width: 52,
    },
    successTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 34,
      marginTop: spacing[5],
      textAlign: 'center',
    },
    successCopy: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[3],
      textAlign: 'center',
    },
    successActions: {
      gap: spacing[3],
      marginTop: spacing[3],
    },
  });
}
