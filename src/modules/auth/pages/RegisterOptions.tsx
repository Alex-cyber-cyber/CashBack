import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/styles.scss";

const RegisterOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      {/* Panel izquierdo igual que en Login */}
      <div className="auth-left-panel">
        <div className="brand-content">
          <h1 className="brand-title">
            Transforma tus compras en <span className="highlight">recompensas</span>
          </h1>
          <p className="brand-subtitle">
            Regístrate y empieza a acumular beneficios exclusivos.
          </p>
        </div>
      </div>

      {/* Panel derecho con opciones */}
      <div className="auth-right-panel">
        <div className="form-header">
          <h2 className="welcome-title">Elige tu tipo de cuenta</h2>
          <p className="welcome-subtitle">Selecciona cómo deseas registrarte</p>
        </div>

        <div className="options-container">
          <div
            className="option-card"
            onClick={() => navigate("/register/emprendedor")}
          >
            <h3 className="welcome-title">🚀 Soy Emprendedor</h3>
            <p className="brand-subtitle">
              Crea tu cuenta y haz crecer tu negocio.
            </p>
          </div>

          <div
            className="option-card"
            onClick={() => navigate("/register/cliente")}
          >
        <h3 className="welcome-title">🛍️ Soy Cliente</h3>
        <p className="brand-subtitle">
        Descubre productos únicos y gana recompensas en tus compras.
        </p>
        </div>
        </div>
        
       {/* Botón Volver */}
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ⬅ Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterOptions;