import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import MapViewDirections, {Directions} from 'react-native-maps-directions';


interface MarkerProps {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  pinColor: string;
}

const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Directions | null>(
    null,
  );
  const [farthestMarker, setFarthestMarker] = useState<Directions | null>(null);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const apiKey: string = 'AIzaSyDp0XbRCB978UJnBMtfrtJIpwD5W9GVm94';

  const requestLocationPermission = async () => {
    try {
      setMarkers([
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
        {
          id: 4,
          latitude: 25.2726,
          longitude: 51.4767,
          title: 'Marker 4',
          description: 'Description for Marker 4',
          pinColor: 'blue',
        },
        {
          id: 5,
          latitude: 25.2826,
          longitude: 51.4867,
          title: 'Marker 5',
          description: 'Description for Marker 5',
          pinColor: 'blue',
        },
        {
          id: 6,
          latitude: 25.2926,
          longitude: 51.4967,
          title: 'Marker 6',
          description: 'Description for Marker 6',
          pinColor: 'blue',
        },
        {
          id: 7,
          latitude: 25.2826,
          longitude: 51.4967,
          title: 'Marker 7',
          description: 'Description for Marker 7',
          pinColor: 'blue',
        },
      ]);

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to provide accurate data.',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('this grand');
        
        Geolocation.getCurrentPosition(
          (position: GeolocationResponse) => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation({latitude, longitude});
          },
          (error: any) => console.log(error, 'this is the location error'),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }

    const destinations = markers.map(
      marker => `${marker.latitude},${marker.longitude}`,
    );

    const origins = `${currentLocation?.latitude},${currentLocation?.longitude}`;
    if (origins) {
      const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${destinations.join(
        '|',
      )}&key=${apiKey}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData?.rows[0]?.elements, 'this is elements');

        const distances = responseData?.rows[0]?.elements?.map(
          (element: {distance: {value: number}}) => element?.distance.value,
        );
        const farthestIndex = distances.indexOf(Math.max(...distances));
        setFarthestMarker(markers[farthestIndex]);
      } catch (error) {
        console.error('Error fetching distance matrix', error);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);
  console.log(currentLocation + 'this is cure');
  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 25.3548,
            longitude: 51.1839,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
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
            origin={currentLocation}
            waypoints={markers.map(marker => ({
              latitude: marker.latitude,
              longitude: marker.longitude,
            }))}
            destination={farthestMarker}
            apikey="AIzaSyDp0XbRCB978UJnBMtfrtJIpwD5W9GVm94"
            strokeWidth={3}
            strokeColor="blue"
            optimizeWaypoints={true}
            
            
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
