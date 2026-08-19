import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createRecipe as createRecipeApi, getRecipes as getRecipesApi } from '../api/recipes';
import { RecipeCreate, RecipeRead } from '../api/types';
import { demoRecipe, type Recipe } from '../data/mockRecipe';
import { useAuth } from './AuthContext';
import { usePersistedState } from './usePersistedState';

export function apiRecipeToAppRecipe(r: RecipeRead): Recipe {
  const missing = r.missing_ingredients || [];
  return {
    id: r.id,
    title: r.title,
    source: r.source_url ? `Imported from ${r.source_url}` : 'Savora Kitchen',
    heroImage:
      r.hero_image ||
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80',
    description: r.description || '',
    heroTag: r.hero_tag || 'Savora Pick',
    quickStats: [
      { label: 'Prep', value: `${r.prep_minutes || 0}m` },
      { label: 'Cook', value: `${r.cook_minutes || 0}m` },
      { label: 'Serves', value: `${r.servings || 1}` },
      { label: 'Difficulty', value: r.difficulty || 'Easy' },
    ],
    servings: r.servings || 1,
    pantryOwned: r.pantry_owned || 0,
    pantryTotal: r.pantry_total || (r.ingredients ? r.ingredients.length : 0),
    missingIngredients: missing,
    ingredients: (r.ingredients || []).map((ing) => ({
      id: ing.id,
      amount: Number(ing.amount),
      unit: ing.unit || '',
      name: ing.name,
      note: ing.note || undefined,
      inPantry: !missing.includes(ing.name),
    })),
    steps: (r.steps || []).map((s) => ({
      id: s.id,
      instruction: s.instruction,
      timerMinutes: s.timer_minutes || undefined,
      linkedRecipe: s.linked_recipe || undefined,
    })),
    nutrition: r.nutrition || [],
    cookHistory: 'Cooked recently',
    communityRating: r.community_rating || '4.8 from 126 home cooks',
    logs: [],
  };
}

export function appRecipeToCreatePayload(r: Recipe): RecipeCreate {
  const prepStr = r.quickStats?.find((s) => s.label === 'Prep')?.value || '0';
  const cookStr = r.quickStats?.find((s) => s.label === 'Cook')?.value || '0';
  const diffStr = r.quickStats?.find((s) => s.label === 'Difficulty')?.value || 'Easy';

  return {
    title: r.title,
    source_url: r.source,
    hero_image: r.heroImage,
    description: r.description,
    hero_tag: r.heroTag,
    servings: r.servings || 1,
    prep_minutes: parseInt(prepStr.replace('m', ''), 10) || 0,
    cook_minutes: parseInt(cookStr.replace('m', ''), 10) || 0,
    difficulty: diffStr,
    nutrition: r.nutrition || [],
    ingredients: (r.ingredients || []).map((i) => ({
      amount: i.amount,
      unit: i.unit || '',
      name: i.name,
      note: i.note,
    })),
    steps: (r.steps || []).map((s) => ({
      instruction: s.instruction,
      timer_minutes: s.timerMinutes,
      linked_recipe: s.linkedRecipe,
    })),
  };
}

type RecipeState = {
  recipes: Recipe[];
  savedIds: string[];
  isLoading: boolean;
  getRecipeById: (id: string) => Recipe | undefined;
  saveRecipe: (recipe: Recipe) => Promise<void>;
  createRecipeFromUrl: (url: string) => Recipe;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  refreshRecipes: () => Promise<void>;
};

const RecipesContext = createContext<RecipeState | undefined>(undefined);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedIds, setSavedIds] = usePersistedState<string[]>('saved-recipe-ids', []);

  const refreshRecipes = useCallback(async () => {
    if (!isAuthenticated) {
      setRecipes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getRecipesApi();
      const mapped = response.items.map(apiRecipeToAppRecipe);
      setRecipes(mapped);
    } catch (err) {
      console.warn('Failed to fetch recipes from API, falling back gracefully:', err);
      // Fallback cleanly on error to empty array without crashing
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshRecipes();
  }, [refreshRecipes]);

  const getRecipeById = useCallback(
    (id: string) => recipes.find((recipe) => recipe.id === id),
    [recipes],
  );

  const saveRecipe = useCallback(
    async (recipeToSave: Recipe) => {
      try {
        const payload = appRecipeToCreatePayload(recipeToSave);
        const created = await createRecipeApi(payload);
        const appRecipe = apiRecipeToAppRecipe(created);

        setRecipes((current) => [appRecipe, ...current.filter((item) => item.id !== appRecipe.id)]);
        setSavedIds((current) =>
          current.includes(appRecipe.id) ? current : [...current, appRecipe.id]
        );
      } catch (err) {
        console.warn('Failed to save recipe to backend, saving locally:', err);
        setRecipes((current) => [recipeToSave, ...current.filter((item) => item.id !== recipeToSave.id)]);
        setSavedIds((current) =>
          current.includes(recipeToSave.id) ? current : [...current, recipeToSave.id]
        );
      }
    },
    [setSavedIds]
  );

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, [setSavedIds]);

  const createRecipeFromUrl = useCallback((url: string): Recipe => {
    let hostname = url;

    try {
      hostname = new URL(url).hostname.replace('www.', '');
    } catch {
      hostname = url;
    }

    const id = `imported-${Date.now()}`;
    const title = `Imported from ${hostname}`;

    return {
      ...demoRecipe,
      id,
      title,
      source: `Imported from ${hostname}`,
      heroTag: 'AI Import',
      heroImage:
        'https://images.unsplash.com/photo-1512058564366-c9e8173bcee4?auto=format&fit=crop&w=1200&q=80',
      description:
        'Savora parsed this recipe for you. Review ingredients, edit quantities, and save it to your cookbook.',
      quickStats: [
        { label: 'Prep', value: '10m' },
        { label: 'Cook', value: '25m' },
        { label: 'Serves', value: '4' },
        { label: 'Difficulty', value: 'Easy' },
      ],
      pantryOwned: 5,
      pantryTotal: 8,
      missingIngredients: ['heavy cream', 'parmesan', 'lemon'],
      ingredients: demoRecipe.ingredients.map((ingredient, index) => ({
        ...ingredient,
        id: `${id}-${ingredient.id}`,
        inPantry: index < 5,
      })),
    };
  }, []);

  const value = useMemo(
    () => ({
      recipes,
      savedIds,
      isLoading,
      getRecipeById,
      saveRecipe,
      createRecipeFromUrl,
      isSaved,
      toggleSaved,
      refreshRecipes,
    }),
    [
      recipes,
      savedIds,
      isLoading,
      getRecipeById,
      saveRecipe,
      createRecipeFromUrl,
      isSaved,
      toggleSaved,
      refreshRecipes,
    ]
  );

  return (
    <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);

  if (!context) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }

  return context;
}
