import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createPantryItem as createPantryItemApi,
  deletePantryItem as deletePantryItemApi,
  getPantryItems as getPantryItemsApi,
} from '../api/pantry';
import { PantryItemRead } from '../api/types';
import { useAuth } from './AuthContext';

export type PantryItem = {
  alert: 'high' | 'medium' | 'low';
  category: string;
  expiry: string;
  id: string;
  name: string;
  quantity: string;
};

type PantryState = {
  items: PantryItem[];
  isLoading: boolean;
  addIngredient: (name: string, quantity: string, category?: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  hasIngredient: (name: string) => boolean;
  refreshPantry: () => Promise<void>;
};

export function apiPantryItemToApp(item: PantryItemRead): PantryItem {
  let expiryLabel = '—';
  if (item.expiry_date) {
    const diffDays = Math.ceil(
      (new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays <= 0) expiryLabel = 'Expired';
    else if (diffDays === 1) expiryLabel = 'Tomorrow';
    else if (diffDays <= 30) expiryLabel = `${diffDays} days`;
    else expiryLabel = item.expiry_date;
  }

  const alertLevel = item.alert === 'high' || item.alert === 'medium' || item.alert === 'low'
    ? item.alert
    : 'low';

  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    category: item.category || 'Pantry',
    expiry: expiryLabel,
    alert: alertLevel,
  };
}

const PantryContext = createContext<PantryState | undefined>(undefined);

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshPantry = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getPantryItemsApi();
      const mapped = response.items.map(apiPantryItemToApp);
      setItems(mapped);
    } catch (err) {
      console.warn('Failed to fetch pantry items from API:', err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshPantry();
  }, [refreshPantry]);

  const addIngredient = useCallback(
    async (name: string, quantity: string, category = 'Pantry') => {
      try {
        const created = await createPantryItemApi({
          name,
          quantity,
          category,
        });
        const appItem = apiPantryItemToApp(created);
        setItems((current) => [appItem, ...current.filter((i) => i.id !== appItem.id)]);
      } catch (err) {
        console.warn('Failed to add pantry item to API, fallback to local state:', err);
        const tempItem: PantryItem = {
          id: `pantry-${Date.now()}`,
          name,
          quantity,
          category,
          expiry: '—',
          alert: 'low',
        };
        setItems((current) => [tempItem, ...current]);
      }
    },
    []
  );

  const removeItem = useCallback(async (id: string) => {
    try {
      await deletePantryItemApi(id);
    } catch (err) {
      console.warn('Failed to delete pantry item from API:', err);
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const hasIngredient = useCallback(
    (name: string) =>
      items.some((item) => item.name.toLowerCase() === name.toLowerCase()),
    [items]
  );

  const value = useMemo(
    () => ({ items, isLoading, addIngredient, removeItem, hasIngredient, refreshPantry }),
    [items, isLoading, addIngredient, removeItem, hasIngredient, refreshPantry]
  );

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const context = useContext(PantryContext);

  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }

  return context;
}