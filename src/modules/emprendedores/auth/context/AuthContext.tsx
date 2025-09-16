import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../../../../../firebase/firebase.config";
import { onAuthStateChanged, User } from "firebase/auth";
import { ensureEntrepreneurProfile } from "../services/emprendedor.services";
import type { UserProfile } from "../types/Emprendedor.types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        try {

          const profileData = await ensureEntrepreneurProfile({ uid: firebaseUser.uid });
          setProfile(profileData);
        } catch (err) {
          console.error("Error obteniendo/creando perfil del emprendedor:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
