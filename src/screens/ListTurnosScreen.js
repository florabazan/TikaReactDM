import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ListTurnosScreen({ navigation }) {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    console.log("Conectando a Firestore...");
    const ref = collection(db, "turnos");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      console.log("Snapshot recibido:", snapshot.size);
        const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Turnos cargados:", data);
      setTurnos(data);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Mis Turnos</Text>

      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate("DetailTurno", { turno: item })}
          >
            <Text style={styles.name}>{item.nombrePaciente}</Text>
            <Text style={styles.info}>{item.especialista}</Text>
            <Text style={styles.info}>{item.fecha} - {item.hora}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay turnos cargados</Text>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate("FormTurno")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbeaf7'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6a1b9a'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c'
  },
  info: {
    color: '#6a1b9a'
  },
  empty: {
    textAlign: 'center',
    color: '#9c27b0',
    marginTop: 30,
    fontSize: 16
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#ce93d8',
    padding: 15,
    borderRadius: 50,
    elevation: 6
  }
});