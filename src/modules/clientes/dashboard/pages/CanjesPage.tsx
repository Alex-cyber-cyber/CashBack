// src/modules/clientes/dashboard/pages/CanjesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiCopy, FiPlusCircle, FiRefreshCcw, FiShield, FiXCircle } from "react-icons/fi";

// Estilos (usa la misma paleta del dashboard de clientes)
import "../Styles/canjes.scss";

// Auth hook (ajústalo si tu proyecto lo expone en otra ruta)
import { useAuth } from "../../auth/hooks/useAuth";

// Servicios de Firestore para wallet y códigos
import {
  createDiscountCode,
  ensureWallet,
  listenMyCodes,
  listenWallet,
  type DiscountCode,
  type Wallet,
} from "../services/codes.service";

/** Formateador de moneda Lempiras (HNL) */
const fmtMoney = (v: number) =>
  new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    maximumFractionDigits: 2,
  }).format(v);

const CanjesPage: React.FC = () => {
  const { user } = useAuth();
  const uid = user?.uid ?? "";

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [rows, setRows] = useState<DiscountCode[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const saldo = wallet?.cashbackBalance ?? 0;
  const amountNum = useMemo(() => Number.parseFloat((amount || "0").replace(",", ".")), [amount]);
  const validAmount = Number.isFinite(amountNum) && amountNum > 0 && amountNum <= saldo;

  useEffect(() => {
    if (!uid) return;
    ensureWallet(uid);
    const unsubW = listenWallet(uid, setWallet);
    const unsubC = listenMyCodes(uid, setRows);
    return () => {
      unsubW?.();
      unsubC?.();
    };
  }, [uid]);

  async function handleGenerate() {
    if (!uid || !validAmount) return;
    try {
      setBusy(true);
      const code = await createDiscountCode(uid, amountNum, 120);
      alert(`Código generado: ${code}\nCompártelo con el emprendedor para canjear.`);
      setAmount("");
    } catch (e: any) {
      alert(e?.message ?? "No se pudo generar el código.");
    } finally {
      setBusy(false);
    }
  }

  function copy(t: string) {
    navigator.clipboard.writeText(t);
  }

  return (

    <div className="canjes-page container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Historial de canjes</h3>
        <button className="btn btn-client-outline btn-sm" onClick={() => window.location.reload()}>
          <FiRefreshCcw /> Refrescar
        </button>
      </div>

      {/* Tarjeta: Saldo + Generar */}
      <div className="card mb-4 saldo-card">
        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="saldo-label">Saldo disponible</div>
            <div className="saldo-valor m-0">{fmtMoney(saldo)}</div>
          </div>

          <div className="flex-grow-1" />

          {/* Caja glass para contraste del input/botón */}
          <div className="gen-box d-flex gap-2 align-items-end">
            <div>
              <label className="form-label m-0">Monto a generar</label>
              <input
                inputMode="decimal"
                className="form-control"
                placeholder="Ej. 250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {!validAmount && amount && (
                <div className="form-text text-danger">Monto inválido o mayor al saldo.</div>
              )}
            </div>

            <button
              className="btn btn-client d-flex align-items-center gap-2"
              disabled={!validAmount || busy}
              onClick={handleGenerate}
              title="Generar código de descuento"
            >
              <FiPlusCircle /> Generar código
            </button>
          </div>
        </div>

        <div className="small px-3 pb-3 d-flex align-items-center gap-2">
          <FiShield />
          Al generar el código, el monto se descuenta de tu saldo. El código vence en 120 minutos si no se canjea.
        </div>
      </div>

      {/* Tabla de códigos */}
      <div className="card client-card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Monto</th>
                  <th>Válido</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Vence</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      Aún no has generado códigos.
                    </td>
                  </tr>
                )}

                {rows.map((r) => {
                  const created =
                    typeof (r.createdAt as any)?.toDate === "function"
                      ? (r.createdAt as any).toDate().toLocaleString()
                      : "-";
                  const expires =
                    typeof (r.expiresAt as any)?.toDate === "function"
                      ? (r.expiresAt as any).toDate().toLocaleString()
                      : "-";

                  return (
                    <tr key={r.code}>
                      <td className="fw-semibold">{r.code}</td>
                      <td>{fmtMoney(r.amount)}</td>
                      <td>
                        <span className={`chip ${r.isValid ? "ok" : "bad"}`}>
                          {r.isValid ? (
                            <>
                              <FiCheckCircle /> Válido
                            </>
                          ) : (
                            <>
                              <FiXCircle /> Inválido
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="chip info text-capitalize">{r.status}</span>
                      </td>
                      <td>{created}</td>
                      <td>{expires}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => copy(r.code)}>
                          <FiCopy /> Copiar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="small note">
            * <b>Válido</b> indica si el código puede ser canjeado por un emprendedor. Al canjearse, pasará a{" "}
            <b>redeemed</b> (se implementa en la etapa de Emprendedor).
          </div>
        </div>
      </div>
    </div>

  );
};

export default CanjesPage;
