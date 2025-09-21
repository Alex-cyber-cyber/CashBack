import React from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

import RegisterOptions from "./modules/RegisterOptions";
import RegisterEmprendedor from "./modules/emprendedores/auth/pages/RegisterEmprendedor";
import RegisterCliente from "./modules/clientes/auth/pages/RegisterCliente";
import LoginPage from "./modules/clientes/auth/pages/LoginPage";
import LoginEmprendedor from "./modules/emprendedores/auth/pages/LoginEmprendedor";

import DashboardPage from "./modules/clientes/dashboard/pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import clientesRoutes from "./modules/clientes/dashboard/routes";
import { emprendedoresRoutes } from "./modules/emprendedores/dashboard/routes";

export default function App() {
  const routes: RouteObject[] = [
    { path: "/", element: <Navigate to="/register" replace /> },

    { path: "/register", element: <RegisterOptions /> },
    { path: "/register/emprendedor", element: <RegisterEmprendedor /> },
    { path: "/register/cliente", element: <RegisterCliente /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/login/emprendedor", element: <LoginEmprendedor /> },

    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
      children: clientesRoutes, // ← hijos: Overview y Canjes
    },

    ...(Array.isArray(emprendedoresRoutes) ? emprendedoresRoutes : [emprendedoresRoutes]),

    { path: "*", element: <Navigate to="/register" replace /> },
  ];

  return useRoutes(routes);
}
