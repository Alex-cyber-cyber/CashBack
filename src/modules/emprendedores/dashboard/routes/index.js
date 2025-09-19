import { jsx as _jsx } from "react/jsx-runtime";
import EmpPanel from "../Components/EmpPanel";
import EmpDashboardLayout from "../pages/DashboardEmp";
import CanjePuntosForm from "../Components/CanjePuntos";
import RegistroPuntosForm from "../Components/RegistroDePuntos";
import HistorialEmp from "../Components/HistorialEmp";
export const emprendedoresRoutes = {
    path: "/emp",
    element: _jsx(EmpDashboardLayout, {}),
    children: [
        { index: true, element: _jsx(EmpPanel, {}) },
        { path: "panel", element: _jsx(EmpPanel, {}) },
        { path: "RegistroPuntos", element: _jsx(RegistroPuntosForm, {}) },
        { path: "CanjePuntos", element: _jsx(CanjePuntosForm, {}) },
        { path: "historial", element: _jsx(HistorialEmp, {}) },
    ],
};
