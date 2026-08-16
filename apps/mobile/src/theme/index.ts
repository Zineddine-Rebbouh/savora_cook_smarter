export type ThemeMode = 'light' | 'dark';

type Palette = {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgDark: string;
  bgDarkSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  accentPrimary: string;
  accentSecondary: string;
  accentDanger: string;
  accentWarning: string;
  surfaceCard: string;
  surfaceElevated: string;
  borderSubtle: string;
  borderStrong: string;
  aiBg: string;
  aiBorder: string;
  aiText: string;
  warningText: string;
  warningSurface: string;
  overlayStrong: string;
  heroGradientTop: string;
  heroGradientBottom: string;
};

const palettes: Record<ThemeMode, Palette> = {
  light: {
    bgPrimary: '#FEFCF7',
    bgSecondary: '#F5F0E8',
    bgTertiary: '#EDE6D6',
    bgDark: '#1C1814',
    bgDarkSecondary: '#2A2420',
    textPrimary: '#1C1814',
    textSecondary: '#6B5E52',
    textTertiary: '#9C8B7E',
    textInverse: '#FEFCF7',
    accentPrimary: '#E8854A',
    accentSecondary: '#3DBE6C',
    accentDanger: '#D94F3D',
    accentWarning: '#F2C94C',
    surfaceCard: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    borderSubtle: '#E8E0D0',
    borderStrong: '#C8BDB0',
    aiBg: '#EDF9F2',
    aiBorder: '#3DBE6C',
    aiText: '#1A6640',
    warningText: '#1C1814',
    warningSurface: '#FDF1E4',
    overlayStrong: 'rgba(28, 24, 20, 0.42)',
    heroGradientTop: 'rgba(28, 24, 20, 0.06)',
    heroGradientBottom: 'rgba(28, 24, 20, 0.88)',
  },
  dark: {
    bgPrimary: '#1C1814',
    bgSecondary: '#242018',
    bgTertiary: '#2E2822',
    bgDark: '#1C1814',
    bgDarkSecondary: '#2A2420',
    textPrimary: '#F5F0E8',
    textSecondary: '#9C8B7E',
    textTertiary: '#6B5E52',
    textInverse: '#FEFCF7',
    accentPrimary: '#E8854A',
    accentSecondary: '#3DBE6C',
    accentDanger: '#D94F3D',
    accentWarning: '#F2C94C',
    surfaceCard: '#2A2420',
    surfaceElevated: '#2A2420',
    borderSubtle: '#3A332D',
    borderStrong: '#4A4038',
    aiBg: '#1A2E22',
    aiBorder: '#3DBE6C',
    aiText: '#3DBE6C',
    warningText: '#1C1814',
    warningSurface: '#3A2D20',
    overlayStrong: 'rgba(28, 24, 20, 0.6)',
    heroGradientTop: 'rgba(28, 24, 20, 0.12)',
    heroGradientBottom: 'rgba(28, 24, 20, 0.94)',
  },
};

export type AppTheme = ReturnType<typeof buildTheme>;

export function buildTheme(mode: ThemeMode) {
  const colors = palettes[mode];

  return {
    mode,
    colors,
    fonts: {
      displayLight: 'Fraunces_300Light',
      displaySemiBold: 'Fraunces_600SemiBold',
      displayBold: 'Fraunces_700Bold',
      body: 'DMSans_400Regular',
      bodyMedium: 'DMSans_500Medium',
      bodySemiBold: 'DMSans_600SemiBold',
      mono: 'DMMono_400Regular',
      monoMedium: 'DMMono_500Medium',
    },
    spacing: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      8: 32,
      10: 40,
      12: 48,
      16: 64,
    },
    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      pill: 999,
    },
    shadows: {
      card: {
        elevation: 3,
        shadowColor: '#1C1814',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: mode === 'dark' ? 0.24 : 0.08,
        shadowRadius: 12,
      },
      elevated: {
        elevation: 6,
        shadowColor: '#1C1814',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: mode === 'dark' ? 0.28 : 0.14,
        shadowRadius: 24,
      },
    },
  };
}
