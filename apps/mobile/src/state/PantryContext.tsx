import { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistedState } from './usePersistedState';

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
  addIngredient: (name: string, quantity: string, category?: string) => void;
  removeItem: (id: string) => void;
  hasIngredient: (name: string) => boolean;
};

const seedItems: PantryItem[] = [
  { id: 'pantry-1', name: 'Heavy cream', quantity: '250ml', expiry: 'Tomorrow', alert: 'high', category: 'Dairy' },
  { id: 'pantry-2', name: 'Chicken breast', quantity: '2 pcs', expiry: '4 days', alert: 'medium', category: 'Meat' },
  { id: 'pantry-3', name: 'Eggs', quantity: '6', expiry: '7 days', alert: 'low', category: 'Dairy' },
  { id: 'pantry-4', name: 'Lemon', quantity: '3', expiry: '2 days', alert: 'medium', category: 'Produce' },
  { id: 'pantry-5', name: 'Chickpeas', quantity: '400g', expiry: '30 days', alert: 'low', category: 'Pantry' },
  { id: 'pantry-6', name: 'Butter', quantity: '100g', expiry: '5 days', alert: 'medium', category: 'Dairy' },
];

const PantryContext = createContext<PantryState | undefined>(undefined);

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems, hydrated] = usePersistedState<PantryItem[]>(
    'pantry-items',
    seedItems,
  );

  const addIngredient = useCallback(
    (name: string, quantity: string, category = 'Pantry') => {
      setItems((current) => {
        if (current.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
          return current;
        }

        return [
          {
            id: `pantry-${Date.now()}`,
            name,
            quantity,
            expiry: '—',
            alert: 'low' as const,
            category,
          },
          ...current,
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const hasIngredient = useCallback(
    (name: string) =>
      items.some((item) => item.name.toLowerCase() === name.toLowerCase()),
    [items],
  );

  const value = useMemo(
    () => ({ items, addIngredient, removeItem, hasIngredient }),
    [items, addIngredient, removeItem, hasIngredient],
  );

  if (!hydrated) {
    return null;
  }

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const context = useContext(PantryContext);

  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }

  return context;
}