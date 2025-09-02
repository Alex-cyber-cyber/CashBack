import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "../Styles/RegistroEmprendedor.scss";

interface FormData {
  nombrePropietario: string;
  email: string;
  telefono: string;
  password: string;
  confirmarPassword: string;
  nombreComercial: string;
  razonSocial: string;
  rtn: string;
  categoria: string;
  descripcion: string;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  logo: File | null;
}

const RegisterEmprendedor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nombrePropietario: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
    nombreComercial: "",
    razonSocial: "",
    rtn: "",
    categoria: "",
    descripcion: "",
    pais: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    logo: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden 🚨");
      return;
    }

    console.log("Datos enviados:", formData);
  };

  return (
    <div className="register-emprendedor">
      <div className="auth-container">
      
        <div className="auth-left-panel">
          <button
            className="back-button"
            onClick={() => navigate("/login/emprendedor")}
          >
            <ChevronLeft size={48} color="white" />
          </button>

          <div className="brand-content">
            <h1 className="brand-title">
              🚀 Registra tu <span className="highlight">emprendimiento</span>
            </h1>
            <p className="brand-subtitle">
              Llena los datos y empieza a crecer con nosotros.
            </p>
          </div>
        </div>


        <div className="auth-right-panel">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-header">
              <h2 className="welcome-title">Registro Emprendedor</h2>
              <p className="welcome-subtitle">
                Completa la información básica
              </p>
            </div>

     
            <h3 className="section-title">Cuenta y contacto</h3>
            <div className="inputs-grid">
              <div className="input-group floating-input">
                <input
                  type="text"
                  name="nombrePropietario"
                  placeholder=" "
                  value={formData.nombrePropietario}
                  onChange={handleChange}
                  required
                />
                <label>Nombre del propietario / representante</label>
                <div className="input-highlight"></div>
              </div>

              <div className="input-group floating-input">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
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
                  placeholder=" "
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
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label>Contraseña</label>
                <div className="input-highlight"></div>
              </div>

              <div className="input-group floating-input">
                <input
                  type="password"
                  name="confirmarPassword"
                  placeholder=" "
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  required
                />
                <label>Confirmar contraseña</label>
                <div className="input-highlight"></div>
              </div>
            </div>

            
           <h3 className="section-title">Datos del negocio</h3>
<div className="inputs-grid">
  <div className="input-group floating-input">
    <input
      type="text"
      name="nombreComercial"
      placeholder=" "
      value={formData.nombreComercial}
      onChange={handleChange}
      required
    />
    <label>Nombre comercial</label>
    <div className="input-highlight"></div>
  </div>

  <div className="input-group floating-input">
    <input
      type="text"
      name="razonSocial"
      placeholder=" "
      value={formData.razonSocial}
      onChange={handleChange}
      required
    />
    <label>Razón social</label>
    <div className="input-highlight"></div>
  </div>

  <div className="input-group floating-input">
    <input
      type="text"
      name="rtn"
      placeholder=" "
      value={formData.rtn}
      onChange={handleChange}
      required
    />
    <label>RTN / ID tributario</label>
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
    <label>Categoría del negocio</label>
    <div className="input-highlight"></div>
  </div>
  <div className="input-group floating-input full-width">
    <textarea
      name="descripcion"
      placeholder=" "
      value={formData.descripcion}
      onChange={handleChange}
      required
    />
    <label>Descripción del negocio</label>
    <div className="input-highlight"></div>
  </div>

  <div className="input-group floating-input">
    <input
      type="text"
      name="pais"
      placeholder=" "
      value={formData.pais}
      onChange={handleChange}
      required
    />
    <label>País</label>
    <div className="input-highlight"></div>
  </div>

  <div className="input-group floating-input">
    <select
      name="departamento"
      value={formData.departamento}
      onChange={handleChange}
      required
    >
      <option value="">Selecciona un departamento</option>
      <option value="francisco-morazan">Francisco Morazán</option>
      <option value="cortes">Cortés</option>
      <option value="atlantida">Atlántida</option>
      <option value="choluteca">Choluteca</option>
      <option value="otros">Otros</option>
    </select>
    <label>Departamento</label>
    <div className="input-highlight"></div>
  </div>

  <div className="input-group floating-input">
    <input
      type="text"
      name="ciudad"
      placeholder=" "
      value={formData.ciudad}
      onChange={handleChange}
      required
    />
    <label>Ciudad</label>
    <div className="input-highlight"></div>
  </div>

  <div className="input-group floating-input">
    <input
      type="text"
      name="direccion"
      placeholder=" "
      value={formData.direccion}
      onChange={handleChange}
      required
    />
    <label>Dirección</label>
    <div className="input-highlight"></div>
  </div>
  <div className="input-group full-width">
    <input
      type="file"
      name="logo"
      accept="image/*"
      onChange={handleChange}
    />
    <label>Logo del negocio</label>
  </div>
</div>

            <button type="submit" className="login-button">
              Registrarme
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmprendedor;
