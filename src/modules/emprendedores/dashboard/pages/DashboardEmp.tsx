import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  FiPlusCircle, FiGift, FiClock, FiSettings,
  FiBell, FiSearch, FiMoon, FiSun, FiMenu, FiGrid
} from "react-icons/fi";
import "../Styles/dashboardEmp.scss"; 


const EmpDashboardLayout: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  const navigate = useNavigate();
  const dark = theme === "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const ThemeToggle = () => (
    <button
      className="theme-toggle"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Cambiar tema"
    >
      {dark ? <FiSun /> : <FiMoon />}{" "}
      <span className="d-none d-sm-inline">{dark ? "Claro" : "Oscuro"}</span>
    </button>
  );

  return (
    <div className="emp-dashboard">
      <div className="emp-grid">
        {/* Sidebar */}
        <aside className="sidebar d-none d-lg-flex">
          <div className="brand" onClick={() => navigate("/emp/panel")} role="button">
            <span className="dot" />
            <span className="brand-text">Emprende+</span>
          </div>

          <nav className="nav flex-column">
            <NavLink className="nav-link" to="/emp/panel">
              <FiGrid /><span>Panel</span>
            </NavLink>
            <NavLink className="nav-link" to="/emp/RegistroPuntos">
              <FiPlusCircle /><span>Registrar Puntos</span>
            </NavLink>
            <NavLink className="nav-link" to="/emp/CanjePuntos">
              <FiGift /><span>Canjear Puntos</span>
            </NavLink>
            <NavLink className="nav-link" to="/emp/historial">
              <FiClock /><span>Historial</span>
            </NavLink>
          </nav>

          <div className="get-card mt-auto">
            <div className="fw-bold mb-1">Consejo</div>
            <div className="small text-muted mb-2">
              Usa el Panel para acceder rápido a Registrar/Canjear.
            </div>
            <button className="btn btn-gradient w-100" onClick={() => navigate("/emp/panel")}>
              Ir al Panel
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <button
              className="hamburger d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#sbOffEmp"
              aria-label="Abrir menú"
            >
              <FiMenu />
            </button>

            <div className="search input-group">
              <span className="input-group-text border-0"><FiSearch /></span>
              <input className="form-control" placeholder="Buscar cliente o transacción…" />
            </div>

            <ThemeToggle />

            <button className="btn btn-light border rounded-circle p-2" aria-label="Notificaciones">
              <FiBell />
            </button>

            <div className="user">
              <div className="avatar">EM</div>
              <div className="d-none d-md-block">
                <div className="fw-bold">Emprendedor</div>
                <small className="text-muted-2">Administrador</small>
              </div>
            </div>
          </header>

          {/* Aquí se renderizan las páginas */}
          <section className="content">
            <Outlet />
          </section>
        </div>

        {/* Sidebar móvil */}
        <aside id="sbOffEmp" className="offcanvas offcanvas-start sidebar d-lg-none">
          <div className="offcanvas-body p-0 d-flex flex-column">
            <div className="brand" data-bs-dismiss="offcanvas" onClick={() => navigate("/emp/panel")} role="button">
              <span className="dot" />
              <span className="brand-text">Emprende+</span>
            </div>
            <nav className="nav flex-column">
              <NavLink className="nav-link" to="/emp/panel" data-bs-dismiss="offcanvas">
                <FiGrid /><span>Panel</span>
              </NavLink>
              <NavLink className="nav-link" to="/emp/RegistroPuntos" data-bs-dismiss="offcanvas">
                <FiPlusCircle /><span>Registrar Puntos</span>
              </NavLink>
              <NavLink className="nav-link" to="/emp/canjear" data-bs-dismiss="offcanvas">
                <FiGift /><span>Canjear Puntos</span>
              </NavLink>
              <NavLink className="nav-link" to="/emp/historial" data-bs-dismiss="offcanvas">
                <FiClock /><span>Historial</span>
              </NavLink>
              <NavLink className="nav-link" to="/emp/config" data-bs-dismiss="offcanvas">
                <FiSettings /><span>Configuración</span>
              </NavLink>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EmpDashboardLayout;
