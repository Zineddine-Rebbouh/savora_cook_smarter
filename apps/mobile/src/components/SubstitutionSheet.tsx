import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppTheme } from '../theme';

type Substitute = {
  confidence: 'high' | 'medium';
  name: string;
  note: string;
  ratio: string;
};

const suggestions: Record<string, Substitute[]> = {
  'heavy cream': [
    {
      confidence: 'high',
      name: 'Coconut cream',
      ratio: '1:1',
      note: 'Neutral flavor, same richness. Whipped cream still works.',
    },
    {
      confidence: 'medium',
      name: 'Half-and-half + butter',
      ratio: '3:1',
      note: 'Thinner sauce — stir in 1 tbsp flour to thicken.',
    },
  ],
  parmesan: [
    {
      confidence: 'high',
      name: 'Pecorino Romano',
      ratio: '1:1',
      note: 'Saltier — cut added salt by half.',
    },
    {
      confidence: 'medium',
      name: 'Nutritional yeast',
      ratio: '2 tbsp / cup',
      note: 'Vegan option, less melt.',
    },
  ],
  lemon: [
    {
      confidence: 'medium',
      name: 'White wine vinegar',
      ratio: '1 tbsp per lemon',
      note: 'Use half the amount to avoid tartness.',
    },
  ],
};

const fallback: Substitute[] = [
  {
    confidence: 'medium',
    name: 'A close kitchen swap',
    ratio: '',
    note: 'Full substitution needs the AI engine — wired to the backend next.',
  },
];

type SubstitutionSheetProps = {
  ingredient: string | null;
  onClose: () => void;
  theme: AppTheme;
};

export function SubstitutionSheet({
  ingredient,
  onClose,
  theme,
}: SubstitutionSheetProps) {
  const styles = createStyles(theme);
  const options = ingredient
    ? suggestions[ingredient.toLowerCase()] ?? fallback
    : [];

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={ingredient !== null}
    >
      <Pressable onPress={onClose} style={styles.backdrop} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={styles.aiBadge}>
            <Feather color={theme.colors.aiText} name="zap" size={12} />
            <Text style={styles.aiBadgeText}>Smart Substitute</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather color={theme.colors.textPrimary} name="x" size={18} />
          </Pressable>
        </View>

        <Text style={styles.title}>Swap out “{ingredient}”</Text>
        <Text style={styles.subtitle}>
          Savora keeps flavor and texture close. Pick a swap to continue cooking.
        </Text>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {options.map((option) => (
            <Pressable key={option.name} style={styles.optionCard}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionName}>{option.name}</Text>
                <View
                  style={[
                    styles.confidenceChip,
                    option.confidence === 'high'
                      ? styles.confidenceHigh
                      : styles.confidenceMedium,
                  ]}
                >
                  <Text
                    style={[
                      styles.confidenceText,
                      option.confidence === 'high'
                        ? styles.confidenceTextHigh
                        : styles.confidenceTextMedium,
                    ]}
                  >
                    {option.confidence === 'high' ? 'High match' : 'Best guess'}
                  </Text>
                </View>
              </View>
              {option.ratio ? (
                <Text style={styles.ratio}>{option.ratio}</Text>
              ) : null}
              <Text style={styles.note}>{option.note}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable onPress={onClose} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Keep this ingredient</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, shadows, spacing } = theme;

  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlayStrong,
    },
    sheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      bottom: 0,
      left: 0,
      maxHeight: '75%',
      paddingBottom: spacing[8],
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      position: 'absolute',
      right: 0,
      ...shadows.elevated,
    },
    handle: {
      alignSelf: 'center',
      backgroundColor: colors.borderStrong,
      borderRadius: radius.pill,
      height: 4,
      marginBottom: spacing[4],
      width: 44,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[4],
    },
    aiBadge: {
      alignItems: 'center',
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
    closeButton: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    title: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 30,
    },
    subtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
    },
    list: {
      gap: spacing[3],
      paddingTop: spacing[5],
      paddingBottom: spacing[4],
    },
    optionCard: {
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing[4],
    },
    optionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    optionName: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 16,
      lineHeight: 22,
      flex: 1,
      paddingRight: spacing[3],
    },
    confidenceChip: {
      borderRadius: radius.pill,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    confidenceHigh: {
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderWidth: 1,
    },
    confidenceMedium: {
      backgroundColor: colors.warningSurface,
      borderColor: colors.accentWarning,
      borderWidth: 1,
    },
    confidenceText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      lineHeight: 16,
    },
    confidenceTextHigh: {
      color: colors.aiText,
    },
    confidenceTextMedium: {
      color: colors.textPrimary,
    },
    ratio: {
      color: colors.accentPrimary,
      fontFamily: fonts.monoMedium,
      fontSize: 14,
      lineHeight: 20,
      marginTop: spacing[3],
    },
    note: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 14,
      lineHeight: 20,
      marginTop: spacing[1],
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
  });
}