import { useState, useEffect } from "react";
import {
  Button,
  Text,
  ActivityIndicator,
  Card,
  Avatar,
} from "react-native-paper";
import { View, Alert } from "react-native";
import { CenteredLayout } from "../components/centered-layout";
import { authService } from "../services/auth";

const HomeScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      if (route.params?.user) {
        setUser(route.params.user);
        setLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Erreur", "Impossible de charger les données utilisateur");
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            setLogoutLoading(true);
            await authService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Erreur", "Erreur lors de la déconnexion");
          } finally {
            setLogoutLoading(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setLogoutLoading(true);
              await authService.deleteAccount();
              Alert.alert(
                "Compte supprimé",
                "Votre compte a été supprimé avec succès",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Welcome" }],
                      });
                    },
                  },
                ],
              );
            } catch (error) {
              console.error("Delete account error:", error);
              Alert.alert(
                "Erreur",
                "Impossible de supprimer le compte. Cette fonctionnalité n'est peut-être pas encore disponible.",
              );
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Date inconnue";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  if (loading) {
    return (
      <CenteredLayout>
        <ActivityIndicator size="large" color="#7B1FA2" />
        <Text style={{ marginTop: 16, textAlign: "center" }}>
          Chargement des données...
        </Text>
      </CenteredLayout>
    );
  }

  if (!user) {
    return (
      <CenteredLayout>
        <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
          Aucune donnée utilisateur trouvée
        </Text>
        <Button
          mode="contained"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            })
          }
        >
          Retour à l'accueil
        </Button>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Card style={{ marginBottom: 20, padding: 16 }}>
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Avatar.Text
              size={80}
              label={getInitials(user.name)}
              style={{ backgroundColor: "#7B1FA2", marginBottom: 12 }}
            />

            <Text
              style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
            >
              {user.name}
            </Text>

            <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
              {user.email}
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "bold" }}>Membre depuis :</Text>
              <Text>{formatDate(user.created_at)}</Text>
            </View>

            {user.updated_at !== user.created_at && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  Dernière mise à jour :
                </Text>
                <Text>{formatDate(user.updated_at)}</Text>
              </View>
            )}
          </View>
        </Card>

        <View style={{ gap: 12 }}>
          <Button
            mode="contained"
            onPress={handleLogout}
            disabled={logoutLoading}
            style={{ backgroundColor: "#7B1FA2" }}
          >
            {logoutLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              "Déconnexion"
            )}
          </Button>

          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            disabled={logoutLoading}
            style={{ borderColor: "#d32f2f" }}
            textColor="#d32f2f"
          >
            Supprimer mon compte
          </Button>
        </View>
      </View>
    </CenteredLayout>
  );
};

export default HomeScreen;
