import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/clientes/auth/hooks/useAuth";
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading)
        return _jsx("div", { style: { padding: 24 }, children: "Cargando\u2026" });
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    return children;
}
