import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { user, loading, profile } = useContext(AuthContext);
  return { user, loading, profile };
};
