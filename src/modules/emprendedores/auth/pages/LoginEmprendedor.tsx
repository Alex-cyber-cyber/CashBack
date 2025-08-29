import React, { useState } from 'react';
import "../Styles/loginEmprendedor.scss"; 

const LoginEmprendedor = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container-emprendedor">
      <div className="auth-left-panel-emprendedor">
        <div className="brand-content">
          <h1 className="brand-title">
            Transforma y dale nueva vida a tu <span className="highlight">emprendimiento</span>
          </h1>
          <p className="brand-subtitle">
            Crea, innova y crece con nosotros. Tu proyecto merece brillar.
          </p>
        </div>
      </div>

      <div className="auth-right-panel-emprendedor">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <h2 className="welcome-title">Bienvenido Emprendedor</h2>
            <p className="welcome-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="input-group floating-input">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
              required
            />
            <label htmlFor="email">Email</label>
            <div className="input-highlight"></div>
          </div>

          <div className="input-group floating-input">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              required
            />
            <label htmlFor="password">Contraseña</label>
            <div className="input-highlight"></div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" className="custom-checkbox" />
              <label htmlFor="remember">Recuérdame</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          <div className="signup-link">
            ¿No tienes una cuenta? <a href="/register/emprendedor" className="signup-button">Regístrate aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginEmprendedor;
