import React, { useEffect, useMemo, useState } from 'react';
import '../Styles/dashboard.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {
  FiHome, FiCreditCard, FiUsers, FiLink, FiUser, FiSettings,
  FiBell, FiSearch, FiMoon, FiSun, FiMenu
} from 'react-icons/fi';

const fmt = (v:number)=> new Intl.NumberFormat('es-HN',{style:'currency',currency:'HNL'}).format(v);

type Tendencia = { dir:'up'|'down'; texto:string };

const StatCard = ({ titulo, valor, auxiliar, tendencia, icono }:{
  titulo:string; valor:string; auxiliar?:string; tendencia?:Tendencia; icono:React.ReactNode;
}) => (
  <div className="card stat h-100">
    <div className="stat-bg" />
    <div className="card-body position-relative">
      <div className="icon-badge">{icono}</div>
      <div className="text-muted fw-semibold">{titulo}</div>
      <div className="d-flex align-items-end gap-2 mt-1">
        <div className="value">{valor}</div>
        {auxiliar && <small className="text-muted">{auxiliar}</small>}
      </div>
      {tendencia && <div className={`mt-2 fw-bold trend ${tendencia.dir}`}>{tendencia.texto}</div>}
    </div>
  </div>
);

const WithdrawWidget = () => {
  const [tel,setTel]=useState('');
  const [montoStr,setMontoStr]=useState('1500.00');
  const monto=useMemo(()=>Number(montoStr.replace(/[^\d.]/g,''))||0,[montoStr]);
  const com = monto*0.02;
  const neto = Math.max(0,monto-com);
  return (
    <div className="card withdraw h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-3">Operación de retiro</h5>
        <div className="alert alert-warning small" role="alert">
          Al comprar en tienda privada o usar bloqueadores como <strong>AdBlock</strong>, la transacción podría no confirmarse.
        </div>
        <div className="row g-3">
          <div className="col-lg-7">
            <div className="provider rounded-3">
              <div className="mb-2 fw-bold">Portmanat</div>
              <div className="mb-2">
                <label className="form-label small text-muted">Número de teléfono</label>
                <input className="form-control" placeholder="+504 9999-9999" value={tel} onChange={e=>setTel(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted">Monto total (HNL)</label>
                <input className="form-control" value={montoStr} onChange={e=>setMontoStr(e.target.value)} />
              </div>
              <div className="mb-3 small text-muted">Comisión: 2% ({fmt(com)})</div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="small text-muted">Monto a retirar</div>
                  <div className="fw-bold">{fmt(neto)}</div>
                </div>
                <button className="btn btn-withdraw px-4">Retirar</button>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="p-3 rounded-3 h-100">
              <div className="fw-bold mb-2">Reglas de retiro con Portmanat:</div>
              <div className="rule mb-2"><div className="fw-bold">2%</div><small>Comisión en efectivo</small></div>
              <div className="rule mb-2"><div className="fw-bold">≥ {fmt(75)}</div><small>Monto mínimo</small></div>
              <div className="rule mb-2"><div className="fw-bold">≤ {fmt(3750)}</div><small>Monto máximo</small></div>
              <div className="rule mb-2"><div className="fw-bold">HNL</div><small>Moneda disponible</small></div>
              <div className="rule"><div className="fw-bold">≈ 1–5 días</div><small>Tiempo estimado</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentTable = () => {
  const rows=[
    {store:'Amazon',date:'2025-08-14',amount:1290.5,status:'ok'},
    {store:'Ebay',date:'2025-08-12',amount:470,status:'hold'},
    {store:'AliExpress',date:'2025-08-10',amount:310.25,status:'fail'},
  ];
  return (
    <div className="card table-card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="m-0 fw-bold">Transacciones recientes</h6>
          <a href="#" className="small">Ver todo</a>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Tienda</th><th>Fecha</th><th>Monto</th><th>Estado</th><th className="text-end">Acción</th></tr></thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td className="fw-semibold">{r.store}</td>
                  <td>{r.date}</td>
                  <td>{fmt(r.amount)}</td>
                  <td><span className={`status ${r.status}`}>{r.status==='ok'?'Pagado':r.status==='hold'?'Pendiente':'Fallido'}</span></td>
                  <td className="text-end"><button className="btn btn-sm btn-light border">Detalles</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Activity = () => (
  <div className="card h-100">
    <div className="card-body">
      <h6 className="fw-bold mb-3">Actividad</h6>
      <div className="activity d-grid gap-3">
        {[{title:'Invitación enviada a Karen',time:'hace 3 min'},{title:'Solicitud de retiro creada',time:'hace 1 h'},{title:'Cupón canjeado en Nike',time:'Ayer'}].map((a,i)=>(
          <div className="item" key={i}><div className="dot"></div><div><div className="fw-semibold">{a.title}</div><div className="time">{a.time}</div></div></div>
        ))}
      </div>
    </div>
  </div>
);

const ThemeToggle:React.FC=()=>{
  const [theme,setTheme]=useState<'light'|'dark'>(()=>localStorage.getItem('theme')==='dark'?'dark':'light');
  useEffect(()=>{document.documentElement.setAttribute('data-theme',theme);localStorage.setItem('theme',theme)},[theme]);
  const dark=theme==='dark';
  return (
    <button className="theme-toggle" onClick={()=>setTheme(dark?'light':'dark')} aria-label="Cambiar tema">
      {dark?<FiSun/>:<FiMoon/>} <span className="d-none d-sm-inline">{dark?'Claro':'Oscuro'}</span>
    </button>
  );
};

const DashboardPage:React.FC=()=>{
  return (
    <div className="dash-grid">
      <aside className="sidebar d-none d-lg-flex">
        <div className="brand"><span className="dot"/><span className="brand-text">Swapp</span></div>
        <nav className="nav flex-column">
          <a className="nav-link active" href="#"><FiHome/><span>Panel</span></a>
          <a className="nav-link" href="#"><FiCreditCard/><span>Retiros</span></a>
          <a className="nav-link" href="#"><FiUsers/><span>Mis amigos</span></a>
          <a className="nav-link" href="#"><FiLink/><span>Acortador</span></a>
          <a className="nav-link" href="#"><FiUser/><span>Mi perfil</span></a>
          <a className="nav-link" href="#"><FiSettings/><span>Configuración</span></a>
        </nav>
        <div className="get-card mt-auto">
          <div className="fw-bold mb-1">Obtén tu Visa</div>
          <div className="small text-muted mb-2">Retiros rápidos y comisiones menores.</div>
          <button className="btn btn-gradient w-100">Obtener ahora</button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="hamburger d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sbOff" aria-label="Abrir menú"><FiMenu/></button>
          <div className="search input-group">
            <span className="input-group-text border-0"><FiSearch/></span>
            <input className="form-control" placeholder="Buscar tiendas, cupones…" />
          </div>
          <ThemeToggle/>
          <button className="btn btn-light border rounded-circle p-2" aria-label="Notificaciones"><FiBell/></button>
          <div className="user">
            <div className="avatar">NE</div>
            <div className="d-none d-md-block">
              <div className="fw-bold">Néstor</div>
              <small className="text-muted-2">Administrador</small>
            </div>
          </div>
        </header>

        <section className="content">
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6 col-xl-3"><StatCard titulo="Saldo" valor={fmt(2580.75)} auxiliar="Disponible" icono={<FiCreditCard/>}/></div>
            <div className="col-12 col-sm-6 col-xl-3"><StatCard titulo="Este mes" valor={fmt(842.10)} tendencia={{dir:'up',texto:'+12.2%'}} icono={<FiUsers/>}/></div>
            <div className="col-12 col-sm-6 col-xl-3"><StatCard titulo="Pendiente" valor={fmt(150)} tendencia={{dir:'down',texto:'-3.8%'}} icono={<FiLink/>}/></div>
            <div className="col-12 col-sm-6 col-xl-3"><StatCard titulo="Retiros" valor="8" auxiliar="últimos 30 días" icono={<FiHome/>}/></div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-xl-7"><WithdrawWidget/></div>
            <div className="col-12 col-xl-5"><Activity/></div>
          </div>

          <div className="row g-3">
            <div className="col-12"><RecentTable/></div>
          </div>
        </section>
      </div>

      <aside id="sbOff" className="offcanvas offcanvas-start sidebar d-lg-none">
        <div className="offcanvas-body p-0 d-flex flex-column">
          <div className="brand"><span className="dot"/><span className="brand-text">Swapp</span></div>
          <nav className="nav flex-column">
            <a className="nav-link active" data-bs-dismiss="offcanvas" href="#"><FiHome/><span>Panel</span></a>
            <a className="nav-link" data-bs-dismiss="offcanvas" href="#"><FiCreditCard/><span>Retiros</span></a>
            <a className="nav-link" data-bs-dismiss="offcanvas" href="#"><FiUsers/><span>Mis amigos</span></a>
            <a className="nav-link" data-bs-dismiss="offcanvas" href="#"><FiLink/><span>Acortador</span></a>
            <a className="nav-link" data-bs-dismiss="offcanvas" href="#"><FiUser/><span>Mi perfil</span></a>
            <a className="nav-link" data-bs-dismiss="offcanvas" href="#"><FiSettings/><span>Configuración</span></a>
          </nav>
          <div className="get-card mt-auto">
            <div className="fw-bold mb-1">Obtén tu Visa</div>
            <div className="small text-muted mb-2">Retiros rápidos y comisiones menores.</div>
            <button className="btn btn-gradient w-100" data-bs-dismiss="offcanvas">Obtener ahora</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardPage;
