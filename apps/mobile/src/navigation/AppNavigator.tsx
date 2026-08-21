import { Feather } from "@expo/vector-icons";
import {
  DefaultTheme,
  NavigationContainer,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRef } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "../state/AuthContext";

import { HomeScreen } from "../screens/HomeScreen";
import { ImportHubScreen } from "../screens/ImportHubScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RecipeDetailScreen } from "../screens/RecipeDetailScreen";
import { UrlImportScreen } from "../screens/UrlImportScreen";
import { CookingModeScreen } from "../screens/CookingModeScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { MealPlannerScreen } from "../screens/MealPlannerScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { CreateAccountScreen } from "../screens/CreateAccountScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { PantryScreen } from "../screens/PantryScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import type { AppTheme } from "../theme";

type RootStackParamList = {
  ImportHub: undefined;
  MainTabs: undefined;
  RecipeDetail: { recipeId: string };
  UrlImport: undefined;
  CookingMode: { recipeId: string };
  MealPlanner: undefined;
  Onboarding: undefined;
  CreateAccount: undefined;
  Login: undefined;
  EditProfile: undefined;
  Settings: undefined;
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
  const { isAuthenticated, isLoading } = useAuth();

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

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.bgPrimary,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={theme.colors.accentPrimary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator
        initialRouteName={isAuthenticated ? "MainTabs" : "Onboarding"}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen
              theme={theme}
              onFinish={() => navigation.replace("CreateAccount")}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="CreateAccount"
          options={{ animation: "slide_from_right" }}
        >
          {({ navigation }) => (
            <CreateAccountScreen
              theme={theme}
              onFinish={() => navigation.replace("MainTabs")}
              onGoToLogin={() => navigation.replace("Login")}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="Login"
          options={{ animation: "slide_from_right" }}
        >
          {({ navigation }) => (
            <LoginScreen
              theme={theme}
              onFinish={() => navigation.replace("MainTabs")}
              onGoToCreateAccount={() => navigation.replace("CreateAccount")}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen name="MainTabs">
          {({ navigation }) => (
            <TabNavigator
              onOpenImport={() => navigation.navigate("ImportHub")}
              onOpenRecipe={(recipeId) =>
                navigation.navigate("RecipeDetail", { recipeId })
              }
              onOpenPlanner={() => navigation.navigate("MealPlanner")}
              onOpenEditProfile={() => navigation.navigate("EditProfile")}
              onOpenSettings={() => navigation.navigate("Settings")}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen name="RecipeDetail">
          {({ navigation, route }) => (
            <RecipeDetailScreen
              onAddToPlan={() => navigation.navigate("MealPlanner")}
              onBack={() => navigation.goBack()}
              onStartCooking={() =>
                navigation.navigate("CookingMode", {
                  recipeId: route.params.recipeId,
                })
              }
              recipeId={route.params.recipeId}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="CookingMode"
          options={{
            animation: "slide_from_bottom",
          }}
        >
          {({ navigation, route }) => (
            <CookingModeScreen
              onExit={() => navigation.goBack()}
              recipeId={route.params.recipeId}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="MealPlanner"
          options={{
            animation: "slide_from_right",
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
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
            presentation: "transparentModal",
          }}
        >
          {({ navigation }) => (
            <ImportHubScreen
              onClose={() => navigation.goBack()}
              onOpenUrl={() => navigation.navigate("UrlImport")}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="UrlImport"
          options={{
            animation: "slide_from_bottom",
            presentation: "modal",
          }}
        >
          {({ navigation }) => (
            <UrlImportScreen
              onClose={() => navigation.goBack()}
              onGoToRecipe={(recipeId) =>
                navigation.reset({
                  index: 1,
                  routes: [
                    { name: "MainTabs" },
                    { name: "RecipeDetail", params: { recipeId } },
                  ],
                })
              }
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="EditProfile"
          options={{
            animation: "slide_from_right",
          }}
        >
          {({ navigation }) => (
            <EditProfileScreen
              onBack={() => navigation.goBack()}
              theme={theme}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="Settings"
          options={{
            animation: "slide_from_right",
          }}
        >
          {({ navigation }) => (
            <SettingsScreen onBack={() => navigation.goBack()} theme={theme} />
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
  onOpenEditProfile,
  onOpenSettings,
  theme,
}: {
  onOpenImport: () => void;
  onOpenRecipe: (recipeId: string) => void;
  onOpenPlanner: () => void;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
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
      <Tab.Screen name="Home" options={{ title: "Home" }}>
        {() => <HomeScreen onOpenRecipe={onOpenRecipe} theme={theme} />}
      </Tab.Screen>
      <Tab.Screen name="Discover" options={{ title: "Discover" }}>
        {() => <DiscoverScreen onOpenRecipe={onOpenRecipe} theme={theme} />}
      </Tab.Screen>
      <Tab.Screen
        name="Add"
        options={{
          title: "Add",
          tabBarButton: (props) => (
            <AddTabButton onPress={onOpenImport} props={props} theme={theme} />
          ),
        }}
      >
        {() => (
          <View style={{ backgroundColor: theme.colors.bgPrimary, flex: 1 }} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Pantry" options={{ title: "Pantry" }}>
        {() => <PantryScreen theme={theme} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ title: "Profile" }}>
        {() => (
          <ProfileScreen
            onOpenPlanner={onOpenPlanner}
            onOpenEditProfile={onOpenEditProfile}
            onOpenSettings={onOpenSettings}
            theme={theme}
          />
        )}
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
    case "Home":
      return focused ? "home" : "home";
    case "Discover":
      return "search";
    case "Add":
      return "plus";
    case "Pantry":
      return "archive";
    case "Profile":
      return "user";
    default:
      return "circle";
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
        style,
        styles.addButtonShell,
        { opacity: pressed ? 0.85 : 1, transform: [{ scale }] },
      ]}
      testID={testID}
    >
      <View style={styles.addButton}>
        <Feather color={theme.colors.textInverse} name="plus" size={22} />
      </View>
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
      flexDirection: "row",
      justifyContent: "center",
    },
    tabBarItem: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      paddingTop: 2,
    },
    addButtonShell: {
      alignItems: "center",
      alignSelf: "stretch",
      flex: 1,
      justifyContent: "center",
      width: "100%",
    },
    addButton: {
      alignItems: "center",
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      height: 48,
      justifyContent: "center",
      width: 48,
      ...shadows.elevated,
    },
  });
}
