import React, { useEffect, useMemo, useState } from "react";
import "../Styles/dashboard.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  FiHome,
  FiCreditCard,
  FiUsers,
  FiLink,
  FiUser,
  FiSettings,
  FiBell,
  FiSearch,
  FiMoon,
  FiSun,
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";
import { logout } from "../../auth/services/auth.service";

/** Helpers */
const fmt = (v: number, currency: "HNL" | "USD" = "HNL") =>
  new Intl.NumberFormat("es-HN", { style: "currency", currency }).format(
    isFinite(v) ? v : 0
  );

/** === UserAvatar integrado === */
const UserAvatar: React.FC<{
  photoURL?: string | null;
  size?: number;
}> = ({ photoURL, size = 38 }) => {
  const [error, setError] = useState(false);

  if (photoURL && !error) {
    return (
      <img
        src={photoURL}
        alt="Avatar"
        className="avatar-img"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className="avatar-fallback"
      style={{ width: size, height: size }}
      aria-label="Avatar"
    >
      <FiUser size={size * 0.55} />
    </div>
  );
};

/** === Tarjeta estadística === */
type Tendencia = { dir: "up" | "down"; texto: string };

const StatCard: React.FC<{
  titulo: string;
  valor: string;
  auxiliar?: string;
  tendencia?: Tendencia;
  icono: React.ReactNode;
}> = ({ titulo, valor, auxiliar, tendencia, icono }) => (
  <div className="card stat h-100">
    <div className="stat-bg" />
    <div className="card-body position-relative">
      <div className="icon-badge">{icono}</div>
      <div className="text-muted fw-semibold">{titulo}</div>
      <div className="d-flex align-items-end gap-2 mt-1">
        <div className="value">{valor}</div>
        {auxiliar && <small className="text-muted">{auxiliar}</small>}
      </div>
      {tendencia && (
        <div className={`mt-2 fw-bold trend ${tendencia.dir}`}>
          {tendencia.texto}
        </div>
      )}
    </div>
  </div>
);

/** === Tabla de transacciones === */
const RecentTable: React.FC = () => {
  const rows = [
    { store: "Amazon", date: "2025-08-14", amount: 1290.5, status: "ok" },
    { store: "Ebay", date: "2025-08-12", amount: 470, status: "hold" },
    { store: "AliExpress", date: "2025-08-10", amount: 310.25, status: "fail" },
  ];
  return (
    <div className="card table-card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="m-0 fw-bold">Transacciones recientes</h6>
          <a href="#" className="small">
            Ver todo
          </a>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Tienda</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="fw-semibold">{r.store}</td>
                  <td>{r.date}</td>
                  <td>{fmt(r.amount)}</td>
                  <td>
                    <span className={`status ${r.status}`}>
                      {r.status === "ok"
                        ? "Pagado"
                        : r.status === "hold"
                        ? "Pendiente"
                        : "Fallido"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-light border">
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/** === Actividad === */
const Activity: React.FC = () => (
  <div className="card h-100">
    <div className="card-body">
      <h6 className="fw-bold mb-3">Actividad</h6>
      <div className="activity d-grid gap-3">
        {[
          { title: "Invitación enviada a Karen", time: "hace 3 min" },
          { title: "Solicitud de retiro creada", time: "hace 1 h" },
          { title: "Cupón canjeado en Nike", time: "Ayer" },
        ].map((a, i) => (
          <div className="item" key={i}>
            <div className="dot" />
            <div>
              <div className="fw-semibold">{a.title}</div>
              <div className="time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/** === Tema claro/oscuro === */
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
      {dark ? <FiSun /> : <FiMoon />}{" "}
      <span className="d-none d-sm-inline">{dark ? "Claro" : "Oscuro"}</span>
    </button>
  );
};

/** === Página principal === */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const display = user?.displayName || user?.email || "Usuario";

  return (
    <div className="client-dashboard">
      <div className="dash-grid">
        {/* Sidebar */}
        <aside className="sidebar d-none d-lg-flex">
          <div className="brand">
            <span className="dot" />
            <span className="brand-text">Swapp</span>
          </div>

          <nav className="nav flex-column">
            <a className="nav-link active" href="#">
              <FiHome />
              <span>Panel</span>
            </a>
            <a className="nav-link" href="#">
              <FiCreditCard />
              <span>Retiros</span>
            </a>

            <button
              className="nav-link nav-link-btn"
              data-bs-toggle="collapse"
              data-bs-target="#subHistorial"
              aria-expanded="false"
              aria-controls="subHistorial"
              type="button"
            >
              <FiClock />
              <span>Historial</span>
              <FiChevronDown className="caret" />
            </button>
            <div id="subHistorial" className="collapse">
              <div className="nav-sub">
                <a className="nav-sublink" href="#">
                  <span>Historial de puntos</span>
                </a>
                <a className="nav-sublink" href="#">
                  <span>Historial de canjes</span>
                </a>
              </div>
            </div>
          </nav>

          <div className="mt-auto p-3">
            <button
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={logout}
            >
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <button
              className="hamburger d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#sbOff"
              aria-label="Abrir menú"
            >
              <FiMenu />
            </button>

            <div className="search input-group">
              <span className="input-group-text border-0">
                <FiSearch />
              </span>
              <input
                className="form-control"
                placeholder="Buscar tiendas, cupones…"
              />
            </div>

            <ThemeToggle />

            <button
              className="btn btn-light border rounded-circle p-2"
              aria-label="Notificaciones"
            >
              <FiBell />
            </button>

            {/* Menú usuario */}
            <div className="user dropdown">
              <button
                className="btn p-0 dropdown-toggle user-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={display}
              >
                <UserAvatar photoURL={user?.photoURL} size={38} />
              </button>

              <div className="dropdown-menu dropdown-menu-end user-menu">
                <div className="user-header">
                  <div className="u-name">{display}</div>
                  <div className="u-email">{user?.email}</div>
                </div>
                <button className="dropdown-item">
                  <FiUser /> Mi perfil
                </button>
                <button className="dropdown-item">
                  <FiUsers /> Mis amigos
                </button>
                <button className="dropdown-item">
                  <FiSettings /> Configuración
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item text-danger" onClick={logout}>
                  <FiLogOut /> Cerrar sesión
                </button>
              </div>
            </div>
          </header>

          <section className="content">
            {/* Stats */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  titulo="Saldo"
                  valor={fmt(2580.75)}
                  auxiliar="Disponible"
                  icono={<FiCreditCard />}
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  titulo="Este mes"
                  valor={fmt(842.1)}
                  tendencia={{ dir: "up", texto: "+12.2%" }}
                  icono={<FiUsers />}
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  titulo="Pendiente"
                  valor={fmt(150)}
                  tendencia={{ dir: "down", texto: "-3.8%" }}
                  icono={<FiLink />}
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  titulo="Retiros"
                  valor="8"
                  auxiliar="últimos 30 días"
                  icono={<FiHome />}
                />
              </div>
            </div>

            {/* Secciones */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-xl-7">
                {/* Aquí tu PaypalWithdrawWidget */}
              </div>
              <div className="col-12 col-xl-5">
                <Activity />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <RecentTable />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
