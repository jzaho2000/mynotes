import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {View, Alert} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';
import {Calendar,CalendarList, Agenda} from 'react-native-calendars';


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
  const [calendarList, setCalendarList] = React.useState({});

    function dayToStr(day) {
        
        if (day==null)
            return "";
        cprint("Day: " + JSON.stringify(day));
        return day.dateString;
    }
  
    let apu;
  //function getList() {
    db.transaction( 
      tx => {
          tx.executeSql('SELECT noteid,description,datetime FROM notebook JOIN notetype ON notebook.notetype=notetype.typeid ORDER BY datetime;', [], 
          (_, {rows})  => {
            let list = rows._array;
            cprint(list);
            if (list.length>0) {
                let obj_list = {};
                for (let i=0; i<list.length; i++) {

                    if (list[i].description=='PERSONAL') 
                        obj_list[list[i].datetime] = {marked:true, dotColor:'green'};
                    else if (list[i].description=='WORK')
                        obj_list[list[i].datetime] = {marked:true, dotColor:'red'};

                }
                //obj_list = {result:obj_list};

                
                apu = {apu:obj_list};
                setCalendarList(new Object(obj_list));
                
                cprint("New list....");
                cprint("obj_list: " + JSON.stringify(obj_list));

                cprint("Calendar list: " + JSON.stringify(calendarList));
                cprint("apu: " + JSON.stringify(apu));
            }



            //setNoteList(rows._array);
            //cprint("NoteScreen: " + JSON.stringify(rows));
          });
      }, 
      showError, 
      null
    );
  //}

  //getList();
  //const calendarList = React.useState({});
  //const calendarList = {apu};
  cprint("Ennen tulostusta: " + calendarList);

  //markedDates={{calendarList}}

  /*
      {'2012-05-16': {selected: true, marked: true, selectedColor: '#f0f'},
                '2021-03-02': {marked: true},
                '2021-03-03': {marked: true, dotColor: '#ff0', activeOpacity: 0},
                '2021-03-04': {disabled: true, disableTouchEvent: true}}
  */

  return (
    <SafeAreaProvider>
        <NavBar navigation={navigation} />
        <View style={styles.container} >
            <Calendar
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    width: '100%'
                }}


                current={new Date()}
                monthFormat="MM yyyy"
                markingType="period"
                markedDates={calendarList}
                showWeekNumbers={true}
                onDayPress={(day) => {Alert.alert('Selected day: ' +  dayToStr(day))}}

            />
            <StatusBar style="auto" />
          
        </View>
      </SafeAreaProvider>
    );
}

// calendarList