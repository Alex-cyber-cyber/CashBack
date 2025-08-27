import React, { useState } from "react";
import "../Styles/styles.scss";

const RegisterEmprendedor = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
    password: "",
    nombreNegocio: "",
    categoria: "",
    ubicacion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <div className="auth-container">
      {/* Panel izquierdo */}
      <div className="auth-left-panel">
        <div className="brand-content">
          <h1 className="brand-title">
            🚀 Registra tu <span className="highlight">emprendimiento</span>
          </h1>
          <p className="brand-subtitle">
            Llena los datos y empieza a crecer con nosotros.
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="auth-right-panel">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <h2 className="welcome-title">Registro Emprendedor</h2>
            <p className="welcome-subtitle">Completa la información básica</p>
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
                required
              />
              <label>Teléfono</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Contraseña</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="text"
                name="nombreNegocio"
                value={formData.nombreNegocio}
                onChange={handleChange}
                required
              />
              <label>Nombre del emprendimiento</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="alimentacion">Alimentación</option>
                <option value="tecnologia">Tecnología</option>
                <option value="moda">Moda</option>
                <option value="servicios">Servicios</option>
                <option value="otros">Otros</option>
              </select>
              <label>Categoría</label>
              <div className="input-highlight"></div>
            </div>

            <div className="input-group floating-input">
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
              />
              <label>Ubicación</label>
              <div className="input-highlight"></div>
            </div>
          </div>

          <button type="submit" className="login-button">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterEmprendedor;
