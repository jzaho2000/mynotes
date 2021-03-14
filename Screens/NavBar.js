import React from 'react';
import {NativeAppEventEmitter, Text, View} from 'react-native';
import {Header, Icon} from 'react-native-elements';
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


let background_color = '#C2DFFF';
let icon_text  = 'black';
let icon_color = 'red';
let app_name_size = 17;




export default function NavBar(props) {

    
    cprint("NavBar: " + JSON.stringify(props));
    const navigation= props.navigation;
    const addPage = props.addPage;
    const name    = props.name;
    const param   = props.param;




    function TestScreen() {
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Text screen</Text>
        </View>
        );
    }
    
    
    function pressMenuIcon() {
        cprint("Menu pressed");
        navigation.openDrawer();
    }
    
    function leftCompo() {
        return (
            <Icon name="menu" color={icon_text} onPress={()=>pressMenuIcon()} />
    
        );
    }
    
    
    function centerCompo() {
        return (
            <Text style={{fontSize: app_name_size, fontWeight: 'bold', color:"red"}}>My <Text style={{color:icon_text}}>memo</Text></Text>
        );
    }
    
    function rightCompo() {
        if (addPage!=null) {
            if (param != null) {
                return(
                    <Icon name="add" reverse size={15} fontWeight="bold" color={icon_color} onPress={() => navigation.navigate(addPage, param)} />
                );
            } else {
                return(
                    <Icon name="add" reverse size={15} fontWeight="bold" color={icon_color} onPress={() => navigation.navigate(addPage)} />
                );
            }
            


        }
            
        
        return null;
    }




    return(
        <Header
        backgroundColor={background_color}
        leftComponent={leftCompo}  
        centerComponent={centerCompo}
        rightComponent={rightCompo}
        
        />
    );
}







