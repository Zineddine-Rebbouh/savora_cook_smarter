import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type EditProfileScreenProps = {
  onBack: () => void;
  theme: AppTheme;
};

export function EditProfileScreen({ onBack, theme }: EditProfileScreenProps) {
  const styles = createStyles(theme);
  const [name, setName] = useState('Zine');
  const [email, setEmail] = useState('zine@example.com');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    onBack();
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
          <Feather color={theme.colors.textPrimary} name="x" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>Z</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.changePhotoButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              color={theme.colors.accentPrimary}
              name="camera"
              size={16}
            />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textTertiary}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textTertiary}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Tell us about yourself"
              placeholderTextColor={theme.colors.textTertiary}
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.readOnlyText}>April 2024</Text>
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
    saveButton: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      paddingHorizontal: spacing[3],
    },
    saveButtonText: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 16,
      lineHeight: 22,
    },
    pressed: {
      opacity: 0.6,
    },
    content: {
      paddingBottom: spacing[12],
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: spacing[8],
    },
    avatarLarge: {
      alignItems: 'center',
      backgroundColor: colors.bgDark,
      borderRadius: radius.pill,
      height: 120,
      justifyContent: 'center',
      width: 120,
      marginBottom: spacing[4],
    },
    avatarLargeText: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 48,
      lineHeight: 56,
    },
    changePhotoButton: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[2],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    changePhotoText: {
      color: colors.accentPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    form: {
      paddingHorizontal: spacing[5],
    },
    fieldGroup: {
      marginBottom: spacing[6],
    },
    label: {
      color: colors.textSecondary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: spacing[2],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 16,
      lineHeight: 22,
      minHeight: 48,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      ...shadows.card,
    },
    textArea: {
      minHeight: 100,
      paddingTop: spacing[3],
    },
    readOnlyText: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 16,
      lineHeight: 22,
      paddingVertical: spacing[3],
    },
  });
}
