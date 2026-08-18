import { Feather } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTheme } from '../theme';

type OnboardingScreenProps = {
  onFinish: () => void;
  theme: AppTheme;
};

const slides = [
  {
    key: 'slide-1',
    title: 'Hands-free gesture cooking',
    subtitle: 'Your kitchen should adapt to your hands, not the other way around.',
    icon: 'repeat',
  },
  {
    key: 'slide-2',
    title: 'Import any recipe instantly',
    subtitle: 'Paste a URL and Savora structures the ingredients, steps, and timing.',
    icon: 'link',
  },
  {
    key: 'slide-3',
    title: 'Cook with confidence',
    subtitle: 'Wake-lock cooking mode keeps the screen ready when your hands are full.',
    icon: 'clock',
  },
];

const dietaryPreferences = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Halal',
  'Keto',
  'None',
];

export function OnboardingScreen({ onFinish, theme }: OnboardingScreenProps) {
  const styles = createStyles(theme);
  const [stage, setStage] = useState<'carousel' | 'account'>('carousel');
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<FlatList<any>>(null);

  function toggleDiet(label: string) {
    setSelectedDiets((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  if (stage === 'account') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.pagePadding}>
          <Text style={styles.accountTitle}>Set up your cookbook</Text>
          <Text style={styles.accountSubtitle}>
            Tell us how you eat. Set these now, skip forever.
          </Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.input}
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.colors.textTertiary}
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Text style={styles.dietLabel}>Dietary preferences</Text>
          <View style={styles.dietRow}>
            {dietaryPreferences.map((label) => {
              const active = selectedDiets.includes(label);

              return (
                <Pressable
                  key={label}
                  onPress={() => toggleDiet(label)}
                  style={[styles.dietChip, active && styles.dietChipActive]}
                >
                  <Text style={[styles.dietChipText, active && styles.dietChipTextActive]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onFinish}
            style={({ pressed }) => [
              styles.ctaButton,
              styles.ctaSpacing,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.ctaText}>Create My Cookbook</Text>
          </Pressable>
          <Pressable onPress={onFinish} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.heroShell}>
        <Pressable onPress={() => setStage('account')} style={styles.skipLink}>
          <Text style={styles.skipLinkText}>Skip</Text>
        </Pressable>
        <View style={styles.heroContent}>
          <View style={styles.logoShell}>
            <Text style={styles.logo}>S</Text>
          </View>
          <Text style={styles.appName}>Savora</Text>
          <Text style={styles.tagline}>Cook smarter. Waste less. Eat better.</Text>
        </View>
      </View>

      <View style={styles.carouselShell}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );
            setIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.illustrationShell}>
                <Feather color={theme.colors.accentSecondary} name={item.icon} size={48} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideText}>{item.subtitle}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((_, slideIndex) => (
            <View
              key={slideIndex}
              style={[
                styles.dot,
                slideIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={() => setStage('account')}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>Get Started</Text>
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
    pagePadding: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[10],
    },
    accountTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 36,
    },
    accountSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
      marginBottom: spacing[6],
    },
    input: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing[3],
      minHeight: 54,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dietLabel: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[4],
      marginBottom: spacing[3],
    },
    dietRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    dietChip: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dietChipActive: {
      backgroundColor: colors.accentPrimary,
      borderColor: colors.accentPrimary,
    },
    dietChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    dietChipTextActive: {
      color: colors.textInverse,
    },
    ctaSpacing: {
      marginTop: 'auto',
    },
    skipButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      paddingVertical: spacing[3],
    },
    skipText: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
    pressed: {
      opacity: 0.8,
    },
    heroShell: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[5],
      position: 'relative',
    },
    skipLink: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      position: 'absolute',
      right: spacing[3],
      top: spacing[3],
      zIndex: 1,
    },
    skipLinkText: {
      color: colors.textTertiary,
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
    heroContent: {
      alignItems: 'center',
      gap: spacing[3],
      marginTop: spacing[8],
    },
    logoShell: {
      alignItems: 'center',
      backgroundColor: colors.bgDark,
      borderRadius: radius.xl,
      height: 96,
      justifyContent: 'center',
      width: 96,
    },
    logo: {
      color: colors.textInverse,
      fontFamily: fonts.displayBold,
      fontSize: 42,
      lineHeight: 50,
    },
    appName: {
      color: colors.textPrimary,
      fontFamily: fonts.displayLight,
      fontSize: 42,
      lineHeight: 50,
      marginTop: spacing[4],
    },
    tagline: {
      color: colors.textTertiary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing[2],
      textAlign: 'center',
      maxWidth: 280,
    },
    carouselShell: {
      flex: 1,
    },
    slide: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[5],
    },
    illustrationShell: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.xl,
      height: 220,
      justifyContent: 'center',
      marginBottom: spacing[6],
      width: '100%',
    },
    slideTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 32,
      lineHeight: 40,
      marginBottom: spacing[3],
      textAlign: 'center',
    },
    slideText: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      maxWidth: 320,
    },
    footer: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      paddingBottom: spacing[8],
      paddingTop: spacing[4],
    },
    dotsRow: {
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[6],
    },
    dot: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.pill,
      height: 10,
      width: 10,
    },
    dotActive: {
      backgroundColor: colors.accentPrimary,
      width: 24,
    },
    ctaButton: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.xl,
      height: 52,
      justifyContent: 'center',
      width: '90%',
    },
    ctaText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}