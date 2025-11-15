import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

// IMPORTAMOS FIRESTORE
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";  // ← tu archivo

export default function FormPacienteScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    dni: "",
    observaciones: "",
  });

  const onChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // GUARDAR PACIENTE EN FIRESTORE
  const guardarPaciente = async () => {
    if (!form.nombre || !form.edad || !form.dni) {
      Alert.alert("Error", "Todos los campos obligatorios deben completarse.");
      return;
    }

    try {
      await addDoc(collection(db, "pacientes"), {
        nombre: form.nombre,
        edad: form.edad,
        dni: form.dni,
        observaciones: form.observaciones || "",
        fechaRegistro: new Date(),
      });

      Alert.alert("Éxito", "Paciente guardado correctamente.");
      navigation.goBack();

    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar el paciente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Paciente</Text>

      <Text>Nombre del paciente:</Text>
      <TextInput
        style={styles.input}
        value={form.nombre}
        onChangeText={(t) => onChange("nombre", t)}
      />

      <Text>Edad:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.edad}
        onChangeText={(t) => onChange("edad", t)}
      />

      <Text>DNI:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.dni}
        onChangeText={(t) => onChange("dni", t)}
      />

      <Text>Observaciones (opcional):</Text>
      <TextInput
        style={styles.input}
        multiline
        value={form.observaciones}
        onChangeText={(t) => onChange("observaciones", t)}
      />

      <TouchableOpacity style={styles.btn} onPress={guardarPaciente}>
        <Text style={styles.btnText}>Guardar Paciente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6fb",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#4b2e83",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d79ce7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#d79ce7",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});