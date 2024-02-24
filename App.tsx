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
import Geocoding from 'react-native-geocoding';

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

      Geocoding.init(apiKey, {language: 'en'});

      Geocoding.from('Street 555 Ibn Dinar street, Zone 55, Building 25')
        .then(response => {
          const {lat, lng} = response.results[0].geometry.location;
          console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        })
        .catch(error => console.error(error));

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
  };

  function calculateDistance(point1: Directions, point2: Directions) {
    const R = 6371;
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * (Math.PI / 180)) *
        Math.cos(point2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  function findNearestNeighbor(
    point: Directions,
    unvisitedPoints: Directions[],
  ) {
    let nearestNeighbor: Directions | null = null;
    let minDistance = Infinity;
    for (const unvisitedPoint of unvisitedPoints) {
      const distance = calculateDistance(point, unvisitedPoint);
      console.log(unvisitedPoint.title + ':', distance);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNeighbor = unvisitedPoint;
      }
    }

    console.log(nearestNeighbor, minDistance, 'this');

    return nearestNeighbor;
  }
  let a: number = 1;
  function solveTSP(startingPoint: Directions, points: Directions[]) {
    let currentPoint = startingPoint;
    let unvisitedPoints = [...points];
    const tspSolution: Directions[] = [];

    while (unvisitedPoints.length > 0) {
      const nearestNeighbor = findNearestNeighbor(
        currentPoint,
        unvisitedPoints,
      );

      tspSolution.push({
        ...nearestNeighbor,
        description: `Description for Marker`,title: `Location ${a++}`});
        unvisitedPoints = unvisitedPoints.filter(
        point => point !== nearestNeighbor,
      );
    }

    return tspSolution;
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);
  let tspsolution;
  if (currentLocation) {
    tspsolution = solveTSP(currentLocation, markers);
    console.log(tspsolution, 'tsp solution');
  }

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {tspsolution?.map(marker => (
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
            waypoints={tspsolution?.map(marker => ({
              latitude: marker.latitude,
              longitude: marker.longitude,
            }))}
            destination={tspsolution[tspsolution?.length - 1]}
            apikey={apiKey}
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
