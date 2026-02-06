import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { Button } from "react-native-paper";
import { CenteredLayout } from "../components/centered-layout";
import Svg, { Path, Circle } from "react-native-svg";

const SwitchCameraIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>
    <Path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/>
    <Circle cx="12" cy="12" r="3"/>
    <Path d="m18 22-3-3 3-3"/>
    <Path d="m6 2 3 3-3 3"/>
  </Svg>
);

const CameraScreen = ({ navigation, route }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <CenteredLayout>
        <Text>Demande d'autorisation pour la caméra...</Text>
      </CenteredLayout>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <CenteredLayout>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          L'accès à la caméra est nécessaire pour prendre une photo de profil.
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Accorder la permission
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
          Retour
        </Button>
      </CenteredLayout>
    );
  }

  const handleFlipCamera = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        
        const fileName = `profile_${Date.now()}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.copyAsync({
          from: photo.uri,
          to: fileUri,
        });
        
        setCapturedPhoto(fileUri);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Erreur", "Impossible de prendre la photo");
      }
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto && route.params?.onPhotoTaken) {
      route.params.onPhotoTaken(capturedPhoto);
    }
    navigation.goBack();
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleCloseCamera = () => {
    navigation.goBack();
  };

  if (capturedPhoto) {
    return (
      <CenteredLayout>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Aperçu de la photo</Text>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          
          <View style={styles.previewButtons}>
            <Button
              mode="outlined"
              onPress={handleRetakePhoto}
              style={styles.retakeButton}
            >
              Reprendre
            </Button>
            
            <Button
              mode="contained"
              onPress={handleConfirmPhoto}
              style={styles.confirmButton}
            >
              Confirmer
            </Button>
          </View>
        </View>
      </CenteredLayout>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.flipButton} onPress={handleFlipCamera}>
            <SwitchCameraIcon />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  flipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  flipButtonText: {
    fontSize: 24,
  },
  captureButton: {
    backgroundColor: "white",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    backgroundColor: "red",
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "white",
  },
  previewContainer: {
    alignItems: "center",
    padding: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 30,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 20,
  },
  retakeButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#7B1FA2",
  },
});

export default CameraScreen;