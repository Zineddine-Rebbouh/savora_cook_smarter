import { apiClient } from './client';
import { Paginated, PantryItemCreate, PantryItemRead, PantryItemUpdate } from './types';

export interface ListPantryItemsParams {
  limit?: number;
  offset?: number;
}

export async function getPantryItems(params?: ListPantryItemsParams): Promise<Paginated<PantryItemRead>> {
  const response = await apiClient.get<Paginated<PantryItemRead>>('/pantry-items/', { params });
  return response.data;
}

export async function createPantryItem(data: PantryItemCreate): Promise<PantryItemRead> {
  const response = await apiClient.post<PantryItemRead>('/pantry-items/', data);
  return response.data;
}

export async function getPantryItem(id: string): Promise<PantryItemRead> {
  const response = await apiClient.get<PantryItemRead>(`/pantry-items/${id}`);
  return response.data;
}

export async function updatePantryItem(id: string, data: PantryItemCreate): Promise<PantryItemRead> {
  const response = await apiClient.put<PantryItemRead>(`/pantry-items/${id}`, data);
  return response.data;
}

export async function patchPantryItem(id: string, data: PantryItemUpdate): Promise<PantryItemRead> {
  const response = await apiClient.patch<PantryItemRead>(`/pantry-items/${id}`, data);
  return response.data;
}

export async function deletePantryItem(id: string): Promise<void> {
  await apiClient.delete(`/pantry-items/${id}`);
}
