import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  collections,
  forYouRecipes,
  readyToCookRecipes,
  recentRecipes,
} from '../data/homeFeed';
import { useRecipes } from '../state/RecipesContext';
import type { AppTheme } from '../theme';

type HomeScreenProps = {
  onOpenRecipe: (recipeId: string) => void;
  theme: AppTheme;
};

export function HomeScreen({ onOpenRecipe, theme }: HomeScreenProps) {
  const { isSaved, toggleSaved } = useRecipes();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagePadding}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.greeting}>Good morning, Zine</Text>
              <Text style={styles.headline}>What are we cooking today?</Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.pressed,
                ]}
              >
                <Feather color={theme.colors.textPrimary} name="bell" size={18} />
                <View style={styles.notificationDot} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.avatar,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.avatarText}>Z</Text>
              </Pressable>
            </View>
          </View>

          <SectionHeader
            badge="4 recipes"
            theme={theme}
            title="Ready to Cook"
          />
          <ScrollView
            contentContainerStyle={styles.horizontalRail}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {readyToCookRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => onOpenRecipe(recipe.recipeId)}
                style={styles.readyCard}
              >
                <Image source={{ uri: recipe.image }} style={styles.readyImage} />
                <View style={styles.readyCopy}>
                  <Text numberOfLines={2} style={styles.readyTitle}>
                    {recipe.title}
                  </Text>
                  <Text style={styles.readyPantry}>{recipe.pantryLabel}</Text>
                  <View style={styles.readyMetaRow}>
                    <View style={styles.timeChip}>
                      <Feather
                        color={theme.colors.textSecondary}
                        name="clock"
                        size={12}
                      />
                      <Text style={styles.timeChipText}>{recipe.time}</Text>
                    </View>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${recipe.pantryMatch * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <SectionHeader
            subtitle="Based on your tastes"
            theme={theme}
            title="For You"
          />
          <View style={styles.feedColumn}>
            {forYouRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => onOpenRecipe(recipe.recipeId)}
                style={styles.feedCard}
              >
                <ImageBackground
                  imageStyle={styles.feedCardImage}
                  source={{ uri: recipe.image }}
                  style={styles.feedCardImage}
                >
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(28, 24, 20, 0.2)',
                      theme.colors.bgDark,
                    ]}
                    locations={[0, 0.45, 1]}
                    style={styles.feedGradient}
                  >
                    <View style={styles.feedTopRow}>
                      {recipe.aiPick ? (
                        <View style={styles.aiBadge}>
                          <Feather
                            color={theme.colors.aiText}
                            name="star"
                            size={12}
                          />
                          <Text style={styles.aiBadgeText}>Savora Pick</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                      <Pressable
                        onPress={() => toggleSaved(recipe.recipeId)}
                        style={({ pressed }) => [
                          styles.bookmarkButton,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Feather
                          color={
                            isSaved(recipe.recipeId)
                              ? theme.colors.accentPrimary
                              : theme.colors.textInverse
                          }
                          name="bookmark"
                          size={16}
                        />
                      </Pressable>
                    </View>

                    <View style={styles.feedBottom}>
                      <Text style={styles.feedTitle}>{recipe.title}</Text>
                      <View style={styles.feedMetaRow}>
                        <View style={styles.feedChip}>
                          <Text style={styles.feedChipText}>{recipe.cuisine}</Text>
                        </View>
                        <Text style={styles.feedMetaText}>{recipe.time}</Text>
                        <Text style={styles.feedMetaText}>
                          {'●'.repeat(recipe.difficulty)}{' '}
                          {recipe.pantryMatch}% match
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            ))}
          </View>

          <SectionHeader theme={theme} title="Popular Collections" />
          <ScrollView
            contentContainerStyle={styles.collectionsRail}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {collections.map((collection) => (
              <View key={collection.id} style={styles.collectionItem}>
                <Image
                  source={{ uri: collection.image }}
                  style={styles.collectionImage}
                />
                <Text style={styles.collectionTitle}>{collection.title}</Text>
              </View>
            ))}
          </ScrollView>

          <SectionHeader theme={theme} title="Your Recently Saved" />
          <ScrollView
            contentContainerStyle={styles.recentRail}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {recentRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => onOpenRecipe(recipe.recipeId)}
                style={styles.recentCard}
              >
                <Image source={{ uri: recipe.image }} style={styles.recentImage} />
                <Text numberOfLines={2} style={styles.recentTitle}>
                  {recipe.title}
                </Text>
                <Text style={styles.recentSource}>{recipe.source}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  subtitle,
  badge,
  theme,
}: {
  badge?: string;
  subtitle?: string;
  theme: AppTheme;
  title: string;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
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
      backgroundColor: colors.bgPrimary,
      paddingBottom: spacing[16],
    },
    pagePadding: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[8],
    },
    headerCopy: {
      flex: 1,
      gap: spacing[1],
      paddingRight: spacing[4],
    },
    greeting: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    headline: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 32,
    },
    headerActions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[2],
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 44,
      justifyContent: 'center',
      position: 'relative',
      width: 44,
      ...shadows.card,
    },
    notificationDot: {
      backgroundColor: colors.accentDanger,
      borderColor: colors.surfaceCard,
      borderRadius: radius.pill,
      borderWidth: 2,
      height: 10,
      position: 'absolute',
      right: 9,
      top: 9,
      width: 10,
    },
    avatar: {
      alignItems: 'center',
      backgroundColor: colors.bgDark,
      borderRadius: radius.pill,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    avatarText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
    },
    sectionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[4],
      marginTop: spacing[2],
    },
    sectionHeaderCopy: {
      flex: 1,
      gap: spacing[1],
      paddingRight: spacing[3],
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 22,
      lineHeight: 30,
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    sectionBadge: {
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    sectionBadgeText: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    horizontalRail: {
      gap: spacing[3],
      paddingBottom: spacing[2],
      paddingRight: spacing[5],
    },
    readyCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 108,
      overflow: 'hidden',
      width: 292,
      ...shadows.card,
    },
    readyImage: {
      height: '100%',
      width: 108,
    },
    readyCopy: {
      flex: 1,
      justifyContent: 'space-between',
      padding: spacing[4],
    },
    readyTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    readyPantry: {
      color: colors.accentSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      lineHeight: 14,
      marginTop: spacing[1],
    },
    readyMetaRow: {
      flexDirection: 'row',
      marginTop: spacing[3],
    },
    timeChip: {
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      flexDirection: 'row',
      gap: spacing[1],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    timeChipText: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    progressTrack: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.pill,
      height: 8,
      marginTop: spacing[3],
      overflow: 'hidden',
    },
    progressFill: {
      backgroundColor: colors.accentSecondary,
      borderRadius: radius.pill,
      height: '100%',
    },
    feedColumn: {
      gap: spacing[4],
      marginBottom: spacing[6],
    },
    feedCard: {
      borderRadius: radius.xl,
      overflow: 'hidden',
      ...shadows.elevated,
    },
    feedCardImage: {
      height: 220,
      width: '100%',
    },
    feedGradient: {
      flex: 1,
      justifyContent: 'space-between',
      padding: spacing[4],
    },
    feedTopRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    aiBadge: {
      alignItems: 'center',
      alignSelf: 'flex-start',
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
    bookmarkButton: {
      alignItems: 'center',
      backgroundColor: colors.imageScrim,
      borderColor: colors.imageBorderLight,
      borderRadius: radius.pill,
      borderWidth: 1,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    pressed: {
      opacity: 0.6,
    },
    feedBottom: {
      gap: spacing[2],
    },
    feedTitle: {
      color: colors.textInverse,
      fontFamily: fonts.displaySemiBold,
      fontSize: 22,
      lineHeight: 28,
      maxWidth: '92%',
    },
    feedMetaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    feedChip: {
      backgroundColor: colors.chipOnImage,
      borderColor: colors.imageBorderLight,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    feedChipText: {
      color: colors.textInverse,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    feedMetaText: {
      color: colors.textInverse,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 16,
      opacity: 0.88,
    },
    collectionsRail: {
      gap: spacing[4],
      paddingBottom: spacing[2],
      paddingRight: spacing[5],
    },
    collectionItem: {
      alignItems: 'center',
      width: 92,
    },
    collectionImage: {
      borderRadius: radius.pill,
      height: 78,
      marginBottom: spacing[2],
      width: 78,
    },
    collectionTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
    recentRail: {
      gap: spacing[3],
      paddingBottom: spacing[8],
      paddingRight: spacing[5],
    },
    recentCard: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      overflow: 'hidden',
      paddingBottom: spacing[3],
      width: 168,
      ...shadows.card,
    },
    recentImage: {
      height: 120,
      width: '100%',
    },
    recentTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 20,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[3],
    },
    recentSource: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 16,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[1],
    },
  });
}
