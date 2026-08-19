export interface RegisterIn {
  email: string;
  password: string;
  display_name: string;
  diets?: string[];
}

export interface LoginIn {
  email: string;
  password: string;
}

export interface RefreshIn {
  refresh_token: string;
}

export interface TokenOut {
  access_token: string;
  refresh_token: string;
}

export interface UserRead {
  id: string;
  email: string;
  display_name: string;
}

export interface ProfileUpdate {
  display_name?: string;
  dietary_preferences?: string[];
  cooking_since?: string;
}

export interface ProfileRead {
  display_name: string;
  dietary_preferences: string[];
  cooking_since: string;
  saved_count?: number;
  cooked_count?: number;
  collection_count?: number;
}

export interface IngredientIn {
  amount: number;
  unit?: string;
  name: string;
  note?: string | null;
}

export interface IngredientRead {
  id: string;
  amount: number;
  unit: string;
  name: string;
  note: string | null;
}

export interface StepIn {
  instruction: string;
  timer_minutes?: number | null;
  linked_recipe?: string | null;
}

export interface StepRead {
  id: string;
  instruction: string;
  timer_minutes: number | null;
  linked_recipe: string | null;
}

export interface NutritionItem {
  label: string;
  grams: number;
  color: string;
}

export interface RecipeCreate {
  title: string;
  source_url?: string | null;
  hero_image?: string | null;
  description?: string | null;
  hero_tag?: string | null;
  servings?: number;
  prep_minutes?: number;
  cook_minutes?: number;
  difficulty?: string;
  nutrition?: NutritionItem[];
  ingredients?: IngredientIn[];
  steps?: StepIn[];
}

export interface RecipeUpdate {
  title?: string | null;
  source_url?: string | null;
  hero_image?: string | null;
  description?: string | null;
  hero_tag?: string | null;
  servings?: number | null;
  prep_minutes?: number | null;
  cook_minutes?: number | null;
  difficulty?: string | null;
  nutrition?: NutritionItem[] | null;
  ingredients?: IngredientIn[] | null;
  steps?: StepIn[] | null;
}

export interface RecipeRead {
  id: string;
  title: string;
  source_url: string | null;
  hero_image: string | null;
  description: string | null;
  hero_tag: string | null;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  difficulty: string;
  nutrition: NutritionItem[];
  created_at: string;
  updated_at: string;
  ingredients: IngredientRead[];
  steps: StepRead[];
  pantry_owned?: number;
  pantry_total?: number;
  missing_ingredients?: string[];
  community_rating?: string;
}

export interface PantryItemCreate {
  name: string;
  quantity: string;
  category: string;
  expiry_date?: string | null;
}

export interface PantryItemUpdate {
  name?: string | null;
  quantity?: string | null;
  category?: string | null;
  expiry_date?: string | null;
}

export interface PantryItemRead {
  id: string;
  name: string;
  quantity: string;
  category: string;
  expiry_date: string | null;
  alert?: string | null;
}

export interface CookLogCreate {
  recipe_id?: string | null;
  date?: string | null;
  rating: number;
  note?: string | null;
}

export interface CookLogRead {
  id: string;
  recipe_id: string;
  recipe_title: string;
  recipe_hero_image: string | null;
  date: string;
  rating: number;
  note: string | null;
}

export interface MealPlanEntryCreate {
  recipe_id: string;
  day: number;
  slot: string;
}

export interface MealPlanEntryRead {
  id: string;
  recipe_id: string;
  recipe_title: string;
  recipe_hero_image: string | null;
  day: number;
  slot: string;
}

export interface MealPlanCreate {
  week_start: string;
  entries?: MealPlanEntryCreate[];
}

export interface MealPlanUpdate {
  week_start?: string | null;
}

export interface MealPlanRead {
  id: string;
  week_start: string;
  entries: MealPlanEntryRead[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
