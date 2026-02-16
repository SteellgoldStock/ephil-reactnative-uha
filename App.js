import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import useThemeStore from "./stores/themeStore";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import PoiScreen from "./screens/PoiScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  version: 3,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

export default function App() {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const activeTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider
      settings={{
        rippleEffectEnabled: true,
      }}
      theme={activeTheme}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={activeTheme}>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: activeTheme.colors.surface,
            },
            headerTintColor: activeTheme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: "Caméra", headerShown: true }}
          />
          <Stack.Screen
            name="Poi"
            component={PoiScreen}
            options={{ title: "Points d'intérêt", headerShown: true }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Paramètres", headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

