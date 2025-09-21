import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle, FiCopy, FiPlusCircle, FiRefreshCcw, FiShield, FiXCircle
} from "react-icons/fi";

import "../../../Styles/canjes.scss";
import { useAuth } from "../../../../auth/hooks/useAuth";
import type { DiscountCode, Wallet } from "../types/code";

import {
  asegurarCartera,
  escucharCartera,
  escucharMisCodigos,
  generarCodigoLegible,
  crearCodigoManual,
  recalcularCarteraDesdeRegistros,
} from "../services/codes.service";

/** Formateo moneda HNL */
const fmtMoney = (v: number) =>
  new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL", maximumFractionDigits: 2 }).format(v);

const CanjesPage: React.FC = () => {
  const { user } = useAuth();
  const uid = user?.uid ?? "";

  // ----- Estado principal -----
  const [cartera, setCartera] = useState<Wallet | null>(null);
  const [codigos, setCodigos] = useState<DiscountCode[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorUi, setErrorUi] = useState<string | null>(null);

  // ----- Modal -----
  const [mostrar, setMostrar] = useState(false);
  const [codigoInput, setCodigoInput] = useState("");
  const [montoInput, setMontoInput] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cálculos
  const saldo = cartera?.cashbackBalance ?? 0;
  const montoNum = useMemo(() => Number.parseFloat((montoInput || "0").replace(",", ".")), [montoInput]);
  const montoValido = Number.isFinite(montoNum) && montoNum > 0 && montoNum <= saldo;

  // Fechas del modal (solo visuales)
  const creadoAhora = useMemo(() => new Date(), [mostrar]);
  const venceEn = useMemo(() => new Date(creadoAhora.getTime() + 120 * 60_000), [creadoAhora]);

  // ----- Efecto: abrir listeners cuando hay UID -----
  useEffect(() => {
    if (!uid) return;

    let offCartera: (() => void) | undefined;
    let offCodigos: (() => void) | undefined;

    setCargando(true);
    setErrorUi(null);

    // Asegura doc cartera y escucha
    asegurarCartera(uid)
      .then(() => {
        offCartera = escucharCartera(
          uid,
          (w) => {
            setCartera(w);
            setCargando(false);
          },
          (err) => {
            setErrorUi("No se pudo leer tu saldo (cartera).");
            setCargando(false);
          }
        );

        // Codigos
        offCodigos = escucharMisCodigos(
          uid,
          (rows) => setCodigos(rows),
          (err: any) => {
            // Si falta índice, Firestore lanza failed-precondition
            if (err?.code === "failed-precondition") {
              setErrorUi("Falta crear el índice de Firestore (uid + createdAt). Ábrelo desde el link de la consola.");
            } else if (err?.code === "permission-denied") {
              setErrorUi("Permisos insuficientes para leer tus códigos.");
            } else {
              setErrorUi("No se pudo leer tus códigos.");
            }
          }
        );
      })
      .catch(() => {
        setErrorUi("No se pudo preparar tu cartera.");
        setCargando(false);
      });

    return () => {
      offCartera?.();
      offCodigos?.();
    };
  }, [uid]);

  // ----- Acciones UI -----
  const abrirModal = () => {
    setCodigoInput("");
    setMontoInput("");
    setMostrar(true);
  };
  const cerrarModal = () => {
    if (!guardando) setMostrar(false);
  };
  const copiar = (t: string) => navigator.clipboard.writeText(t);

  const refrescarCartera = async () => {
    if (!uid) return;
    setCargando(true);
    setErrorUi(null);
    try {
      await recalcularCarteraDesdeRegistros(uid);
    } catch {
      setErrorUi("No se pudo recalcular tu cartera.");
    } finally {
      setCargando(false);
    }
  };

  const enviarModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    if (!montoValido) {
      alert("Monto inválido o mayor al saldo.");
      return;
    }
    if (!codigoInput.trim()) {
      alert("Escribe un código.");
      return;
    }

    try {
      setGuardando(true);
      await crearCodigoManual(uid, codigoInput, montoNum, 120);
      setMostrar(false);
    } catch (err: any) {
      alert(err?.message ?? "No se pudo generar el código.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="canjes-page container py-4">
      {/* Encabezado */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Historial de canjes</h3>

        <button className="btn btn-client-outline btn-sm" onClick={refrescarCartera}>
          <FiRefreshCcw /> Refrescar
        </button>
      </div>

      {/* Saldo + botón */}
      <div className="card mb-4 saldo-card">
        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="saldo-label">
              Saldo disponible
              {cargando && <span className="ms-2 small text-muted">Sincronizando…</span>}
            </div>
            <div className="saldo-valor m-0">{fmtMoney(saldo)}</div>

            {/* Si quieres mostrar “este mes” reutiliza tu cálculo mensual aquí */}
            <div className="small text-muted mt-1">
              Este mes: <b>{fmtMoney(saldo)}</b>
            </div>
          </div>

          <div className="flex-grow-1" />

          <button className="btn btn-client d-flex align-items-center gap-2" onClick={abrirModal} disabled={cargando}>
            <FiPlusCircle /> Generar código
          </button>
        </div>

        <div className="small px-3 pb-3 d-flex align-items-center gap-2">
          <FiShield />
          Al generar el código, el monto se descuenta de tu saldo. El código vence en 120 minutos si no se canjea.
        </div>
      </div>

      {/* Tabla */}
      <div className="card client-card">
        <div className="card-body">
          {errorUi && <div className="alert alert-warning py-2">{errorUi}</div>}

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
                {codigos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      Aún no has generado códigos.
                    </td>
                  </tr>
                )}

                {codigos.map((r) => {
                  const creado =
                    typeof (r.createdAt as any)?.toDate === "function"
                      ? (r.createdAt as any).toDate().toLocaleString()
                      : "-";
                  const vence =
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
                        <span className="chip info text-capitalize">
                          {r.status === "generated" ? "En espera de canje" : r.status}
                        </span>
                      </td>
                      <td>{creado}</td>
                      <td>{vence}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => copiar(r.code)}>
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

      {/* Modal */}
      {mostrar && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <form onSubmit={enviarModal}>
                  <div className="modal-header">
                    <h5 className="modal-title">Generar código</h5>
                    <button type="button" className="btn-close" onClick={cerrarModal} aria-label="Cerrar" />
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="form-label">Código</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            placeholder="Ej. SW-ABCD-1234"
                            value={codigoInput}
                            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setCodigoInput(generarCodigoLegible())}
                            title="Sugerir código"
                          >
                            Sugerir
                          </button>
                        </div>
                        <div className="form-text">Letras, números y guiones. 6–24 caracteres.</div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <label className="form-label">Monto</label>
                        <input
                          inputMode="decimal"
                          className="form-control"
                          placeholder="Ej. 250"
                          value={montoInput}
                          onChange={(e) => setMontoInput(e.target.value)}
                        />
                        {!montoValido && montoInput && (
                          <div className="form-text text-danger">Monto inválido o mayor al saldo.</div>
                        )}
                        <div className="form-text">Saldo disponible: {fmtMoney(saldo)}</div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <label className="form-label">Válido</label>
                        <input className="form-control" value="Sí" disabled />
                      </div>

                      <div className="col-12 col-sm-6">
                        <label className="form-label">Estado</label>
                        <input className="form-control" value="En espera de canje" disabled />
                      </div>

                      <div className="col-12 col-sm-6">
                        <label className="form-label">Creado</label>
                        <input className="form-control" value={creadoAhora.toLocaleString()} disabled />
                      </div>

                      <div className="col-12 col-sm-6">
                        <label className="form-label">Vence</label>
                        <input className="form-control" value={venceEn.toLocaleString()} disabled />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-light border" onClick={cerrarModal} disabled={guardando}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-client" disabled={!montoValido || !codigoInput || guardando}>
                      {guardando ? "Guardando..." : "Confirmar generación"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default CanjesPage;
