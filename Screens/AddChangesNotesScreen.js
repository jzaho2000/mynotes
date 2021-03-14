import 'react-native-gesture-handler';
import React,{ useEffect } from 'react';
import {View, Alert} from 'react-native';
import {Input, Button} from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';
import DatePicker from '@react-native-community/datetimepicker';
import TextareaAutosize from 'react-autosize-textarea';



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


export default function AddChangesNotesScreen({route, navigation}) {

    cprint( "AddChangesNotesScreen route: " +  JSON.stringify(route));
    cprint( "AddChangesNotesScreen navigation: " +  JSON.stringify(navigation));
  
    const db = SQLite.openDatabase('mynotesdb.db');

    let ntype = null;
    let nid = null;
    let dt = null;
    try {
      ntype = route.params.notetype;
      nid = route.params.noteid;

    }catch (err) {

    } 
    if (nid==null)
      dt = new Date();

    cprint("AddChangesNotesScreen dt: " + dt);

    const notetype = ntype;
    const noteId = nid;
    
    const [timeMode, setTimeMode] = React.useState('date'); // date or time
    const [show,setShow] = React.useState(false);

    const [header, setHeader] = React.useState(null);
    const [datetime, setDatetime] = React.useState(dt);
    const [notetext, setNotetext] = React.useState(null);
    //const [notetypeInt, setNotetypeInt] = React.useState(-1);


    const showErr = (error) => {
      showError(error);
      Alert.alert("There were error for saving data. Check your inputs!");
    }

    function getData() {
      cprint("function get data");
      db.transaction( 
        tx => {
            tx.executeSql('SELECT header,datetime,notetext FROM notebook WHERE noteid=(?);', [noteId], 
            (_, {rows})  => {
              
              let d = rows._array[0];
  
              cprint(JSON.stringify(d));
  
              setHeader(d.header);
              setDatetime(new Date(d.datetime));
              setNotetext(d.notetext);

            });
        }, 
        showErr, 
        null
      );
    }


    function checkInputs() {

      let h =  header; 
      let dt = datetime;
      let nt = notetext;
  
      if (h==null ) {
        Alert.alert("Missing header!");
        return false;
      }
  
      if (dt==null ) {
        Alert.alert("Missing datetime!");
        return false;
      }
  
      if (nt==null ) {
        Alert.alert("Missing notetext!");
        return false;
      }
  
  
      return true;
    }


    function addInput() {
      cprint("function add input");

      cprint("noteid: " + noteId);
      cprint("header: " + header);
      cprint("time: " + datetime + " -> " + timeToSqlStr(datetime));
      cprint("notes: " + notetext);
      cprint("notetype: " + notetype);


      db.transaction( 
        tx => {
            tx.executeSql('SELECT typeid FROM notetype WHERE description=?;', [notetype],
            (_, {rows})  => {
              cprint("Get typeid rows: " + JSON.stringify(rows));
              let notetypeInt =  parseInt( rows._array[0].typeid);
              cprint("notetype -> int: " + notetypeInt);

              db.transaction( 
                tx => {
                    tx.executeSql('INSERT INTO notebook(header,datetime,notetext,notetype) VALUES (?,?,?,?);', [header,timeToSqlStr(datetime),notetext,notetypeInt]);
                }, 
                showError, 
                null
              );

            });
        }, 
        showError, 
        null
      );

      



      //cprint("datetime: " + datetime);
      
  
    }


    function updateInput() {
      cprint("function update input");
      db.transaction( 
        tx => {
            tx.executeSql('UPDATE notebook SET header=(?),datetime=(?),notetext=(?) WHERE noteid=(?);', [header,timeToSqlStr(datetime),notetext,noteId]);
        }, 
        showErr, 
        null
      );
  }


  function deleteInput() {

    cprint("function delete input");
    if (noteId==null)
      return;

    db.transaction( 
      tx => {
          tx.executeSql('DELETE FROM notebook WHERE noteid=(?);', [noteId]);
      }, 
      showErr, 
      null
    );
    
  }

  function saveButton() {
    cprint("function save button");

    cprint("Check inputs");
    let input_ok = checkInputs();

    if (input_ok == false)
      return;

    cprint("check if add or update");
    if (noteId == null)
      addInput();
    else
      updateInput();

    navigation.goBack();

  }


  function deleteButton() {
    deleteInput();

    navigation.goBack();
  }

  const getCurrentDate=()=>{

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    let dateStr = year + "-" + month + "-" + date


    return dateStr;
}


function timeToDateStr(time) {

  if (time==null) 
    return "null";

  let d = time.getDate();
  let m = time.getMonth() + 1;
  let y = time.getFullYear();

  

  return d + "." + m + "." + y;
}


function timeToSqlStr(time) {

  if (time==null) 
    return "null";

  let d = time.getDate();
  let m = time.getMonth() + 1;
  let y = time.getFullYear();

  let sqlStr = y + "-";
  if (m<10)
    sqlStr = sqlStr + "0";
  sqlStr = sqlStr + m + "-";
  if (d<10)
    sqlStr= sqlStr + "0";
  sqlStr = sqlStr + d;


  return sqlStr;
}

  useEffect( () => {  
      if (noteId != null) 
          getData();
  }, []);



  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDatetime(selectedDate);
  }

  const showDatePicker = () => {
    setTimeMode('date');
    setShow(true);
  }

  const showTimePicker = () => {
    setTimeMode('time');
    setShow(true);
  }



  cprint(JSON.stringify(datetime));

  return (
    <SafeAreaProvider>
      <View style={styles.container} >
        <Input placeholder='Type header'  label="HEADER"  onChangeText={header=>setHeader(header)}    value={header} />
        
     
        <Button raised title={timeToDateStr(datetime)}  style={{background:'green'}} onPress={showDatePicker} />
        {show && (<DatePicker
          value={datetime}
          mode={timeMode}
          is24hour={true}
          display="default"
          onChange={onChangeDate}
        />)}
        <Input placeholder='Type your notes' label="NOTES"  multiline={true} numberOfLines={7}  onChangeText={notetext=>setNotetext(notetext)}          value={notetext} />
        

        <View style={styles.buttonRow} >
          <Button raised icon={{color:'white',name: 'save'}} onPress={() => saveButton()} title="SAVE" />
          <Button raised icon={{color:'white',name: 'delete'}} color="red" onPress={() => deleteButton()} title="DELETE" />
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
    );
}

