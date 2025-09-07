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

const getInitials = (nameOrEmail: string) => {
  if (!nameOrEmail) return "US";
  const clean = nameOrEmail.split("@")[0];
  const parts = clean.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/** UI building blocks */
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

/** === PayPal Withdraw Widget (UI only) === */
const PaypalWithdrawWidget: React.FC = () => {
  const [paypalEmail, setPaypalEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [currency, setCurrency] = useState<"HNL" | "USD">("HNL");
  const [amountStr, setAmountStr] = useState("1500.00");
  const [note, setNote] = useState("");
  const [accept, setAccept] = useState(false);

  const amount = useMemo(
    () => Number(String(amountStr).replace(/[^\d.]/g, "")) || 0,
    [amountStr]
  );

  // Tasas de ejemplo (UI, no contractuales):
  // - Tarifa Swapp: 2%
  // - Tarifa PayPal estimada (ejemplo): 3.49% + 0.30 USD (si es USD)
  //   En HNL solo mostramos "estimado" (no calculamos fijo de 0.30 USD).
  const swappFee = amount * 0.02;
  const paypalPct = 0.0349;
  const paypalFixedUSD = 0.3;

  const paypalFee =
    currency === "USD" ? amount * paypalPct + paypalFixedUSD : amount * paypalPct;

  const totalFees = swappFee + paypalFee;
  const net = Math.max(0, amount - totalFees);

  const min = currency === "USD" ? 5 : 150; // solo UI
  const max = currency === "USD" ? 5000 : 120000; // solo UI

  return (
    <div className="card withdraw h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0">Retiro a PayPal</h5>
          <span className="small text-muted d-inline-flex align-items-center gap-2">
            {/* PayPal logo simple svg */}
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#003087"
                d="M20.4 4.5C19.2 2.8 16.9 2 13.9 2H7.8c-.5 0-1 .4-1.1.9L4 19.3c-.1.6.3 1.1.9 1.1h3.4l.3-1.9v.1c.1-.5.5-.9 1-.9h1.9c3.8 0 6.7-1.5 7.5-5.9.3-1.8.1-3.1-.5-4.3Z"
              />
              <path
                fill="#009CDE"
                d="M21 9.4c-.9 4.4-3.8 5.9-7.5 5.9H11.7c-.5 0-.9.4-1 .9L10.4 21h3.1c.6 0 1.1-.4 1.2-1l.3-1.6c0-.1.1-.3.3-.3 2.5 0 4.4-1 5-3.9.2-1 .2-2 0-2.8Z"
              />
            </svg>
            PayPal (UI)
          </span>
        </div>

        <div className="alert alert-warning small" role="alert">
          Este cálculo es <strong>estimado</strong>. Las tarifas reales dependen de tu
          cuenta PayPal y país. El retiro se procesa a la <strong>cuenta PayPal</strong> que
          indiques.
        </div>

        <div className="row g-3">
          <div className="col-lg-7">
            <div className="provider rounded-3">
              <div className="mb-2 fw-bold">Detalles del retiro</div>

              <div className="mb-2">
                <label className="form-label small text-muted">
                  Nombre del titular (como aparece en PayPal)
                </label>
                <input
                  className="form-control"
                  placeholder="Ej. Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted">
                  Correo de PayPal
                </label>
                <input
                  className="form-control"
                  placeholder="tu-correo@paypal.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-7">
                  <label className="form-label small text-muted">
                    Monto a retirar
                  </label>
                  <input
                    className="form-control"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                  />
                </div>
                <div className="col-5">
                  <label className="form-label small text-muted">Moneda</label>
                  <select
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as "HNL" | "USD")}
                  >
                    <option value="HNL">HNL</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Nota (opcional)</label>
                <input
                  className="form-control"
                  placeholder="Mensaje para el retiro"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="small text-muted">Comisiones estimadas</div>
                  <div className="fw-bold">
                    {fmt(totalFees, currency)}{" "}
                    <small className="text-muted">({fmt(swappFee, currency)} Swapp + {fmt(paypalFee, currency)} PayPal)</small>
                  </div>
                </div>
                <button className="btn btn-withdraw px-4" disabled={!accept}>
                  Solicitar retiro
                </button>
              </div>

              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="acceptFees"
                  checked={accept}
                  onChange={(e) => setAccept(e.target.checked)}
                />
                <label className="form-check-label small text-muted" htmlFor="acceptFees">
                  Acepto las tarifas estimadas y políticas de retiro.
                </label>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="p-3 rounded-3 h-100">
              <div className="fw-bold mb-2">Requisitos y reglas (PayPal)</div>

              <div className="rule mb-2">
                <div className="fw-bold">{fmt(min, currency)}</div>
                <small>Monto mínimo por retiro</small>
              </div>

              <div className="rule mb-2">
                <div className="fw-bold">{fmt(max, currency)}</div>
                <small>Monto máximo por retiro</small>
              </div>

              <div className="rule mb-2">
                <div className="fw-bold">Cuenta verificada</div>
                <small>Tu cuenta PayPal debe estar activa y verificada.</small>
              </div>

              <div className="rule mb-2">
                <div className="fw-bold">2–72 h</div>
                <small>Tiempo de acreditación estimado</small>
              </div>

              <div className="rule">
                <div className="fw-bold">Monedas</div>
                <small>Procesamos HNL y USD (según disponibilidad de tu cuenta).</small>
              </div>

              <hr />

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="small text-muted">Recibirás aprox.</div>
                  <div className="fw-bold">{fmt(net, currency)}</div>
                </div>
                <button className="btn btn-outline-secondary">
                  Conectar PayPal
                </button>
              </div>

              <div className="small text-muted mt-2">
                * La conversión de moneda (si aplica) y la tarifa fija de PayPal
                pueden variar según país/cuenta.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** === Page === */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const display = user?.displayName || user?.email || "Usuario";
  const initials = getInitials(display);
  const avatarUrl = user?.photoURL ?? "";

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

            {/* Historial con submenú */}
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
              >
                {avatarUrl ? (
                  <img className="avatar-img" src={avatarUrl} alt={display} />
                ) : (
                  <div className="avatar">{initials}</div>
                )}
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

            <div className="row g-3 mb-3">
              <div className="col-12 col-xl-7">
                <PaypalWithdrawWidget />
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

        {/* Sidebar móvil */}
        <aside
          id="sbOff"
          className="offcanvas offcanvas-start sidebar d-lg-none"
        >
          <div className="offcanvas-body p-0 d-flex flex-column">
            <div className="brand">
              <span className="dot" />
              <span className="brand-text">Swapp</span>
            </div>
            <nav className="nav flex-column">
              <a
                className="nav-link active"
                data-bs-dismiss="offcanvas"
                href="#"
              >
                <FiHome />
                <span>Panel</span>
              </a>
              <a className="nav-link" data-bs-dismiss="offcanvas" href="#">
                <FiCreditCard />
                <span>Retiros</span>
              </a>

              <button
                className="nav-link nav-link-btn"
                data-bs-toggle="collapse"
                data-bs-target="#subHistorialM"
                aria-expanded="false"
                aria-controls="subHistorialM"
                type="button"
              >
                <FiClock />
                <span>Historial</span>
                <FiChevronDown className="caret" />
              </button>
              <div id="subHistorialM" className="collapse">
                <div className="nav-sub">
                  <a
                    className="nav-sublink"
                    data-bs-dismiss="offcanvas"
                    href="#"
                  >
                    <span>Historial de puntos</span>
                  </a>
                  <a
                    className="nav-sublink"
                    data-bs-dismiss="offcanvas"
                    href="#"
                  >
                    <span>Historial de canjes</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
