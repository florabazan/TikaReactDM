import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const guardarObservacion = async (data) => {
  console.log(" Enviando a Firestore:", data);

  try {
    const ref = await addDoc(collection(db, "observaciones"), {
      paciente: data.paciente,
      especialista: data.especialista,
      fecha: data.fecha,
      detalle: data.detalle,
      tipo: data.tipo || "General",
      creadoEn: serverTimestamp(),
    });

    console.log("✔ Guardado correctamente con ID:", ref.id);
    return { success: true };
  } catch (error) {
    console.log("ERROR guardando observación:", error);
    return { success: false, error: error.message || String(error) };
  }
};

export const obtenerObservaciones = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "observaciones"));
    let lista = [];
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    return lista;
  } catch (error) {
    console.log(" ERROR obteniendo observaciones:", error);
    return [];
  }
};

