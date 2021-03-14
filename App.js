
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { createStackNavigator} from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';


import MainScreen from './Screens/MainScreen';
import AddressScreen from './Screens/AddressScreen'
import NotesScreen from './Screens/NotesScreen';
import MapScreen from './Screens/MapScreen';
import CalendarScreen from './Screens/CalendarScreen';

import AddChangeAddressScreen from './Screens/AddChangeAddressScreen';
import AddChangesNotesScreen from './Screens/AddChangesNotesScreen';


let development_mode = true;

function cprint(val) {
  if (development_mode)
    console.log(val);
}

function showError(error) {
  if (development_mode)
    console.log(error.message);
}

function dropAllTables(db) {
  db.transaction(
    tx => {
      tx.executeSql(
        'DROP TABLE addressbook;'
      );
    }, 
    showError, 
    null
    
  );


  db.transaction(
    tx => {
      tx.executeSql(
        'DROP TABLE notetype;'
      );
    }, 
    showError, 
    null
  );


  

  db.transaction(
    tx => {
      tx.executeSql(
        'DROP TABLE notebook;'
      );
    }, 
    showError, 
    null
  );


}




const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


export default function App() {

  if (development_mode)
    cprint("Start App");

  const db = SQLite.openDatabase('mynotesdb.db');


  //dropAllTables(db);
  //return(<View><Text>Tyhjennetty</Text></View>);
  


  //useEffect( () => {
    if (development_mode)
      console.log("Check databases");

    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS addressbook(addressid INTEGER PRIMARY KEY NOT NULL, firstname TEXT NOT NULL, lastname TEXT NOT NULL, phonenumber TEXT, address TEXT NOT NULL, postalcode TEXT NOT NULL, city TEXT NOT NULL);'
        );
      }, 
      showError, 
      null
      
    );


    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS notetype(typeid INTEGER PRIMARY KEY NOT NULL, description TEXT NOT NULL);'
        );
      }, 
      showError, 
      null
    );


    db.transaction( 
      tx => {
          tx.executeSql('SELECT count(*) AS lkm FROM notetype;', [], 
            (_, {rows})  => {
              let type_counter = parseInt(rows._array[0].lkm);

              cprint("db counter: "+ type_counter);
              if (type_counter==0) {
                  db.transaction(
                    tx => {
                      tx.executeSql(
                        'INSERT INTO notetype(description) VALUES ("PERSONAL"),("WORK");'
                      );
                    }, 
                    showError, 
                    null
                  );
              }
          });
      }, 
      showError, 
      null
    );

    

    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS notebook( noteid INTEGER PRIMARY KEY NOT NULL, header TEXT NOT NULL, datetime DATE, notetype INTEGER NOT NULL, notetext TEXT, FOREIGN KEY(notetype) REFERENCES notetype(typeid));'
        );
      }, 
      showError, 
      null
    );



    /*
    db.transaction(
      tx => {
        tx.executeSql(
          ''
        );
      }, 
      showError, 
      null
    );

    db.transaction(
      tx => {
        tx.executeSql(
          ''
        );
      }, 
      showError, 
      null
    );

*/
    
 // }, []);



  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Main" component={MainScreen} /> 
        <Drawer.Screen name="Address" component={StackAddressScreen} />
        <Drawer.Screen name="Personal Notes" component={StackPersonalScreen} initialParams={{notetype:'PERSONAL'}}  />
        <Drawer.Screen name="Work Notes" component={StackWorkScreen} initialParams={{notetype:'WORK'}}  />
        <Drawer.Screen name="Calendar" component={CalendarScreen} />
      </Drawer.Navigator>
      

    </NavigationContainer>
  );
}


function StackAddressScreen({navigator}) {
  return (
    <Stack.Navigator initialRouteName="Address" >
        <Stack.Screen options={{headerShown: false}} name="Address" component={AddressScreen}  />
        <Stack.Screen name="Upgrade Address" component={AddChangeAddressScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
  );
}


function StackPersonalScreen({navigator}) {
  return (
    <Stack.Navigator initialRouteName="Notes P">
        <Stack.Screen options={{headerShown: false}} name="Notes P" component={NotesScreen} initialParams={{notetype:'PERSONAL'}} />
        <Stack.Screen name="Upgrade Notes PERSONAL" component={AddChangesNotesScreen} />
      </Stack.Navigator>
  );
}


function StackWorkScreen({navigator}) {
  return (
    <Stack.Navigator initialRouteName="Notes W">
        <Stack.Screen options={{headerShown: false}} name="Notes W" component={NotesScreen} initialParams={{notetype:'WORK'}} />
        <Stack.Screen name="Upgrade Notes WORK" component={AddChangesNotesScreen} />
      </Stack.Navigator>
  );
}