import React, { useEffect } from 'react';
import {View, Text, Button, FlatList} from 'react-native';
import {ListITem} from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';


import NavBar from './NavBar';
import { enableNetworkProviderAsync } from 'expo-location';


let development_mode = true;

function cprint(val) {
  if (development_mode)
    console.log(val);
}

function showError(error) {
  if (development_mode)
    console.log(error.message);
}





export default function MainScreen({navigation}) {

  const[pageCounter,setPageCounter] = React.useState([]);
  const[addressCount, setAddressCount] = React.useState(0);
  const[personalCount, setPersonalCount] = React.useState(0);
  const[workCount, setWorkCount] = React.useState(0);

  
  cprint("Start MainScreen");

  const db = SQLite.openDatabase('mynotesdb.db');

  function updateCounter() {

    cprint("\n\n\nGet note counts from database");

    
    db.transaction( 
      tx => {
          tx.executeSql('SELECT count(*) AS lkm FROM addressbook;', 
          [], 
          (_, {rows})  => {

              setAddressCount(rows._array[0].lkm);


          } );
      }, 
      showError, 
      null
    ); 


      db.transaction( 
        tx => {
            tx.executeSql('SELECT description, count(noteid) AS lkm FROM notetype LEFT JOIN notebook ON typeid=notetype GROUP BY description ORDER BY description;', 
            [], 
            (_, {rows})  => {

              
              
              if (rows.length==2 ){
                setPersonalCount(rows._array[0].lkm);
                setWorkCount(rows._array[1].lkm);
              }

              

            } );
        }, 
        showError, 
        null
      ); 

   
  }


  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateCounter();
    });

    

    //updateCounter();
  }, []);

  
  
//
  return (
    <SafeAreaProvider>
      <NavBar navigation ={navigation} />
      
      <View style={styles.container} >
        <View style={styles.mainScreenContentStyle}>
            <Text style={styles.mainFontStyle} onPress={() => navigation.navigate("Address")} >ADDRESS: {addressCount}</Text>
            
            <Text style={styles.mainFontStyle} onPress={() => navigation.navigate("Personal Notes", {notetype:"PERSONAL"})} >PERSONAL: {personalCount}</Text>
            <Text style={styles.mainFontStyle} onPress={() => navigation.navigate("Work Notes", {notetype:"WORK"})}>WORK: {workCount}</Text>
            <Text style={styles.mainFontStyle} onPress={() => navigation.navigate("Calendar")} >CALENDAR</Text>
        </View>
      </View>
    
    </SafeAreaProvider>
  );
}