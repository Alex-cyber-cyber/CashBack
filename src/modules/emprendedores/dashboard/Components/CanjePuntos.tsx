// src/modules/CanjePuntos/pages/CanjePuntosForm.tsx
import React, { useId, useMemo, useState } from "react";
import "../Components/Styles/CanjePuntos.scss";

type ValidacionRespuesta = {
  ok: boolean;
  puntos?: number;
};

type ConfirmacionPayload = {
  correo: string;
  identidad: string;
  codigo: string;
  puntos: number;
};

type Props = {
  embedded?: boolean;
  puntosDisponibles?: number;
  onValidate?: (correo: string, identidad: string, codigo: string) => Promise<ValidacionRespuesta>;
  onConfirm?: (payload: ConfirmacionPayload) => Promise<void> | void;
};

export default function CanjePuntosForm({
  embedded = false,
  puntosDisponibles: puntosDisponiblesProp,
  onValidate,
  onConfirm,
}: Props) {
  // IDs únicos (evita ":" para atributos HTML)
  const uid = useId().replace(/:/g, "-");
  const modalId = `confirmCanjeModal-${uid}`;

  // ----- Estado del formulario -----
  const [identidad, setIdentidad] = useState("");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState(""); // NUEVO: Código de Canje
  const [puntos, setPuntos] = useState("");

  // Estado de validación remota / puntos disponibles
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState<"idle" | "ok" | "error">("idle");
  const [pDisp, setPDisp] = useState<number | undefined>(puntosDisponiblesProp);

  // ----- Reglas & validaciones locales -----
  const correoValido = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo), [correo]);

  // Formato HN típico: 4-4-5 dígitos (permite guiones)
  const identidadValida = useMemo(() => /^\d{4}-\d{4}-\d{5}$/.test(identidad), [identidad]);

  // Código alfanumérico 6–12 (insensible a mayúsculas). Ajusta el rango según negocio.
  const codigoValido = useMemo(() => /^[A-Z0-9]{6,12}$/i.test(codigo.trim()), [codigo]);

  const puntosNum = useMemo(() => {
    const n = Number(puntos);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : NaN;
  }, [puntos]);

  const puntosValidos = Number.isFinite(puntosNum);
  const dentroDeDisponibles = pDisp === undefined || (puntosValidos && puntosNum <= pDisp);

  const puedeContinuar =
    correoValido && identidadValida && codigoValido && puntosValidos && dentroDeDisponibles;

  // ----- Acciones -----
  async function handleValidate() {
    // Validación local previa
    if (!correoValido || !identidadValida || !codigoValido) {
      setValidated("error");
      return;
    }
    // Si no hay validación remota, considera ok
    if (!onValidate) {
      setValidated("ok");
      return;
    }
    try {
      setValidating(true);
      const res = await onValidate(correo, identidad, codigo.trim());
      setValidated(res.ok ? "ok" : "error");
      if (res.ok && typeof res.puntos === "number") setPDisp(res.puntos);
    } finally {
      setValidating(false);
    }
  }

  function handleReset() {
    setIdentidad("");
    setCorreo("");
    setCodigo("");
    setPuntos("");
    setValidated("idle");
    setPDisp(puntosDisponiblesProp);
  }

  async function handleConfirm() {
    if (!puedeContinuar || !onConfirm) return;
    await onConfirm({
      correo,
      identidad,
      codigo: codigo.trim().toUpperCase(),
      puntos: puntosNum,
    });
  }

  // ----- Presentación -----
  const wrapperClass = embedded ? "canje-form embedded" : "container my-4 canje-form";
  const puntosDispMostrar = typeof pDisp === "number" ? pDisp : "—";
  const puntosMostrar = puntos === "" ? "—" : puntos;

  // Nombre visible en resumen (antes del @)
  const aliasCliente = correo ? correo.split("@")[0] : "Nombre del cliente";

  return (
    <div className={wrapperClass}>
      <div className={embedded ? "row g-4" : "row g-4 justify-content-center"}>
        {/* Formulario */}
        <div className={embedded ? "col-12 col-lg-7" : "col-12 col-md-10 col-lg-7"}>
          <div className="card shadow-sm">
            <div className="card-header">
              <h1 className="h5 mb-0">Canje de Puntos</h1>
            </div>

            <div className="card-body p-4">
              <form noValidate>
                {/* IDENTIDAD */}
                <div className="mb-3">
                  <label htmlFor={`identidad-${uid}`} className="form-label fw-semibold">
                    Identidad
                  </label>
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
                      aria-describedby={`identidad-help-${uid}`}
                    />
                  </div>
                  <div id={`identidad-help-${uid}`} className="form-text">
                    Formato: ####-####-#####.
                  </div>
                </div>

                {/* CORREO */}
                <div className="mb-3">
                  <label htmlFor={`correo-${uid}`} className="form-label fw-semibold">
                    Correo electrónico
                  </label>
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

                {/* CÓDIGO DE CANJE */}
                <div className="mb-3">
                  <label htmlFor={`codigo-${uid}`} className="form-label fw-semibold">
                    Código de Canje de Puntos
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">COD</span>
                    <input
                      id={`codigo-${uid}`}
                      name="codigo"
                      type="text"
                      className={`form-control ${codigo && !codigoValido ? "is-invalid" : ""}`}
                      placeholder="ABC123"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      autoComplete="one-time-code"
                      inputMode="text"
                      maxLength={12}
                    />
                  </div>
                  <div className="form-text">Use 6 a 12 caracteres alfanuméricos (A–Z, 0–9).</div>
                </div>

                {/* VALIDAR */}
                <div className="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    className={`btn btn-outline-${validated === "ok" ? "success" : "primary"} btn-sm`}
                    onClick={handleValidate}
                    disabled={validating || !correoValido || !identidadValida || !codigoValido}
                    aria-live="polite"
                  >
                    {validating ? "Validando…" : validated === "ok" ? "✓ Validado" : "Validar"}
                  </button>
                </div>

                {/* PUNTOS */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-end">
                    <label htmlFor={`puntos-${uid}`} className="form-label fw-semibold mb-0">
                      Puntos a canjear
                    </label>
                    <span className="small text-secondary">Mín. 0 • Máx. disponible</span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">PTS</span>
                    <input
                      id={`puntos-${uid}`}
                      name="puntos"
                      type="number"
                      min={0}
                      step={1}
                      className={`form-control ${puntos !== "" && !puntosValidos ? "is-invalid" : ""}`}
                      placeholder="0"
                      value={puntos}
                      onChange={(e) => setPuntos(e.target.value)}
                    />
                  </div>
                  <div className="form-text">Ingrese la cantidad a canjear.</div>
                  {!dentroDeDisponibles && (
                    <div className="text-danger small mt-1">Excede los puntos disponibles.</div>
                  )}
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
              * La validación y carga de datos reales se implementarán posteriormente.
            </div>
          </div>
        </div>

        {/* Resumen (siempre visible) */}
        <div className={embedded ? "col-12 col-lg-5" : "col-12 col-md-10 col-lg-5"}>
          <div className="card shadow-sm h-100">
            <div className="card-body p-4" aria-live="polite">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h6 m-0">Resumen del Cliente</h2>
                <span className="badge bg-light text-secondary">Vista previa</span>
              </div>

              <div className="summary-tile">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar bg-primary-subtle rounded-circle" aria-hidden="true" />
                  <div>
                    <div className="fw-semibold">{aliasCliente}</div>
                    <div className="text-secondary small">{correo || "cliente@correo.com"}</div>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat border rounded-3 p-3">
                      <div className="text-secondary small">Puntos disponibles</div>
                      <div className="fs-5 fw-bold">{puntosDispMostrar}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="stat border rounded-3 p-3">
                      <div className="text-secondary small">Puntos a canjear</div>
                      <div className="fs-5 fw-bold">{puntosMostrar}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="stat border rounded-3 p-3 bg-light-subtle">
                      <div className="text-secondary small">Observaciones</div>
                      <div className="fw-medium">
                        {validated === "ok"
                          ? "Cliente validado. Puede continuar con el canje."
                          : "Presione “Validar” para cargar y confirmar datos del cliente."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 small text-secondary">
                  <div>
                    <span className="me-1">Identidad:</span>
                    <span className="fw-semibold">{identidad || "—"}</span>
                  </div>
                  <div>
                    <span className="me-1">Código de Canje:</span>
                    <span className="fw-semibold">{codigo || "—"}</span>
                  </div>
                </div>
              </div>

              <p className="small text-secondary mt-3 mb-0">
                Este panel mostrará los datos reales una vez se valide el cliente.
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
              <h2 className="modal-title h5" id={`${modalId}-label`}>Confirmar canje</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
            </div>
            <div className="modal-body">
              Revise los datos antes de confirmar:
              <ul className="mt-2 mb-0">
                <li>
                  <span className="text-secondary">Cliente:</span> {aliasCliente}
                </li>
                <li>
                  <span className="text-secondary">Correo:</span> {correo || "—"}
                </li>
                <li>
                  <span className="text-secondary">Identidad:</span> {identidad || "—"}
                </li>
                <li>
                  <span className="text-secondary">Código de Canje:</span> {codigo || "—"}
                </li>
                <li>
                  <span className="text-secondary">Puntos a canjear:</span> {puntosMostrar}
                </li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>
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
