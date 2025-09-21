import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import "../../Styles/CanjePuntos.scss";

type Payload = {
  correo: string;
  identidad: string;
  totalFactura: number;
  totalPts: number;
};

type Props = {
  embedded?: boolean;
  currency?: string;
  pointsFormula?: (totalFactura: number) => number;
  onConfirm?: (payload: Payload) => Promise<void> | void;
};

export default function RegistroPuntosForm({
  embedded = false,
  currency = "L",
  pointsFormula = (total) => Math.max(0, Math.floor(total / 10)),
  onConfirm,
}: Props) {
  const uid = useId().replace(/:/g, "-");
  const modalId = `confirmRegistroModal-${uid}`;

  const [identidad, setIdentidad] = useState("");
  const [correo, setCorreo] = useState("");
  const [totalFactura, setTotalFactura] = useState("");
  const [saving, setSaving] = useState(false);

  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.info("[RegistroPuntosForm] has onConfirm?", !!onConfirm);
  }, [onConfirm]);

  // Accesibilidad: devolver el foco al botón que lo abrió
  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const onHidden = () => triggerBtnRef.current?.focus();
    el.addEventListener("hidden.bs.modal", onHidden);
    return () => el.removeEventListener("hidden.bs.modal", onHidden);
  }, []);

  // Validaciones
  const correoValido = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo), [correo]);
  const identidadValida = useMemo(() => /^\d{4}-\d{4}-\d{5}$/.test(identidad), [identidad]);

  const totalFacturaNum = useMemo(() => {
    const n = Number(totalFactura);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }, [totalFactura]);

  const totalFacturaValido = Number.isFinite(totalFacturaNum) && totalFacturaNum > 0;

  const totalPts = useMemo(
    () => (totalFacturaValido ? pointsFormula(totalFacturaNum) : 0),
    [totalFacturaNum, totalFacturaValido, pointsFormula]
  );

  const puedeContinuar = correoValido && identidadValida && totalFacturaValido;

  function handleReset() {
    setIdentidad("");
    setCorreo("");
    setTotalFactura("");
  }

  async function handleConfirm() {
    console.debug("[Form] Confirm clicked → puedeContinuar:", puedeContinuar, "onConfirm?", !!onConfirm);
    if (!puedeContinuar) return;

    const payload: Payload = { correo, identidad, totalFactura: totalFacturaNum, totalPts };

    try {
      setSaving(true);

      if (onConfirm) {
        await onConfirm(payload);
      } else {
        console.warn("[Form] onConfirm ausente: usando fallback repo (solo DEV)");
        const { createRegistroPuntos } = await import("../services/registroPuntos.repository");
        await createRegistroPuntos(payload);
      }

      console.info("[Form] Guardado OK");
      alert("Registro guardado ✅");

      // 1) Cerrar modal programáticamente
      const modalEl = modalRef.current as any;
      const Modal = (window as any).bootstrap?.Modal;
      if (modalEl && Modal) Modal.getOrCreateInstance(modalEl).hide();

      // 2) Limpiar formulario (después de cerrar el modal)
      handleReset();

    } catch (e: any) {
      console.error("[Form] ERROR en Confirm:", e?.code || e?.name, e?.message || e);
      alert(`Error al guardar: ${e?.message ?? "revisa consola"}`);
    } finally {
      setSaving(false);
    }
  }

  const wrapperClass = embedded ? "canje-form embedded" : "container my-4 canje-form";
  const totalFacturaMostrar = totalFacturaValido
    ? new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" }).format(totalFacturaNum)
    : `${currency} 0.00`;

  return (
    <div className={wrapperClass}>
      <div className={embedded ? "row g-4" : "row g-4 justify-content-center"}>
        {/* Formulario */}
        <div className={embedded ? "col-12 col-lg-7" : "col-12 col-md-10 col-lg-7"}>
          <div className="card shadow-sm">
            <div className="card-header">
              <h1 className="h5 mb-0">Registro de Puntos</h1>
            </div>

            <div className="card-body p-4">
              <form noValidate>
                {/* Identidad */}
                <div className="mb-3">
                  <label htmlFor={`identidad-${uid}`} className="form-label fw-semibold">Identidad</label>
                  <div className="input-group">
                    <span className="input-group-text">#</span>
                    <input
                      id={`identidad-${uid}`}
                      name="identidad"
                      type="text"
                      inputMode="numeric"
                      className={`form-control ${identidad && !identidadValida ? "is-invalid" : ""}`}
                      placeholder="0801-1990-12345"
                      value={identidad}
                      maxLength={15}
                      onChange={(e) => setIdentidad(e.target.value)}
                    />
                  </div>
                  <div className="form-text">Formato: ####-####-#####.</div>
                </div>

                {/* Correo */}
                <div className="mb-3">
                  <label htmlFor={`correo-${uid}`} className="form-label fw-semibold">Correo electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      id={`correo-${uid}`}
                      name="correo"
                      type="email"
                      className={`form-control ${correo && !correoValido ? "is-invalid" : ""}`}
                      placeholder="cliente@correo.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Total factura */}
                <div className="mb-3">
                  <label htmlFor={`totalFactura-${uid}`} className="form-label fw-semibold">Total factura</label>
                  <div className="input-group">
                    <span className="input-group-text">{currency}</span>
                    <input
                      id={`totalFactura-${uid}`}
                      name="totalFactura"
                      type="number"
                      min={0}
                      step="0.01"
                      className={`form-control ${totalFactura !== "" && !totalFacturaValido ? "is-invalid" : ""}`}
                      placeholder="0.00"
                      value={totalFactura}
                      onChange={(e) => setTotalFactura(e.target.value)}
                    />
                  </div>
                  <div className="form-text">Ingrese el monto total de la compra.</div>
                </div>

                {/* Total PTS */}
                <div className="mb-4">
                  <label htmlFor={`totalPts-${uid}`} className="form-label fw-semibold">Total PTS</label>
                  <div className="input-group">
                    <span className="input-group-text">PTS</span>
                    <input
                      id={`totalPts-${uid}`}
                      name="totalPts"
                      type="number"
                      className="form-control"
                      value={totalPts}
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="form-text">* Campo calculado automáticamente.</div>
                </div>

                {/* Acciones */}
                <div className="d-flex gap-2 justify-content-end">
                  <button type="reset" className="btn btn-light" onClick={handleReset} disabled={saving}>
                    Limpiar
                  </button>
                  <button
                    ref={triggerBtnRef}
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#${modalId}`}
                    disabled={!puedeContinuar || saving}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer small text-secondary">
              * Confirma para guardar el registro en la base de datos.
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className={embedded ? "col-12 col-lg-5" : "col-12 col-md-10 col-lg-5"}>
          <div className="card shadow-sm h-100">
            <div className="card-body p-4" aria-live="polite">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h6 m-0">Resumen del Registro</h2>
                <span className="badge bg-light text-secondary">Vista previa</span>
              </div>

              <div className="summary-tile">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar bg-primary-subtle rounded-circle" aria-hidden="true" />
                  <div>
                    <div className="fw-semibold">{correo ? correo.split("@")[0] : "Nombre del cliente"}</div>
                    <div className="text-secondary small">{correo || "cliente@correo.com"}</div>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat border rounded-3 p-3">
                      <div className="text-secondary small">Total factura</div>
                      <div className="fw-bold">{totalFacturaMostrar}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat border rounded-3 p-3">
                      <div className="text-secondary small">Total PTS</div>
                      <div className="fw-bold">{totalPts}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="stat border rounded-3 p-3 bg-light-subtle">
                      <div className="text-secondary small">Observaciones</div>
                      <div className="fw-medium">Datos listos para registrar.</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 small text-secondary">
                  <span className="me-1">Identidad:</span>
                  <span className="fw-semibold">{identidad || "—"}</span>
                </div>
              </div>

              <p className="small text-secondary mt-3 mb-0">
                Este panel refleja los datos ingresados y los puntos calculados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <div
        ref={modalRef}
        className="modal fade"
        id={modalId}
        aria-hidden="true"
        aria-labelledby={`${modalId}-label`}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id={`${modalId}-label`}>Confirmar registro</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
            </div>
            <div className="modal-body">
              Revise los datos antes de confirmar:
              <ul className="mt-2 mb-0">
                <li><span className="text-secondary">Cliente:</span> {correo ? correo.split("@")[0] : "—"}</li>
                <li><span className="text-secondary">Correo:</span> {correo || "—"}</li>
                <li><span className="text-secondary">Identidad:</span> {identidad || "—"}</li>
                <li><span className="text-secondary">Total factura:</span> {totalFacturaMostrar}</li>
                <li><span className="text-secondary">Total PTS:</span> {totalPts}</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal" disabled={saving}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={!puedeContinuar || saving}>
                {saving ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
