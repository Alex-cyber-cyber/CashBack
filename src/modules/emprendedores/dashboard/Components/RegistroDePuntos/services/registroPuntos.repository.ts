// src/modules/emprendedores/dashboard/Components/RegistroDePuntos/services/registroPuntos.repository.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../../../../../firebase/firebase.config";
import { RegistroPuntosDTO, RegistroPuntosDoc } from "../types/registroPuntos";

const COLLECTION = "registros_puntos";

export async function createRegistroPuntos(
  payload: RegistroPuntosDTO
): Promise<RegistroPuntosDoc> {
  const user = auth.currentUser;
  if (!user) {
    console.error("[repo] No hay usuario autenticado");
    throw new Error("UNAUTHENTICATED");
  }

  const docToSave: Omit<RegistroPuntosDoc, "id"> = {
    ...payload,
    createdAt: serverTimestamp(),
    createdBy: user.uid,
  };

  try {
    console.debug("[repo] addDoc →", COLLECTION, docToSave);
    const ref = await addDoc(collection(db, COLLECTION), docToSave);
    console.debug("[repo] creado id:", ref.id);
    return { ...docToSave, id: ref.id };
  } catch (e: any) {
    console.error("[repo] ERROR al guardar:", e?.code || e?.name, e?.message || e);
    throw e;
  }
}
