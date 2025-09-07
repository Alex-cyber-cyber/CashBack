import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/clientes/auth/hooks/useAuth";
import { JSX } from "react/jsx-runtime";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
