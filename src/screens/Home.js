import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }) {

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  return (
    <LinearGradient colors={['#e1bee7', '#f8bbd0', '#f3e5f5']} style={styles.container}>
      <Image source={require('../../assets/tika-logo.png')} style={styles.logo} />
      <Text style={styles.title}>🌸 Bienvenida 🌸</Text>
      <Text style={styles.subtitle}>Gracias por iniciar sesión</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogOut}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 25,
    borderRadius: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4a148c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7b1fa2',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#ab47bc',
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});