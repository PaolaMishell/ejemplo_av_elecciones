// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreenComponent from './src/screens/SplashScreen'; // Importa el SplashScreen
import HomeScreen from './src/screens/HomeScreen'; // Importa la pantalla de inicio
import AsistenteScreen from './src/screens/AsistenteScreen'; // Importa la pantalla Asistente

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen sin encabezado */}
        <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreenComponent} 
          options={{ headerShown: false }} 
        />
        {/* Pantalla de inicio */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }} 
        />
        {/* Pantalla Asistente */}
        <Stack.Screen 
          name="Asistente" 
          component={AsistenteScreen} 
          options={{ title: 'Asistente' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
