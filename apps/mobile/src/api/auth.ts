import { apiClient } from './client';
import { LoginIn, ProfileRead, ProfileUpdate, RefreshIn, RegisterIn, TokenOut } from './types';

export async function register(data: RegisterIn): Promise<TokenOut> {
  const response = await apiClient.post<TokenOut>('/auth/register/', data);
  return response.data;
}

export async function login(data: LoginIn): Promise<TokenOut> {
  const response = await apiClient.post<TokenOut>('/auth/login/', data);
  return response.data;
}

export async function refreshToken(data: RefreshIn): Promise<TokenOut> {
  const response = await apiClient.post<TokenOut>('/auth/refresh/', data);
  return response.data;
}

export async function getMe(): Promise<ProfileRead> {
  const response = await apiClient.get<ProfileRead>('/me/');
  return response.data;
}

export async function updateMe(data: ProfileUpdate): Promise<ProfileRead> {
  const response = await apiClient.patch<ProfileRead>('/me/', data);
  return response.data;
}
