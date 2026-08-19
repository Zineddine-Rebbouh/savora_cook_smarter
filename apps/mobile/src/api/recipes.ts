import { apiClient } from './client';
import { CookLogCreate, CookLogRead, Paginated, RecipeCreate, RecipeRead, RecipeUpdate } from './types';

export interface ListRecipesParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getRecipes(params?: ListRecipesParams): Promise<Paginated<RecipeRead>> {
  const response = await apiClient.get<Paginated<RecipeRead>>('/recipes/', { params });
  return response.data;
}

export async function createRecipe(data: RecipeCreate): Promise<RecipeRead> {
  const response = await apiClient.post<RecipeRead>('/recipes/', data);
  return response.data;
}

export async function getRecipe(id: string): Promise<RecipeRead> {
  const response = await apiClient.get<RecipeRead>(`/recipes/${id}`);
  return response.data;
}

export async function updateRecipe(id: string, data: RecipeCreate): Promise<RecipeRead> {
  const response = await apiClient.put<RecipeRead>(`/recipes/${id}`, data);
  return response.data;
}

export async function patchRecipe(id: string, data: RecipeUpdate): Promise<RecipeRead> {
  const response = await apiClient.patch<RecipeRead>(`/recipes/${id}`, data);
  return response.data;
}

export async function deleteRecipe(id: string): Promise<void> {
  await apiClient.delete(`/recipes/${id}`);
}

export async function logCook(id: string, data: CookLogCreate): Promise<CookLogRead> {
  const response = await apiClient.post<CookLogRead>(`/recipes/${id}/cook-logs/`, data);
  return response.data;
}
