// src/App.tsx
import React from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

// PÚBLICAS / AUTH
import RegisterOptions from "./modules/RegisterOptions";
import RegisterEmprendedor from "./modules/emprendedores/auth/pages/RegisterEmprendedor";
import RegisterCliente from "./modules/clientes/auth/pages/RegisterCliente";
import LoginPage from "./modules/clientes/auth/pages/LoginPage";
import LoginEmprendedor from "./modules/emprendedores/auth/pages/LoginEmprendedor";

// DASHBOARDS
import DashboardPage from "./modules/clientes/dashboard/pages/DashboardPage";
import DashboardEmp from "./modules/emprendedores/dashboard/pages/DashboardEmp";

// PROTEGIDAS
import ProtectedRoute from "./routes/ProtectedRoute";

// NUEVO: Canjes del cliente
import CanjesPage from "./modules/clientes/dashboard/pages/CanjesPage";

// RUTAS EMPRENDEDORES
import { emprendedoresRoutes } from "./modules/emprendedores/dashboard/routes";

export default function App() {
  const routes: RouteObject[] = [
    { path: "/", element: <Navigate to="/register" replace /> },

    // públicas
    { path: "/register", element: <RegisterOptions /> },
    { path: "/register/emprendedor", element: <RegisterEmprendedor /> },
    { path: "/register/cliente", element: <RegisterCliente /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/login/emprendedor", element: <LoginEmprendedor /> },

    // cliente protegido
    {
      path: "/dashboard/canjes",
      element: (
        <ProtectedRoute>
          <CanjesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },

    // emprendedor (legacy)
    { path: "/dashboard/emprendedor", element: <DashboardEmp /> },

    // módulo emprendedores NUEVO:
    // Si emprendedoresRoutes es un solo objeto:
    // emprendedoresRoutes,
    // Si es un arreglo:
    ...(Array.isArray(emprendedoresRoutes) ? emprendedoresRoutes : [emprendedoresRoutes]),

    { path: "*", element: <Navigate to="/register" replace /> },
  ];

  return useRoutes(routes);
}
