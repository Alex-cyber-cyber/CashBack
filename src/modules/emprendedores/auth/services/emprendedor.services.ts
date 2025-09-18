import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "../../../../../firebase/firebase.config";
import type { UserProfile } from "../types/Emprendedor.types";

export async function ensureEntrepreneurProfile(
  input: Partial<UserProfile> & { uid: string }
): Promise<UserProfile> {
  if (!input.uid) throw new Error("UID no proporcionado");

  const ref = doc(db, "Emprendedores", input.uid);
  const snap = await getDoc(ref);

  const base: UserProfile = {
    uid: input.uid,
    email: input.email ?? auth.currentUser?.email ?? "",
    displayName: input.displayName ?? auth.currentUser?.displayName ?? "Emprendedor",
    phone: input.phone ?? auth.currentUser?.phoneNumber ?? undefined,
    nombrePropietario: input.nombrePropietario ?? "",
    nombreComercial: input.nombreComercial ?? "",
    razonSocial: input.razonSocial ?? "",
    rtn: input.rtn ?? "",
    categoria: input.categoria ?? "",
    descripcion: input.descripcion ?? "",
    pais: input.pais ?? "",
    departamento: input.departamento ?? "",
    ciudad: input.ciudad ?? "",
    direccion: input.direccion ?? "",
    logo: input.logo ?? "",
    role: "Emprendedor",
    provider: input.provider ?? "password",
    emailVerified: input.emailVerified ?? !!auth.currentUser?.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),

    // 👇 nuevo
    maximoCredito: input.maximoCredito ?? 0,
  };

  if (!snap.exists()) {
    await setDoc(
      ref,
      { ...base, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true }
    );
    return base;
  } else {
    const updates = {
      displayName: base.displayName,
      phone: base.phone,
      nombrePropietario: base.nombrePropietario,
      nombreComercial: base.nombreComercial,
      razonSocial: base.razonSocial,
      rtn: base.rtn,
      categoria: base.categoria,
      descripcion: base.descripcion,
      pais: base.pais,
      departamento: base.departamento,
      ciudad: base.ciudad,
      direccion: base.direccion,
      logo: base.logo,
      updatedAt: serverTimestamp(),

      maximoCredito: base.maximoCredito,
    };
    await updateDoc(ref, updates as any);

    const data = snap.data() as any;
    return {
      ...base,
      ...data,
      ...updates,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: new Date(),
    };
  }
}
