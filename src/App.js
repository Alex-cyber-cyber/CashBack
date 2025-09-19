import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useRoutes } from "react-router-dom";
// PÚBLICAS / AUTH
import RegisterOptions from "./modules/RegisterOptions";
import RegisterEmprendedor from "./modules/emprendedores/auth/pages/RegisterEmprendedor";
import RegisterCliente from "./modules/clientes/auth/pages/RegisterCliente";
import LoginPage from "./modules/clientes/auth/pages/LoginPage";
import LoginEmprendedor from "./modules/emprendedores/auth/pages/LoginEmprendedor";
// DASHBOARDS (clientes y legacy emprendedor)
import DashboardPage from "./modules/clientes/dashboard/pages/DashboardPage";
import DashboardEmp from "./modules/emprendedores/dashboard/pages/DashboardEmp"; // si aún lo usas
// PROTEGIDAS
import ProtectedRoute from "./routes/ProtectedRoute";
// RUTAS DEL MÓDULO EMPRENDEDORES (nuevo layout + páginas: panel, registrar, canjear, historial, config)
import { emprendedoresRoutes } from "./modules/emprendedores/dashboard/routes";
export default function App() {
    // Define TODO el árbol de rutas aquí
    const routes = [
        // redirect raíz
        { path: "/", element: _jsx(Navigate, { to: "/register", replace: true }) },
        // públicas
        { path: "/register", element: _jsx(RegisterOptions, {}) },
        { path: "/register/emprendedor", element: _jsx(RegisterEmprendedor, {}) },
        { path: "/register/cliente", element: _jsx(RegisterCliente, {}) },
        { path: "/login", element: _jsx(LoginPage, {}) },
        { path: "/login/emprendedor", element: _jsx(LoginEmprendedor, {}) },
        // dashboard de clientes (protegido)
        {
            path: "/dashboard",
            element: (_jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) })),
        },
        // (opcional) dashboard emprendedor legacy si todavía lo usas en paralelo
        { path: "/dashboard/emprendedor", element: _jsx(DashboardEmp, {}) },
        // >>> módulo Emprendedores NUEVO: /emp, /emp/panel, /emp/canjear, etc.
        emprendedoresRoutes,
        // catch-all
        { path: "*", element: _jsx(Navigate, { to: "/register", replace: true }) },
    ];
    // Render del árbol
    const element = useRoutes(routes);
    return element;
}
