import React from "react";
import { RouteObject } from "react-router-dom";
import EmpPanel from "../Components/EmpPanel";
import EmpDashboardLayout from "../pages/DashboardEmp";
import CanjePuntosForm from "../Components/CanjePuntos";
import RegistroPuntosForm from "../Components/RegistroDePuntos";
import HistorialEmp from "../Components/HistorialEmp";

export const emprendedoresRoutes: RouteObject = {
  path: "/emp",
  element: <EmpDashboardLayout />,
  children: [
    { index: true, element: <EmpPanel /> },
    { path: "panel", element: <EmpPanel /> },
    { path: "RegistroPuntos", element: <RegistroPuntosForm /> },
    { path: "CanjePuntos", element: <CanjePuntosForm /> },
    { path: "historial", element: <HistorialEmp /> },
  ],
};
