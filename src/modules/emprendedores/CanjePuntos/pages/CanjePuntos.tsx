// src/modules/CanjePuntos/pages/CanjePuntosForm.tsx
import React from "react";
import "../styles/CanjePuntos.scss"

type Props = {
  embedded?: boolean; // NUEVO: para usarlo dentro del panel derecho
};

export default function CanjePuntosForm({ embedded = false }: Props) {
  // Si es embebido, no uses container grande
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) =>
    embedded ? <div className="canje-form embedded">{children}</div> : <div className="container my-4 canje-form">{children}</div>;

  return (
    <Wrapper>
      <div className={embedded ? "" : "row justify-content-center"}>
        <div className={embedded ? "" : "col-12 col-md-10 col-lg-8"}>
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
                    <input id="identidad" name="identidad" type="text" inputMode="numeric"
                      className="form-control" placeholder="0801-1990-12345" aria-describedby="identidadHelp identidad-addon" />
                  </div>
                  <div id="identidadHelp" className="form-text">Formato sugerido: ####-####-#####.</div>
                </div>

                {/* CORREO + VALIDAR */}
                <div className="mb-1">
                  <label htmlFor="correo" className="form-label fw-semibold">Correo electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text" id="correo-addon">@</span>
                    <input id="correo" name="correo" type="email" className="form-control"
                      placeholder="cliente@correo.com" aria-describedby="correoHelp correo-addon" />
                  </div>
                </div>
                <div className="d-flex justify-content-end mb-3">
                  <button type="button" className="btn btn-outline-primary btn-sm"
                    data-bs-toggle="tooltip" data-bs-title="Validar existencia del cliente">
                    Validar
                  </button>
                </div>

                {/* PUNTOS */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-end">
                    <label htmlFor="puntos" className="form-label fw-semibold mb-0">Puntos a canjear</label>
                    <span className="small text-secondary">Mín. 0 • Máx. disponible</span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">PTS</span>
                    <input id="puntos" name="puntos" type="number" min={0} step={1}
                      className="form-control" placeholder="0" aria-describedby="puntosHelp" />
                  </div>
                  <div id="puntosHelp" className="form-text">Ingrese la cantidad a canjear.</div>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button type="reset" className="btn btn-light">Limpiar</button>
                  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#confirmCanjeModal">Continuar</button>
                </div>
              </form>
            </div>

            <div className="card-footer small text-secondary">
              * La validación real se implementará luego.
            </div>
          </div>
        </div>
      </div>

      {/* Modal (se mantiene igual) */}
      <div className="modal fade" id="confirmCanjeModal" aria-hidden="true" aria-labelledby="confirmCanjeLabel" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="confirmCanjeLabel">Confirmar canje</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
            </div>
            <div className="modal-body">
              Revise los datos antes de confirmar.
              <ul className="mt-2 mb-0">
                <li><span className="text-secondary">Cliente:</span> —</li>
                <li><span className="text-secondary">Correo:</span> —</li>
                <li><span className="text-secondary">Puntos a canjear:</span> —</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
