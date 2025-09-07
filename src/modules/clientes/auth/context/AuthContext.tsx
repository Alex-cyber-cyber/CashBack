import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../../../../../firebase/firebase.config";
import { onAuthStateChanged, User } from "firebase/auth";

type AuthContextType = { user: User | null; loading: boolean };
export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
