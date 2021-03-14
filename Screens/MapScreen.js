import 'react-native-gesture-handler';
import React,{ useEffect } from 'react';
import {View, Text, Button} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

import styles from './NoteStyles';

let development_mode = true;

function cprint(val) {
  if (development_mode)
    console.log(val);
}

function showError(error) {
  if (development_mode)
    console.log(error.message);
}


/*
<NavBar navigation />
*/

export default function MapScreen({route, navigation}) {

  let defaultCoord = {latitude: 60.200692,longitude: 24.934302,latitudeDelta: 0.0322, longitudeDelta: 0.0221};;
  let defaultMark= {latitude: 60.200692,longitude: 24.934302 };

  
  /*
  *   You can get your own free map key for development from address:
  *   https://developer.mapquest.com/documentation/geocoding-api/ 
  */
  let KEY =  	'DEVELOPER_MAPQUEST_KEY';

  let defaultTitle = 'Haaga-Helia'
  const [add_coord, setAdd_coord] = React.useState(defaultCoord);
  const [mark_coord, setMark_coord] = React.useState(defaultMark);
  const [location_coord, setLocation_coord] = React.useState(defaultMark);
  const [findAddress, setFindAddress] = React.useState(defaultTitle);

  const getOwnersLocation = async() => {

    //Checkpermission
    let   { status} = await Location.requestPermissionsAsync();
    await Location.requestPermissionsAsync
    
    if (status != null && status !==   'granted') {
      Alert.alert('No permission to access location');
      return;
    }

    
    let loc= (await Location.getCurrentPositionAsync({}) ).coords;
    let location = {latitude: (loc.latitude), longitude:(loc.longitude)};

    setLocation_coord(location);
   
  };


  function findLocation() {
    
    let address = (route.params.add + ", " + route.params.postal + " " + route.params.city + " FINLAND");
    cprint("Route:\n" + JSON.stringify(route));
    cprint("Address: " + address);

    const uri = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + KEY + 
                '&location=' + encodeURIComponent(address)  + '&outFormat=json&thumbMaps=false';
 
  
    fetch(uri)
    .then((response) => response.json()) 
    .then((responseJson) => {
      
      let co = responseJson.results[0].locations[0].displayLatLng;

      let lat = co.lat;
      let lng = co.lng;
      let dLat = add_coord.latitudeDelta;
      let dLng = add_coord.longitudeDelta;

      let new_coord = {latitude: (lat), longitude: (lng), latitudeDelta: (dLat), longitudeDelta: (dLng)};
      let m = {latitude: (lat), longitude: (lng)};
      

      setAdd_coord(new_coord);
      setMark_coord(m);
      setFindAddress(address);
          
    })
    .catch((error) => {
      Alert.alert('Error', error.message );
    });


  }

  useEffect( () => {

      findLocation();
      getOwnersLocation();

  }, []);


  return (
    <SafeAreaProvider>
        <View style={styles.container} >
          <MapView style={styles.mapStyle}  region = {add_coord}>
            <Marker coordinate={location_coord}
                 title="Me" pinColor='green' />
            <Marker coordinate={mark_coord}
                     title={findAddress} pincolor='red' />
          </MapView>

          <View style={styles.mapButtonViewStyle}>
            <Button title="BACK TO LOCATION" onPress={() => findLocation()} />
          </View>

          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    );
}

