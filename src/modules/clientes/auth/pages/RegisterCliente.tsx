import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/styles.scss";

const RegisterCliente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí iría la lógica de registro
  };

  return (
    <div className="auth-container">
      {/* Panel izquierdo */}
      <div className="auth-left-panel">
        <div className="brand-content">
          <h1 className="brand-title">
            🛍️ Únete como <span className="highlight">Cliente</span>
          </h1>
          <p className="brand-subtitle">
            Regístrate y comienza a disfrutar de cashback en tus compras favoritas.
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="auth-right-panel">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <h2 className="welcome-title">Registro de Cliente</h2>
            <p className="welcome-subtitle">Completa tus datos personales</p>
          </div>

          {/* Rejilla de 2 en 2 */}
          <div className="inputs-grid">
            <div className="input-group floating-input">
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Nombre completo</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Correo electrónico</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Teléfono (opcional)</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Contraseña</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Confirmar contraseña</label>
              <div className="input-highlight"></div>
            </div>

            {/* Espacio vacío para mantener la cuadrícula */}
            <div></div>
          </div>

          {/* Checkbox de términos y condiciones */}
          <div className="form-options" style={{marginTop: '2rem', justifyContent: 'flex-start'}}>
            <label className="remember-me">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="custom-checkbox"
                required
              />
              <span>Acepto los términos y condiciones</span>
            </label>
          </div>

          <button type="submit" className="login-button">
            Crear Cuenta
          </button>

          {/* Enlaces de navegación */}
          <div className="signup-link">
            <p>
              ¿Ya tienes una cuenta?{" "}
              <a 
                href="#" 
                className="signup-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Inicia sesión aquí
              </a>
            </p>
            <p style={{marginTop: '1rem'}}>
              <a 
                href="#" 
                className="signup-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
              
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCliente; 
