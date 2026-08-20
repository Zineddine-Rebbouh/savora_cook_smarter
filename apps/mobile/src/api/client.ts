import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './storage';
import { TokenOut } from './types';

// NOTE: When running on a physical mobile device, EXPO_PUBLIC_API_URL must be set
// to your computer's LAN IP address (e.g., http://192.168.1.100:8000/api/v1)
// instead of http://localhost:8000/api/v1, because "localhost" inside the app
// on a physical device or emulator resolves to the device itself.
const DEFAULT_API_URL = 'http://localhost:8000/api/v1';

// In development Expo advertises the Metro host (the dev machine) via hostUri,
// e.g. "192.168.1.3:8081". Devices/emulators must reach the backend through
// that LAN IP, never "localhost" (which resolves to the device itself).
const getBaseUrl = (): string => {
  const extraApiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (extraApiUrl || envApiUrl) {
    return extraApiUrl || envApiUrl;
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host && host !== 'localhost') {
    return `http://${host}:8000/api/v1`;
  }

  return DEFAULT_API_URL;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

let unauthenticatedCallback: (() => void) | null = null;

/**
 * Register a callback to be called when authentication fails and tokens cannot be refreshed.
 * This allows higher-level auth state or UI components to reset state and navigate to Onboarding/login.
 */
export function setUnauthenticatedHandler(handler: (() => void) | null): void {
  unauthenticatedCallback = handler;
}

// Request Interceptor: Attach Authorization Bearer token if available
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 Unauthorized & Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401, request exists, and we haven't already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Do not attempt refresh if the failed request was itself the refresh endpoint or login/register
      const isAuthEndpoint = originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call POST /auth/refresh without triggering this response interceptor endlessly
        const refreshResponse = await axios.post<TokenOut>(
          `${getBaseUrl()}/auth/refresh/`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { access_token, refresh_token: new_refresh_token } = refreshResponse.data;
        await setTokens(access_token, new_refresh_token);

        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await clearTokens();
        if (unauthenticatedCallback) {
          unauthenticatedCallback();
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
