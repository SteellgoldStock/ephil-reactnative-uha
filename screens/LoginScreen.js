import React, { useState } from "react";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { FormLayout } from "../components/centered-layout";
import { View } from "react-native";
import { loginSchema } from "../schema/account";
import { AntDesign } from "@react-native-vector-icons/ant-design";
import { authService } from "../services/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setError("");
    setErrors({ email: "", password: "" });

    const validated = loginSchema.safeParse({ email, password });
    if (!validated.success) {
      setErrors(
        validated.error.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {}),
      );

      setError(validated.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: email.toLowerCase(),
        password,
      });

      if (response.user) {
        // Extract first name and last name from the full name
        const nameParts = response.user.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        navigation.navigate("Home", {
          firstName: firstName,
          lastName: lastName,
          email: response.user.email,
          user: response.user,
        });
      } else {
        setError("Erreur lors de la connexion");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.message.includes("401") || err.message.includes("incorrect")) {
        setError("Email ou mot de passe incorrect");
      } else if (
        err.message.includes("network") ||
        err.message.includes("fetch")
      ) {
        setError("Erreur de connexion. Vérifiez votre connexion internet.");
      } else {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Connexion
      </Text>

      <View style={{ gap: 10 }}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="flat"
          error={!!errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading}
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          mode="flat"
          secureTextEntry
          error={!!errors.password}
          disabled={loading}
        />

        <Button mode="contained" onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            "Connexion"
          )}
        </Button>
      </View>

      {error !== "" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            color: "red",
            padding: 10,
            textAlign: "center",
            backgroundColor: "#f8d7da",
            marginTop: 10,
            gap: 2,
          }}
        >
          <AntDesign name="alert" size={13} color="red" />
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        </View>
      )}

      <Text style={{ marginTop: 10, textAlign: "center" }}>
        <Text
          style={{ textDecorationLine: "underline", color: "#7B1FA2" }}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Mot de passe oublié ?
        </Text>
      </Text>

      <Text style={{ marginTop: 10, textAlign: "center" }}>
        Vous n&apos;avez pas de compte ?{" "}
        <Text
          style={{ textDecorationLine: "underline", color: "#7B1FA2" }}
          onPress={() => navigation.navigate("Register")}
        >
          S'inscrire
        </Text>
      </Text>
    </FormLayout>
  );
};

export default LoginScreen;
