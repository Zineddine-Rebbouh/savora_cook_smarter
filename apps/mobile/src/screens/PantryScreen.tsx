import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePantry } from '../state/PantryContext';
import type { AppTheme } from '../theme';

type PantryScreenProps = {
  theme: AppTheme;
};

const categories = ['All', 'Produce', 'Dairy', 'Meat', 'Pantry', 'Freezer'];

export function PantryScreen({ theme }: PantryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { items } = usePantry();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagePadding}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>My Pantry</Text>
              <Text style={styles.subtitle}>{items.length} items tracked</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionPill,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.actionPillText}>Edit</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryPill,
                  pressed && styles.pressed,
                ]}
              >
                <Feather color={theme.colors.textInverse} name="plus" size={16} />
                <Text style={styles.primaryPillText}>Add Item</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.alertBanner}>
            <View style={styles.alertDot} />
            <Text style={styles.alertText}>
              Your heavy cream expires tomorrow — 3 recipes use it →
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={
                    selectedCategory === category
                      ? styles.categoryChipTextActive
                      : styles.categoryChipText
                  }
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [styles.matchCard, pressed && styles.pressed]}
          >
            <View>
              <Text style={styles.matchLabel}>Zero-waste match</Text>
              <Text style={styles.matchTitle}>
                Based on your pantry, you can cook 6 recipes right now
              </Text>
            </View>
            <Feather color={theme.colors.accentSecondary} name="chevron-right" size={20} />
          </Pressable>

          <Text style={styles.gridHeading}>Ingredients</Text>
          <FlatList
            data={items}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item }) => (
              <View style={styles.ingredientCard}>
                <View style={styles.ingredientIcon} />
                <Text style={styles.ingredientName}>{item.name}</Text>
                <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
                <View style={styles.ingredientFooter}>
                  <View
                    style={[
                      styles.expiryDot,
                      item.alert === 'high'
                        ? styles.expiryHigh
                        : item.alert === 'medium'
                        ? styles.expiryMedium
                        : styles.expiryLow,
                    ]}
                  />
                  <Text style={styles.expiryText}>{item.expiry}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
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
    content: {
      paddingBottom: spacing[12],
      backgroundColor: colors.bgPrimary,
    },
    pagePadding: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[5],
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
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacing[1],
    },
    headerActions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[2],
    },
    actionPill: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.pill,
      borderColor: colors.borderSubtle,
      borderWidth: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      height: 44,
    },
    actionPillText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    primaryPill: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      flexDirection: 'row',
      gap: spacing[2],
      height: 44,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
    },
    primaryPillText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
    },
    alertBanner: {
      alignItems: 'center',
      backgroundColor: colors.warningSurface,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[5],
      padding: spacing[4],
    },
    alertDot: {
      backgroundColor: colors.accentWarning,
      borderRadius: radius.pill,
      height: 12,
      width: 12,
    },
    alertText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
    },
    categoryRow: {
      gap: spacing[3],
      marginBottom: spacing[5],
    },
    categoryChip: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.pill,
      borderColor: colors.borderSubtle,
      borderWidth: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    categoryChipActive: {
      backgroundColor: colors.accentPrimary,
      borderColor: colors.accentPrimary,
    },
    categoryChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    categoryChipTextActive: {
      color: colors.textInverse,
    },
    matchCard: {
      alignItems: 'center',
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.xl,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[5],
      padding: spacing[5],
    },
    pressed: {
      opacity: 0.7,
    },
    matchLabel: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: spacing[2],
    },
    matchTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 18,
      lineHeight: 26,
      maxWidth: 260,
    },
    gridHeading: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 20,
      lineHeight: 28,
      marginBottom: spacing[4],
    },
    gridRow: {
      justifyContent: 'space-between',
      columnGap: spacing[4],
      marginBottom: spacing[4],
    },
    ingredientCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      flex: 1,
      minWidth: 100,
      padding: spacing[4],
      ...theme.shadows.card,
    },
    ingredientIcon: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.lg,
      height: 56,
      marginBottom: spacing[4],
      width: '100%',
    },
    ingredientName: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: spacing[1],
    },
    ingredientQuantity: {
      color: colors.textSecondary,
      fontFamily: fonts.monoMedium,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: spacing[3],
    },
    ingredientFooter: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[2],
    },
    expiryDot: {
      borderRadius: radius.pill,
      height: 10,
      width: 10,
    },
    expiryHigh: {
      backgroundColor: colors.accentDanger,
    },
    expiryMedium: {
      backgroundColor: colors.accentWarning,
    },
    expiryLow: {
      backgroundColor: colors.accentSecondary,
    },
    expiryText: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 11,
      lineHeight: 16,
    },
  });
}
