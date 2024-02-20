import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections, { Directions } from 'react-native-maps-directions';

interface MarkerProps {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  pinColor: string;
}

const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Directions | null>(null);
  const [markers, setMarkers] = useState<MarkerProps[]>([
    {
      id: 1,
      latitude: 25.2426,
      longitude: 51.4467,
      title: 'Marker 1',
      description: 'Description for Marker 1',
      pinColor: 'blue',
    },
    {
      id: 2,
      latitude: 25.2526,
      longitude: 51.4567,
      title: 'Marker 2',
      description: 'Description for Marker 2',
      pinColor: 'blue',
    },
    {
      id: 3,
      latitude: 25.2626,
      longitude: 51.4667,
      title: 'Marker 3',
      description: 'Description for Marker 3',
      pinColor: 'blue',
    },
  ]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to provide accurate data.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
          },
          error => console.log(error, 'this is the location error'),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);
  console.log(currentLocation, 'this is current location');

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 25.3548,
            longitude: 51.1839,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
              pinColor={marker.pinColor}
            />
          ))}
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
            description="Description for Current Location"
            pinColor="green"
          />
          <MapViewDirections
            origin={markers[2]}
            waypoints={markers.map(marker => ({
              latitude: marker.latitude,
              longitude: marker.longitude,
            }))}
            destination={currentLocation}
            apikey="AIzaSyDp0XbRCB978UJnBMtfrtJIpwD5W9GVm94"
            strokeWidth={3}
            strokeColor="blue"
          />
        </MapView>
      )}
      <TouchableOpacity
        onPress={requestLocationPermission}
        style={styles.button}>
        <Text>Request Location Permission</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginTop: 10,
    position: 'absolute',
    bottom: 10,
    right: 77,
  },
});

export default App;
