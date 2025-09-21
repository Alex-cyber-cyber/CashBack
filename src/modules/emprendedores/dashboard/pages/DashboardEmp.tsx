import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "../Styles/dashboardEmp.scss";

import {
  FiHome,
  FiCreditCard,
  FiClock,
  FiChevronDown,
  FiMenu,
  FiSearch,
  FiBell,
  FiLogOut,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { auth } from "../../../../../firebase/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";

/** Helper para clases activas de NavLink */
const navClass =
  (base: string) =>
  ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? "active" : ""}`;

/** Avatar del usuario */
const UserAvatar: React.FC<{ photoURL?: string | null; size?: number }> = ({
  photoURL,
  size = 38,
}) =>
  photoURL ? (
    <img
      src={photoURL}
      alt="Avatar"
      className="avatar-img"
      style={{ width: size, height: size }}
    />
  ) : (
    <div className="avatar-fallback" style={{ width: size, height: size }}>
      <FiUser size={size * 0.55} />
    </div>
  );

/** Toggle tema claro/oscuro */
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") === "dark" ? "dark" : "light")
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const dark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Cambiar tema"
    >
      {dark ? "Claro" : "Oscuro"}
    </button>
  );
};

const EmpDashboardLayout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate("/login/emprendedor", { replace: true });
  }

  // nombre “bonito”: usa displayName; si no, la parte antes del @; si eso coincide con el email, no repitas
  const email: string = user?.email ?? "";
  const niceName: string =
    (user?.displayName?.trim() ||
      (email ? email.split("@")[0] : "") ||
      "Mi cuenta") + "";
  const showEmail = Boolean(email) && niceName !== email;

  return (
    <div className="emp-dashboard">
      <div className="emp-grid">
        {/* ===== Sidebar (desktop) ===== */}
        <aside className="sidebar d-none d-lg-flex">
          <div className="brand">
            <span className="dot" />
            <span className="brand-text">Swapp</span>
          </div>

          <nav className="nav flex-column">
            <NavLink to="/emp/panel" end className={navClass("nav-link")}>
              <FiHome />
              <span>Panel</span>
            </NavLink>

            <NavLink to="/emp/RegistroPuntos" className={navClass("nav-link")}>
              <FiUsers />
              <span>Registro de puntos</span>
            </NavLink>

            <NavLink to="/emp/CanjePuntos" className={navClass("nav-link")}>
              <FiCreditCard />
              <span>Canje de puntos</span>
            </NavLink>

            <button
              className="nav-link nav-link-btn"
              data-bs-toggle="collapse"
              data-bs-target="#subHistorialEmp"
              aria-expanded="false"
              aria-controls="subHistorialEmp"
              type="button"
            >
              <FiClock />
              <span>Historial</span>
              <FiChevronDown className="caret" />
            </button>
            <div id="subHistorialEmp" className="collapse">
              <div className="nav-sub">
                <NavLink
                  to="/emp/historial"
                  className={navClass("nav-sublink")}
                >
                  Historial general
                </NavLink>
              </div>
            </div>
          </nav>

          <div className="mt-auto p-3">
            {user && (
              <button
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <FiLogOut /> Cerrar sesión
              </button>
            )}
          </div>
        </aside>

        {/* ===== Main ===== */}
        <div className="main">
          {/* Topbar */}
          <header className="topbar">
            {/* Menú móvil */}
            <button
              className="hamburger d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#sbOffEmp"
              aria-label="Abrir menú"
            >
              <FiMenu />
            </button>

            <div className="search input-group">
              <span className="input-group-text border-0">
                <FiSearch />
              </span>
              <input className="form-control" placeholder="Buscar..." />
            </div>

            <ThemeToggle />

            <button
              className="btn btn-light border rounded-circle p-2"
              aria-label="Notificaciones"
            >
              <FiBell />
            </button>

            {/* Avatar + Dropdown (arreglado) */}
            <div className="user dropdown">
              {/* OJO: no uso .dropdown-toggle para evitar el caret extra;
                  con data-bs-toggle="dropdown" basta */}
              <button
                className="btn p-0 user-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={niceName}
              >
                <UserAvatar photoURL={user?.photoURL} size={38} />
              </button>

              <div className="dropdown-menu dropdown-menu-end user-menu shadow">
                <div className="menu-header">
                  <UserAvatar photoURL={user?.photoURL} size={36} />
                  <div className="meta">
                    {showEmail && (
                      <div className="email" title={email}>
                        {email}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="dropdown-item"
                  onClick={() => navigate("/emp/perfil")}
                >
                  <FiUser /> Mi perfil
                </button>

                <div className="dropdown-divider" />

                {user && (
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Contenido (rutas hijas) */}
          <section className="content">
            <Outlet />
          </section>
        </div>

        {/* ===== Sidebar Offcanvas (móvil) ===== */}
        <div
          className="offcanvas offcanvas-start d-lg-none"
          tabIndex={-1}
          id="sbOffEmp"
          aria-labelledby="sbOffEmpLabel"
        >
          <div className="offcanvas-header">
            <h5 id="sbOffEmpLabel" className="m-0">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Cerrar"
            />
          </div>

          <div className="offcanvas-body">
            <nav className="nav flex-column">
              <NavLink
                to="/emp/panel"
                end
                className={navClass("nav-link")}
                data-bs-dismiss="offcanvas"
              >
                <FiHome />
                <span>Panel</span>
              </NavLink>

              <NavLink
                to="/emp/RegistroPuntos"
                className={navClass("nav-link")}
                data-bs-dismiss="offcanvas"
              >
                <FiUsers />
                <span>Registro de puntos</span>
              </NavLink>

              <NavLink
                to="/emp/CanjePuntos"
                className={navClass("nav-link")}
                data-bs-dismiss="offcanvas"
              >
                <FiCreditCard />
                <span>Canje de puntos</span>
              </NavLink>

              <div className="mt-3 small text-muted px-2">Historial</div>
              <NavLink
                to="/emp/historial"
                className={navClass("nav-sublink")}
                data-bs-dismiss="offcanvas"
              >
                Historial general
              </NavLink>
            </nav>

            <div className="mt-auto pt-3">
              {user && (
                <button
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleLogout}
                  data-bs-dismiss="offcanvas"
                >
                  <FiLogOut /> Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboardLayout;
