import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function ComprobanteScreen() {
  const [data, setData] = useState({
    paciente: "",
    dni: "",
    fecha: "",
    monto: "",
    descripcion: ""
  });

  // VALIDACIÓN EN TIEMPO REAL
  const onChange = (name, value) => {
    if (name === "paciente") {
      // Solo letras
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]*$/.test(value)) return;
    }

    if (name === "dni" || name === "monto") {
      // Solo números
      if (!/^[0-9]*$/.test(value)) return;
    }

    if (name === "fecha") {
      // Solo números y "/"
      if (!/^[0-9/]*$/.test(value)) return;
    }

    setData({ ...data, [name]: value });
  };

  // Validar fecha dd/mm/aaaa
  const validarFecha = (fecha) => {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(fecha);
  };

  const generarPDF = async () => {
    // VALIDACIONES
    if (!data.paciente || !data.fecha || !data.monto) {
      Alert.alert("Error", "Paciente, fecha y monto son obligatorios.");
      return;
    }

    if (!validarFecha(data.fecha)) {
      Alert.alert("Fecha inválida", "La fecha debe ser dd/mm/aaaa");
      return;
    }

    if (isNaN(data.dni)) {
      Alert.alert("DNI inválido", "El DNI debe ser solo números.");
      return;
    }

    if (isNaN(data.monto) || Number(data.monto) <= 0) {
      Alert.alert("Monto inválido", "Debe ingresar un número mayor que 0.");
      return;
    }

    // GENERAR HTML DEL PDF
    const html = `
      <html>
        <body style="font-family: Arial; padding:20px">
          <h2 style="text-align:center; color:#6a1b9a;">COMPROBANTE</h2>
          <hr />

          <p><strong>Paciente:</strong> ${data.paciente}</p>
          <p><strong>DNI:</strong> ${data.dni}</p>
          <p><strong>Fecha:</strong> ${data.fecha}</p>
          <p><strong>Monto:</strong> $${data.monto}</p>
          <p><strong>Descripción:</strong> ${data.descripcion}</p>

          <br/>
          <p style="text-align:center; font-size:12px; color:gray;">Generado automáticamente por TIKA</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      Alert.alert("Éxito", "Comprobante generado correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el comprobante.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Generar Comprobante</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del paciente"
          value={data.paciente}
          onChangeText={(v) => onChange("paciente", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="DNI"
          keyboardType="numeric"
          value={data.dni}
          onChangeText={(v) => onChange("dni", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha (dd/mm/aaaa)"
          value={data.fecha}
          onChangeText={(v) => onChange("fecha", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Monto"
          keyboardType="numeric"
          value={data.monto}
          onChangeText={(v) => onChange("monto", v)}
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Descripción"
          multiline
          value={data.descripcion}
          onChangeText={(v) => onChange("descripcion", v)}
        />

        <TouchableOpacity style={styles.btn} onPress={generarPDF}>
          <Text style={styles.btnText}>Generar Comprobante PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ------------------------------------------
// ESTILO TIKA 💜 (igual a tus otras pantallas)
// ------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7e8ff", // rosado pastel TIKA
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
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
  btn: {
    backgroundColor: "#8e24aa",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
});
