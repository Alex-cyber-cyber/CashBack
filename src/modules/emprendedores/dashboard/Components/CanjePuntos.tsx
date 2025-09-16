// src/modules/CanjePuntos/pages/CanjePuntosForm.tsx
import React, { useState } from "react";
import "../Components/Styles/CanjePuntos.scss";

type Props = {
  embedded?: boolean; // si lo incrustas dentro de otro panel
};

export default function CanjePuntosForm({ embedded = false }: Props) {
  // Estado mínimo solo para reflejar en el Resumen (UI/UX)
  const [identidad, setIdentidad] = useState("");
  const [correo, setCorreo] = useState("");
  const [puntos, setPuntos] = useState<number | "">("");

  // Wrapper para permitir versión embebida o página completa
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) =>
    embedded ? (
      <div className="canje-form embedded">{children}</div>
    ) : (
      <div className="container my-4 canje-form">{children}</div>
    );

  // helpers visuales
  const puntosMostrar = puntos === "" ? "—" : puntos;
  const puntosDisponibles = "—"; // placeholder hasta conectar con backend

  return (
    <Wrapper>
      <div className={embedded ? "row g-4" : "row g-4 justify-content-center"}>
        {/* Columna Formulario */}
        <div className={embedded ? "col-12 col-lg-7" : "col-12 col-md-10 col-lg-7"}>
          <div className="card shadow-sm">
            <div className="card-header">
              <h1 className="h5 mb-0">Canje de Puntos</h1>
            </div>

            <div className="card-body p-4">
              <form noValidate>
                {/* IDENTIDAD */}
                <div className="mb-3">
                  <label htmlFor="identidad" className="form-label fw-semibold">Identidad</label>
                  <div className="input-group">
                    <span className="input-group-text" id="identidad-addon">#</span>
                    <input
                      id="identidad"
                      name="identidad"
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      placeholder="0801-1990-12345"
                      aria-describedby="identidadHelp identidad-addon"
                      value={identidad}
                      onChange={(e) => setIdentidad(e.target.value)}
                    />
                  </div>
                  <div id="identidadHelp" className="form-text">
                    Formato sugerido: ####-####-#####.
                  </div>
                </div>

                {/* CORREO + VALIDAR */}
                <div className="mb-1">
                  <label htmlFor="correo" className="form-label fw-semibold">Correo electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text" id="correo-addon">@</span>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      className="form-control"
                      placeholder="cliente@correo.com"
                      aria-describedby="correoHelp correo-addon"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    data-bs-toggle="tooltip"
                    data-bs-title="Validar existencia del cliente"
                  >
                    Validar
                  </button>
                </div>

                {/* PUNTOS A CANJEAR */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-end">
                    <label htmlFor="puntos" className="form-label fw-semibold mb-0">
                      Puntos a canjear
                    </label>
                    <span className="small text-secondary">
                      Mín. 0 • Máx. disponible
                    </span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">PTS</span>
                    <input
                      id="puntos"
                      name="puntos"
                      type="number"
                      min={0}
                      step={1}
                      className="form-control"
                      placeholder="0"
                      aria-describedby="puntosHelp"
                      value={puntos}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPuntos(val === "" ? "" : Number(val));
                      }}
                    />
                  </div>
                  <div id="puntosHelp" className="form-text">
                    Ingrese la cantidad a canjear.
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="reset"
                    className="btn btn-light"
                    onClick={() => {
                      setIdentidad("");
                      setCorreo("");
                      setPuntos("");
                    }}
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmCanjeModal"
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

        {/* Columna Resumen (a la derecha) */}
        <div className={embedded ? "col-12 col-lg-5" : "col-12 col-md-10 col-lg-5"}>
          <div className="card shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h6 m-0">Resumen del Cliente</h2>
                <span className="badge bg-light text-secondary">Vista previa</span>
              </div>

              {/* Avatar + datos mínimos */}
              <div className="summary-tile">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar bg-primary-subtle rounded-circle" aria-hidden="true" />
                  <div>
                    <div className="fw-semibold">
                      {correo ? correo.split("@")[0] : "Nombre del cliente"}
                    </div>
                    <div className="text-secondary small">
                      {correo || "cliente@correo.com"}
                    </div>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat border rounded-3 p-3">
                      <div className="text-secondary small">Puntos disponibles</div>
                      <div className="fs-5 fw-bold">{puntosDisponibles}</div>
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
                        {correo
                          ? "Presione “Validar” para cargar datos del cliente."
                          : "Ingrese correo y valide para ver datos."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identidad visible en resumen */}
                <div className="mt-3 small text-secondary">
                  <span className="me-1">Identidad:</span>
                  <span className="fw-semibold">{identidad || "—"}</span>
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
      <div
        className="modal fade"
        id="confirmCanjeModal"
        aria-hidden="true"
        aria-labelledby="confirmCanjeLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="confirmCanjeLabel">
                Confirmar canje
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body">
              Revise los datos antes de confirmar:
              <ul className="mt-2 mb-0">
                <li>
                  <span className="text-secondary">Cliente:</span>{" "}
                  {correo ? correo.split("@")[0] : "—"}
                </li>
                <li>
                  <span className="text-secondary">Correo:</span> {correo || "—"}
                </li>
                <li>
                  <span className="text-secondary">Puntos a canjear:</span>{" "}
                  {puntosMostrar}
                </li>
                <li>
                  <span className="text-secondary">Identidad:</span>{" "}
                  {identidad || "—"}
                </li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
