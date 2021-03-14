import 'react-native-gesture-handler';
import React,{ useEffect } from 'react';
import {View, Text, Alert} from 'react-native';
import {Input, Button} from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';

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



export default function AddChangeAddressScreen({route, navigation}) {
  const db = SQLite.openDatabase('mynotesdb.db');

  let add = null;
  try {
    add = route.params.addressid;

  }catch (err) {

  }
    cprint(JSON.stringify(route));
    cprint("add: " + add);

    const addressId = add;



  const [firstname, setFirstname] = React.useState(null);
  const [lastname, setLastname]  = React.useState(null);
  const [address, setAddress]    = React.useState(null);
  const [postalcode, setPostalcode] = React.useState(null);
  const [city, setCity] = React.useState(null);

 

  //setAddressId(route.params.addressid);
  


  const showErr = (error) => {
    showError(error);
    Alert.alert("There were error for saving data. Check your inputs!");
  }

  function getData() {
    db.transaction( 
      tx => {
          tx.executeSql('SELECT firstname,lastname,address,postalcode,city FROM addressbook WHERE addressid=(?);', [addressId], 
          (_, {rows})  => {
            
            let d = rows._array[0];

            cprint(JSON.stringify(d));

            setFirstname(d.firstname);
            setLastname(d.lastname);
            setAddress(d.address);
            setPostalcode(d.postalcode);
            setCity(d.city);
            
          });
      }, 
      showErr, 
      null
    );
  }

  function checkInputs() {

    let fn = firstname;
    let ln = lastname;
    let add = address;
    let pc = postalcode;
    let c  = city;



    if (fn==null ) {
      Alert.alert("Missing firstname!");
      return false;
    }

    if (ln==null ) {
      Alert.alert("Missing lastname!");
      return false;
    }

    if (add==null ) {
      Alert.alert("Missing address!");
      return false;
    }

    if (pc==null)  {
      Alert.alert("Missing postalcode!");
      return false;
    }

    if (c==null)  {
      Alert.alert("Missing city!");
      return false;
    }


    return true;
  }

  function addInput() {
    db.transaction( 
      tx => {
          tx.executeSql('INSERT INTO addressbook(firstname,lastname,address,city,postalcode) VALUES (?,?,?,?,?);', [firstname,lastname,address,city,postalcode.toString()]);
      }, 
      showErr, 
      null
    );

  }

  function updateInput() {
      db.transaction( 
        tx => {
            tx.executeSql('UPDATE addressbook SET firstname=(?),lastname=(?),address=(?),postalcode=(?),city=(?) WHERE addressid=(?);', [firstname,lastname,address,postalcode.toString(),city,addressId]);
        }, 
        showErr, 
        null
      );
  }


  function deleteInput() {
    if (addressId==null)
      return;

    db.transaction( 
      tx => {
          tx.executeSql('DELETE FROM addressbook WHERE addressid=(?);', [addressId]);
      }, 
      showErr, 
      null
    );
    
  }


  function saveButton() {
    let input_ok = checkInputs();

    if (input_ok == false)
      return;

    if (addressId == null)
      addInput();
    else
      updateInput();

    navigation.goBack();

  }


  function deleteButton() {
    deleteInput();

    navigation.goBack();
  }


  useEffect( () => {  
      if (addressId != null) 
          getData();
  }, []);



  

  return (
    <SafeAreaProvider>
      <View style={styles.container} >
        <Input placeholder='Type firstname'  label="FIRSTNAME"  onChangeText={firstname=>setFirstname(firstname)}    value={firstname} />
        <Input placeholder='Type lastname'   label="LASTNAME"   onChangeText={lastname=>setLastname(lastname)}       value={lastname} />
        <Input placeholder='Type address'    label="ADDRESS"    onChangeText={address=>setAddress(address)}          value={address} />
        <Input placeholder='Type postalcode' label="POSTALCODE" onChangeText={postalcode=>setPostalcode(postalcode)} value={postalcode} keyboardType = 'numeric' />
        <Input placeholder='Type city'       label="CITY"       onChangeText={city=>setCity(city)}                    value={city} />
        
        <View style={styles.buttonRow} >
          <Button raised icon={{color:'white',name: 'save'}} onPress={() => saveButton()} title="SAVE" />
          <Button raised icon={{color:'white',name: 'delete'}} color="red" onPress={() => deleteButton()} title="DELETE" />
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
    );
}

