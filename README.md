# mynotes
Originally School project


Projektissa toteutettiin osoitekirja ja muistilistojen kirjoittaminen kalenteriin.
Osoitekirjassa osoitteet tallennettiin sqlite-tietokantaan ja osoitteita pystyttiin tarkastelemaan kartalla suhteessa omaan sijaintiin. Kartassa ei kuitenkaan nyt toteutettu lyhimmän mahdolliisen reitin etsimistä näiden kahden pisteen välille.

Muistikirja toteutettiin myös sqlite tietokantaan. Muistiluokituksia on mahdollista toteuttaa lisää tähän tietokantaan.

Kalenterinäkymässä näkee merkinnät, minkätyyppisiä luokituksia löytyy kullekin päivälle. Ajan puutteen vuoksi jätin sen tuollaiseksi. Siinä voisi olla mahdollista päivää klikkaamalla nähdä kyseisen päivän sisällön.

Projektin luomisessa käytettiin sellaisia komponentteja ja rajapintoja kuin

-Käyttöliittymä (UI)
  react-native-elements
  react-native-safe-area-context
  react-native
  @react-native-community/datetimepicker
  react-native-calendars
  
-Navigointiin
  react-native-gesture-handler
  expo-status-bar
  @react-navigation/native
  react-native-reanimated 
  react-native-screens 
  react-native-safe-area-context 
  @react-native-community/masked-view
  @react-navigation/drawer
  @react-navigation/stack

-Karttapalveluihin
  react-native-maps
  expo-location
  
-Tiedon tallennukseen
  expo-sqlite
