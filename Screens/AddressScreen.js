import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {View, Text, FlatList} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';


import NavBar from './NavBar';


let development_mode = true;

function cprint(val) {
  if (development_mode)
    console.log(val);
}

function showError(error) {
  if (development_mode)
    console.log(error.message);
}



export default function AddressScreen({navigation}) {

  const db = SQLite.openDatabase('mynotesdb.db');
  const[addressList, setAddressList] = React.useState([]);
  const[updateParam, setUpdateParam] = React.useState(1);
 

  function getList() {
    db.transaction( 
      tx => {
          tx.executeSql('SELECT addressid,firstname,lastname,address,postalcode,city FROM addressbook ORDER BY lastname, firstname;', [], 
          (_, {rows})  => {
            setAddressList(rows._array);
            cprint(JSON.stringify(rows));
          });
      }, 
      showError, 
      null
    );
  }

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', () => {
      getList();
      setUpdateParam( (updateParam + 1) % 10 );
    });
  }, []);





  renderItem =({item}) => (
    <ListItem bottomDivider style={styles.liStyle}>
      <ListItem.Content  >
        <View style={styles.itemRowStyle}>
          <View style={styles.itemColStyle} >
            <ListItem.Title >
              <Text onLongPress={() => navigation.navigate('Upgrade Address',{addressid:(item.addressid)})} >{item.lastname}, {item.firstname}</Text>
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text onLongPress={() => navigation.navigate('Upgrade Address',{addressid:(item.addressid)})}>{item.address}, {item.postalcode} {item.city}</Text>
            </ListItem.Subtitle>
          </View>
          <View style={{alignItems:'center', justifyContent:'center',flexDirection:'row'}}>
          <Icon name="edit" size={30}  fontWeight="bold" color="green" onPress={()=>navigation.navigate('Upgrade Address',{addressid:(item.addressid)})} />
            <Icon name="map" size={30}  fontWeight="bold" color="green" onPress={()=>navigation.navigate('Map', {add:(item.address), postal:(item.postalcode),city:(item.city)})} />
          </View>
        </View>
        
      </ListItem.Content>
    </ListItem>
  );


  return (
    <SafeAreaProvider>
        <NavBar navigation={navigation}  addPage="Upgrade Address" />
        <View style={styles.container} >
          
            <FlatList 
              style={styles.flistStyle}
              data={addressList}
              extraData={updateParam}
              renderItem={renderItem} 
              keyExtractor={(item, index) => index.toString()}
            />
            <StatusBar style="auto" />
          
        </View>
      </SafeAreaProvider>
    );
}

