import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type PlaceholderScreenProps = {
  description: string;
  icon: keyof typeof Feather.glyphMap;
  theme: AppTheme;
  title: string;
};

export function PlaceholderScreen({
  description,
  icon,
  theme,
  title,
}: PlaceholderScreenProps) {
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconShell}>
          <Feather color={theme.colors.accentPrimary} name={icon} size={28} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>Coming in the next sprint</Text>
        </Pressable>
      </View>
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
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[8],
    },
    iconShell: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: radius.xl,
      borderWidth: 1,
      height: 72,
      justifyContent: 'center',
      marginBottom: spacing[6],
      width: 72,
    },
    title: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 34,
      textAlign: 'center',
    },
    description: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[3],
      textAlign: 'center',
    },
    cta: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      justifyContent: 'center',
      marginTop: spacing[6],
      minHeight: 44,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    ctaText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
  });
}
