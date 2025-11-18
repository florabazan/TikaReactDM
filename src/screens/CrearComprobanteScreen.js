import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { guardarComprobante } from "../services/comprobantesService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function CrearComprobanteScreen() {
  const [form, setForm] = useState({
    pacienteId: "",
    fecha: "",
    monto: "",
    descripcion: "",
  });

  // ----------------------------
  // VALIDACIONES EN TIEMPO REAL
  // ----------------------------
  const onChange = (name, value) => {
    if (name === "pacienteId") {
      // SOLO LETRAS — no números, no espacios, no caracteres raros
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ]*$/.test(value)) return;
    }

    if (name === "monto") {
      // Solo números y decimales
      if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;
    }

    if (name === "fecha") {
      // Solo números y "/"
      if (!/^[0-9/]*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  // Validación formato fecha dd/mm/aaaa
  const validarFecha = (fecha) => {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(fecha);
  };

  // Validar existencia del paciente en Firebase
  const verificarPaciente = async (pacienteId) => {
    try {
      const ref = doc(db, "pacientes", pacienteId);
      const snapshot = await getDoc(ref);
      return snapshot.exists();
    } catch (error) {
      console.log("Error verificando paciente:", error);
      return false;
    }
  };

  // ----------------------------
  // GUARDAR COMPROBANTE
  // ----------------------------
  const guardar = async () => {
    if (!form.pacienteId || !form.fecha || !form.monto) {
      Alert.alert("Error", "Los campos Paciente, Fecha y Monto son obligatorios.");
      return;
    }

    if (!validarFecha(form.fecha)) {
      Alert.alert("Fecha inválida", "La fecha debe ser en formato dd/mm/aaaa");
      return;
    }

    if (isNaN(form.monto) || Number(form.monto) <= 0) {
      Alert.alert("Monto inválido", "Debe ingresar un número mayor que 0.");
      return;
    }

    // Validar si el paciente existe
    const existePaciente = await verificarPaciente(form.pacienteId);

    if (!existePaciente) {
      Alert.alert("Error", "El paciente no existe en la base de datos.");
      return;
    }

    const res = await guardarComprobante(form);

    if (res.success) {
      Alert.alert("Éxito", "Comprobante guardado correctamente.");
      setForm({ pacienteId: "", fecha: "", monto: "", descripcion: "" });
    } else {
      Alert.alert("Error", "No se pudo guardar el comprobante.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Comprobante</Text>

        <TextInput
          style={styles.input}
          placeholder="ID del paciente (solo letras)"
          value={form.pacienteId}
          onChangeText={(v) => onChange("pacienteId", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha (dd/mm/aaaa)"
          value={form.fecha}
          onChangeText={(v) => onChange("fecha", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Monto"
          keyboardType="numeric"
          value={form.monto}
          onChangeText={(v) => onChange("monto", v)}
        />

        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Descripción"
          multiline
          value={form.descripcion}
          onChangeText={(v) => onChange("descripcion", v)}
        />

        <TouchableOpacity style={styles.button} onPress={guardar}>
          <Text style={styles.buttonText}>Guardar Comprobante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ----------------------------
// ESTILOS TIKA
// ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7e8ff",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    color: "#6a1b9a",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d7b7f7",
    borderWidth: 2,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#8e24aa",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
});
