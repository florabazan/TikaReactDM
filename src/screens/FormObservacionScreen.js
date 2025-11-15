import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { guardarObservacion } from "../services/observacionesService";

export default function FormObservacionScreen({ navigation }) {
  const [form, setForm] = useState({
    paciente: "",
    especialista: "",
    fecha: "",
    tipo: "",
    detalle: ""
  });

  const onChange = (name, value) => {
    if (name === "paciente" || name === "especialista" || name === "tipo") {
      if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]*$/.test(value)) return;
    }

    if (name === "fecha") {
      if (!/^[0-9-]*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const validarFecha = (fecha) => {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d{4}$/;
    return regex.test(fecha);
  };

  const crear = async () => {
    // VALIDACIONES
    if (!form.paciente || !form.especialista || !form.fecha || !form.detalle) {
      Alert.alert("Error", "Complete todos los campos obligatorios.");
      return;
    }

    if (!validarFecha(form.fecha)) {
      Alert.alert("Fecha inválida", "Use el formato dd-mm-aaaa");
      return;
    }

    if (form.detalle.length < 10) {
      Alert.alert("Detalle muy corto", "Ingrese al menos 10 caracteres.");
      return;
    }

    // 💾 GUARDAR EN FIREBASE
    const res = await guardarObservacion(form);
    console.log("Respuesta de guardarObservacion:", res);

    if (res.success) {
      Alert.alert("Éxito", "Observación registrada.");

      // limpiar formulario
      setForm({
        paciente: "",
        especialista: "",
        fecha: "",
        tipo: "",
        detalle: ""
      });

      // volver a la lista
      navigation.navigate("ObservacionesTab", { screen: "ObservacionesHome" });
    } else {
      Alert.alert(
        "Error",
        res.error ? `No se guardó la observación.\nDetalle: ${res.error}` : "No se guardó la observación."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Nueva Observación</Text>

      <TextInput
        style={styles.input}
        placeholder="Paciente"
        value={form.paciente}
        onChangeText={(v) => onChange("paciente", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Especialista"
        value={form.especialista}
        onChangeText={(v) => onChange("especialista", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha (dd-mm-aaaa)"
        value={form.fecha}
        onChangeText={(v) => onChange("fecha", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Tipo (conductual, emocional...)"
        value={form.tipo}
        onChangeText={(v) => onChange("tipo", v)}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Detalle de la observación"
        value={form.detalle}
        multiline
        onChangeText={(v) => onChange("detalle", v)}
      />

      <TouchableOpacity style={styles.btn} onPress={crear}>
        <Text style={styles.btnText}>Guardar Observación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7e8ff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6a1b9a",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d7b7f7",
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#a74ac7",
    padding: 15,
    borderRadius: 30,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
