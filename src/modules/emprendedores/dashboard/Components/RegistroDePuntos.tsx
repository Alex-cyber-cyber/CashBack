// src/modules/CanjePuntos/pages/RegistroPuntosForm.tsx
import React, { useEffect, useId, useMemo, useState } from "react";
import "../Components/Styles/CanjePuntos.scss";

type Props = {
  embedded?: boolean;
  currency?: string; // símbolo mostrado en UI, ej: "L", "$"
  pointsFormula?: (totalFactura: number) => number; // ej. Math.floor(total/10)
  onValidate?: (correo: string, identidad: string) => Promise<{ ok: boolean }>;
  onConfirm?: (payload: { correo: string; identidad: string; totalFactura: number; totalPts: number }) => Promise<void> | void;
};

export default function RegistroPuntosForm({
  embedded = false,
  currency = "L",
  pointsFormula = (total) => Math.max(0, Math.floor(total / 10)),
  onValidate,
  onConfirm,
}: Props) {
  const uid = useId().replace(/:/g, "-");
  const modalId = `confirmRegistroModal-${uid}`;

  const [identidad, setIdentidad] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [totalFactura, setTotalFactura] = useState<string>("");

  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState<"idle" | "ok" | "error">("idle");

  // Validaciones básicas
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

  
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    
    const instances = (window as any).bootstrap ? els.map((el) => new (window as any).bootstrap.Tooltip(el)) : [];
    return () => instances.forEach((i: any) => i.dispose());
  }, []);

  async function handleValidate() {
    if (!correoValido || !identidadValida) {
      setValidated("error");
      return;
    }
    if (!onValidate) {
      setValidated("ok");
      return;
    }
    try {
      setValidating(true);
      const res = await onValidate(correo, identidad);
      setValidated(res.ok ? "ok" : "error");
    } finally {
      setValidating(false);
    }
  }

  function handleReset() {
    setIdentidad("");
    setCorreo("");
    setTotalFactura("");
    setValidated("idle");
  }

  async function handleConfirm() {
    if (!puedeContinuar || !onConfirm) return;
    await onConfirm({ correo, identidad, totalFactura: totalFacturaNum, totalPts });
  }

  // Wrapper simplificado
  const wrapperClass = embedded ? "canje-form embedded" : "container my-4 canje-form";

  const totalFacturaMostrar = totalFacturaValido
    ? new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" }).format(totalFacturaNum)
    : `${currency} 0.00`;

  return (
    <div className={wrapperClass}>
      <div className={embedded ? "row g-4" : "row g-4 justify-content-center"}>
        {/* Columna Formulario */}
        <div className={embedded ? "col-12 col-lg-7" : "col-12 col-md-10 col-lg-7"}>
          <div className="card shadow-sm">
            <div className="card-header">
              <h1 className="h5 mb-0">Registro de Puntos</h1>
            </div>

            <div className="card-body p-4">
              <form noValidate>
                {/* IDENTIDAD */}
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

                {/* CORREO */}
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

                {/* TOTAL FACTURA */}
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

                {/* TOTAL PTS  */}
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

                {/* ACCIONES */}
                <div className="d-flex gap-2 justify-content-end">
                  <button type="reset" className="btn btn-light" onClick={handleReset}>
                    Limpiar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#${modalId}`}
                    disabled={!puedeContinuar}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer small text-secondary">
              * La validación y registro real se implementarán posteriormente.
            </div>
          </div>
        </div>

        {/* Columna Resumen */}
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
                      <div className="fw-medium">
                        {validated === "ok"
                          ? "Cliente validado. Puede continuar con el registro."
                          : "Ingrese identidad/correo y valide al cliente."}
                      </div>
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
      <div className="modal fade" id={modalId} aria-hidden="true" aria-labelledby={`${modalId}-label`} tabIndex={-1}>
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
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                disabled={!puedeContinuar}
                onClick={handleConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
