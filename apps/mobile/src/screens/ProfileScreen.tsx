import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type ProfileScreenProps = {
  onOpenPlanner: () => void;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
  theme: AppTheme;
};

const collections = [
  { id: 'col-1', title: 'Weeknight Dinners', count: 12 },
  { id: 'col-2', title: 'Baking Favorites', count: 8 },
  { id: 'col-3', title: 'Zero-Waste', count: 6 },
  { id: 'col-4', title: 'Guest Menus', count: 9 },
];

const cookLog = [
  { id: 'log-1', date: 'May 20', recipe: 'Mushroom Duxelles Tart', rating: 5 },
  { id: 'log-2', date: 'May 17', recipe: 'Harissa Chickpea Skillet', rating: 4 },
  { id: 'log-3', date: 'May 13', recipe: 'Cumin Braised Eggplant', rating: 5 },
];

const settings = [
  'Dietary Preferences',
  'Notification Settings',
  'Linked Accounts',
  'Dark Mode',
  'Offline Storage',
];

export function ProfileScreen({
  onOpenPlanner,
  onOpenEditProfile,
  onOpenSettings,
  theme,
}: ProfileScreenProps) {
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagePadding}>
          <View style={styles.headerRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>Z</Text>
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>Zine</Text>
              <Text style={styles.profileSince}>Cooking since April 2024</Text>
              <Pressable
                onPress={onOpenEditProfile}
                style={({ pressed }) => [
                  styles.editPill,
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  color={theme.colors.textSecondary}
                  name="edit-2"
                  size={14}
                />
                <Text style={styles.editPillText}>Edit Profile</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.statsRow}>
            {[
              { label: 'Saved', value: '142' },
              { label: 'Cooked', value: '38' },
              { label: 'Collections', value: '12' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={onOpenPlanner}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Open Meal Planner</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>My Collections</Text>
          <View style={styles.collectionsGrid}>
            {collections.map((item) => (
              <View key={item.id} style={styles.collectionCard}>
                <View style={styles.collectionMosaic}>
                  <View style={styles.tile} />
                  <View style={styles.tile} />
                  <View style={styles.tile} />
                  <View style={styles.tile} />
                </View>
                <Text style={styles.collectionTitle}>{item.title}</Text>
                <Text style={styles.collectionMeta}>{item.count} recipes</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>My Cooking Journey</Text>
          <View style={styles.logCard}>
            {cookLog.map((entry, index) => (
              <View
                key={entry.id}
                style={[styles.logRow, index === cookLog.length - 1 && styles.rowLast]}
              >
                <View>
                  <Text style={styles.logDate}>{entry.date}</Text>
                  <Text style={styles.logRecipe}>{entry.recipe}</Text>
                </View>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>{entry.rating}/5</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {settings.map((item, index) => (
              <Pressable
                key={item}
                onPress={onOpenSettings}
                style={({ pressed }) => [
                  styles.settingsRow,
                  index === settings.length - 1 && styles.rowLast,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.settingsText}>{item}</Text>
                <Feather color={theme.colors.textTertiary} name="chevron-right" size={18} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
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
    content: {
      paddingBottom: spacing[12],
      backgroundColor: colors.bgPrimary,
    },
    pagePadding: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginBottom: spacing[6],
    },
    avatarLarge: {
      alignItems: 'center',
      backgroundColor: colors.bgDark,
      borderRadius: radius.pill,
      height: 120,
      justifyContent: 'center',
      width: 120,
      marginRight: spacing[5],
    },
    avatarLargeText: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 48,
      lineHeight: 56,
    },
    profileCopy: {
      flex: 1,
    },
    profileName: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 36,
      marginBottom: spacing[1],
    },
    profileSince: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    editPill: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing[1],
      marginTop: spacing[3],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    editPillText: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[5],
    },
    statCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      flex: 1,
      paddingHorizontal: spacing[1],
      paddingVertical: spacing[4],
      ...shadows.card,
    },
    statValue: {
      color: colors.textPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 24,
      lineHeight: 30,
      marginBottom: spacing[1],
    },
    statLabel: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 11,
      lineHeight: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    actionRow: {
      marginBottom: spacing[6],
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
    pressed: {
      opacity: 0.8,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 22,
      lineHeight: 28,
      marginBottom: spacing[4],
    },
    collectionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing[6],
    },
    collectionCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      flexBasis: '48%',
      marginBottom: spacing[4],
      padding: spacing[4],
      ...shadows.card,
    },
    collectionMosaic: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing[3],
    },
    tile: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.md,
      flexBasis: '48%',
      height: 48,
      marginBottom: spacing[2],
    },
    collectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing[1],
    },
    collectionMeta: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 18,
    },
    logCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      marginBottom: spacing[6],
      padding: spacing[4],
      ...shadows.card,
    },
    logRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing[3],
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    logDate: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: spacing[1],
    },
    logRecipe: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    ratingPill: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      height: 32,
      justifyContent: 'center',
      paddingHorizontal: spacing[3],
    },
    ratingText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
    },
    settingsCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      padding: spacing[3],
      ...shadows.card,
    },
    settingsRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing[4],
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: 1,
    },
    settingsText: {
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
