import React, { useState } from "react";
import { Text } from "react-native-paper";
import { FormLayout } from "../components/centered-layout";
import { View } from "react-native";
import { loginSchema } from "../schema/account";
import { authService } from "../services/auth";
import AppButton from "../components/ui/AppButton";
import AppTextInput from "../components/ui/AppTextInput";
import AppErrorMessage from "../components/ui/AppErrorMessage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("gaetan@vrai-email.com");
  const [password, setPassword] = useState("100%Vrai@");
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
      const fieldErrors = validated.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});
      setErrors(fieldErrors);
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
        navigation.navigate("Home", {
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
        variant="headlineSmall"
        style={{
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Connexion
      </Text>

      <View style={{ gap: 10 }}>
        <AppTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={!!errors.email}
          errorText={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading}
        />

        <AppTextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={!!errors.password}
          errorText={errors.password}
          disabled={loading}
        />

        <AppButton loading={loading} onPress={handleLogin}>
          Connexion
        </AppButton>
      </View>

      <AppErrorMessage message={error} />

      <View style={{ marginTop: 20, gap: 10 }}>
        <Text style={{ textAlign: "center" }}>
          <Text
            style={{ textDecorationLine: "underline", color: "#7B1FA2" }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Mot de passe oublié ?
          </Text>
        </Text>

        <Text style={{ textAlign: "center" }}>
          Vous n&apos;avez pas de compte ?{" "}
          <Text
            style={{ textDecorationLine: "underline", color: "#7B1FA2" }}
            onPress={() => navigation.navigate("Register")}
          >
            S'inscrire
          </Text>
        </Text>
      </View>
    </FormLayout>
  );
};

export default LoginScreen;

