// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native'; 

export default function SplashScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    // Prevenir que el splash screen se oculte automáticamente
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync(); // Mantener el splash screen visible
      setTimeout(() => {
        SplashScreen.hideAsync(); // Ocultar splash screen después de 3 segundos
        navigation.replace('Home'); // Navegar a la pantalla 'Home'
      }, 5000);
    };

    prepare();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Imagen centrada en el SplashScreen */}
      <Image 
        source={require('../../assets/elecciones.jpg')} // Ruta de tu imagen
        style={styles.image}
        resizeMode="contain" // Asegúrate de que la imagen se ajuste bien
      />
      <Text style={styles.text}>Elecciones Presidenciales!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#fff',
  },
  image: {
    width: 200, 
    height: 200, 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20, 
  },
});
