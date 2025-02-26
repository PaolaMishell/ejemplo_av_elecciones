import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home'); // Estado para resaltar el botón activo

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://pa1.aminoapps.com/6428/bef5e67ded28422e825cd00ad3d5081e762a90ae_00.gif' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        {/* Nombre y descripción */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>@PaoTenecela</Text>
          <Text style={styles.description}>
            Soy estudiante de décimo semestre de la carrera de Sistemas de la Información de la Universidad Central del Ecuador!
          </Text>

          {/* Nuevo párrafo agregado */}
          <Text style={styles.additionalText}>
            Me apasiona la tecnología, la inteligencia artificial y el desarrollo de software. 
            Siempre estoy buscando aprender y mejorar mis habilidades en programación.
          </Text>
        </View>

        {/* Redes sociales */}
        <View style={styles.socialContainer}>
          <Text style={styles.sectionTitle}>Contacto</Text>

          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL('https://github.com/PaolaMishell')}>
            <Ionicons name="logo-github" size={30} color="#000" style={styles.icon} />
            <Text style={styles.socialLink}>@PaolaMishell</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL('https://www.facebook.com/PaoMishell')}>
            <FontAwesome name="facebook" size={30} color="#1877F2" style={styles.icon} />
            <Text style={styles.socialLink}>@PaoMishell</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL('https://twitter.com/PaoMishell22')}>
            <AntDesign name="twitter" size={30} color="#1DA1F2" style={styles.icon} />
            <Text style={styles.socialLink}>@PaoMishell22</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/PaoMishell')}>
            <FontAwesome name="linkedin" size={30} color="#0e76a8" style={styles.icon} />
            <Text style={styles.socialLink}>@PaoMishell</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Barra de navegación simple */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Home');
            navigation.navigate('Home');
          }}>
          <Ionicons name="home-outline" size={28} color={activeTab === 'Home' ? '#007AFF' : '#777'} />
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeText]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Asistente');
            navigation.navigate('Asistente');
          }}>
          <Ionicons name="chatbubbles-outline" size={28} color={activeTab === 'Asistente' ? '#007AFF' : '#777'} />
          <Text style={[styles.navText, activeTab === 'Asistente' && styles.activeText]}>Asistente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 80, // Espacio para que el contenido no quede tapado por la barra de navegación
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#ddd',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  additionalText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
  },
  socialContainer: {
    alignItems: 'flex-start',
    width: '80%',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  socialLink: {
    fontSize: 18,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#777',
    fontSize: 14,
    marginTop: 2,
  },
  activeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

