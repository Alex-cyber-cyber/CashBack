import React, { useEffect, useState } from 'react';
import "../Styles/styles.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import {  loginWithFacebook, loginWithGoogle, loginWithGithub, handleAuthRedirectResult } from '../services/auth.service';
import SocialButtons from '../components/SocialButtons';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../../../../../firebase/firebase.config'; 
import { getRedirectResult } from 'firebase/auth';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleAuthRedirectResult().catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoading && user) navigate("/dashboard", { replace: true });
  }, [user, isLoading, navigate]);

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleGoogleLogin = async () => { await loginWithGoogle(); };   // redirect
  const handleGithubLogin  = async () => { await loginWithGithub(); };  // redirect
  const handleFacebookLogin = async () => { await loginWithFacebook(); };// redirect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <button
          className="back-button"
          onClick={() => navigate("/register")}
        >
          <ChevronLeft size={48} color="white" />
        </button>
        <div className="brand-content">
          <h1 className="brand-title">Transforma tus compras en <span className="highlight">recompensas</span></h1>
          <p className="brand-subtitle">
            Cada vez que consumes en comercios afiliados, acumulas puntos que puedes canjear por beneficios exclusivos.
            <span className="pulse-animation"> ¡Empieza a disfrutar hoy!</span>
          </p>
          <div className="floating-rewards">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              <path d="M12 6V17.5" stroke="#a777e3" />
              <circle cx="12" cy="12" r="2" fill="#6e8efb" />
            </svg>

            <div className="floating-points">+500</div>
            <div className="floating-points">+200</div>
            <div className="floating-points">+100</div>
          </div>
        </div>
      </div>

      <div className="auth-right-panel">
        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-header">
            <h2 className="welcome-title">Bienvenido de vuelta</h2>
            <p className="welcome-subtitle">Ingresa tus credenciales para acceder</p>
          </div>

          <SocialButtons
            onGoogle={handleGoogleLogin}
            onGithub={handleGithubLogin}
            onFacebook={handleFacebookLogin}
          />
          <h1></h1>
          <div className="input-group floating-input">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=""
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
              placeholder=" "
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
            ¿No tienes una cuenta? <a href="/register/cliente" className="signup-button">Regístrate aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
