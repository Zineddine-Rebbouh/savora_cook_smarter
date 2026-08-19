import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function usePersistedState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(key)
      .then((raw) => {
        if (active && raw) {
          try {
            setState(JSON.parse(raw) as T);
          } catch {
            // corrupt stored data — keep seed values
          }
        }
      })
      .finally(() => {
        if (active) {
          setHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(key, JSON.stringify(state)).catch(() => {
        // storage writes are non-fatal
      });
    }
  }, [key, state, hydrated]);

  return [state, setState, hydrated];
}