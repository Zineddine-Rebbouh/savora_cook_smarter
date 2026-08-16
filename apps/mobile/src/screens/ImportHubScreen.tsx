import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type ImportHubScreenProps = {
  onClose: () => void;
  onOpenUrl: () => void;
  theme: AppTheme;
};

const importOptions = [
  {
    id: 'url',
    icon: 'link' as const,
    subtitle: 'Any food blog',
    title: 'Paste URL',
  },
  {
    id: 'scan',
    icon: 'camera' as const,
    subtitle: 'Cookbook / OCR',
    title: 'Scan Photo',
  },
  {
    id: 'voice',
    icon: 'mic' as const,
    subtitle: 'Voice dictate',
    title: 'Speak Recipe',
  },
  {
    id: 'type',
    icon: 'edit-3' as const,
    subtitle: 'Custom entry',
    title: 'Type Manually',
  },
];

export function ImportHubScreen({
  onClose,
  onOpenUrl,
  theme,
}: ImportHubScreenProps) {
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Pressable onPress={onClose} style={styles.backdrop} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>Add a Recipe</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather color={theme.colors.textPrimary} name="x" size={18} />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {importOptions.map((option) => {
            const isUrl = option.id === 'url';

            return (
              <Pressable
                key={option.id}
                onPress={isUrl ? onOpenUrl : undefined}
                style={[
                  styles.optionCard,
                  !isUrl && styles.optionCardDisabled,
                ]}
              >
                <Feather
                  color={
                    isUrl ? theme.colors.accentPrimary : theme.colors.textTertiary
                  }
                  name={option.icon}
                  size={24}
                />
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                {!isUrl ? (
                  <View style={styles.comingSoonChip}>
                    <Text style={styles.comingSoonText}>Next</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, shadows, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: 'transparent',
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlayStrong,
    },
    sheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      paddingBottom: spacing[8],
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
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[5],
    },
    title: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 32,
    },
    closeButton: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
      justifyContent: 'space-between',
    },
    optionCard: {
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing[2],
      minHeight: 148,
      padding: spacing[4],
      width: '47%',
    },
    optionCardDisabled: {
      opacity: 0.82,
    },
    optionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 16,
      lineHeight: 22,
      marginTop: spacing[2],
    },
    optionSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    comingSoonChip: {
      alignSelf: 'flex-start',
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.pill,
      borderWidth: 1,
      marginTop: 'auto',
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    comingSoonText: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
  });
}
