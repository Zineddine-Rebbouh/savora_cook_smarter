import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import {
  DMMono_400Regular,
  DMMono_500Medium,
} from '@expo-google-fonts/dm-mono';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans';
import {
  Fraunces_300Light,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { PantryProvider } from './src/state/PantryContext';
import { RecipesProvider } from './src/state/RecipesContext';
import { buildTheme } from './src/theme';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = buildTheme(colorScheme === 'dark' ? 'dark' : 'light');
  const [fontsLoaded] = useFonts({
    Fraunces_300Light,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: theme.colors.bgPrimary,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color={theme.colors.accentPrimary} size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RecipesProvider>
          <PantryProvider>
            <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
            <AppNavigator theme={theme} />
          </PantryProvider>
        </RecipesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
