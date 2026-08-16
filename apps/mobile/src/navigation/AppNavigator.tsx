import { Feather } from '@expo/vector-icons';
import {
  DefaultTheme,
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { ImportHubScreen } from '../screens/ImportHubScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { UrlImportScreen } from '../screens/UrlImportScreen';
import { CookingModeScreen } from '../screens/CookingModeScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { MealPlannerScreen } from '../screens/MealPlannerScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PantryScreen } from '../screens/PantryScreen';
import type { AppTheme } from '../theme';

type RootStackParamList = {
  ImportHub: undefined;
  MainTabs: undefined;
  RecipeDetail: { recipeId: string };
  UrlImport: undefined;
  CookingMode: undefined;
  MealPlanner: undefined;
  Onboarding: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Add: undefined;
  Pantry: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type AppNavigatorProps = {
  theme: AppTheme;
};

export function AppNavigator({ theme }: AppNavigatorProps) {
  const navigationTheme: NavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.bgPrimary,
      border: theme.colors.borderSubtle,
      card: theme.colors.surfaceCard,
      primary: theme.colors.accentPrimary,
      text: theme.colors.textPrimary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen
              theme={theme}
              onFinish={() => navigation.replace('MainTabs')}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen name="MainTabs">
          {({ navigation }) => (
            <TabNavigator
              onOpenImport={() => navigation.navigate('ImportHub')}
              onOpenRecipe={(recipeId) =>
                navigation.navigate('RecipeDetail', { recipeId })
              }
              onOpenPlanner={() => navigation.navigate('MealPlanner')}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen name="RecipeDetail">
          {({ navigation, route }) => (
            <RecipeDetailScreen
              onBack={() => navigation.goBack()}
              onStartCooking={() => navigation.navigate('CookingMode')}
              recipeId={route.params.recipeId}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="CookingMode"
          options={{
            animation: 'slide_from_bottom',
          }}
        >
          {({ navigation }) => (
            <CookingModeScreen
              theme={theme}
              onExit={() => navigation.goBack()}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="MealPlanner"
          options={{
            animation: 'slide_from_right',
          }}
        >
          {({ navigation }) => (
            <MealPlannerScreen
              theme={theme}
              onClose={() => navigation.goBack()}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="ImportHub"
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
            presentation: 'transparentModal',
          }}
        >
          {({ navigation }) => (
            <ImportHubScreen
              onClose={() => navigation.goBack()}
              onOpenUrl={() => navigation.navigate('UrlImport')}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="UrlImport"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        >
          {({ navigation }) => (
            <UrlImportScreen
              onClose={() => navigation.goBack()}
              onGoToRecipe={(recipeId) =>
                navigation.reset({
                  index: 1,
                  routes: [
                    { name: 'MainTabs' },
                    { name: 'RecipeDetail', params: { recipeId } },
                  ],
                })
              }
              theme={theme}
            />
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigator({
  onOpenImport,
  onOpenRecipe,
  onOpenPlanner,
  theme,
}: {
  onOpenImport: () => void;
  onOpenRecipe: (recipeId: string) => void;
  onOpenPlanner: () => void;
  theme: AppTheme;
}) {
  const styles = createStyles(theme);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.bgPrimary },
        tabBarActiveTintColor: theme.colors.accentPrimary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.bodyMedium,
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ color, focused, size }) => (
          <Feather
            color={color}
            name={getTabIcon(route.name, focused)}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" options={{ title: 'Home' }}>
        {() => <HomeScreen onOpenRecipe={onOpenRecipe} theme={theme} />}
      </Tab.Screen>
      <Tab.Screen name="Discover" options={{ title: 'Discover' }}>
        {() => <DiscoverScreen theme={theme} />}
      </Tab.Screen>
      <Tab.Screen
        name="Add"
        options={{
          title: 'Add',
          tabBarButton: (props) => (
            <AddTabButton
              onPress={onOpenImport}
              props={props}
              theme={theme}
            />
          ),
        }}
      >
        {() => <View style={{ backgroundColor: theme.colors.bgPrimary, flex: 1 }} />}
      </Tab.Screen>
      <Tab.Screen name="Pantry" options={{ title: 'Pantry' }}>
        {() => <PantryScreen theme={theme} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ title: 'Profile' }}>
        {() => <ProfileScreen onOpenPlanner={onOpenPlanner} theme={theme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getTabIcon(
  routeName: keyof MainTabParamList,
  focused: boolean,
): keyof typeof Feather.glyphMap {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home';
    case 'Discover':
      return 'search';
    case 'Add':
      return 'plus';
    case 'Pantry':
      return 'archive';
    case 'Profile':
      return 'user';
    default:
      return 'circle';
  }
}

function AddTabButton({
  onPress,
  props,
  theme,
}: {
  onPress: () => void;
  props: BottomTabBarButtonProps;
  theme: AppTheme;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const styles = createStyles(theme);
  const {
    accessibilityLabel,
    accessibilityLargeContentTitle,
    accessibilityState,
    accessibilityValue,
    children,
    delayLongPress,
    disabled,
    onLongPress,
    onPressIn,
    onPressOut,
    style,
    testID,
  } = props;

  function handlePressIn(event: any) {
    Animated.spring(scale, {
      toValue: 1.05,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
    if (onPressIn) {
      onPressIn(event);
    }
  }

  function handlePressOut(event: any) {
    Animated.spring(scale, {
      toValue: 1,
      friction: 10,
      tension: 200,
      useNativeDriver: true,
    }).start();
    if (onPressOut) {
      onPressOut(event);
    }
  }

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityLargeContentTitle={accessibilityLargeContentTitle}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityValue={accessibilityValue}
      delayLongPress={delayLongPress}
      disabled={disabled}
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.addButtonShell,
        style,
        { opacity: pressed ? 0.85 : 1, transform: [{ scale }] },
      ]}
      testID={testID}
    >
      <View style={styles.addButton}>
        <Feather color={theme.colors.textInverse} name="plus" size={22} />
      </View>
      <Text style={styles.addLabel}>Add</Text>
      {children}
    </AnimatedPressable>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, shadows } = theme;

  return StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surfaceCard,
      borderTopColor: colors.borderSubtle,
      height: 84,
      paddingBottom: 10,
      paddingTop: 8,
    },
    tabBarItem: {
      paddingTop: 2,
    },
    addButtonShell: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      marginTop: -18,
    },
    addButton: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      height: 56,
      justifyContent: 'center',
      width: 56,
      ...shadows.elevated,
    },
    addLabel: {
      color: colors.textSecondary,
      fontFamily: theme.fonts.bodyMedium,
      fontSize: 11,
      marginTop: 6,
    },
  });
}
