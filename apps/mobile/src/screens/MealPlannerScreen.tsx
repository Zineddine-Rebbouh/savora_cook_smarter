import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecipes } from '../state/RecipesContext';
import type { AppTheme } from '../theme';

type MealPlannerScreenProps = {
  onClose: () => void;
  theme: AppTheme;
};

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const mealSlots = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function MealPlannerScreen({ onClose, theme }: MealPlannerScreenProps) {
  const styles = createStyles(theme);
  const { recipes } = useRecipes();
  const [plan, setPlan] = useState<Record<string, string>>({});
  const [pickingSlot, setPickingSlot] = useState<string | null>(null);

  function toggleSlot(key: string) {
    if (plan[key]) {
      setPlan((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      return;
    }

    setPickingSlot(key);
  }

  function assignRecipe(recipeId: string) {
    if (pickingSlot) {
      setPlan((current) => ({ ...current, [pickingSlot]: recipeId }));
    }
    setPickingSlot(null);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Pressable onPress={onClose} style={styles.headerButton}>
          <Feather color={theme.colors.textPrimary} name="chevron-left" size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>Meal Planner</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagePadding}>
          <View style={styles.weekRow}>
            {weekdays.map((day, index) => (
              <View key={day} style={styles.weekdayCell}>
                <Text style={styles.weekdayLabel}>{day}</Text>
                <Text style={styles.weekdayDate}>{index + 19}</Text>
              </View>
            ))}
          </View>

          <View style={styles.slotsGrid}>
            {weekdays.map((day) => (
              <View key={day} style={styles.dayColumn}>
                <Text style={styles.dayHeading}>{day}</Text>
                {mealSlots.map((slot) => {
                  const key = `${day}-${slot}`;
                  const recipe = plan[key]
                    ? recipes.find((item) => item.id === plan[key])
                    : undefined;

                  return (
                    <Pressable
                      key={slot}
                      onPress={() => toggleSlot(key)}
                      style={[
                        styles.slotCard,
                        recipe && styles.slotCardFilled,
                      ]}
                    >
                      <Text style={styles.slotLabel}>{slot}</Text>
                      <Text
                        numberOfLines={2}
                        style={recipe ? styles.slotRecipe : styles.slotPlaceholder}
                      >
                        {recipe ? recipe.title : 'Tap to assign'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Week's shopping</Text>
              <Text style={styles.summaryValue}>12 items needed</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Est. cost</Text>
              <Text style={styles.summaryValue}>~2,400 DZD</Text>
            </View>
            <Text style={styles.summaryMeta}>Avg 2,100 cal/day · 145g protein</Text>
          </View>

          <View style={styles.groceryCard}>
            <View style={styles.groceryHeader}>
              <Text style={styles.sectionTitle}>Grocery List</Text>
              <Pressable style={styles.groceryAction}>
                <Text style={styles.groceryActionText}>Share</Text>
              </Pressable>
            </View>
            {[
              { item: 'Cherry tomatoes', note: 'Monday Dinner' },
              { item: 'Greek yogurt', note: 'Tuesday Lunch' },
              { item: 'Fresh herbs', note: 'Thursday Dinner' },
            ].map((entry) => (
              <View key={entry.item} style={styles.groceryRow}>
                <View style={styles.checkbox} />
                <View style={styles.groceryCopy}>
                  <Text style={styles.groceryText}>{entry.item}</Text>
                  <Text style={styles.groceryNote}>Used in: {entry.note}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setPickingSlot(null)}
        transparent
        visible={pickingSlot !== null}
      >
        <Pressable onPress={() => setPickingSlot(null)} style={styles.backdrop} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHandle} />
          <Text style={styles.pickerTitle}>Assign a recipe</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {recipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => assignRecipe(recipe.id)}
                style={({ pressed }) => [
                  styles.pickerRow,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.pickerThumb} />
                <View style={styles.pickerCopy}>
                  <Text style={styles.pickerName}>{recipe.title}</Text>
                  <Text style={styles.pickerMeta}>{recipe.source}</Text>
                </View>
                <Feather
                  color={theme.colors.textTertiary}
                  name="plus"
                  size={18}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[3],
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
    },
    headerButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      height: 44,
      justifyContent: 'center',
      width: 44,
      ...shadows.card,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      flex: 1,
      fontSize: 24,
      lineHeight: 32,
      textAlign: 'center',
    },
    content: {
      paddingBottom: spacing[12],
      backgroundColor: colors.bgPrimary,
    },
    pagePadding: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[5],
    },
    weekdayCell: {
      alignItems: 'center',
      flex: 1,
      paddingVertical: spacing[3],
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      ...shadows.card,
    },
    weekdayLabel: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: spacing[1],
    },
    weekdayDate: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 11,
      lineHeight: 16,
    },
    slotsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    dayColumn: {
      flexBasis: '48%',
    },
    dayHeading: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
      marginBottom: spacing[3],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    slotCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      marginBottom: spacing[3],
      minHeight: 96,
      padding: spacing[4],
      ...shadows.card,
    },
    slotCardFilled: {
      borderColor: colors.accentPrimary,
      borderWidth: 1,
    },
    slotLabel: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing[2],
    },
    slotRecipe: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    slotPlaceholder: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlayStrong,
    },
    pickerSheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      bottom: 0,
      left: 0,
      maxHeight: '70%',
      paddingBottom: spacing[8],
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      position: 'absolute',
      right: 0,
      ...shadows.elevated,
    },
    pickerHandle: {
      alignSelf: 'center',
      backgroundColor: colors.borderStrong,
      borderRadius: radius.pill,
      height: 4,
      marginBottom: spacing[4],
      width: 44,
    },
    pickerTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 32,
      marginBottom: spacing[4],
    },
    pickerRow: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[3],
      padding: spacing[3],
    },
    pickerThumb: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.md,
      height: 48,
      width: 48,
    },
    pickerCopy: {
      flex: 1,
      gap: spacing[1],
    },
    pickerName: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    pickerMeta: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    pressed: {
      opacity: 0.7,
    },
    summaryCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      marginTop: spacing[4],
      padding: spacing[5],
      ...shadows.card,
    },
    summaryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[3],
    },
    summaryLabel: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    summaryValue: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    summaryMeta: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    groceryCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      marginTop: spacing[5],
      padding: spacing[5],
      ...shadows.card,
    },
    groceryHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[4],
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 20,
      lineHeight: 28,
    },
    groceryAction: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.xl,
      height: 44,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
    },
    groceryActionText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    groceryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: spacing[4],
    },
    checkbox: {
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      height: 22,
      marginRight: spacing[4],
      width: 22,
    },
    groceryCopy: {
      flex: 1,
    },
    groceryText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing[1],
    },
    groceryNote: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 18,
    },
  });
}
