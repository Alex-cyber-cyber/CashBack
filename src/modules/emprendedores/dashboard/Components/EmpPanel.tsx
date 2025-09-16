import React from "react";
import { FiPlusCircle, FiGift, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EmpPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-4">
        <div className="card stat h-100 option-card">
          <div className="card-body text-center">
            <FiPlusCircle size={28} className="mb-2 highlight" />
            <h6>Registrar Puntos</h6>
            <p className="text-muted small">Agrega puntos a un cliente</p>
            <button className="btn btn-primary w-100" onClick={() => navigate("/emp/registrar")}>
              Registrar
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="card stat h-100 option-card">
          <div className="card-body text-center">
            <FiGift size={28} className="mb-2 highlight" />
            <h6>Canjear Puntos</h6>
            <p className="text-muted small">Permite usar puntos acumulados</p>
            <button className="btn btn-success w-100" onClick={() => navigate("/emp/CanjePuntos")}>
              Canjear
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="card stat h-100 option-card">
          <div className="card-body text-center">
            <FiClock size={28} className="mb-2 highlight" />
            <h6>Historial</h6>
            <p className="text-muted small">Revisa registros y canjes</p>
            <button className="btn btn-secondary w-100" onClick={() => navigate("/emp/historial")}>
              Ver historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpPanel;
