// src/modules/emprendedores/dashboard/pages/DashboardEmp.tsx
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiCreditCard, FiLogOut } from "react-icons/fi";
import { auth } from "../../../../../firebase/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const EmpDashboardLayout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null); // 👈 muy importante para que caiga en "Invitado"
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside className="sidebar bg-dark text-white p-3">
        <h4 className="text-center mb-4">Panel Empresarial</h4>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <Link to="/emp/panel" className="nav-link text-white d-flex align-items-center gap-2">
              <FiHome /> Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/emp/RegistroPuntos" className="nav-link text-white d-flex align-items-center gap-2">
              <FiUsers /> Registro Puntos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/emp/CanjePuntos" className="nav-link text-white d-flex align-items-center gap-2">
              <FiCreditCard /> Canje Puntos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/emp/historial" className="nav-link text-white d-flex align-items-center gap-2">
              <FiUsers /> Historial
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="m-0">Dashboard Empresarial</h5>

          <div className="user d-flex align-items-center gap-2">
            {/* Avatar con iniciales o "IN" */}
            <div
              className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "IN"}
            </div>

            {/* Info usuario */}
            <div className="d-none d-md-block text-end">
              <div className="fw-bold">{user ? user.email : "Invitado"}</div>
              <small className="text-muted-2">
                {user ? "Administrador" : "Visitante"}
              </small>
            </div>

            {/* Botón de logout (solo si hay usuario) */}
            {user && (
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <FiLogOut />
              </button>
            )}
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmpDashboardLayout;
