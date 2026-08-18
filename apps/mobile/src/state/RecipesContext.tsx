import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { demoRecipe, initialRecipes, type Recipe } from '../data/mockRecipe';

type RecipeState = {
  recipes: Recipe[];
  savedIds: string[];
  getRecipeById: (id: string) => Recipe | undefined;
  saveRecipe: (recipe: Recipe) => void;
  createRecipeFromUrl: (url: string) => Recipe;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

const RecipesContext = createContext<RecipeState | undefined>(undefined);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const getRecipeById = useCallback(
    (id: string) => recipes.find((recipe) => recipe.id === id),
    [recipes],
  );

  const saveRecipe = useCallback((recipe: Recipe) => {
    setRecipes((current) => [recipe, ...current.filter((item) => item.id !== recipe.id)]);
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds],
  );

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

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
      getRecipeById,
      saveRecipe,
      createRecipeFromUrl,
      isSaved,
      toggleSaved,
    }),
    [recipes, savedIds, getRecipeById, saveRecipe, createRecipeFromUrl, isSaved, toggleSaved],
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
