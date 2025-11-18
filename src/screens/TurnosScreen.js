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

export default function TurnosScreen() {
  const [turnos, setTurnos] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [turnoEditando, setTurnoEditando] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);

  const [form, setForm] = useState({
    nombrePaciente: "",
    especialista: "",
    fecha: "",
    hora: "",
    notas: "",
  });

  const [errors, setErrors] = useState({});

  // ======================
  //   CARGAR TURNOS
  // ======================
  const cargarTurnos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "turnos"));
      const lista = [];
      querySnapshot.forEach((unDoc) => {
        lista.push({ id: unDoc.id, ...unDoc.data() });
      });
      setTurnos(lista);
    } catch (e) {
      console.log("Error cargando turnos:", e);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  // ======================
  //   VALIDACIONES
  // ======================
  const validarFormulario = () => {
    let newErrors = {};

    // Nombre solo letras
    if (!form.nombrePaciente.trim())
      newErrors.nombrePaciente = "Nombre obligatorio.";
    else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(form.nombrePaciente))
      newErrors.nombrePaciente = "Solo letras.";

    // Especialista solo letras
    if (!form.especialista.trim())
      newErrors.especialista = "Especialista obligatorio.";
    else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(form.especialista))
      newErrors.especialista = "Solo letras.";

    // Fecha
    if (!form.fecha.trim()) newErrors.fecha = "Fecha obligatoria.";
    else if (!/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d{4}$/.test(form.fecha))
      newErrors.fecha = "Formato: dd-mm-aaaa";

    // Hora
    if (!form.hora.trim()) newErrors.hora = "Hora obligatoria.";
    else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.hora))
      newErrors.hora = "Formato: HH:MM";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================
  //   ABRIR MODALES
  // ======================
  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setForm({
      nombrePaciente: "",
      especialista: "",
      fecha: "",
      hora: "",
      notas: "",
    });
    setErrors({});
    setModalVisible(true);
  };

  const abrirModalEditar = (turno) => {
    setModoEdicion(true);
    setTurnoEditando(turno);
    setForm({
      nombrePaciente: turno.nombrePaciente,
      especialista: turno.especialista,
      fecha: turno.fecha,
      hora: turno.hora,
      notas: turno.notas || "",
    });
    setErrors({});
    setModalVisible(true);
  };

  // ======================
  //   GUARDAR NUEVO
  // ======================
  const guardarTurno = async () => {
    if (!validarFormulario()) return;

    try {
      await addDoc(collection(db, "turnos"), {
        nombrePaciente: form.nombrePaciente.trim(),
        especialista: form.especialista.trim(),
        fecha: form.fecha.trim(),
        hora: form.hora.trim(),
        notas: form.notas.trim(),
        fechaRegistro: new Date(),
      });

      Alert.alert("Éxito", "Turno agregado.");
      setModalVisible(false);
      cargarTurnos();
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
      await updateDoc(doc(db, "turnos", turnoEditando.id), {
        nombrePaciente: form.nombrePaciente.trim(),
        especialista: form.especialista.trim(),
        fecha: form.fecha.trim(),
        hora: form.hora.trim(),
        notas: form.notas.trim(),
      });

      Alert.alert("Éxito", "Turno actualizado.");
      setModalVisible(false);
      cargarTurnos();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo actualizar.");
    }
  };

  // ======================
  //   ELIMINAR (CONFIRMAR)
  // ======================
  const pedirConfirmacionEliminar = (turno) => {
    setTurnoAEliminar(turno);
    setConfirmVisible(true);
  };

  const confirmarEliminacion = async () => {
    if (!turnoAEliminar) return;

    try {
      await deleteDoc(doc(db, "turnos", turnoAEliminar.id));
      setConfirmVisible(false);
      setTurnoAEliminar(null);
      cargarTurnos();
    } catch (e) {
      console.log(e);
      setConfirmVisible(false);
      Alert.alert("Error", "No se pudo eliminar.");
    }
  };

  const cancelarEliminacion = () => {
    setConfirmVisible(false);
    setTurnoAEliminar(null);
  };

  // ======================
  //   RENDER
  // ======================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turnos</Text>

      <ScrollView style={{ marginBottom: 80 }}>
        {turnos.length === 0 ? (
          <Text style={styles.subtitle}>No hay turnos registrados.</Text>
        ) : (
          turnos.map((t) => (
            <View key={t.id} style={styles.card}>
              <Text style={styles.bold}>{t.nombrePaciente}</Text>
              <Text>Especialista: {t.especialista}</Text>
              <Text>Fecha: {t.fecha}</Text>
              <Text>Hora: {t.hora}</Text>
              {t.notas ? <Text>Notas: {t.notas}</Text> : null}

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.cardBtn, styles.editBtn]}
                  onPress={() => abrirModalEditar(t)}
                >
                  <Text style={styles.cardBtnText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cardBtn, styles.deleteBtn]}
                  onPress={() => pedirConfirmacionEliminar(t)}
                >
                  <Text style={styles.cardBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity style={styles.fab} onPress={abrirModalAgregar}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL AGREGAR / EDITAR */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modoEdicion ? "Editar Turno" : "Nuevo Turno"}
            </Text>

            <ScrollView>
              {/* NOMBRE PACIENTE */}
              <Text>Nombre del paciente:</Text>
              <TextInput
                style={styles.input}
                value={form.nombrePaciente}
                onChangeText={(t) =>
                  setForm({ ...form, nombrePaciente: t })
                }
              />
              {errors.nombrePaciente && (
                <Text style={styles.error}>{errors.nombrePaciente}</Text>
              )}

              {/* ESPECIALISTA */}
              <Text>Especialista:</Text>
              <TextInput
                style={styles.input}
                value={form.especialista}
                onChangeText={(t) =>
                  setForm({ ...form, especialista: t })
                }
              />
              {errors.especialista && (
                <Text style={styles.error}>{errors.especialista}</Text>
              )}

              {/* FECHA */}
              <Text>Fecha (dd-mm-aaaa):</Text>
              <TextInput
                style={styles.input}
                value={form.fecha}
                onChangeText={(t) =>
                  setForm({ ...form, fecha: t })
                }
              />
              {errors.fecha && (
                <Text style={styles.error}>{errors.fecha}</Text>
              )}

              {/* HORA */}
              <Text>Hora (HH:MM):</Text>
              <TextInput
                style={styles.input}
                value={form.hora}
                onChangeText={(t) =>
                  setForm({ ...form, hora: t })
                }
              />
              {errors.hora && (
                <Text style={styles.error}>{errors.hora}</Text>
              )}

              {/* NOTAS */}
              <Text>Notas (opcional):</Text>
              <TextInput
                style={styles.input}
                multiline
                value={form.notas}
                onChangeText={(t) =>
                  setForm({ ...form, notas: t })
                }
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={modoEdicion ? guardarEdicion : guardarTurno}
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

      {/* MODAL CONFIRMAR ELIMINAR */}
      <Modal animationType="fade" transparent visible={confirmVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.confirmBox}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={{ textAlign: "center", marginBottom: 15 }}>
              ¿Seguro que deseas eliminar el turno de{" "}
              <Text style={{ fontWeight: "bold" }}>
                {turnoAEliminar?.nombrePaciente}
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