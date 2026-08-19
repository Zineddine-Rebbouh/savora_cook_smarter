import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecipes } from '../state/RecipesContext';
import type { AppTheme } from '../theme';

type DiscoverScreenProps = {
  onOpenRecipe?: (recipeId: string) => void;
  theme: AppTheme;
};

const categories = [
  'Algerian',
  'Italian',
  'Asian',
  'Mediterranean',
  'Middle Eastern',
];

const trendingSearches = [
  'summer salads',
  'chicken and rice',
  'no onion',
  'quick pasta',
  'plant-based',
];

const categoryCards = [
  { id: 'cat-1', title: 'Algerian', subtitle: 'Warm spice bowls' },
  { id: 'cat-2', title: 'Italian', subtitle: 'Comfort pasta' },
  { id: 'cat-3', title: 'Asian', subtitle: 'Bright noodles' },
  { id: 'cat-4', title: 'Mediterranean', subtitle: 'Fresh plates' },
];

const featured = {
  title: 'Seasonal: Summer Salads',
  subtitle: 'Bright recipes for lighter evenings',
};

export function DiscoverScreen({ onOpenRecipe, theme }: DiscoverScreenProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { recipes } = useRecipes();
  const styles = createStyles(theme);
  const hasQuery = debouncedQuery.trim().length > 0;

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);

    return () => clearTimeout(id);
  }, [query]);

  const results = debouncedQuery.trim()
    ? recipes.filter((recipe) => {
        const term = debouncedQuery.toLowerCase();
        const haystack = `${recipe.title} ${recipe.source} ${recipe.ingredients
          .map((ingredient) => ingredient.name)
          .join(' ')}`.toLowerCase();

        if (term.startsWith('no ')) {
          const excluded = term.slice(3);
          return !haystack.includes(excluded);
        }

        return term
          .split(' ')
          .every((word) => word && haystack.includes(word));
      })
    : [];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagePadding}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Discover</Text>
            <Pressable
              style={({ pressed }) => [
                styles.filterButton,
                pressed && styles.pressed,
              ]}
            >
              <Feather color={theme.colors.textPrimary} name="sliders" size={18} />
              <View style={styles.filterDot} />
            </Pressable>
          </View>

          <View style={styles.searchCard}>
            <Feather color={theme.colors.textTertiary} name="search" size={18} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search recipes, ingredients, cuisines..."
              placeholderTextColor={theme.colors.textTertiary}
              style={styles.searchInput}
              value={query}
            />
          </View>

          {hasQuery ? (
            <View>
              <View style={styles.interpretationCard}>
                <Text style={styles.interpretationLabel}>Filtering</Text>
                <Text style={styles.interpretationText}>
                  {debouncedQuery.trim()}
                </Text>
              </View>

              <Text style={styles.sectionHeading}>
                Recipes ({results.length})
              </Text>
              {results.length ? (
                <View style={styles.resultsList}>
                  {results.map((recipe) => (
                    <Pressable
                      key={recipe.id}
                      onPress={() => onOpenRecipe?.(recipe.id)}
                      style={styles.resultRow}
                    >
                      <View style={styles.resultThumb} />
                      <View style={styles.resultCopy}>
                        <Text style={styles.resultTitle}>{recipe.title}</Text>
                        <Text style={styles.resultMeta}>{recipe.source}</Text>
                      </View>
                      <Feather
                        color={theme.colors.textTertiary}
                        name="chevron-right"
                        size={18}
                      />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Feather
                    color={theme.colors.textTertiary}
                    name="search"
                    size={28}
                  />
                  <Text style={styles.emptyTitle}>Couldn't find that</Text>
                  <Text style={styles.emptyBody}>
                    Try different keywords, or import a recipe with that name.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <>
              <View style={styles.sectionCard}>
                <View style={styles.featuredCard}>
                  <Text style={styles.featuredLabel}>Featured Collection</Text>
                  <Text style={styles.featuredTitle}>{featured.title}</Text>
                  <Text style={styles.featuredSubtitle}>{featured.subtitle}</Text>
                </View>
              </View>

              <Text style={styles.sectionHeading}>Browse by category</Text>
              <FlatList
                data={categoryCards}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.categoryRow}
                renderItem={({ item }) => (
                  <Pressable style={styles.categoryCard}>
                    <View style={styles.categoryImage} />
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                    <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
                  </Pressable>
                )}
              />

              <Text style={styles.sectionHeading}>Smart filters</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {['Under 30min', 'High Protein', 'Vegan', 'Pantry Match', 'Highly Rated'].map((label) => (
                  <Pressable key={label} style={styles.filterChip}>
                    <Text style={styles.filterChipText}>{label}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.sectionHeading}>Trending searches</Text>
              <View style={styles.trendingList}>
                {trendingSearches.map((term) => (
                  <Pressable key={term} onPress={() => setQuery(term)} style={styles.trendingItem}>
                    <Text style={styles.trendingText}>{term}</Text>
                    <Feather color={theme.colors.accentPrimary} name="arrow-right" size={16} />
                  </Pressable>
                ))}
              </View>
            </>
          )}
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
      marginBottom: spacing[6],
    },
    title: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 36,
    },
    filterButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      height: 45,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      position: 'relative',
    },
    pressed: {
      opacity: 0.7,
    },
    filterDot: {
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      height: 8,
      position: 'absolute',
      right: 10,
      top: 12,
      width: 8,
    },
    searchCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderSubtle,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing[3],
      minHeight: 54,
      paddingHorizontal: spacing[4],
    },
    searchInput: {
      color: colors.textPrimary,
      flex: 1,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      paddingVertical: spacing[3],
    },
    sectionCard: {
      marginTop: spacing[6],
      marginBottom: spacing[6],
    },
    featuredCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      padding: spacing[5],
      ...theme.shadows.card,
    },
    featuredLabel: {
      color: colors.textSecondary,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: spacing[2],
    },
    featuredTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 32,
      marginBottom: spacing[2],
    },
    featuredSubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
    },
    sectionHeading: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 20,
      lineHeight: 28,
      marginBottom: spacing[4],
    },
    categoryRow: {
      gap: spacing[4],
      paddingBottom: spacing[4],
    },
    categoryCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.lg,
      height: 140,
      justifyContent: 'flex-end',
      marginRight: spacing[4],
      padding: spacing[4],
      width: 180,
      ...theme.shadows.card,
    },
    categoryImage: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.md,
      height: 72,
      marginBottom: spacing[3],
      width: '100%',
    },
    categoryTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing[1],
    },
    categorySubtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    chipRow: {
      flexDirection: 'row',
      gap: spacing[3],
      paddingBottom: spacing[4],
    },
    filterChip: {
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.pill,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    filterChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    trendingList: {
      gap: spacing[3],
      marginBottom: spacing[8],
    },
    trendingItem: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing[4],
      ...theme.shadows.card,
    },
    trendingText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    interpretationCard: {
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.xl,
      borderWidth: 1,
      padding: spacing[4],
      marginBottom: spacing[8],
    },
    interpretationLabel: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      letterSpacing: 0.5,
      marginBottom: spacing[2],
      textTransform: 'uppercase',
    },
    interpretationText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    resultsList: {
      gap: spacing[3],
      marginBottom: spacing[8],
    },
    resultRow: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing[3],
      padding: spacing[4],
      ...theme.shadows.card,
    },
    resultThumb: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.md,
      height: 56,
      width: 56,
    },
    resultCopy: {
      flex: 1,
      gap: spacing[1],
    },
    resultTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    resultMeta: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
    },
    emptyCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      gap: spacing[2],
      padding: spacing[8],
      ...theme.shadows.card,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 22,
      lineHeight: 28,
      marginTop: spacing[3],
    },
    emptyBody: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
    },
  });
}
