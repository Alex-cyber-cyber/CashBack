import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../../../firebase/firebase.config";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthCtx = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: AuthContextValue = { user, loading };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
