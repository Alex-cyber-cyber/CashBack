import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/clientes/auth/hooks/useAuth";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container py-5">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <>{children}</>;
}
