import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from '../config/firebaseConfig';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';

export default function FormTurnoScreen({ navigation, route }) {
  const turno = route.params?.turno || null;

  const [nombrePaciente, setNombrePaciente] = useState(turno ? turno.nombrePaciente : "");
  const [especialista, setEspecialista] = useState(turno ? turno.especialista : "");
  const [fecha, setFecha] = useState(turno ? turno.fecha : "");
  const [hora, setHora] = useState(turno ? turno.hora : "");
  const [notas, setNotas] = useState(turno ? turno.notas : "");

  const handleSave = async () => {
    if (!nombrePaciente || !especialista || !fecha || !hora) {
      Alert.alert("Error", "Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (turno) {
        // EDITAR TURNO
        const ref = doc(db, "turnos", turno.id);
        await updateDoc(ref, {
          nombrePaciente,
          especialista,
          fecha,
          hora,
          notas,
        });
        Alert.alert("¡Actualizado!", "El turno se actualizó correctamente.");
      } else {
        // CREAR NUEVO TURNO
        const ref = collection(db, "turnos");
        await addDoc(ref, {
          nombrePaciente,
          especialista,
          fecha,
          hora,
          notas,
        });
        Alert.alert("¡Guardado!", "El turno se creó correctamente.");
      }

      navigation.goBack();

    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el turno.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {turno ? "✏️ Editar Turno" : "➕ Nuevo Turno"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Paciente"
        value={nombrePaciente}
        onChangeText={setNombrePaciente}
      />

      <TextInput
        style={styles.input}
        placeholder="Especialista"
        value={especialista}
        onChangeText={setEspecialista}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha (dd-mm-aaaa)"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Hora (HH:MM)"
        value={hora}
        onChangeText={setHora}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notas (opcional)"
        value={notas}
        onChangeText={setNotas}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {turno ? "Guardar Cambios" : "Crear Turno"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fbeaf7'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6a1b9a',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ce93d8',
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: '#ba68c8',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  }
});