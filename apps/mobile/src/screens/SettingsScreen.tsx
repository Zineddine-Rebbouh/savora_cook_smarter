import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type SettingsScreenProps = {
  onBack: () => void;
  theme: AppTheme;
};

const settingsSections = [
  {
    title: 'Preferences',
    items: [
      { id: 'dietary', label: 'Dietary Preferences', type: 'nav' as const },
      { id: 'units', label: 'Measurement Units', type: 'nav' as const },
      { id: 'darkMode', label: 'Dark Mode', type: 'toggle' as const },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { id: 'pushNotifs', label: 'Push Notifications', type: 'toggle' as const },
      { id: 'mealReminders', label: 'Meal Reminders', type: 'toggle' as const },
      { id: 'weeklyDigest', label: 'Weekly Recipe Digest', type: 'toggle' as const },
    ],
  },
  {
    title: 'Data & Storage',
    items: [
      { id: 'offlineStorage', label: 'Offline Storage', type: 'nav' as const },
      { id: 'clearCache', label: 'Clear Cache', type: 'action' as const },
      { id: 'exportData', label: 'Export My Data', type: 'nav' as const },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'linkedAccounts', label: 'Linked Accounts', type: 'nav' as const },
      { id: 'privacy', label: 'Privacy Settings', type: 'nav' as const },
      { id: 'deleteAccount', label: 'Delete Account', type: 'action' as const, danger: true },
    ],
  },
];

export function SettingsScreen({ onBack, theme }: SettingsScreenProps) {
  const styles = createStyles(theme);
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const getToggleValue = (id: string) => {
    switch (id) {
      case 'darkMode':
        return darkMode;
      case 'pushNotifs':
        return pushNotifs;
      case 'mealReminders':
        return mealReminders;
      case 'weeklyDigest':
        return weeklyDigest;
      default:
        return false;
    }
  };

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'pushNotifs':
        setPushNotifs(value);
        break;
      case 'mealReminders':
        setMealReminders(value);
        break;
      case 'weeklyDigest':
        setWeeklyDigest(value);
        break;
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather color={theme.colors.textPrimary} name="arrow-left" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsCard}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={item.id}
                  disabled={item.type === 'toggle'}
                  style={({ pressed }) => [
                    styles.settingsRow,
                    itemIndex === section.items.length - 1 && styles.rowLast,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.settingsText,
                      item.danger && styles.dangerText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.type === 'nav' && (
                    <Feather
                      color={theme.colors.textTertiary}
                      name="chevron-right"
                      size={18}
                    />
                  )}
                  {item.type === 'toggle' && (
                    <Switch
                      trackColor={{
                        false: theme.colors.bgTertiary,
                        true: theme.colors.accentPrimary,
                      }}
                      thumbColor={theme.colors.textInverse}
                      value={getToggleValue(item.id)}
                      onValueChange={(value) => handleToggle(item.id, value)}
                    />
                  )}
                  {item.type === 'action' && !item.danger && (
                    <Feather
                      color={theme.colors.textTertiary}
                      name="chevron-right"
                      size={18}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Savora v1.0.0</Text>
          <Text style={styles.footerText}>Made with care for home cooks</Text>
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
    header: {
      alignItems: 'center',
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    headerTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 18,
      lineHeight: 24,
    },
    iconButton: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    pressed: {
      opacity: 0.6,
    },
    content: {
      paddingBottom: spacing[12],
    },
    section: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
    },
    sectionTitle: {
      color: colors.textSecondary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: spacing[3],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
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
    rowLast: {
      borderBottomWidth: 0,
    },
    settingsText: {
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
    dangerText: {
      color: '#EF4444',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: spacing[8],
    },
    footerText: {
      color: colors.textTertiary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 20,
    },
  });
}
