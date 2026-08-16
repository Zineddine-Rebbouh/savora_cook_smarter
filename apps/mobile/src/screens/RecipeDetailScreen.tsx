import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { demoRecipe } from '../data/mockRecipe';
import { useRecipes as useRecipeStore } from '../state/RecipesContext';
import type { AppTheme } from '../theme';

type RecipeDetailScreenProps = {
  onBack: () => void;
  onStartCooking?: () => void;
  recipeId: string;
  theme: AppTheme;
};

export function RecipeDetailScreen({
  onBack,
  theme,
  onStartCooking,
  recipeId,
}: RecipeDetailScreenProps) {
  const { getRecipeById } = useRecipeStore();
  const recipe = getRecipeById(recipeId) ?? demoRecipe;
  const [servings, setServings] = useState(recipe.servings);
  const [nutritionOpen, setNutritionOpen] = useState(true);
  const styles = createStyles(theme);
  const scale = servings / recipe.servings;
  const pantryProgress = recipe.pantryOwned / recipe.pantryTotal;
  const nutritionTotal = recipe.nutrition.reduce(
    (sum, item) => sum + item.grams,
    0,
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroShell}>
          <ImageBackground
            imageStyle={styles.heroImage}
            source={{ uri: recipe.heroImage }}
            style={styles.heroImage}
          >
            <LinearGradient
              colors={[
                theme.colors.heroGradientTop,
                'transparent',
                theme.colors.heroGradientBottom,
              ]}
              locations={[0, 0.32, 1]}
              style={styles.heroGradient}
            >
              <View style={styles.heroTopRow}>
                <IconButton icon="chevron-left" onPress={onBack} theme={theme} />
                <View style={styles.heroActions}>
                  <IconButton icon="share-2" theme={theme} />
                  <IconButton icon="bookmark" theme={theme} />
                </View>
              </View>

              <View style={styles.heroBottom}>
                <View style={styles.aiBadge}>
                  <Feather
                    color={theme.colors.aiText}
                    name="star"
                    size={12}
                  />
                  <Text style={styles.aiBadgeText}>{recipe.heroTag}</Text>
                </View>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeMeta}>{recipe.source}</Text>
                <Text style={styles.recipeDescription}>
                  {recipe.description}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.pagePadding}>
          <View style={styles.quickStatsRow}>
            {recipe.quickStats.map((item) => (
              <View key={item.label} style={styles.quickStatCard}>
                <Text style={styles.quickStatValue}>{item.value}</Text>
                <Text style={styles.quickStatLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionSection}>
            <Pressable
              onPress={onStartCooking}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Start Cooking</Text>
            </Pressable>

            <View style={styles.secondaryActionsRow}>
              <SecondaryAction label="Scale Recipe" theme={theme} />
              <SecondaryAction label="Add to Plan" theme={theme} />
              <SecondaryAction label="Share" theme={theme} />
            </View>
          </View>

          <View style={styles.bannerCard}>
            <View style={styles.bannerHeader}>
              <Text style={styles.bannerTitle}>
                You have {recipe.pantryOwned} of {recipe.pantryTotal}{' '}
                ingredients
              </Text>
              <Text style={styles.bannerSubtle}>Pantry Intelligence</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(pantryProgress * 100, 6)}%` },
                ]}
              />
            </View>

            <View style={styles.missingChipWrap}>
              {recipe.missingIngredients.map((ingredient) => (
                <View key={ingredient} style={styles.missingChip}>
                  <Text style={styles.missingChipText}>{ingredient}</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.substituteButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.substituteButtonText}>Substitute?</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          <SectionHeader
            action={
              <View style={styles.stepper}>
                <Pressable
                  onPress={() => setServings((value) => Math.max(1, value - 1))}
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.stepperButtonText}>-</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{servings}</Text>
                <Pressable
                  onPress={() => setServings((value) => Math.min(12, value + 1))}
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </Pressable>
              </View>
            }
            subtitle="Scaled live as servings change"
            theme={theme}
            title="Ingredients"
          />

          <View style={styles.surfaceCard}>
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={ingredient.id}
                style={[
                  styles.ingredientRow,
                  index === recipe.ingredients.length - 1 && styles.rowLast,
                ]}
              >
                <View style={styles.amountColumn}>
                  <Text style={styles.amountText}>
                    {formatAmount(ingredient.amount * scale)}
                  </Text>
                  <Text style={styles.unitText}>{ingredient.unit || ' '}</Text>
                </View>

                <View style={styles.ingredientCopy}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  {ingredient.note ? (
                    <Text style={styles.ingredientNote}>{ingredient.note}</Text>
                  ) : null}
                </View>

                <View style={styles.ingredientState}>
                  {ingredient.inPantry ? (
                    <View style={styles.pantryCheck}>
                      <Feather
                        color={theme.colors.textInverse}
                        name="check"
                        size={12}
                      />
                    </View>
                  ) : (
                    <Pressable style={({ pressed }) => [styles.addChip, pressed && styles.pressed]}>
                      <Text style={styles.addChipText}>Add</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>

          <SectionHeader
            subtitle={`${recipe.steps.length} steps`}
            theme={theme}
            title="Instructions"
          />

          <View style={styles.stepsCard}>
            {recipe.steps.map((step, index) => (
              <View
                key={step.id}
                style={[
                  styles.stepRow,
                  index === recipe.steps.length - 1 && styles.rowLast,
                ]}
              >
                <View style={styles.stepIndex}>
                  <Text style={styles.stepIndexText}>{index + 1}</Text>
                </View>

                <View style={styles.stepCopy}>
                  <Text style={styles.stepInstruction}>{step.instruction}</Text>
                  <View style={styles.stepAssistRow}>
                    {step.timerMinutes ? (
                      <View style={styles.timerChip}>
                        <Feather
                          color={theme.colors.textPrimary}
                          name="clock"
                          size={12}
                        />
                        <Text style={styles.timerChipText}>
                          {step.timerMinutes} min - Start
                        </Text>
                      </View>
                    ) : null}
                    {step.linkedRecipe ? (
                      <View style={styles.linkedRecipeChip}>
                        <Text style={styles.linkedRecipeChipText}>
                          {`${step.linkedRecipe} ->`}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => setNutritionOpen((value) => !value)}
            style={styles.sectionToggle}
          >
            <View>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <Text style={styles.sectionSubtitle}>Per serving summary</Text>
            </View>
            <Feather
              color={theme.colors.textSecondary}
              name={nutritionOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
            />
          </Pressable>

          {nutritionOpen ? (
            <View style={styles.surfaceCard}>
              <View style={styles.nutritionBar}>
                {recipe.nutrition.map((item) => (
                  <View
                    key={item.label}
                    style={[
                      styles.nutritionSegment,
                      {
                        backgroundColor: item.color,
                        flex: item.grams / nutritionTotal,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.nutritionLegend}>
                {recipe.nutrition.map((item) => (
                  <View key={item.label} style={styles.nutritionLegendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <View>
                      <Text style={styles.legendLabel}>{item.label}</Text>
                      <Text style={styles.legendValue}>{item.grams}g</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <SectionHeader
            subtitle={`${recipe.communityRating} | ${recipe.cookHistory}`}
            theme={theme}
            title="Cook Log & Reviews"
          />

          <View style={styles.surfaceCard}>
            {recipe.logs.map((entry, index) => (
              <View
                key={entry.id}
                style={[
                  styles.logRow,
                  index === recipe.logs.length - 1 && styles.rowLast,
                ]}
              >
                <View style={styles.logMeta}>
                  <Text style={styles.logDate}>{entry.date}</Text>
                  <Text style={styles.logRating}>{entry.rating}/5</Text>
                </View>
                <Text style={styles.logNote}>{entry.note}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
  theme,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  theme: AppTheme;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {action}
    </View>
  );
}

function IconButton({
  icon,
  onPress,
  theme,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  theme: AppTheme;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityLabel={icon}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && styles.pressed,
      ]}
    >
      <Feather color={theme.colors.textInverse} name={icon} size={18} />
    </Pressable>
  );
}

function SecondaryAction({
  label,
  theme,
}: {
  label: string;
  theme: AppTheme;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function formatAmount(value: number) {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  const rounded = Math.round(value * 100) / 100;

  return `${rounded}`.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, shadows, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    content: {
      backgroundColor: colors.bgPrimary,
      paddingBottom: spacing[10],
    },
    heroShell: {
      backgroundColor: colors.bgDark,
    },
    heroImage: {
      height: 340,
      width: '100%',
    },
    heroGradient: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[6],
    },
    heroTopRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    heroActions: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(28, 24, 20, 0.32)',
      borderColor: 'rgba(254, 252, 247, 0.24)',
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    pressed: {
      opacity: 0.6,
    },
    heroBottom: {
      gap: spacing[2],
    },
    aiBadge: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.pill,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing[1],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    aiBadgeText: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    recipeTitle: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 30,
      lineHeight: 36,
      maxWidth: '90%',
    },
    recipeMeta: {
      color: colors.textInverse,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      opacity: 0.84,
    },
    recipeDescription: {
      color: colors.textInverse,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      maxWidth: '92%',
      opacity: 0.92,
    },
    pagePadding: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
    },
    quickStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
    },
    quickStatCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      minWidth: '47%',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      ...shadows.card,
    },
    quickStatValue: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 17,
      lineHeight: 24,
    },
    quickStatLabel: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacing[1],
    },
    actionSection: {
      gap: spacing[3],
      marginTop: spacing[6],
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      justifyContent: 'center',
      minHeight: 54,
      paddingHorizontal: spacing[4],
      ...shadows.elevated,
    },
    primaryButtonText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    secondaryActionsRow: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.md,
      borderWidth: 1,
      flex: 1,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: spacing[3],
    },
    secondaryButtonText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
    bannerCard: {
      backgroundColor: colors.warningSurface,
      borderColor: colors.accentWarning,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginTop: spacing[8],
      padding: spacing[4],
    },
    bannerHeader: {
      gap: spacing[1],
    },
    bannerTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    bannerSubtle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    progressTrack: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.pill,
      height: 10,
      marginTop: spacing[4],
      overflow: 'hidden',
    },
    progressFill: {
      backgroundColor: colors.accentSecondary,
      borderRadius: radius.pill,
      height: '100%',
    },
    missingChipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
      marginTop: spacing[4],
    },
    missingChip: {
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing[2],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    missingChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    substituteButton: {
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      minHeight: 36,
      justifyContent: 'center',
    },
    substituteButtonText: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    sectionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing[8],
      marginBottom: spacing[4],
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 32,
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacing[1],
    },
    stepper: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing[2],
      padding: spacing[1],
    },
    stepperButton: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    stepperButtonText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 16,
      lineHeight: 20,
    },
    stepperValue: {
      color: colors.textPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 15,
      lineHeight: 22,
      minWidth: 18,
      textAlign: 'center',
    },
    surfaceCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      overflow: 'hidden',
      ...shadows.card,
    },
    ingredientRow: {
      alignItems: 'center',
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: 1,
      flexDirection: 'row',
      minHeight: 72,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    amountColumn: {
      alignItems: 'flex-end',
      marginRight: spacing[3],
      width: 76,
    },
    amountText: {
      color: colors.textPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 15,
      lineHeight: 20,
    },
    unitText: {
      color: colors.textSecondary,
      fontFamily: fonts.mono,
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacing[1],
    },
    ingredientCopy: {
      flex: 1,
      gap: spacing[1],
    },
    ingredientName: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      lineHeight: 22,
    },
    ingredientNote: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    ingredientState: {
      marginLeft: spacing[3],
    },
    pantryCheck: {
      alignItems: 'center',
      backgroundColor: colors.accentSecondary,
      borderRadius: radius.pill,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    addChip: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderStrong,
      borderRadius: radius.pill,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 36,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    addChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    stepsCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.xl,
      borderWidth: 1,
      overflow: 'hidden',
      ...shadows.card,
    },
    stepRow: {
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
    },
    stepIndex: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      height: 32,
      justifyContent: 'center',
      marginTop: 2,
      width: 32,
    },
    stepIndexText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 18,
    },
    stepCopy: {
      flex: 1,
      gap: spacing[3],
    },
    stepInstruction: {
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 24,
    },
    stepAssistRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    timerChip: {
      alignItems: 'center',
      backgroundColor: colors.accentWarning,
      borderRadius: radius.pill,
      flexDirection: 'row',
      gap: spacing[2],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    timerChipText: {
      color: colors.warningText,
      fontFamily: fonts.bodySemiBold,
      fontSize: 12,
      lineHeight: 16,
    },
    linkedRecipeChip: {
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    linkedRecipeChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    sectionToggle: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing[8],
      marginBottom: spacing[4],
    },
    nutritionBar: {
      borderRadius: radius.pill,
      flexDirection: 'row',
      height: 16,
      overflow: 'hidden',
    },
    nutritionSegment: {
      height: '100%',
    },
    nutritionLegend: {
      gap: spacing[3],
      marginTop: spacing[4],
    },
    nutritionLegendItem: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[3],
    },
    legendDot: {
      borderRadius: radius.pill,
      height: 10,
      width: 10,
    },
    legendLabel: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    legendValue: {
      color: colors.textPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 15,
      lineHeight: 20,
      marginTop: spacing[1],
    },
    logRow: {
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: 1,
      gap: spacing[2],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
    },
    logMeta: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    logDate: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    logRating: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
    },
    logNote: {
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
