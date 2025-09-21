import { collection, getDocs, query, where, Timestamp, } from "firebase/firestore";
import { db } from "../../../../../../../firebase/firebase.config";
const SUBCOLLECTION_REGISTROS = "registrosPuntos";
const SUBCOLLECTION_CANJES = "canjesPuntos";
const TOPCOLLECTION_REGISTROS = "RegistrosPuntos";
const TOPCOLLECTION_CANJES = "CanjesPuntos";
const FALLBACK_LIMIT = 100;
const registroFieldCandidates = {
    cliente: [
        "cliente",
        "cliente.nombre",
        "clienteNombre",
        "nombreCliente",
        "usuario.nombre",
        "displayName",
    ],
    identidad: [
        "identidad",
        "cliente.identidad",
        "documento",
        "clienteDocumento",
        "dni",
    ],
    correo: [
        "correo",
        "cliente.correo",
        "email",
        "clienteEmail",
    ],
    comercio: [
        "comercio",
        "negocio",
        "nombreComercial",
        "empresa",
        "tienda",
    ],
    factura: [
        "factura",
        "numeroFactura",
        "facturaId",
        "factura.numero",
    ],
    total: ["total", "totalFactura", "monto", "valorFactura", "montoFactura"],
    puntos: ["puntos", "puntosGanados", "cantidad", "points", "puntosOtorgados"],
    estado: ["estado", "status", "situacion"],
    fecha: ["fecha", "fechaMovimiento", "fechaRegistro", "createdAt", "updatedAt"],
};
const canjeFieldCandidates = {
    cliente: registroFieldCandidates.cliente,
    identidad: registroFieldCandidates.identidad,
    correo: registroFieldCandidates.correo,
    premio: ["premio", "beneficio", "reward", "descripcion"],
    canal: ["canal", "channel", "origen", "medio"],
    puntos: ["puntos", "puntosCanjeados", "cantidad", "points"],
    valor: ["valor", "monto", "equivalente", "total"],
    estado: registroFieldCandidates.estado,
    fecha: ["fecha", "fechaMovimiento", "fechaCanje", "createdAt", "updatedAt"],
};
const POSSIBLE_OWNER_FIELDS = [
    "emprendedorId",
    "emprendedorID",
    "emprendedorUid",
    "emprendedorUID",
    "negocioId",
    "ownerId",
    "userId",
    "uid",
];
function getNestedValue(data, path) {
    const parts = path.split(".");
    let current = data;
    for (const part of parts) {
        if (current === null || typeof current !== "object")
            return undefined;
        current = current[part];
        if (current === undefined)
            return undefined;
    }
    return current;
}
function pickString(data, candidates, fallback = "") {
    for (const key of candidates) {
        const value = getNestedValue(data, key);
        if (typeof value === "string" && value.trim() !== "")
            return value.trim();
    }
    return fallback;
}
function pickNumber(data, candidates, fallback = 0) {
    for (const key of candidates) {
        const value = getNestedValue(data, key);
        if (typeof value === "number" && Number.isFinite(value))
            return value;
        if (typeof value === "string") {
            const parsed = Number(value.replace(/[^0-9.,-]/g, "").replace(",", "."));
            if (Number.isFinite(parsed))
                return parsed;
        }
    }
    return fallback;
}
function pickDate(data, candidates) {
    for (const key of candidates) {
        const value = getNestedValue(data, key);
        const date = normaliseDate(value);
        if (date)
            return date;
    }
    return new Date(0);
}
function normaliseDate(value) {
    if (!value)
        return null;
    if (value instanceof Date)
        return value;
    if (value instanceof Timestamp)
        return value.toDate();
    if (typeof value === "object" &&
        value !== null &&
        "seconds" in value &&
        typeof value.seconds === "number") {
        const seconds = value.seconds;
        const nanos = typeof value.nanoseconds === "number" ? value.nanoseconds : 0;
        return new Date(seconds * 1000 + nanos / 1_000_000);
    }
    if (typeof value === "string") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime()))
            return parsed;
    }
    if (typeof value === "number") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime()))
            return parsed;
    }
    return null;
}
function normaliseEstado(value, type) {
    const clean = value.trim().toLowerCase();
    if (!clean)
        return "pendiente";
    if (["acreditado", "aprobado", "completado", "confirmado", "activo"].includes(clean)) {
        return type === "registro" ? "acreditado" : "completado";
    }
    if (["pendiente", "en proceso", "validando", "procesando"].includes(clean))
        return "pendiente";
    if (["anulado", "cancelado", "rechazado", "fallido"].includes(clean)) {
        return type === "registro" ? "anulado" : "rechazado";
    }
    return "pendiente";
}
function mapRegistro(doc) {
    const data = doc.data();
    const estadoRaw = pickString(data, registroFieldCandidates.estado, "pendiente");
    return {
        id: doc.id,
        fecha: pickDate(data, registroFieldCandidates.fecha),
        cliente: pickString(data, registroFieldCandidates.cliente, "Sin nombre"),
        identidad: pickString(data, registroFieldCandidates.identidad, "—"),
        correo: pickString(data, registroFieldCandidates.correo, "—"),
        comercio: pickString(data, registroFieldCandidates.comercio, "—"),
        factura: pickString(data, registroFieldCandidates.factura, "—"),
        total: pickNumber(data, registroFieldCandidates.total, 0),
        puntos: Math.round(pickNumber(data, registroFieldCandidates.puntos, 0)),
        estado: normaliseEstado(estadoRaw || "pendiente", "registro"),
        raw: data ?? {},
    };
}
function mapCanje(doc) {
    const data = doc.data();
    const estadoRaw = pickString(data, canjeFieldCandidates.estado, "pendiente");
    return {
        id: doc.id,
        fecha: pickDate(data, canjeFieldCandidates.fecha),
        cliente: pickString(data, canjeFieldCandidates.cliente, "Sin nombre"),
        identidad: pickString(data, canjeFieldCandidates.identidad, "—"),
        correo: pickString(data, canjeFieldCandidates.correo, "—"),
        premio: pickString(data, canjeFieldCandidates.premio, "Beneficio"),
        canal: pickString(data, canjeFieldCandidates.canal, "—"),
        puntos: Math.round(pickNumber(data, canjeFieldCandidates.puntos, 0)),
        valor: pickNumber(data, canjeFieldCandidates.valor, 0),
        estado: normaliseEstado(estadoRaw || "pendiente", "canje"),
        raw: data ?? {},
    };
}
async function fetchFromSubcollection(emprendedorId, subPath, mapper, limit = FALLBACK_LIMIT) {
    const ref = collection(db, "Emprendedores", emprendedorId, subPath);
    const snapshot = await getDocs(ref);
    if (snapshot.empty)
        return [];
    return snapshot.docs.slice(0, limit).map(mapper);
}
async function fetchFromTopCollection(collectionName, emprendedorId, mapper, limit = FALLBACK_LIMIT) {
    const baseRef = collection(db, collectionName);
    let accumulated = [];
    for (const field of POSSIBLE_OWNER_FIELDS) {
        try {
            const q = query(baseRef, where(field, "==", emprendedorId));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                accumulated = snapshot.docs.slice(0, limit).map(mapper);
                break;
            }
        }
        catch (err) {
            continue;
        }
    }
    return accumulated;
}
export async function loadHistorialRegistros(emprendedorId, limit = FALLBACK_LIMIT) {
    const fromSub = await fetchFromSubcollection(emprendedorId, SUBCOLLECTION_REGISTROS, mapRegistro, limit);
    if (fromSub.length > 0) {
        return sortByDateDesc(fromSub).slice(0, limit);
    }
    const fallback = await fetchFromTopCollection(TOPCOLLECTION_REGISTROS, emprendedorId, mapRegistro, limit);
    return sortByDateDesc(fallback).slice(0, limit);
}
export async function loadHistorialCanjes(emprendedorId, limit = FALLBACK_LIMIT) {
    const fromSub = await fetchFromSubcollection(emprendedorId, SUBCOLLECTION_CANJES, mapCanje, limit);
    if (fromSub.length > 0) {
        return sortByDateDesc(fromSub).slice(0, limit);
    }
    const fallback = await fetchFromTopCollection(TOPCOLLECTION_CANJES, emprendedorId, mapCanje, limit);
    return sortByDateDesc(fallback).slice(0, limit);
}
function sortByDateDesc(items) {
    return [...items].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}
