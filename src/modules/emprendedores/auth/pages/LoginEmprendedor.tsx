// src/modules/emprendedores/auth/pages/LoginEmprendedor.tsx
import React, { useState } from 'react';
import "../Styles/loginEmprendedor.scss";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";

const LoginEmprendedor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Verificar perfil en Firestore
      const ref = doc(db, "Emprendedores", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Perfil de emprendedor no encontrado 🚨");
        await auth.signOut();
        return;
      }

      const perfil = snap.data() as { role?: string };
      const role = String(perfil.role || "").toLowerCase();

      if (role === "emprendedor") {
        // ✅ usa la base que YA tienes configurada: /emp
        navigate("/emp/panel", { replace: true });
        // o: navigate("/emp", { replace: true }); si el index muestra el panel
      } else {
        alert("No tienes permisos para acceder como emprendedor 🚫");
        await auth.signOut();
      }
    } catch (err: any) {
      console.error(err);
      alert("Error al iniciar sesión: " + (err?.message ?? "intenta de nuevo"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-emprendedor">
      <div className="auth-left-panel-emprendedor">
        <button className="back-button" onClick={() => navigate("/register")}>
          <ChevronLeft size={48} color="white" />
        </button>

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
            <div className="input-highlight" />
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
            <div className="input-highlight" />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" className="custom-checkbox" />
              <label htmlFor="remember">Recuérdame</label>
            </div>
            <a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? <span className="button-loader" /> : 'Iniciar sesión'}
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
