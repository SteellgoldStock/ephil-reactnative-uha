import { useState, useEffect } from "react";
import {
  Text,
  ActivityIndicator,
  Card,
  useTheme,
} from "react-native-paper";
import { View, Alert } from "react-native";
import { CenteredLayout } from "../components/centered-layout";
import { authService } from "../services/auth";
import * as FileSystem from "expo-file-system/legacy";
import useThemeStore from "../stores/themeStore";
import AppButton from "../components/ui/AppButton";
import UserProfileCard from "../components/ui/UserProfileCard";

const HomeScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const { theme: activeThemeName } = useThemeStore();
  const theme = useTheme();

  useEffect(() => {
    loadUserData();
    loadProfilePhoto();
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

  const loadProfilePhoto = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const profilePhotos = files.filter(file => file.startsWith("profile_") && file.endsWith(".jpg"));
      
      if (profilePhotos.length > 0) {
        const sortedPhotos = profilePhotos.sort((a, b) => {
          const timeA = parseInt(a.split("_")[1].split(".")[0]);
          const timeB = parseInt(b.split("_")[1].split(".")[0]);
          return timeB - timeA;
        });
        
        const latestPhoto = sortedPhotos[0];
        setProfilePhoto(`${FileSystem.documentDirectory}${latestPhoto}`);
      }
    } catch (error) {
      console.error("Error loading profile photo:", error);
    }
  };

  const handleOpenCamera = () => {
    navigation.navigate("Camera", {
      onPhotoTaken: (photoUri) => {
        setProfilePhoto(photoUri);
      }
    });
  };

  const handleOpenPoi = () => {
    navigation.navigate("Poi");
  };

  const handleOpenSettings = () => {
    navigation.navigate("Settings");
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
        <Text variant="bodyLarge" style={{ textAlign: "center", marginBottom: 20 }}>
          Aucune donnée utilisateur trouvée
        </Text>
        <AppButton
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            })
          }
        >
          Retour à l'accueil
        </AppButton>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Card style={{ marginBottom: 20, padding: 16 }}>
          <UserProfileCard user={user} profilePhoto={profilePhoto} />

          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "bold" }}>Membre depuis :</Text>
              <Text>{formatDate(user.created_at)}</Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "bold" }}>Thème actif :</Text>
              <Text>{activeThemeName === "light" ? "clair" : "sombre"}</Text>
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
          <AppButton onPress={handleOpenSettings}>
            Paramètres
          </AppButton>

          <AppButton onPress={handleOpenPoi}>
            Voir les POI autour de moi
          </AppButton>

          <AppButton onPress={handleOpenCamera}>
            Caméra
          </AppButton>

          <AppButton
            onPress={handleLogout}
            loading={logoutLoading}
          >
            Déconnexion
          </AppButton>

          <AppButton
            mode="outlined"
            onPress={handleDeleteAccount}
            disabled={logoutLoading}
            style={{ borderColor: "#d32f2f" }}
            textColor="#d32f2f"
          >
            Supprimer mon compte
          </AppButton>
        </View>
      </View>
    </CenteredLayout>
  );
};


export default HomeScreen;
