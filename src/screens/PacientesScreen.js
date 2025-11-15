import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function PacientesScreen() {
  const [pacientes, setPacientes] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    dni: "",
    observaciones: "",
  });

  const [errors, setErrors] = useState({});

  // ======================
  //   CARGAR PACIENTES
  // ======================
  const cargarPacientes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pacientes"));
      const lista = [];
      querySnapshot.forEach((unDoc) => {
        lista.push({ id: unDoc.id, ...unDoc.data() });
      });
      setPacientes(lista);
    } catch (e) {
      console.log("Error cargando pacientes:", e);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  // ======================
  //   VALIDACIONES
  // ======================
  const validarFormulario = () => {
    let newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "Nombre obligatorio.";

    if (!form.edad.trim()) newErrors.edad = "Edad obligatoria.";
    else if (!/^\d+$/.test(form.edad)) newErrors.edad = "Solo números.";

    if (!form.dni.trim()) newErrors.dni = "DNI obligatorio.";
    else if (!/^\d+$/.test(form.dni)) newErrors.dni = "Debe ser numérico.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================
  //   MODALES
  // ======================
  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setForm({ nombre: "", edad: "", dni: "", observaciones: "" });
    setErrors({});
    setModalVisible(true);
  };

  const abrirModalEditar = (paciente) => {
    setModoEdicion(true);
    setPacienteEditando(paciente);
    setForm({
      nombre: paciente.nombre,
      edad: String(paciente.edad ?? ""),
      dni: String(paciente.dni ?? ""),
      observaciones: paciente.observaciones || "",
    });
    setErrors({});
    setModalVisible(true);
  };

  // ======================
  //   GUARDAR NUEVO
  // ======================
  const guardarPaciente = async () => {
    if (!validarFormulario()) return;

    try {
      await addDoc(collection(db, "pacientes"), {
        nombre: form.nombre.trim(),
        edad: form.edad.trim(),
        dni: form.dni.trim(),
        observaciones: form.observaciones.trim(),
        fechaRegistro: new Date(),
      });

      Alert.alert("Éxito", "Paciente agregado.");
      setModalVisible(false);
      cargarPacientes();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo guardar.");
    }
  };

  // ======================
  //   GUARDAR EDICIÓN
  // ======================
  const guardarEdicion = async () => {
    if (!validarFormulario()) return;

    try {
      await updateDoc(doc(db, "pacientes", pacienteEditando.id), {
        nombre: form.nombre.trim(),
        edad: form.edad.trim(),
        dni: form.dni.trim(),
        observaciones: form.observaciones.trim(),
      });

      Alert.alert("Éxito", "Paciente actualizado.");
      setModalVisible(false);
      cargarPacientes();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo actualizar.");
    }
  };

  // ======================
  //   ELIMINAR (CON CONFIRMACIÓN)
  // ======================
  const pedirConfirmacionEliminar = (paciente) => {
    setPacienteAEliminar(paciente);
    setConfirmVisible(true);
  };

  const confirmarEliminacion = async () => {
    if (!pacienteAEliminar) return;

    try {
      await deleteDoc(doc(db, "pacientes", pacienteAEliminar.id));
      setConfirmVisible(false);
      setPacienteAEliminar(null);
      cargarPacientes();
    } catch (e) {
      console.log(e);
      setConfirmVisible(false);
      Alert.alert("Error", "No se pudo eliminar.");
    }
  };

  const cancelarEliminacion = () => {
    setConfirmVisible(false);
    setPacienteAEliminar(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>

      <ScrollView style={{ marginBottom: 80 }}>
        {pacientes.length === 0 ? (
          <Text style={styles.subtitle}>No hay pacientes registrados.</Text>
        ) : (
          pacientes.map((p) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.bold}>{p.nombre}</Text>
              <Text>DNI: {p.dni}</Text>
              <Text>Edad: {p.edad}</Text>
              {p.observaciones ? <Text>Obs: {p.observaciones}</Text> : null}

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.cardBtn, styles.editBtn]}
                  onPress={() => abrirModalEditar(p)}
                >
                  <Text style={styles.cardBtnText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cardBtn, styles.deleteBtn]}
                  onPress={() => pedirConfirmacionEliminar(p)}
                >
                  <Text style={styles.cardBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTÓN FLOTANTE + */}
      <TouchableOpacity style={styles.fab} onPress={abrirModalAgregar}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* -------- MODAL ALTA / EDICIÓN -------- */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modoEdicion ? "Editar Paciente" : "Nuevo Paciente"}
            </Text>

            <ScrollView>
              {/* NOMBRE */}
              <Text>Nombre:</Text>
              <TextInput
                style={styles.input}
                value={form.nombre}
                onChangeText={(t) => setForm({ ...form, nombre: t })}
              />
              {errors.nombre && (
                <Text style={styles.error}>{errors.nombre}</Text>
              )}

              {/* EDAD */}
              <Text>Edad:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.edad}
                onChangeText={(t) =>
                  setForm({ ...form, edad: t.replace(/[^0-9]/g, "") })
                }
              />
              {errors.edad && <Text style={styles.error}>{errors.edad}</Text>}

              {/* DNI */}
              <Text>DNI:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.dni}
                onChangeText={(t) =>
                  setForm({ ...form, dni: t.replace(/[^0-9]/g, "") })
                }
              />
              {errors.dni && <Text style={styles.error}>{errors.dni}</Text>}

              {/* OBSERVACIONES */}
              <Text>Observaciones:</Text>
              <TextInput
                style={styles.input}
                multiline
                value={form.observaciones}
                onChangeText={(t) =>
                  setForm({ ...form, observaciones: t })
                }
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={modoEdicion ? guardarEdicion : guardarPaciente}
              >
                <Text style={styles.saveBtnText}>
                  {modoEdicion ? "Guardar cambios" : "Guardar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* -------- MODAL CONFIRMACIÓN ELIMINAR -------- */}
      <Modal animationType="fade" transparent visible={confirmVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.confirmBox}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={{ textAlign: "center", marginBottom: 15 }}>
              ¿Seguro que deseas eliminar al paciente{" "}
              <Text style={{ fontWeight: "bold" }}>
                {pacienteAEliminar?.nombre}
              </Text>
              ?
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.cardBtn, styles.cancelBtnSmall]}
                onPress={cancelarEliminacion}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cardBtn, styles.deleteBtn]}
                onPress={confirmarEliminacion}
              >
                <Text style={styles.cardBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ============ ESTILOS ===============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf6fb", padding: 20 },
  title: {
    color: "#4b2e83",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 20,
    color: "#7a4ca6",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    elevation: 3,
  },
  bold: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cardBtn: {
    padding: 8,
    borderRadius: 8,
    width: "48%",
  },
  editBtn: { backgroundColor: "#a35bb5" },
  deleteBtn: { backgroundColor: "#d9534f" },
  cardBtnText: { color: "white", textAlign: "center", fontWeight: "bold" },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#d79ce7",
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { fontSize: 35, color: "white", marginBottom: 3 },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    maxHeight: "80%",
  },
  confirmBox: {
    backgroundColor: "white",
    margin: 30,
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b2e83",
    textAlign: "center",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d79ce7",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#8e24aa",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  saveBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  cancelBtn: {
    backgroundColor: "#b39ddb",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  cancelBtnSmall: {
    backgroundColor: "#b39ddb",
  },
  cancelBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
