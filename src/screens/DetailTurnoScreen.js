import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export default function DetailTurnoScreen({ route, navigation }) {
  const turno = route.params.turno;

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar Turno",
      "¿Estás segura de que deseas eliminar este turno?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: eliminarTurno }
      ]
    );
  };

  const eliminarTurno = async () => {
    try {
      const ref = doc(db, "turnos", turno.id);
      await deleteDoc(ref);

      Alert.alert("Eliminado", "El turno ha sido eliminado.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el turno.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Detalle del Turno</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Paciente:</Text>
        <Text style={styles.value}>{turno.nombrePaciente}</Text>

        <Text style={styles.label}>Especialista:</Text>
        <Text style={styles.value}>{turno.especialista}</Text>

        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{turno.fecha}</Text>

        <Text style={styles.label}>Hora:</Text>
        <Text style={styles.value}>{turno.hora}</Text>

        {turno.notas ? (
          <>
            <Text style={styles.label}>Notas:</Text>
            <Text style={styles.value}>{turno.notas}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.greenButton]}
          onPress={() => navigation.navigate("FormTurno", { turno })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.redButton]}
          onPress={confirmarEliminar}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6a1b9a',
    textAlign: 'center',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 4
  },
  label: {
    fontSize: 15,
    color: '#9c27b0',
    marginTop: 10
  },
  value: {
    fontSize: 18,
    color: '#4a148c',
    fontWeight: '600'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30
  },
  greenButton: {
    backgroundColor: '#4caf50'   // VERDE
  },
  redButton: {
    backgroundColor: '#e53935'   // ROJO
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16
  }
});