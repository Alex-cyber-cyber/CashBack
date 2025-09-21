import React from "react";
import { RouteObject } from "react-router-dom";

import EmpPanel from "../Components/EmpPanel";
import EmpDashboardLayout from "../pages/DashboardEmp";
import CanjePuntosForm from "../Components/CanjePuntos/pages/CanjePuntos";
import RegistroDePuntos from "../Components/RegistroDePuntos/Pages/RegistroDePuntos";
import HistorialEmp from "../Components/HistorialEmp/pages/HistorialEmp";

console.info("[routes] usando TSX (emprendedores)");

export const emprendedoresRoutes: RouteObject = {
  path: "/emp",
  element: <EmpDashboardLayout />,
  children: [
    { index: true, element: <EmpPanel /> },
    { path: "panel", element: <EmpPanel /> },
    { path: "RegistroPuntos", element: <RegistroDePuntos /> }, // <- CONTAINER
    { path: "CanjePuntos", element: <CanjePuntosForm /> },
    { path: "historial", element: <HistorialEmp /> },
  ],
};
