import { apiClient } from './client';
import {
  MealPlanCreate,
  MealPlanEntryCreate,
  MealPlanEntryRead,
  MealPlanRead,
  MealPlanUpdate,
} from './types';

export async function getMealPlans(): Promise<MealPlanRead[]> {
  const response = await apiClient.get<MealPlanRead[]>('/meal-plans/');
  return response.data;
}

export async function createMealPlan(data: MealPlanCreate): Promise<MealPlanRead> {
  const response = await apiClient.post<MealPlanRead>('/meal-plans/', data);
  return response.data;
}

export async function getMealPlan(id: string): Promise<MealPlanRead> {
  const response = await apiClient.get<MealPlanRead>(`/meal-plans/${id}`);
  return response.data;
}

export async function updateMealPlan(id: string, data: MealPlanUpdate): Promise<MealPlanRead> {
  const response = await apiClient.put<MealPlanRead>(`/meal-plans/${id}`, data);
  return response.data;
}

export async function patchMealPlan(id: string, data: MealPlanUpdate): Promise<MealPlanRead> {
  const response = await apiClient.patch<MealPlanRead>(`/meal-plans/${id}`, data);
  return response.data;
}

export async function deleteMealPlan(id: string): Promise<void> {
  await apiClient.delete(`/meal-plans/${id}`);
}

export async function getMealPlanEntries(planId: string): Promise<MealPlanEntryRead[]> {
  const response = await apiClient.get<MealPlanEntryRead[]>(`/meal-plans/${planId}/entries/`);
  return response.data;
}

export async function addMealPlanEntry(
  planId: string,
  entry: MealPlanEntryCreate
): Promise<MealPlanEntryRead> {
  const response = await apiClient.post<MealPlanEntryRead>(`/meal-plans/${planId}/entries/`, entry);
  return response.data;
}

export async function removeMealPlanEntry(planId: string, entryId: string): Promise<void> {
  await apiClient.delete(`/meal-plans/${planId}/entries/${entryId}`);
}
