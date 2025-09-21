// src/modules/clientes/dashboard/services/clientStats.service.ts
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../../../firebase/firebase.config"

export type ClientStats = {
  saldoTotal: number;     // suma total de totalPts por correo
  esteMes: number;        // suma de totalPts del mes en curso
  pendiente: number;      // siempre 0 (pedido por ti)
};

type RegistroPuntos = {
  correo: string;
  totalPts: number | string;
  createdAt?: Timestamp | Date | null;
};

// Normaliza números que puedan venir como string
function toNumber(n: unknown): number {
  if (typeof n === "number") return n;
  if (typeof n === "string") return Number(n.replace(/[^\d.-]/g, "")) || 0;
  return 0;
}

// Saca Date desde Timestamp/Date/undefined
function toDate(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === "function") return v.toDate();
  return null;
}

/**
 * Escucha en tiempo real los registros del usuario (por correo) y
 * computa: saldo total, total del mes y pendiente (0).
 *
 * @param email correo del usuario autenticado
 * @param cb callback que recibe los totales
 * @returns función para desuscribirse
 */
export function listenClientStatsByEmail(
  email: string,
  cb: (s: ClientStats) => void
) {
  const col = collection(db, "registros_puntos");
  const q = query(col, where("correo", "==", email));

  const unsub = onSnapshot(q, (snap) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let saldoTotal = 0;
    let esteMes = 0;

    snap.docs.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      const data = d.data() as RegistroPuntos;
      const pts = toNumber(data.totalPts);
      saldoTotal += pts;

      const created = toDate(data.createdAt);
      if (created && created >= monthStart) {
        esteMes += pts;
      }
    });

    cb({ saldoTotal, esteMes, pendiente: 0 });
  });

  return unsub;
}
