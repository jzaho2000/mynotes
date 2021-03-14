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

export default function NotesScreen({route, navigation}) {

  const db = SQLite.openDatabase('mynotesdb.db');  
  const {notetype} = route.params;
  const [noteList, setNoteList] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [updateParam, setUpdateParam] = React.useState("");
  const [showId, setShowId] = React.useState(null);

  

  function getList() {
    db.transaction( 
      tx => {
          tx.executeSql('SELECT noteid,header,datetime,notetext FROM notebook JOIN notetype ON notebook.notetype=notetype.typeid WHERE description=(?) ORDER BY datetime;', [notetype], 
          (_, {rows})  => {
            setNoteList(rows._array);
            cprint("NoteScreen: " + JSON.stringify(rows));
          });
      }, 
      showError, 
      null
    );
  }

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', () => {
      getList();
      setCounter( (counter+1) % 10);
      setUpdateParam( notetype + counter );
    });

    getList();
  }, []);


  const showNote = (text) => {

      return (<Text>{text}</Text>);

  }

  function showHide(id) {
    cprint("Show hide id: " + id);
    setShowId(id);
  }


  //console.log(JSON.stringify(navigation));
  renderItem =({item}) => (
    <ListItem bottomDivider style={styles.liStyle}>
      <ListItem.Content  >
        <View style={styles.itemRowStyle}>
          <View style={styles.itemColStyle} >
            <ListItem.Title >
              <Text onPress={() => showHide(item.noteid)} >{item.header}</Text>
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text onPress={() => showHide(item.noteid)} >{item.datetime}</Text>
            </ListItem.Subtitle>
            <ListItem.Subtitle style={styles.noteContentStyle}>
              {(showId == item.noteid) &&  showNote(item.notetext) }
            </ListItem.Subtitle>
          </View>
          <View style={{alignItems:'center', justifyContent:'center'}}>
            <Icon name="edit" size={30}  fontWeight="bold" color="green" onPress={()=>navigation.navigate('Upgrade Notes ' + notetype, {noteid:(item.noteid),notetype:(notetype)})} />
          </View>
        </View>
        
      </ListItem.Content>
    </ListItem>
  );

  cprint("create param: " + notetype);

  return (
    <SafeAreaProvider>
        <NavBar navigation={navigation} addPage={"Upgrade Notes " + notetype} param={{notetype:notetype}} />
        <View style={styles.container} >
          
            <FlatList 
              style={styles.flistStyle}
              data={noteList}
              extraData={updateParam}
              renderItem={renderItem} 
              keyExtractor={(item, index) => index.toString()}
            />
            <StatusBar style="auto" />
          
        </View>
      </SafeAreaProvider>
    );
}

