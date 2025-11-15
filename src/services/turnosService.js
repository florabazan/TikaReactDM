import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const guardarTurno = async (data) => {
  try {
    await addDoc(collection(db, "turnos"), {
      paciente: data.paciente,
      especialista: data.especialista,
      fecha: data.fecha,
      hora: data.hora,
      notas: data.notas,
      creadoEn: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.log("Error guardando turno:", error);
    return { success: false, error };
  }
};
