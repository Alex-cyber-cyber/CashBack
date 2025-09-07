import React, { useEffect, useState } from "react";
import "../Styles/dashboardEmp.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  FiPlusCircle, FiGift, FiClock, FiSettings,
  FiBell, FiSearch, FiMoon, FiSun, FiMenu
} from "react-icons/fi";

const DashboardPage: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const dark = theme === "dark";

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
          <div className="brand">
            <span className="dot" />
            <span className="brand-text">Emprende+</span>
          </div>

          <nav className="nav flex-column">
            <a className="nav-link active" href="#">
              <FiPlusCircle /><span>Registrar Puntos</span>
            </a>
            <a className="nav-link" href="#">
              <FiGift /><span>Canjear Puntos</span>
            </a>
            <a className="nav-link" href="#">
              <FiClock /><span>Historial</span>
            </a>
            <a className="nav-link" href="#">
              <FiSettings /><span>Configuración</span>
            </a>
          </nav>

          <div className="get-card mt-auto">
            <div className="fw-bold mb-1">Consejo</div>
            <div className="small text-muted mb-2">
              Registra y canjea puntos fácilmente para tus clientes.
            </div>
            <button className="btn btn-gradient w-100">Más info</button>
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

          <section className="content">
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-4">
                <div className="card stat h-100 option-card">
                  <div className="card-body text-center">
                    <FiPlusCircle size={28} className="mb-2 highlight" />
                    <h6>Registrar Puntos</h6>
                    <p className="text-muted small">Agrega puntos a un cliente</p>
                    <button className="btn btn-primary w-100">Registrar</button>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card stat h-100 option-card">
                  <div className="card-body text-center">
                    <FiGift size={28} className="mb-2 highlight" />
                    <h6>Canjear Puntos</h6>
                    <p className="text-muted small">Permite usar puntos acumulados</p>
                    <button className="btn btn-success w-100">Canjear</button>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card stat h-100 option-card">
                  <div className="card-body text-center">
                    <FiClock size={28} className="mb-2 highlight" />
                    <h6>Historial</h6>
                    <p className="text-muted small">Revisa registros y canjes</p>
                    <button className="btn btn-secondary w-100">Ver historial</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar móvil */}
        <aside id="sbOffEmp" className="offcanvas offcanvas-start sidebar d-lg-none">
          <div className="offcanvas-body p-0 d-flex flex-column">
            <div className="brand">
              <span className="dot" />
              <span className="brand-text">Emprende+</span>
            </div>
            <nav className="nav flex-column">
              <a className="nav-link active" data-bs-dismiss="offcanvas" href="#">
                <FiPlusCircle /><span>Registrar Puntos</span>
              </a>
              <a className="nav-link" data-bs-dismiss="offcanvas" href="#">
                <FiGift /><span>Canjear Puntos</span>
              </a>
              <a className="nav-link" data-bs-dismiss="offcanvas" href="#">
                <FiClock /><span>Historial</span>
              </a>
              <a className="nav-link" data-bs-dismiss="offcanvas" href="#">
                <FiSettings /><span>Configuración</span>
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
