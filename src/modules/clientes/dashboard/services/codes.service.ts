// src/modules/clientes/dashboard/services/codes.service.ts
import {
  collection, doc, getDoc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc, Timestamp, where
} from "firebase/firestore";
import { db } from "../../../../../firebase/firebase.config";

export type Wallet = {
  cashbackBalance: number;
  totalEarned?: number;
  totalRedeemed?: number;
  updatedAt?: any;
};

export type DiscountCode = {
  code: string;           // doc id
  uid: string;            // dueño (cliente)
  amount: number;         // monto descontado del saldo
  isValid: boolean;       // <— booleano visible en la tabla
  status: "generated" | "redeemed" | "expired" | "cancelled";
  createdAt: any;
  expiresAt: any | null;
  redeemedAt: any | null;
  redeemedBy?: string | null; // emprendedor (luego)
};

// ===== util =====
const walletsRef = (uid: string) => doc(db, "wallets", uid);
const codesCol = collection(db, "discountCodes");

// Código legible y único (intenta evitar colisiones)
export function genReadableCode(len = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0/1/I
  let s = "";
  const rnd = crypto.getRandomValues(new Uint32Array(len));
  for (let i = 0; i < len; i++) s += alphabet[rnd[i] % alphabet.length];
  // formato: SW-XXXX-XXXX (opcional)
  return `SW-${s.slice(0, 4)}-${s.slice(4, 8)}${len > 8 ? "-" + s.slice(8) : ""}`;
}

export async function ensureWallet(uid: string) {
  const ref = walletsRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const base: Wallet = { cashbackBalance: 0, totalEarned: 0, totalRedeemed: 0, updatedAt: serverTimestamp() };
    await setDoc(ref, base, { merge: true });
    return base;
  }
  return snap.data() as Wallet;
}

/**
 * Genera un código y DESCUENTA el saldo en una transacción.
 * Devuelve el código creado.
 */
export async function createDiscountCode(uid: string, amount: number, expiresMinutes = 120) {
  const code = genReadableCode(10);
  const codeRef = doc(db, "discountCodes", code);
  const walletRef = walletsRef(uid);

  await runTransaction(db, async (tx) => {
    const wSnap = await tx.get(walletRef);
    const current: Wallet = (wSnap.exists() ? (wSnap.data() as Wallet) : { cashbackBalance: 0 }) as Wallet;

    if ((current.cashbackBalance ?? 0) < amount) {
      throw new Error("Saldo insuficiente para generar el código.");
    }

    // Evitar colisión de código (improbable)
    const cSnap = await tx.get(codeRef);
    if (cSnap.exists()) throw new Error("Colisión de código, intenta de nuevo.");

    // Restar saldo
    const newBalance = (current.cashbackBalance ?? 0) - amount;
    tx.set(
      walletRef,
      { ...current, cashbackBalance: newBalance, updatedAt: serverTimestamp() },
      { merge: true }
    );

    // Guardar código
    const expiresAt = expiresMinutes
      ? Timestamp.fromDate(new Date(Date.now() + expiresMinutes * 60_000))
      : null;

    const payload: DiscountCode = {
      code,
      uid,
      amount,
      isValid: true,             // <— booleano requerido
      status: "generated",
      createdAt: serverTimestamp(),
      expiresAt,
      redeemedAt: null,
      redeemedBy: null,
    };

    tx.set(codeRef, payload);
  });

  return code;
}

export function listenWallet(uid: string, cb: (w: Wallet) => void) {
  return onSnapshot(walletsRef(uid), (snap) => cb((snap.data() as Wallet) ?? { cashbackBalance: 0 }));
}

export function listenMyCodes(uid: string, cb: (rows: DiscountCode[]) => void) {
  const q = query(codesCol, where("uid", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as DiscountCode), code: d.id }))));
}
