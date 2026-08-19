import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'savora_access_token';
const REFRESH_TOKEN_KEY = 'savora_refresh_token';

// In-memory fallback for environments without SecureStore native module (e.g. unit tests or web)
let memoryStore: Record<string, string | null> = {};

async function isSecureStoreAvailable(): Promise<boolean> {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (await isSecureStoreAvailable()) {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }
  return memoryStore[ACCESS_TOKEN_KEY] ?? null;
}

export async function setAccessToken(token: string): Promise<void> {
  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } else {
    memoryStore[ACCESS_TOKEN_KEY] = token;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  if (await isSecureStoreAvailable()) {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }
  return memoryStore[REFRESH_TOKEN_KEY] ?? null;
}

export async function setRefreshToken(token: string): Promise<void> {
  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } else {
    memoryStore[REFRESH_TOKEN_KEY] = token;
  }
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await setAccessToken(accessToken);
  await setRefreshToken(refreshToken);
}

export async function clearTokens(): Promise<void> {
  if (await isSecureStoreAvailable()) {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
  memoryStore[ACCESS_TOKEN_KEY] = null;
  memoryStore[REFRESH_TOKEN_KEY] = null;
}
