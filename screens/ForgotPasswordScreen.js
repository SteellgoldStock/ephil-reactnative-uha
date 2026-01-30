// import { useState } from "react";
// import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Text } from "react-native-paper";
import { FormLayout } from "../components/centered-layout";
// import { View } from "react-native";
// import { AntDesign } from "@react-native-vector-icons/ant-design";
// import { useSQLiteContext } from "expo-sqlite";
// import { findUserByEmail, updateUserPassword } from "../services/database";
// import { hashPassword, generateTemporaryPassword } from "../services/auth";
// import { emailSchema } from "../schema/account";

const ForgotPasswordScreen = ({ navigation }) => {
  // const db = useSQLiteContext();

  // const [email, setEmail] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  // const [newPassword, setNewPassword] = useState("");

  // const handleResetPassword = async () => {
  //   setError("");
  //   setSuccess("");
  //   setNewPassword("");

  //   const validated = emailSchema.safeParse({ email });
  //   if (!validated.success) {
  //     setError(validated.error.issues[0].message);
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const user = await findUserByEmail(db, email.toLowerCase());
  //     if (!user) {
  //       setError("Aucun compte trouve avec cet email");
  //       setLoading(false);
  //       return;
  //     }

  //     const tempPassword = generateTemporaryPassword();
  //     const hashedPassword = await hashPassword(tempPassword);

  //     await updateUserPassword(db, email.toLowerCase(), hashedPassword);

  //     setNewPassword(tempPassword);
  //     setSuccess("Mot de passe temporaire créer!");
  //   } catch (err) {
  //     console.error("Password reset error:", err);
  //     setError("Erreur lors de la reinitialisation. Veuillez reessayer.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <FormLayout>
      {/* <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Mot de passe oublie
      </Text>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#666" }}>
        Entrez votre adresse email pour reinitialiser votre mot de passe
      </Text>

      <View style={{ gap: 10 }}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="flat"
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading || !!newPassword}
        />

        <Button mode="contained" onPress={handleResetPassword} disabled={loading || !!newPassword}>
          {loading ? <ActivityIndicator color="#fff" size="small" /> : "Reinitialiser"}
        </Button>
      </View>

      {error !== "" && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, backgroundColor: "#f8d7da", marginTop: 10, gap: 2 }}>
          <AntDesign name="alert" size={13} color="red" />
          <Text style={{ color: "red", textAlign: "center" }}>
            {error}
          </Text>
        </View>
      )}

      {success !== "" && (
        <View style={{ padding: 10, backgroundColor: "#d4edda", marginTop: 10, gap: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <AntDesign name="check" size={13} color="green" />
            <Text style={{ color: "green", textAlign: "center" }}>
              {success}
            </Text>
          </View>
          {newPassword !== "" && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                Votre mot de passe temporaire est :
              </Text>
              <Text style={{ textAlign: "center", fontSize: 18, fontFamily: "monospace", marginTop: 5, padding: 10, backgroundColor: "#fff", borderRadius: 5 }}>
                {newPassword}
              </Text>
            </View>
          )}
        </View>
      )}*/}

      <Text style={{ marginTop: 20, textAlign: "center" }}>
        <Text
          style={{ textDecorationLine: "underline", color: "#7B1FA2" }}
          onPress={() => navigation.navigate("Login")}
        >
          Retour a la connexion
        </Text>
      </Text>
    </FormLayout>
  );
};

export default ForgotPasswordScreen;
