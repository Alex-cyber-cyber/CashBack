
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

// ⬇⬇ IMPORTA TAMBIÉN auth PARA LOGS
import { auth, db } from "../../../../../../../firebase/firebase.config";

import type { Wallet, DiscountCode } from "../types/code";

/* ============================================================================
   Referencias
============================================================================ */
const refCartera = (uid: string) => doc(db, "wallets", uid);
const colCodigos = collection(db, "discountCodes");
const colRegistrosPuntos = collection(db, "registros_puntos");

/* ============================================================================
   Utilidades
============================================================================ */
export function generarCodigoLegible(len = 10) {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0/1/I
  let s = "";
  const rnd = crypto.getRandomValues(new Uint32Array(len));
  for (let i = 0; i < len; i++) s += alfabeto[rnd[i] % alfabeto.length];
  return `SW-${s.slice(0, 4)}-${s.slice(4, 8)}${len > 8 ? "-" + s.slice(8) : ""}`;
}

/* ============================================================================
   Cartera
============================================================================ */
export async function asegurarCartera(uid: string): Promise<Wallet> {
  const ref = refCartera(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const base: Wallet = {
      cashbackBalance: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, base, { merge: true });
    return base;
  }
  return snap.data() as Wallet;
}

/**
 * Recalcula la cartera desde `registros_puntos` (sumando totalPts del usuario)
 * y actualiza `wallets/{uid}`. Útil para el botón “Refrescar”.
 */
export async function recalcularCarteraDesdeRegistros(uid: string) {
  const q = query(colRegistrosPuntos, where("createdBy", "==", uid));
  const snap = await getDocs(q);

  let totalPts = 0;
  snap.forEach((d) => (totalPts += Number(d.data()?.totalPts || 0)));

  await setDoc(
    refCartera(uid),
    {
      cashbackBalance: totalPts, // fuente de verdad para transacción
      totalEarned: totalPts,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Escucha la cartera del usuario (con manejo de error opcional). */
export function escucharCartera(
  uid: string,
  onOk: (w: Wallet) => void,
  onErr?: (e: unknown) => void
) {
  if (!uid) return () => {};
  return onSnapshot(
    refCartera(uid),
    (snap) => onOk((snap.data() as Wallet) ?? { cashbackBalance: 0 }),
    (err) => {
      console.error("[escucharCartera] error:", err);
      onErr?.(err);
    }
  );
}

/** Escucha los códigos del usuario ordenados por createdAt desc. */
export function escucharMisCodigos(
  uid: string,
  onOk: (rows: DiscountCode[]) => void,
  onErr?: (e: unknown) => void
) {
  if (!uid) return () => {};
  const q = query(colCodigos, where("uid", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onOk(snap.docs.map((d) => ({ ...(d.data() as DiscountCode), code: d.id }))),
    (err) => {
      console.error("[escucharMisCodigos] error:", err);
      onErr?.(err);
    }
  );
}

/* ============================================================================
   Códigos
============================================================================ */

/** Crea un código aleatorio (para el botón “Sugerir”). */
export async function crearCodigoAutomatico(uid: string, amount: number, venceMin = 120) {
  const code = generarCodigoLegible(10);
  return crearCodigoManual(uid, code, amount, venceMin);
}

/**
 * Crear código con datos ingresados por el usuario (code + amount).
 * Valida saldo y colisión de código en una transacción.
 */
export async function crearCodigoManual(
  uid: string,
  rawCode: string,
  amount: number,
  venceMin = 120
) {
  const code = (rawCode || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z0-9-]{6,24}$/.test(code)) {
    throw new Error("Código inválido. Usa letras, números y guiones (6–24 caracteres).");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Monto inválido.");
  }

  const codeRef = doc(db, "discountCodes", code);
  const walletRef = refCartera(uid);

  // ======================= LOGS DE DEPURACIÓN =======================
  console.log(
    "[crearCodigoManual] auth.currentUser.uid =",
    auth.currentUser?.uid,
    "| uid parámetro =",
    uid,
    "| walletRef =",
    walletRef.path,
    "| codeRef =",
    codeRef.path
  );
  // =================================================================

  try {
    await runTransaction(db, async (tx) => {
      const wSnap = await tx.get(walletRef);

      // Más logs útiles durante la transacción
      console.log(
        "[crearCodigoManual] wallet existe?",
        wSnap.exists(),
        "| data =",
        wSnap.data()
      );

      const current: Wallet = (wSnap.exists()
        ? (wSnap.data() as Wallet)
        : { cashbackBalance: 0 }) as Wallet;

      const saldoActual = Number(current.cashbackBalance ?? 0);
      console.log("[crearCodigoManual] saldoActual =", saldoActual, "| amount =", amount);

      if (saldoActual < amount) {
        throw new Error("Saldo insuficiente para generar el código.");
      }

      const cSnap = await tx.get(codeRef);
      if (cSnap.exists()) {
        throw new Error("Ese código ya existe. Intenta con otro.");
      }

      // Descuenta saldo
      const nuevoSaldo = saldoActual - amount;
      tx.set(
        walletRef,
        { ...current, cashbackBalance: nuevoSaldo, updatedAt: serverTimestamp() },
        { merge: true }
      );

      // Tiempos
      const createdAt = serverTimestamp();
      const expiresAt = venceMin
        ? Timestamp.fromDate(new Date(Date.now() + venceMin * 60_000))
        : null;

      const payload: DiscountCode = {
        code,
        uid,
        amount,
        isValid: true,
        status: "generated", // “En espera de canje” en la UI
        createdAt,
        expiresAt,
        redeemedAt: null,
        redeemedBy: null,
      };

      tx.set(codeRef, payload);
    });

    return code;
  } catch (e) {
    console.error("[crearCodigoManual] error:", e);
    // Reenvía el error para que la UI lo maneje (alert/toast)
    throw e;
  }
}
