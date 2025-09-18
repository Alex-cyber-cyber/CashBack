import React from "react";
import { RouteObject } from "react-router-dom";
import EmpPanel from "../Components/EmpPanel";
import EmpDashboardLayout from "../pages/DashboardEmp";
import CanjePuntosForm from "../Components/CanjePuntos";
import RegistroPuntosForm from "../Components/RegistroDePuntos";


export const emprendedoresRoutes: RouteObject = {
  path: "/emp",
  element: <EmpDashboardLayout />,
  children: [
    { index: true, element: <EmpPanel /> },                 // /emp
    { path: "panel", element: <EmpPanel /> },    
    { path: "CanjePuntos", element: <CanjePuntosForm/>},           // /emp/panel
     { path: "RegistroPuntos", element: <RegistroPuntosForm/> } // /emp/RegistroPuntos
  ],
};
