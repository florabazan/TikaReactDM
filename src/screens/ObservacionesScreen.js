import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { obtenerObservaciones } from "../services/observacionesService";

export default function ObservacionesScreen({ navigation }) {
  const [lista, setLista] = useState([]);

  const cargar = async () => {
    const data = await obtenerObservaciones();
    setLista(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", cargar);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.paciente}</Text>
      <Text style={styles.cardSub}>Especialista: {item.especialista}</Text>
      <Text>Fecha: {item.fecha}</Text>
      <Text>Tipo: {item.tipo || "General"}</Text>
      <Text style={styles.cardDet}>{item.detalle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("FormObservacion")}
      >
        <Text style={styles.btnText}>+ Nueva Observación</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7e8ff",
    padding: 10,
  },
  btn: {
    backgroundColor: "#a74ac7",
    padding: 15,
    borderRadius: 30,
    marginBottom: 15,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderColor: "#d7b7f7",
    borderWidth: 2,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a1b9a",
  },
  cardSub: {
    color: "#444",
    marginVertical: 5,
  },
  cardDet: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
});
