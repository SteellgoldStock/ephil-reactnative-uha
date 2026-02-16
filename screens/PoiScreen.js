import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';

// Données locales des POI
const POI_DATA = [
  {
    id: '1',
    name: 'Mairie de Mulhouse',
    desc: 'Hôtel de ville historique',
    latitude: 47.7467,
    longitude: 7.3389,
  },
  {
    id: '2',
    name: 'Cité de l\'Automobile',
    desc: 'Plus grand musée automobile du monde',
    latitude: 47.7617,
    longitude: 7.3297,
  },
  {
    id: '3',
    name: 'UHA - Campus Illberg',
    desc: 'Université de Haute-Alsace',
    latitude: 47.7339,
    longitude: 7.3117,
  },
  {
    id: '4',
    name: 'Gare de Mulhouse',
    desc: 'Gare centrale de la ville',
    latitude: 47.7423,
    longitude: 7.3429,
  },
];

const PoiScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission de localisation refusée');
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de récupérer la position');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7B1FA2" />
        <Text style={styles.loadingText}>Récupération de votre position...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Retour
        </Button>
      </View>
    );
  }

  const initialRegion = {
    latitude: location ? location.coords.latitude : 47.7508,
    longitude: location ? location.coords.longitude : 7.3359,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {POI_DATA.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{
              latitude: poi.latitude,
              longitude: poi.longitude,
            }}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.poiName}>{poi.name}</Text>
                <Text style={styles.poiDesc}>{poi.desc}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    marginBottom: 20,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  callout: {
    padding: 10,
    minWidth: 150,
  },
  poiName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  poiDesc: {
    fontSize: 12,
  },
});

export default PoiScreen;