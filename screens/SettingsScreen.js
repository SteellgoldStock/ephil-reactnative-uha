import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import useThemeStore from "../stores/themeStore";
import { CenteredLayout } from "../components/centered-layout";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <CenteredLayout>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Paramètres
        </Text>
        <Text variant="bodyLarge" style={styles.status}>
          Thème actuel : {theme === "light" ? "Clair" : "Sombre"}
        </Text>
        <Button mode="contained" onPress={toggleTheme} style={styles.button}>
          Changer le thème
        </Button>
      </View>
    </CenteredLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  title: {
    marginBottom: 10,
  },
  status: {
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#7B1FA2",
  }
});
