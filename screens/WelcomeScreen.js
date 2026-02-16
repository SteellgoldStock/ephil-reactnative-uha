import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import { CenteredLayout } from "../components/centered-layout";
import { authService } from "../services/auth";
import AppButton from "../components/ui/AppButton";

const WelcomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);


  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        // User is already logged in, get their data and navigate to Home
        const userData = await authService.getUserData();
        if (userData) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home", params: { user: userData } }],
          });
        } else {
          // Token exists but no user data, try to fetch from API
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home", params: { user: currentUser } }],
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // If there's an error, just continue to welcome screen
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CenteredLayout>
        <ActivityIndicator size="large" color="#7B1FA2" />
        <Text style={{ marginTop: 16, textAlign: "center" }}>
          Vérification de l'authentification...
        </Text>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Text
          variant="headlineLarge"
          style={{
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
            color: "#7B1FA2",
          }}
        >
          Bienvenue
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Connectez-vous ou créez un compte pour continuer
        </Text>
      </View>

      <View style={{ width: "100%", maxWidth: 300, gap: 12 }}>
        <AppButton onPress={() => navigation.navigate("Login")}>
          Connexion
        </AppButton>

        <AppButton
          mode="outlined"
          onPress={() => navigation.navigate("Register")}
        >
          Inscription
        </AppButton>
      </View>
    </CenteredLayout>
  );
};


export default WelcomeScreen;
