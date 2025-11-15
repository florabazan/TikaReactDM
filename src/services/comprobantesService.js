import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const guardarComprobante = async (data) => {
  try {
    // Obtener cantidad actual para numeración automática
    const comprobantesRef = collection(db, "comprobantes");
    const snapshot = await getDocs(comprobantesRef);
    const cantidad = snapshot.size + 1;

    // Crear el número de comprobante
    const numeroComprobante = "CMP-" + String(cantidad).padStart(4, "0");

    // Guardar en Firestore
    await addDoc(comprobantesRef, {
      pacienteId: data.pacienteId,
      fecha: data.fecha,
      monto: Number(data.monto),
      descripcion: data.descripcion || "",
      numeroComprobante: numeroComprobante,
      creadoEn: serverTimestamp(),
    });

    return { success: true };

  } catch (error) {
    console.log("ERROR al guardar comprobante:", error);
    return { success: false, error };
  }
};
